# Chat em Grupo - Aplicação Simples

Uma aplicação de chat em grupo com backend em Node.js e frontend em React.

## Estrutura do Projeto

```
/
├── backend/          # API RESTful em Node.js
├── frontend/         # Interface React
└── README.md         # Este arquivo
```

## Como Executar

### Backend

1. Navegue até a pasta backend:
```bash
cd backend
```

2. Instale as dependências:
```bash
npm install
```

3. Execute o servidor:
```bash
npm start
```

O backend estará rodando em `http://localhost:3000`

### Frontend

1. Navegue até a pasta frontend:
```bash
cd frontend
```

2. Instale as dependências:
```bash
npm install
```

3. Execute a aplicação:
```bash
npm start
```

O frontend estará rodando em `http://localhost:3001`

## Funcionalidades

- ✅ Login com nome do usuário
- ✅ Chat em tempo real (atualização a cada 5 segundos)
- ✅ Envio de mensagens de texto (máximo 200 caracteres)
- ✅ Envio de imagens (JPG, PNG)
- ✅ Envio de áudios (MP3, WAV)
- ✅ Preview de arquivos antes do envio
- ✅ Diferenciação visual para mensagens do usuário
- ✅ Scroll automático para última mensagem
- ✅ Layout responsivo
- ✅ Context API para gerenciamento de estado
- ✅ Avatares com iniciais do remetente
- ✅ Agrupamento de mensagens por dia
- ✅ Acessibilidade básica

## Tecnologias Utilizadas

### Backend
- Node.js
- Express
- Multer (upload de arquivos)
- CORS

### Frontend
- React
- Context API
- Axios
- CSS Modules
