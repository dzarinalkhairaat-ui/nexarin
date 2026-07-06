from fastapi import APIRouter, File, UploadFile, HTTPException
from fastapi.responses import StreamingResponse
from pptx import Presentation  # type: ignore
from pptx.util import Inches  # type: ignore
import fitz  # PyMuPDF
import tempfile
import io
import os

router = APIRouter()

@router.post("/convert/pdf-to-pptx")
async def pdf_to_pptx(file: UploadFile = File(...)):
    if not file.filename.lower().endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Hanya menerima file PDF.")
        
    try:
        doc_bytes = await file.read()
        doc = fitz.open(stream=doc_bytes, filetype="pdf")
        
        prs = Presentation()
        blank_slide_layout = prs.slide_layouts[6]
        
        if len(doc) > 0:
            first_page = doc[0]
            width = first_page.rect.width
            height = first_page.rect.height
            prs.slide_width = Inches(width / 72)
            prs.slide_height = Inches(height / 72)
        
        with tempfile.TemporaryDirectory() as temp_dir:
            for i in range(len(doc)):
                page = doc[i]
                pix = page.get_pixmap(matrix=fitz.Matrix(2, 2))
                img_path = os.path.join(temp_dir, f"page_{i}.png")
                pix.save(img_path)
                
                slide = prs.slides.add_slide(blank_slide_layout)
                slide.shapes.add_picture(img_path, 0, 0, width=prs.slide_width, height=prs.slide_height)
                
            pptx_buffer = io.BytesIO()
            prs.save(pptx_buffer)
            
        doc.close()
        pptx_buffer.seek(0)
        
        base_name = os.path.splitext(file.filename)[0]
        return StreamingResponse(
            pptx_buffer, 
            media_type="application/vnd.openxmlformats-officedocument.presentationml.presentation", 
            headers={"Content-Disposition": f'attachment; filename="{base_name}.pptx"'}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Terjadi kesalahan saat mengonversi PDF ke PPTX: {str(e)}")
