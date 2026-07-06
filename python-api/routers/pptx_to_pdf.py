from fastapi import APIRouter, File, UploadFile, HTTPException
from fastapi.responses import StreamingResponse
import subprocess
import tempfile
import io
import os

router = APIRouter()

@router.post("/convert/pptx-to-pdf")
async def pptx_to_pdf(file: UploadFile = File(...)):
    if not (file.filename.lower().endswith('.pptx') or file.filename.lower().endswith('.ppt')):
        raise HTTPException(status_code=400, detail="Hanya menerima file PPT atau PPTX.")
        
    try:
        with tempfile.TemporaryDirectory() as temp_dir:
            input_path = os.path.join(temp_dir, file.filename)
            with open(input_path, "wb") as f:
                content = await file.read()
                f.write(content)
                
            subprocess.run([
                "libreoffice", "--headless", "--invisible",
                "--convert-to", "pdf",
                "--outdir", temp_dir,
                input_path
            ], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            
            base_name = os.path.splitext(file.filename)[0]
            pdf_filename = f"{base_name}.pdf"
            pdf_path = os.path.join(temp_dir, pdf_filename)
            
            if not os.path.exists(pdf_path):
                raise Exception("File PDF gagal dibuat oleh LibreOffice.")
                
            with open(pdf_path, "rb") as f:
                pdf_bytes = f.read()
                
            return StreamingResponse(
                io.BytesIO(pdf_bytes),
                media_type="application/pdf",
                headers={"Content-Disposition": f'attachment; filename="{pdf_filename}"'}
            )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Terjadi kesalahan saat mengonversi PPTX ke PDF: {str(e)}")
