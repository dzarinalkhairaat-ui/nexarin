from fastapi import APIRouter, File, UploadFile, HTTPException
from fastapi.responses import FileResponse
import tempfile
import os
import time
import random
from pdf2docx import Converter

router = APIRouter()

@router.post("/convert/pdf-to-word")
async def convert_pdf_to_word(file: UploadFile = File(...)):
    if not file.filename.lower().endswith('.pdf'):
        raise HTTPException(status_code=400, detail="File must be a PDF")
    
    unique_id = f"{int(time.time())}_{random.randint(1000, 9999)}"
    temp_dir = tempfile.gettempdir()
    
    input_pdf = os.path.join(temp_dir, f"input_{unique_id}.pdf")
    output_docx = os.path.join(temp_dir, f"output_{unique_id}.docx")
    
    try:
        with open(input_pdf, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
            
        cv = Converter(input_pdf)
        kwargs = {
            "shape_min_dimension": 0.5,
            "float_image_ignorable_gap": 0.0,
            "connected_border_tolerance": 1.5,
            "lines_left_aligned_threshold": 0.5,
            "lines_center_aligned_threshold": 1.0,
            "lines_right_aligned_threshold": 0.5,
            "clip_image_res_ratio": 3.0
        }
        cv.convert(output_docx, kwargs=kwargs)
        cv.close()
        
        if not os.path.exists(output_docx):
            raise Exception("DOCX file was not generated")
            
        return FileResponse(
            output_docx, 
            media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            filename=f"{file.filename.rsplit('.', 1)[0]}_nexarin.docx"
        )
        
    except Exception as e:
        print(f"Conversion error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if os.path.exists(input_pdf):
            try:
                os.remove(input_pdf)
            except:
                pass
