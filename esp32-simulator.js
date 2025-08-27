const http = require("http");

const server = http.createServer((req, res) => {
  // Habilitar CORS para permitir requisições do navegador
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Content-Type", "application/json");

  // Responder ao preflight OPTIONS
  if (req.method === "OPTIONS") {
    res.writeHead(200);
    res.end();
    return;
  }

  // Rota /turbidez - simula resposta do ESP32
  if (req.url === "/turbidez" && req.method === "GET") {
    // Gerar valor aleatório de turbidez entre 0 e 50
    const turbidez = Math.floor(Math.random() * 50) + 1;

    const response = {
      turbidez: turbidez,
    };

    console.log(`📡 Enviando dados: ${JSON.stringify(response)}`);

    res.writeHead(200);
    res.end(JSON.stringify(response));
    return;
  }

  // Rota não encontrada
  res.writeHead(404);
  res.end(JSON.stringify({ error: "Rota não encontrada" }));
});

const PORT = 3001;
const HOST = "0.0.0.0"; // Permite acesso de qualquer IP da rede

server.listen(PORT, HOST, () => {
  console.log(`🚀 Servidor ESP32 simulado rodando em http://${HOST}:${PORT}`);
  console.log(`📡 Endpoint disponível: http://${HOST}:${PORT}/turbidez`);
  console.log(
    `🌐 Acesse do seu celular usando o IP da máquina:${PORT}/turbidez`
  );
});

// Mostrar IP da máquina
const os = require("os");
const interfaces = os.networkInterfaces();
console.log("\n📍 IPs disponíveis:");
Object.keys(interfaces).forEach((name) => {
  interfaces[name].forEach((iface) => {
    if (iface.family === "IPv4" && !iface.internal) {
      console.log(`   ${name}: http://${iface.address}:${PORT}/turbidez`);
    }
  });
});
