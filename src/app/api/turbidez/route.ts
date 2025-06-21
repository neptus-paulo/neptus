import { NextRequest, NextResponse } from "next/server";

// Função para gerar dados simulados no novo formato do ESP32
function generateTurbidityData() {
  return {
    voltagem: parseFloat((Math.random() * 1.5 + 3.0).toFixed(2)), // 3.0 - 4.5 V
    turbidez: Math.floor(Math.random() * 150) + 50, // 50 - 200 NTU
    nivel: ["Baixo", "Médio", "Alto"][Math.floor(Math.random() * 3)],
  };
}

// GET - Retorna dados de turbidez
export async function GET(request: NextRequest) {
  try {
    // Simula um pequeno delay para parecer mais realista
    await new Promise((resolve) => setTimeout(resolve, 500));

    const data = generateTurbidityData();

    const response = NextResponse.json(
      {
        success: true,
        data,
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );

    // Adiciona headers CORS
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );
    response.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );

    return response;
  } catch (error) {
    console.error("Erro ao obter dados de turbidez:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Erro interno do servidor",
        error: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 }
    );
  }
}

// OPTIONS - Para requisições preflight CORS
export async function OPTIONS(request: NextRequest) {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

// POST - Permite enviar dados de turbidez (para futuras implementações)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Aqui você poderia salvar os dados em um banco de dados
    console.log("Dados recebidos:", body);

    const response = NextResponse.json(
      {
        success: true,
        message: "Dados de turbidez recebidos com sucesso",
        receivedData: body,
        timestamp: new Date().toISOString(),
      },
      { status: 201 }
    );

    // Adiciona headers CORS
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );
    response.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );

    return response;
  } catch (error) {
    console.error("Erro ao processar dados de turbidez:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Erro ao processar dados",
        error: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 400 }
    );
  }
}
