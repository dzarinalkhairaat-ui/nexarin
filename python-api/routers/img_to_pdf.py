from fastapi import APIRouter, File, UploadFile, Form, HTTPException, BackgroundTasks
from fastapi.responses import FileResponse, StreamingResponse
from typing import List
from PIL import Image, ImageOps
import tempfile
import os
import time
import random
import zipfile
import io

router = APIRouter()

def cleanup_files(files_to_remove: List[str]):
    for f in files_to_remove:
        if os.path.exists(f):
            try:
                os.remove(f)
            except:
                pass

def get_page_size(page_size_str, orientation):
    # Dimensions at 100 DPI
    # A4 = 210 x 297 mm -> 827 x 1169 px
    # US Letter = 215.9 x 279.4 mm -> 850 x 1100 px
    
    if page_size_str == "a4":
        if orientation == "landscape":
            return (1169, 827)
        return (827, 1169)
    elif page_size_str == "letter":
        if orientation == "landscape":
            return (1100, 850)
        return (850, 1100)
    
    return None # Fit to image

def get_margin_px(margin_str):
    if margin_str == "small":
        return 40 # approx 10mm at 100 DPI
    elif margin_str == "big":
        return 100 # approx 25mm at 100 DPI
    return 0

@router.post("/convert/img-to-pdf")
async def convert_img_to_pdf(
    background_tasks: BackgroundTasks,
    files: List[UploadFile] = File(...),
    orientation: str = Form("auto"),
    pageSize: str = Form("fit"),
    margin: str = Form("none"),
    merge: str = Form("true")
):
    valid_extensions = ('.jpg', '.jpeg', '.png')
    
    # Validation
    for file in files:
        if not file.filename.lower().endswith(valid_extensions):
            raise HTTPException(status_code=400, detail=f"File {file.filename} must be a JPG or PNG image")
            
    is_merge = merge.lower() == "true"
    margin_px = get_margin_px(margin)
    
    unique_id = f"{int(time.time())}_{random.randint(1000, 9999)}"
    temp_dir = tempfile.gettempdir()
    
    processed_images = []
    temp_files = []
    
    try:
        # Process each image
        for file in files:
            input_img = os.path.join(temp_dir, f"input_{unique_id}_{file.filename}")
            temp_files.append(input_img)
            
            with open(input_img, "wb") as buffer:
                content = await file.read()
                buffer.write(content)
                
            image = Image.open(input_img)
            if image.mode in ("RGBA", "P", "LA"):
                image = image.convert("RGB")
            elif image.mode != "RGB":
                image = image.convert("RGB")
                
            target_size = get_page_size(pageSize, orientation)
            
            if target_size:
                # Apply margin to target size
                content_w = target_size[0] - (2 * margin_px)
                content_h = target_size[1] - (2 * margin_px)
                
                # Resize keeping aspect ratio to fit inside content area
                image.thumbnail((content_w, content_h), Image.Resampling.LANCZOS)
                
                # Create white background
                bg = Image.new('RGB', target_size, (255, 255, 255))
                
                # Center image on background
                offset_x = (target_size[0] - image.width) // 2
                offset_y = (target_size[1] - image.height) // 2
                
                bg.paste(image, (offset_x, offset_y))
                image = bg
            else:
                # If 'fit' page size, just add margin around the original image
                if margin_px > 0:
                    image = ImageOps.expand(image, border=margin_px, fill='white')
                    
            processed_images.append((image, file.filename))
            
        if not processed_images:
            raise HTTPException(status_code=400, detail="No valid images processed")

        if is_merge or len(processed_images) == 1:
            # Output as single PDF
            output_pdf = os.path.join(temp_dir, f"output_{unique_id}.pdf")
            temp_files.append(output_pdf) # Add it to cleanup array
            
            first_img, _ = processed_images[0]
            other_imgs = [img for img, _ in processed_images[1:]]
            
            first_img.save(
                output_pdf, "PDF", resolution=100.0, save_all=True, append_images=other_imgs
            )
            
            # Setup background task to delete all temp files AFTER response is sent
            background_tasks.add_task(cleanup_files, temp_files)
            
            return FileResponse(
                output_pdf, 
                media_type="application/pdf",
                filename=f"{files[0].filename.rsplit('.', 1)[0]}_merged_nexarin.pdf"
            )
        else:
            # Output as ZIP of individual PDFs
            zip_buffer = io.BytesIO()
            with zipfile.ZipFile(zip_buffer, "w", zipfile.ZIP_DEFLATED) as zip_file:
                for idx, (img, original_name) in enumerate(processed_images):
                    pdf_buffer = io.BytesIO()
                    img.save(pdf_buffer, "PDF", resolution=100.0)
                    pdf_filename = f"{original_name.rsplit('.', 1)[0]}_{idx+1}.pdf"
                    zip_file.writestr(pdf_filename, pdf_buffer.getvalue())
                    
            zip_buffer.seek(0)
            
            # Setup background task to delete all input temp files AFTER response is sent
            background_tasks.add_task(cleanup_files, temp_files)
            
            return StreamingResponse(
                zip_buffer,
                media_type="application/zip",
                headers={"Content-Disposition": "attachment; filename=nexarin_img_to_pdf.zip"}
            )
            
    except Exception as e:
        # If error occurs before background_tasks can be scheduled, clean up manually
        cleanup_files(temp_files)
        print(f"Image conversion error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
