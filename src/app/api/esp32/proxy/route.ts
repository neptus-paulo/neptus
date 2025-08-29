import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const url = req.nextUrl.searchParams.get("url");
    
    if (!url) {
      return NextResponse.json(
        { error: "URL parameter is required" }, 
        { status: 400 }
      );
    }

    // Validação básica de segurança - só permite IPs locais
    const urlObj = new URL(url);
    const hostname = urlObj.hostname;
    
    // Verifica se é IP local (192.168.x.x, 10.x.x.x, 172.16-31.x.x, localhost)
    const isLocalIP = /^(192\.168\.|10\.|172\.(1[6-9]|2[0-9]|3[01])\.|127\.|localhost$)/.test(hostname);
    
    if (!isLocalIP) {
      return NextResponse.json(
        { error: "Only local IPs are allowed" }, 
        { status: 403 }
      );
    }

    console.log(`🔄 Proxy request to: ${url}`);

    // Faz a requisição para o ESP32
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
      // Timeout de 10 segundos
      signal: AbortSignal.timeout(10000)
    });

    if (!response.ok) {
      console.error(`❌ ESP32 response error: ${response.status} ${response.statusText}`);
      return NextResponse.json(
        { error: `ESP32 responded with ${response.status}: ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log(`✅ ESP32 response received:`, data);

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      }
    });

  } catch (error) {
    console.error('❌ Proxy error:', error);
    
    if (error instanceof Error) {
      if (error.name === 'TimeoutError') {
        return NextResponse.json(
          { error: "Request timeout - ESP32 não respondeu em 10 segundos" },
          { status: 408 }
        );
      }
      
      return NextResponse.json(
        { error: `Connection failed: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Unknown error occurred" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const url = req.nextUrl.searchParams.get("url");
    
    if (!url) {
      return NextResponse.json(
        { error: "URL parameter is required" }, 
        { status: 400 }
      );
    }

    // Validação de segurança
    const urlObj = new URL(url);
    const hostname = urlObj.hostname;
    const isLocalIP = /^(192\.168\.|10\.|172\.(1[6-9]|2[0-9]|3[01])\.|127\.|localhost$)/.test(hostname);
    
    if (!isLocalIP) {
      return NextResponse.json(
        { error: "Only local IPs are allowed" }, 
        { status: 403 }
      );
    }

    const body = await req.json();
    console.log(`🔄 Proxy POST request to: ${url}`, body);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      cache: 'no-store',
      signal: AbortSignal.timeout(10000)
    });

    if (!response.ok) {
      console.error(`❌ ESP32 response error: ${response.status} ${response.statusText}`);
      return NextResponse.json(
        { error: `ESP32 responded with ${response.status}: ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log(`✅ ESP32 POST response received:`, data);

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      }
    });

  } catch (error) {
    console.error('❌ Proxy POST error:', error);
    
    if (error instanceof Error) {
      if (error.name === 'TimeoutError') {
        return NextResponse.json(
          { error: "Request timeout - ESP32 não respondeu em 10 segundos" },
          { status: 408 }
        );
      }
      
      return NextResponse.json(
        { error: `Connection failed: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Unknown error occurred" },
      { status: 500 }
    );
  }
}
