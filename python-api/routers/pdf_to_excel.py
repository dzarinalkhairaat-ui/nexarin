from fastapi import APIRouter, File, UploadFile, HTTPException
from fastapi.responses import FileResponse
import pdfplumber  # type: ignore
import pandas as pd  # type: ignore
import tempfile
import os
import time
import random

router = APIRouter()

@router.post("/convert/pdf-to-excel")
async def convert_pdf_to_excel(file: UploadFile = File(...)):
    if not file.filename.lower().endswith('.pdf'):
        raise HTTPException(status_code=400, detail="File must be a PDF")
    
    unique_id = f"{int(time.time())}_{random.randint(1000, 9999)}"
    temp_dir = tempfile.gettempdir()
    
    input_pdf = os.path.join(temp_dir, f"input_excel_{unique_id}.pdf")
    output_excel = os.path.join(temp_dir, f"output_excel_{unique_id}.xlsx")
    
    try:
        with open(input_pdf, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
            
        with pdfplumber.open(input_pdf) as pdf:
            all_tables = []
            for page in pdf.pages:
                table = page.extract_table()
                if table:
                    all_tables.extend(table)
            
            if not all_tables:
                raise Exception("Tidak ada tabel yang terdeteksi di dalam file PDF ini.")
                
            cleaned_tables = [[str(cell) if cell is not None else "" for cell in row] for row in all_tables]
            
            if len(cleaned_tables) > 1:
                df = pd.DataFrame(cleaned_tables[1:], columns=cleaned_tables[0])
            else:
                df = pd.DataFrame(cleaned_tables)
                
            df.to_excel(output_excel, index=False)
            
        return FileResponse(
            output_excel, 
            media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            filename=f"{file.filename.rsplit('.', 1)[0]}_nexarin.xlsx"
        )
    except Exception as e:
        print(f"PDF to Excel error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if os.path.exists(input_pdf):
            try: os.remove(input_pdf)
            except: pass
