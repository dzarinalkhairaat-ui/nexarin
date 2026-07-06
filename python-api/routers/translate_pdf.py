from fastapi import APIRouter, File, UploadFile, Form, HTTPException
from fastapi.responses import FileResponse
from deep_translator import GoogleTranslator
from langdetect import detect
import fitz  # PyMuPDF
import tempfile
import os
import time
import random

router = APIRouter()

LANG_MAP = {
    'id': 'Bahasa Indonesia',
    'en': 'English',
    'es': 'Spanish',
    'fr': 'French',
    'de': 'German',
    'ja': 'Japanese',
    'ko': 'Korean',
    'zh-cn': 'Chinese',
    'ar': 'Arabic',
    'ru': 'Russian',
    'it': 'Italian',
    'pt': 'Portuguese',
    'nl': 'Dutch',
    'vi': 'Vietnamese',
    'th': 'Thai',
    'tr': 'Turkish'
}

@router.post("/convert/translate-pdf")
async def translate_pdf(
    file: UploadFile = File(...),
    target_lang: str = Form("id")
):
    if not file.filename.lower().endswith('.pdf'):
        raise HTTPException(status_code=400, detail="File must be a PDF")
    
    unique_id = f"{int(time.time())}_{random.randint(1000, 9999)}"
    temp_dir = tempfile.gettempdir()
    
    input_pdf = os.path.join(temp_dir, f"input_trans_{unique_id}.pdf")
    output_pdf = os.path.join(temp_dir, f"output_trans_{unique_id}.pdf")
    
    try:
        with open(input_pdf, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
            
        doc = fitz.open(input_pdf)
        
        # Ekstrak seluruh teks untuk deteksi bahasa
        full_text = ""
        for page in doc:
            full_text += page.get_text() + " "
            if len(full_text) > 1000:
                break
                
        detected_lang_code = "auto"
        detected_lang_name = "Otomatis"
        if full_text.strip():
            try:
                detected_lang_code = detect(full_text)
                detected_lang_name = LANG_MAP.get(detected_lang_code, detected_lang_code.upper())
            except:
                pass
                
        out_doc = fitz.open()
        translator = GoogleTranslator(source='auto', target=target_lang)
        
        for i, page in enumerate(doc):
            text = page.get_text()
            
            # Buat halaman baru dengan dimensi yang sama
            out_page = out_doc.new_page(width=page.rect.width, height=page.rect.height)
            rect = out_page.rect
            # Safety padding
            if rect.width > 72 and rect.height > 72:
                rect.x0 += 36
                rect.y0 += 36
                rect.x1 -= 36
                rect.y1 -= 36
            
            if text.strip():
                try:
                    chunk = text[:4900]
                    trans = translator.translate(chunk)
                    # Encode to cp1252 and replace unsupported characters with '?' to prevent PDF stream corruption in helv font
                    safe_trans = trans.encode('cp1252', 'replace').decode('cp1252')
                    out_page.insert_textbox(rect, safe_trans, fontsize=11, fontname="helv", align=0)
                except Exception as ex:
                    # Fallback if any error occurs
                    out_page.insert_textbox(rect, f"[Error: {ex}]", fontsize=11, fontname="helv")
                    
        doc.close()
        out_doc.save(output_pdf)
        out_doc.close()
        
        return FileResponse(
            output_pdf, 
            media_type="application/pdf",
            filename=f"{file.filename.rsplit('.', 1)[0]}_translated.pdf",
            headers={
                "X-Detected-Lang": detected_lang_name,
                "Access-Control-Expose-Headers": "X-Detected-Lang"
            }
        )
    except Exception as e:
        print(f"Translate PDF error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if os.path.exists(input_pdf):
            try: os.remove(input_pdf)
            except: pass
