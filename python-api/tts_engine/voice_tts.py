from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import edge_tts
import io

router = APIRouter(prefix="/api/tts", tags=["Voice Studio"])

class TTSRequest(BaseModel):
    text: str
    voice: str = "id-ID-ArdiNeural" # Default Indonesian male voice

async def generate_audio_stream(text: str, voice: str):
    try:
        communicate = edge_tts.Communicate(text, voice)
        async for chunk in communicate.stream():
            if chunk["type"] == "audio":
                yield chunk["data"]
    except Exception as e:
        # In a real scenario we'd log this properly.
        # Yielding error as bytes could corrupt the audio stream, 
        # but it's a fallback for streaming errors.
        pass

@router.post("")
async def text_to_speech(req: TTSRequest):
    if not req.text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty")
        
    return StreamingResponse(
        generate_audio_stream(req.text, req.voice),
        media_type="audio/mpeg"
    )

@router.get("/voices")
async def get_voices():
    try:
        voices = await edge_tts.list_voices()
        return voices
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
