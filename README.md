# Neptus - Sistema de Monitoramento de Qualidade da Água

Neptus é uma aplicação web moderna para monitoramento da qualidade da água através de sensores ESP32, fornecendo medições de turbidez em tempo real e visualização abrangente de dados. Construído com Next.js 14, TypeScript, e foco em arquitetura offline-first.

## 🚀 Funcionalidades

- **Monitoramento de Qualidade da Água em Tempo Real**: Acompanhe níveis de turbidez de sensores ESP32
- **Arquitetura Offline-First**: Suporte PWA com sincronização offline de dados
- **Interface Moderna**: Design limpo e responsivo com componentes shadcn/ui
- **Autenticação**: Login seguro com Google OAuth e NextAuth.js
- **Visualização de Dados**: Gráficos interativos e exibição de métricas
- **Gerenciamento de Dispositivos**: Configuração e monitoramento de status do ESP32
- **Dashboard Multi-métrica**: Parâmetros abrangentes de qualidade da água

## 🛠️ Stack Tecnológico

### Tecnologias Principais

- **Framework**: Next.js 14 (App Router)
- **Linguagem**: TypeScript
- **Estilização**: Tailwind CSS
- **Componentes UI**: shadcn/ui
- **Autenticação**: NextAuth.js com Google Provider
- **Gerenciamento de Estado**: Zustand
- **Manipulação de Formulários**: React Hook Form com validação Zod
- **Busca de Dados**: React Query (TanStack Query)
- **Cliente HTTP**: Axios

### Ferramentas de Desenvolvimento

- **Linting**: ESLint
- **Verificação de Tipos**: TypeScript
- **Ferramenta de Build**: Bundler integrado do Next.js
- **Gerenciador de Pacotes**: npm/yarn/pnpm

## 📁 Estrutura do Projeto

```
src/
├── app/                          # Páginas e layouts do App Router
│   ├── (authenticated)/          # Rotas protegidas
│   │   ├── _components/          # Componentes específicos da página
│   │   │   └── AdditionalParameters/
│   │   │       ├── page.tsx      # Wrapper do modal
│   │   │       ├── TurbidityForm.tsx
│   │   │       └── TurbidityHeader.tsx
│   │   ├── layout.tsx            # Layout autenticado
│   │   └── page.tsx              # Página do dashboard
│   ├── (public)/                 # Rotas públicas
│   │   ├── cadastro/             # Cadastro
│   │   ├── login/                # Login
│   │   ├── recuperar-senha/      # Recuperação de senha
│   │   └── redefinir-senha/      # Redefinição de senha
│   ├── api/                      # Rotas da API
│   │   ├── auth/[...nextauth]/   # Configuração NextAuth
│   │   └── turbidez/             # API de turbidez
│   ├── globals.css               # Estilos globais
│   └── layout.tsx                # Layout raiz
├── auth/
│   └── Providers.tsx             # Provedores de contexto de auth
├── components/                   # Componentes reutilizáveis
│   ├── forms/                    # Componentes de formulário
│   ├── layout/                   # Componentes de layout
│   ├── ui/                       # Componentes shadcn/ui
│   ├── AppButton.tsx
│   ├── ColorRangeSelector.tsx    # Seletor customizado de cor da água
│   ├── DataSyncManager.tsx       # Gerenciamento de sincronização offline
│   ├── DeviceStatus.tsx          # Exibição de status do ESP32
│   ├── ESP32Config.tsx           # Configuração do dispositivo
│   ├── TurbidityDisplay.tsx      # Visualização de turbidez
│   └── ...
├── hooks/                        # Hooks customizados do React
│   ├── useLogin.ts
│   ├── useOnlineStatus.ts
│   ├── useSensorData.ts
│   ├── useTurbidityForm.ts       # Lógica de negócio do formulário
│   └── ...
├── lib/                          # Bibliotecas utilitárias
│   ├── axios.ts                  # Configuração do cliente HTTP
│   ├── react-query-provider.tsx # Configuração do Query client
│   └── utils.ts                  # Utilitários gerais
├── schemas/                      # Esquemas de validação Zod
│   ├── turbidity-schema.ts       # Validação do formulário de turbidez
│   └── ...
├── services/                     # Camadas de serviço da API
│   ├── auth-service.ts
│   ├── auth-service.ts
│   └── esp32-service.ts
├── stores/                       # Stores de estado Zustand
│   ├── esp32ConfigStore.ts       # Estado de configuração do ESP32
│   ├── offlineAuthStore.ts       # Autenticação offline
│   └── offlineDataStore.ts       # Gerenciamento de dados offline
├── types/                        # Definições de tipos TypeScript
└── utils/                        # Funções utilitárias
```

## 🏗️ Arquitetura

### Fluxo de Autenticação

1. **Rotas Públicas**: Login, cadastro, recuperação de senha
2. **Rotas Protegidas**: Dashboard e funcionalidades autenticadas
3. **Suporte Offline**: Estado de autenticação local com capacidades de sincronização
4. **Google OAuth**: Autenticação de terceiros sem problemas

### Fluxo de Dados

1. **Sensores ESP32** → Coleta de dados em tempo real
2. **Camada de API** → Processamento e validação de dados
3. **React Query** → Cache e sincronização
4. **Stores Zustand** → Gerenciamento de estado global
5. **Componentes UI** → Visualização de dados

### Design Offline-First

- **Capacidades PWA**: Service worker para funcionalidade offline
- **Armazenamento Local**: Persistência de dados críticos
- **Gerenciamento de Sincronização**: Sincronização automática de dados quando online
- **Indicadores Offline**: Feedback claro para o usuário sobre status de conexão

## 🚦 Começando

### Pré-requisitos

- Node.js 18+
- npm/yarn/pnpm
- Dispositivo ESP32 (para integração de hardware)

### Instalação

1. **Clone o repositório**

```bash
git clone <repository-url>
cd neptus
```

2. **Instale as dependências**

```bash
npm install
# ou
yarn install
# ou
pnpm install
```

3. **Configuração do ambiente**

```bash
# Copie o template de ambiente
cp .env.example .env.local

# Configure suas variáveis de ambiente
# - Configuração NextAuth
# - Credenciais Google OAuth
# - Endpoints da API
# - Conexões do banco de dados
```

4. **Execute o servidor de desenvolvimento**

```bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
```

5. **Abra a aplicação**
   Navegue para [http://localhost:3000](http://localhost:3000)

## 📱 Componentes Principais

### ColorRangeSelector

Componente customizado para seleção de parâmetros de cor da água com feedback visual:

- **Escala de cores interativa**: Representação visual da qualidade da água
- **Tooltips**: Informações contextuais no foco
- **Integração com formulários**: Integração perfeita com React Hook Form

### TurbidityForm

Componente de formulário modular para entrada de dados de qualidade da água:

- **Validação Zod**: Validação robusta de entrada
- **Hooks customizados**: Lógica de negócio separada
- **Tratamento de erros**: Mensagens de erro amigáveis ao usuário
- **Design responsivo**: Interface otimizada para mobile

### DataSyncManager

Gerencia sincronização de dados offline/online:

- **Sincronização automática**: Sincronização em segundo plano
- **Resolução de conflitos**: Mesclagem inteligente de dados
- **Indicadores de status**: Status de sincronização em tempo real
- **Gerenciamento de fila**: Enfileiramento de operações offline

## 🔧 Configuração

### Integração ESP32

Configure seu dispositivo ESP32 através da aplicação:

1. Acesse a configuração do dispositivo no dashboard
2. Defina credenciais WiFi e endpoints do servidor
3. Monitore status e conectividade do dispositivo
4. Gerencie configurações de calibração do sensor

### Configuração de Autenticação

1. Configure Google OAuth no Google Cloud Console
2. Adicione URIs de redirecionamento autorizados
3. Defina variáveis de ambiente para NextAuth
4. Configure configurações de sessão e JWT

## 🔍 Diretrizes de Desenvolvimento

### Padrões de Código

- **TypeScript**: Verificação de tipo estrita habilitada
- **ESLint**: Formatação de código consistente
- **Estrutura de Componentes**: Princípio de responsabilidade única
- **Organização de Arquivos**: Estrutura de pastas baseada em funcionalidades

### Melhores Práticas para Formulários

- **Esquemas Zod**: Lógica de validação centralizada
- **Hooks Customizados**: Lógica de negócio de formulários reutilizável
- **Boundaries de Erro**: Tratamento gracioso de erros
- **Acessibilidade**: Conformidade com WCAG

### Gerenciamento de Estado

- **Zustand**: Estado global para dados complexos
- **React Query**: Gerenciamento de estado do servidor
- **Estado Local**: Estado específico do componente com useState
- **Context**: Estado compartilhado de componentes

## 🚀 Deploy

### Processo de Build

```bash
# Build de produção
npm run build

# Iniciar servidor de produção
npm start
```

### Configuração de Ambiente

- Definir variáveis de ambiente de produção
- Configurar provedores de autenticação
- Configurar monitoramento e analytics
- Habilitar funcionalidades PWA

## 🤝 Contribuindo

1. Faça fork do repositório
2. Crie uma branch de funcionalidade (`git checkout -b feature/funcionalidade-incrivel`)
3. Commit suas mudanças (`git commit -m 'Adiciona funcionalidade incrível'`)
4. Push para a branch (`git push origin feature/funcionalidade-incrivel`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo LICENSE para detalhes.

## 🙏 Agradecimentos

- Equipe Next.js pelo framework incrível
- shadcn pelos componentes UI lindos
- Vercel pela plataforma de deploy
- Comunidade ESP32 pelos insights de hardware

---

Construído com ❤️ para monitoramento de qualidade da água
