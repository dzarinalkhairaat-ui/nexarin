from fastapi import APIRouter, File, UploadFile, HTTPException, Form
from fastapi.responses import FileResponse
import fitz  # PyMuPDF
import tempfile
import os
import time
import random
import io
try:
    from PIL import Image
except ImportError:
    Image = None

router = APIRouter()

def compress_images_in_doc(doc, level):
    if not Image:
        return
        
    if level == "less":
        quality = 90
        max_dim = 1600
    elif level == "recommended":
        quality = 65
        max_dim = 1200
    else:  # extreme
        quality = 35
        max_dim = 800

    for page_num in range(len(doc)):
        page = doc[page_num]
        image_list = page.get_images()
        for img in image_list:
            xref = img[0]
            try:
                base_image = doc.extract_image(xref)
                image_bytes = base_image["image"]
                
                # Load with PIL
                pil_img = Image.open(io.BytesIO(image_bytes))
                
                # Convert to RGB if needed
                if pil_img.mode in ('RGBA', 'P', 'CMYK'):
                    pil_img = pil_img.convert('RGB')
                    
                # Resize if exceeding max dimension
                w, h = pil_img.size
                if w > max_dim or h > max_dim:
                    ratio = min(max_dim / w, max_dim / h)
                    # Use LANCZOS if available, else ANTIALIAS
                    resample_filter = getattr(Image.Resampling, 'LANCZOS', getattr(Image, 'ANTIALIAS', 1))
                    pil_img = pil_img.resize((int(w * ratio), int(h * ratio)), resample_filter)
                
                # Save compressed
                out_bytes = io.BytesIO()
                
                # Keep grayscale/b&w images as grayscale
                if pil_img.mode == '1':
                    pil_img = pil_img.convert('L')
                    
                pil_img.save(out_bytes, format="JPEG", quality=quality, optimize=True)
                new_image_bytes = out_bytes.getvalue()
                
                # HANYA ganti gambar jika ukuran file hasil kompresi LEBIH KECIL dari aslinya
                if len(new_image_bytes) < len(image_bytes):
                    try:
                        # Attempt safe replacement available in modern PyMuPDF
                        page.replace_image(xref, stream=new_image_bytes)
                    except AttributeError:
                        # Fallback for older PyMuPDF versions
                        pass
                else:
                    print(f"Skipping {xref}: compressed ({len(new_image_bytes)}) > original ({len(image_bytes)})")
            except Exception as e:
                print(f"Skipping image {xref}: {e}")
                pass

@router.post("/convert/compress-pdf")
async def compress_pdf(
    file: UploadFile = File(...),
    level: str = Form("recommended")
):
    if not file.filename.lower().endswith('.pdf'):
        raise HTTPException(status_code=400, detail="File must be a PDF")
    
    unique_id = f"{int(time.time())}_{random.randint(1000, 9999)}"
    temp_dir = tempfile.gettempdir()
    
    input_pdf = os.path.join(temp_dir, f"input_comp_{unique_id}.pdf")
    output_pdf = os.path.join(temp_dir, f"output_comp_{unique_id}.pdf")
    
    try:
        with open(input_pdf, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
            
        doc = fitz.open(input_pdf)
        
        # 1. Deep Image Compression using PIL
        compress_images_in_doc(doc, level)
        
        # 2. Configure PyMuPDF GC parameters
        # SELALU gunakan kompresi struktur maksimum, level hanya membedakan kompresi gambar
        doc.save(
            output_pdf, 
            garbage=4, 
            deflate=True, 
            clean=True,
            deflate_images=True,
            deflate_fonts=True
        )
        doc.close()
        
        if not os.path.exists(output_pdf):
            raise Exception("Compressed PDF file was not generated")
            
        # 3. Final Size Check (Mencegah file bengkak)
        original_size = os.path.getsize(input_pdf)
        compressed_size = os.path.getsize(output_pdf)
        
        # Jika hasil kompresi ternyata LEBIH BESAR, gunakan file aslinya saja
        if compressed_size >= original_size:
            import shutil
            shutil.copyfile(input_pdf, output_pdf)
            
        return FileResponse(
            output_pdf, 
            media_type="application/pdf",
            filename=f"{file.filename.rsplit('.', 1)[0]}_compressed.pdf"
        )
        
    except Exception as e:
        print(f"PDF compression error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if os.path.exists(input_pdf):
            try:
                os.remove(input_pdf)
            except:
                pass
        # Note: output_pdf cannot be deleted here because FileResponse needs to read it asynchronously.
