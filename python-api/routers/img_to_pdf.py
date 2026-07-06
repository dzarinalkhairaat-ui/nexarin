from fastapi import APIRouter, File, UploadFile, HTTPException
from fastapi.responses import FileResponse
from PIL import Image
import tempfile
import os
import time
import random

router = APIRouter()

@router.post("/convert/img-to-pdf")
async def convert_img_to_pdf(file: UploadFile = File(...)):
    valid_extensions = ('.jpg', '.jpeg', '.png')
    if not file.filename.lower().endswith(valid_extensions):
        raise HTTPException(status_code=400, detail="File must be a JPG or PNG image")
    
    unique_id = f"{int(time.time())}_{random.randint(1000, 9999)}"
    temp_dir = tempfile.gettempdir()
    
    input_img = os.path.join(temp_dir, f"input_{unique_id}_{file.filename}")
    output_pdf = os.path.join(temp_dir, f"output_{unique_id}.pdf")
    
    try:
        with open(input_img, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
            
        image = Image.open(input_img)
        
        if image.mode in ("RGBA", "P", "LA"):
            image = image.convert("RGB")
        elif image.mode != "RGB":
            image = image.convert("RGB")
            
        image.save(output_pdf, "PDF", resolution=100.0)
        
        if not os.path.exists(output_pdf):
            raise Exception("PDF file was not generated")
            
        return FileResponse(
            output_pdf, 
            media_type="application/pdf",
            filename=f"{file.filename.rsplit('.', 1)[0]}_nexarin.pdf"
        )
        
    except Exception as e:
        print(f"Image conversion error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if os.path.exists(input_img):
            try:
                os.remove(input_img)
            except:
                pass
