import { NextRequest, NextResponse } from "next/server";

// Função para gerar dados simulados de turbidez
function generateTurbidityData() {
  // Simula valores de turbidez entre 50 e 200 NTU
  const turbidity = Math.floor(Math.random() * 150) + 50;

  // Simula outros dados do sensor
  const sensorData = {
    turbidity: {
      value: turbidity,
      unit: "NTU",
      status:
        turbidity < 100 ? "normal" : turbidity < 150 ? "atenção" : "crítico",
    },
    dissolvedOxygen: {
      value: parseFloat((Math.random() * 5 + 5).toFixed(1)), // 5.0 - 10.0 mg/L
      unit: "MG/L",
    },
    temperature: {
      value: parseFloat((Math.random() * 10 + 20).toFixed(1)), // 20.0 - 30.0 °C
      unit: "°C",
    },
    waterPH: {
      value: parseFloat((Math.random() * 3 + 6).toFixed(1)), // 6.0 - 9.0 pH
    },
    ammonia: {
      value: parseFloat((Math.random() * 5 + 5).toFixed(1)), // 5.0 - 10.0
    },
    battery: Math.floor(Math.random() * 100), // 0 - 100%
    timestamp: new Date().toISOString(),
    message: "Dados de turbidez obtidos com sucesso",
  };

  return sensorData;
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
      { status: 200 },
    );

    // Adiciona headers CORS
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS",
    );
    response.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization",
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
      { status: 500 },
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
      { status: 201 },
    );

    // Adiciona headers CORS
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS",
    );
    response.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization",
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
      { status: 400 },
    );
  }
}
