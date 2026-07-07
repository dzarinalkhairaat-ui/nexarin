from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import (
    pdf_to_word, img_to_pdf, compress_pdf, pdf_to_excel, 
    word_to_pdf, pdf_to_png, edit_pdf, merge_pdf, 
    split_pdf, pdf_to_pptx, pptx_to_pdf, excel_to_pdf,
    sign_pdf, watermark_pdf, rotate_pdf, html_to_pdf,
    sign_pdf, watermark_pdf, rotate_pdf, html_to_pdf,
    unlock_pdf, protect_pdf, organize_pdf, pdf_to_pdfa,
    repair_pdf, page_number_pdf, scan_pdf, ocr_pdf,
    compare_pdf, redact_pdf, crop_pdf, forms_pdf,
    translate_pdf, markdown_pdf
)
from tts_engine import voice_tts


app = FastAPI(title="Nexarin PDF API", description="Microservice for PDF to Word Conversion")

# Allow CORS so Next.js frontend can call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Change this to your frontend domain in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Nexarin PDF API is running!"}

# Include all the feature routers
app.include_router(pdf_to_word.router)
app.include_router(img_to_pdf.router)
app.include_router(compress_pdf.router)
app.include_router(pdf_to_excel.router)
app.include_router(word_to_pdf.router)
app.include_router(pdf_to_png.router)
app.include_router(edit_pdf.router)
app.include_router(merge_pdf.router)
app.include_router(split_pdf.router)
app.include_router(pdf_to_pptx.router)
app.include_router(pptx_to_pdf.router)
app.include_router(excel_to_pdf.router)
app.include_router(sign_pdf.router)
app.include_router(watermark_pdf.router)
app.include_router(rotate_pdf.router)
app.include_router(html_to_pdf.router)
app.include_router(unlock_pdf.router)
app.include_router(protect_pdf.router)
app.include_router(organize_pdf.router)
app.include_router(pdf_to_pdfa.router)
app.include_router(repair_pdf.router)
app.include_router(page_number_pdf.router)
app.include_router(scan_pdf.router)
app.include_router(ocr_pdf.router)
app.include_router(compare_pdf.router)
app.include_router(redact_pdf.router)
app.include_router(crop_pdf.router)
app.include_router(forms_pdf.router)
app.include_router(translate_pdf.router)
app.include_router(markdown_pdf.router)
app.include_router(voice_tts.router)
