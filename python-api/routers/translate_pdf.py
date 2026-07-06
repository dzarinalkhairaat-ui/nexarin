from fastapi import APIRouter, File, UploadFile, HTTPException
from fastapi.responses import FileResponse
from deep_translator import GoogleTranslator
import fitz  # PyMuPDF
import tempfile
import os
import time
import random

router = APIRouter()

@router.post("/convert/translate-pdf")
async def translate_pdf(file: UploadFile = File(...)):
    if not file.filename.lower().endswith('.pdf'):
        raise HTTPException(status_code=400, detail="File must be a PDF")
    
    unique_id = f"{int(time.time())}_{random.randint(1000, 9999)}"
    temp_dir = tempfile.gettempdir()
    
    input_pdf = os.path.join(temp_dir, f"input_trans_{unique_id}.pdf")
    output_txt = os.path.join(temp_dir, f"output_trans_{unique_id}.txt")
    
    try:
        with open(input_pdf, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
            
        doc = fitz.open(input_pdf)
        translator = GoogleTranslator(source='auto', target='id')
        translated_text = "=== NEXARIN TRANSLATED DOCUMENT (INDONESIA) ===\n\n"
        
        for i, page in enumerate(doc):
            text = page.get_text()
            if text.strip():
                try:
                    # Translate in chunks if it's too large, but usually a page is fine
                    chunk = text[:4900]
                    trans = translator.translate(chunk)
                    translated_text += f"--- HALAMAN {i+1} ---\n{trans}\n\n"
                except Exception as ex:
                    translated_text += f"[Error menerjemahkan halaman {i+1}: {ex}]\n\n"
                    
        doc.close()
        
        with open(output_txt, "w", encoding="utf-8") as f:
            f.write(translated_text)
            
        return FileResponse(
            output_txt, 
            media_type="text/plain",
            filename=f"{file.filename.rsplit('.', 1)[0]}_translated.txt"
        )
    except Exception as e:
        print(f"Translate PDF error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if os.path.exists(input_pdf):
            try: os.remove(input_pdf)
            except: pass
