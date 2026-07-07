import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { text, voice } = await req.json();

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    const pythonApiUrl = process.env.NEXT_PUBLIC_PYTHON_API_URL || 'http://localhost:8000';
    
    // Proxy request to python backend
    const response = await fetch(`${pythonApiUrl}/api/tts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        voice: voice || "id-ID-ArdiNeural",
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Python API Error: ${errorText}`);
    }

    // Return the audio stream back to client
    return new NextResponse(response.body, {
      headers: {
        'Content-Type': 'audio/mpeg',
      }
    });

  } catch (error) {
    console.error('TTS API Error:', error);
    return NextResponse.json(
      { error: 'Gagal menghasilkan audio. Silakan coba lagi.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const pythonApiUrl = process.env.NEXT_PUBLIC_PYTHON_API_URL || 'http://localhost:8000';
    const response = await fetch(`${pythonApiUrl}/api/tts/voices`);
    
    if (!response.ok) {
        throw new Error('Failed to fetch from python backend');
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Fetch voices error:', error);
    return NextResponse.json({ error: 'Failed to fetch voices' }, { status: 500 });
  }
}
