// Service Worker integrado com sistema de autenticação offline do Neptus
// Baseado na documentação oficial do Next.js + lógica personalizada

const CACHE_NAME = "neptus-v1";
const STATIC_CACHE = "neptus-static-v1";
const PAGE_CACHE = "neptus-pages-v1";

// Recursos essenciais que sempre devem estar disponíveis offline
const ESSENTIAL_RESOURCES = [
  "/",
  "/login",
  "/manifest.json",
  "/android-chrome-192x192.png",
  "/android-chrome-512x512.png",
  "/assets/favicon-16x16.png",
  "/assets/favicon-32x32.png",
  "/assets/apple-touch-icon.png",
  "/assets/icon-1024x1024.png",
];

// Função para verificar se usuário já logou (lê do localStorage)
function checkHasEverLoggedIn() {
  try {
    const offlineAuth = self.localStorage?.getItem("offline-auth-storage");
    if (offlineAuth) {
      const data = JSON.parse(offlineAuth);
      return data?.state?.hasEverLoggedIn === true;
    }
  } catch (error) {
    console.log("SW: Erro ao ler localStorage:", error);
  }
  return false;
}

// Install event - cache recursos essenciais
self.addEventListener("install", function (event) {
  console.log("SW: Instalando...");
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then(function (cache) {
        console.log("SW: Cacheando recursos essenciais");
        return cache.addAll(ESSENTIAL_RESOURCES);
      })
      .catch(function (error) {
        console.log("SW: Erro ao cachear recursos:", error);
      })
  );
  // Força ativação imediata
  self.skipWaiting();
});

// Activate event - limpa caches antigos
self.addEventListener("activate", function (event) {
  console.log("SW: Ativando...");
  event.waitUntil(
    caches
      .keys()
      .then(function (cacheNames) {
        return Promise.all(
          cacheNames.map(function (cacheName) {
            if (
              cacheName !== CACHE_NAME &&
              cacheName !== STATIC_CACHE &&
              cacheName !== PAGE_CACHE
            ) {
              console.log("SW: Limpando cache antigo:", cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        // Assume controle imediatamente
        return self.clients.claim();
      })
  );
});

// Fetch event - estratégia personalizada para funcionalidade offline
self.addEventListener("fetch", function (event) {
  // Ignora requests não HTTP/HTTPS
  if (!event.request.url.startsWith("http")) {
    return;
  }

  // Para navegação de páginas (HTML)
  if (
    event.request.mode === "navigate" ||
    (event.request.method === "GET" &&
      event.request.headers.get("accept") &&
      event.request.headers.get("accept").includes("text/html"))
  ) {
    event.respondWith(handlePageRequest(event.request));
    return;
  }

  // Para recursos estáticos (imagens, fontes, JS, CSS)
  if (
    event.request.destination === "image" ||
    event.request.destination === "font" ||
    event.request.destination === "script" ||
    event.request.destination === "style"
  ) {
    event.respondWith(handleStaticResource(event.request));
    return;
  }

  // Para APIs e outros requests - sempre Network First
  event.respondWith(
    fetch(event.request).catch(() => {
      // Se API falhar offline, não retorna cache para evitar dados incorretos
      return new Response('{"error": "Offline"}', {
        status: 503,
        headers: { "Content-Type": "application/json" },
      });
    })
  );
});

// Função para lidar com requests de páginas
async function handlePageRequest(request) {
  try {
    // Tenta network primeiro com timeout
    const networkPromise = fetch(request);
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Network timeout")), 3000)
    );

    const response = await Promise.race([networkPromise, timeoutPromise]);

    // Se sucesso, salva no cache e retorna
    if (response.ok) {
      const cache = await caches.open(PAGE_CACHE);
      cache.put(request, response.clone());
      return response;
    }
  } catch (error) {
    console.log("SW: Network falhou, tentando cache:", error.message);
  }

  // Se network falhou, tenta cache
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    console.log("SW: Servindo página do cache");
    return cachedResponse;
  }

  // Se não tem cache da página específica, verifica se deve redirecionar para login
  const url = new URL(request.url);
  const hasEverLoggedIn = checkHasEverLoggedIn();

  console.log("SW: Verificando redirecionamento offline:", {
    path: url.pathname,
    hasEverLoggedIn,
  });

  // Se nunca logou e não está na página de login, redireciona para login
  if (!hasEverLoggedIn && url.pathname !== "/login") {
    const loginCache = await caches.match("/login");
    if (loginCache) {
      console.log("SW: Redirecionando para login cached");
      return loginCache;
    }
  }

  // Fallback para página principal se disponível
  const homeCache = await caches.match("/");
  if (homeCache) {
    console.log("SW: Servindo página principal do cache");
    return homeCache;
  }

  // Se nada funcionou, retorna erro offline
  return new Response(
    `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Offline - Neptus</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
          .container { max-width: 400px; margin: 0 auto; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Você está offline</h1>
          <p>Conecte-se à internet para acessar o aplicativo.</p>
          <button onclick="window.location.reload()">Tentar novamente</button>
        </div>
      </body>
    </html>
  `,
    {
      status: 200,
      headers: { "Content-Type": "text/html" },
    }
  );
}

// Função para lidar com recursos estáticos
async function handleStaticResource(request) {
  // Cache First para recursos estáticos
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.log("SW: Erro ao buscar recurso estático:", error);
    // Para recursos estáticos, se falhar, não retorna nada (deixa o browser lidar)
    throw error;
  }
}
