# Chat Backend API

Backend API para aplicação de chat em grupo desenvolvido com Node.js, Express e Socket.IO.

## 📋 Descrição

Este é o servidor backend que fornece todas as funcionalidades necessárias para um sistema de chat em grupo, incluindo:

- **Chat em tempo real** com WebSockets
- **Upload de arquivos** (imagens e áudios)
- **Gerenciamento de usuários online**
- **Estatísticas do chat**
- **Edição de mensagens**
- **Sistema de heartbeat** para detectar usuários offline

## 🚀 Tecnologias Utilizadas

- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **Socket.IO** - Comunicação em tempo real
- **Multer** - Upload de arquivos
- **CORS** - Cross-Origin Resource Sharing
- **UUID** - Geração de IDs únicos

## 📦 Instalação

1. **Instale as dependências**:
   ```bash
   npm install
   ```

2. **Execute o servidor**:
   ```bash
   # Modo desenvolvimento (com auto-reload)
   npm run dev
   
   # Modo produção
   npm start
   ```

3. **Acesse o servidor**:
   - URL: `http://localhost:3000`
   - O servidor estará rodando na porta 3000

## 🔧 Configuração

### Variáveis de Ambiente
O servidor usa configurações padrão, mas você pode personalizar:

- **PORT**: Porta do servidor (padrão: 3000)
- **CORS_ORIGIN**: Origem permitida para CORS (padrão: http://localhost:5173)

### Estrutura de Pastas
```
backend/
├── uploads/          # Arquivos enviados pelos usuários
├── node_modules/     # Dependências do Node.js
├── server.js         # Arquivo principal do servidor
├── package.json      # Configurações e dependências
└── README.md         # Este arquivo
```

## 📡 Endpoints da API

### Mensagens

#### `POST /messages`
Cria uma nova mensagem no chat.

**Body:**
```json
{
  "content": "Conteúdo da mensagem",
  "sender": "Nome do usuário",
  "type": "text|image|audio"
}
```

**Resposta:**
```json
{
  "id": "uuid-da-mensagem",
  "content": "Conteúdo da mensagem",
  "sender": "Nome do usuário",
  "type": "text",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

#### `GET /messages`
Retorna todas as mensagens do chat ordenadas por timestamp.

**Resposta:**
```json
[
  {
    "id": "uuid-da-mensagem",
    "content": "Conteúdo da mensagem",
    "sender": "Nome do usuário",
    "type": "text",
    "timestamp": "2024-01-01T12:00:00.000Z"
  }
]
```

#### `PUT /messages/:id`
Edita uma mensagem existente.

**Body:**
```json
{
  "content": "Novo conteúdo da mensagem",
  "sender": "Nome do usuário"
}
```

**Resposta:**
```json
{
  "id": "uuid-da-mensagem",
  "content": "Novo conteúdo da mensagem",
  "sender": "Nome do usuário",
  "type": "text",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "edited": true,
  "editedAt": "2024-01-01T12:30:00.000Z"
}
```

#### `DELETE /messages`
Limpa todas as mensagens do chat.

**Resposta:**
```json
{
  "message": "Mensagens limpas"
}
```

### Upload de Arquivos

#### `POST /upload`
Faz upload de arquivos (imagens e áudios).

**Form Data:**
- `file`: Arquivo a ser enviado

**Tipos permitidos:**
- Imagens: `.jpg`, `.png`
- Áudios: `.mp3`, `.wav`
- Tamanho máximo: 10MB

**Resposta:**
```json
{
  "url": "http://localhost:3000/uploads/nome-do-arquivo.jpg",
  "stats": {
    "totalFiles": 5,
    "totalSize": 1024000,
    "fileType": "image"
  }
}
```

### Usuários

#### `GET /users/online`
Retorna lista de usuários online.

**Resposta:**
```json
{
  "onlineUsers": [
    {
      "username": "João",
      "joinedAt": "2024-01-01T12:00:00.000Z",
      "socketId": "socket-id-123"
    }
  ],
  "count": 1
}
```

### Estatísticas

#### `GET /stats`
Retorna estatísticas do chat.

**Resposta:**
```json
{
  "totalMessages": 150,
  "onlineUsersCount": 3,
  "totalUsersCount": 3,
  "uniqueUsersCount": 5,
  "uniqueUsersList": ["João", "Maria", "Pedro"],
  "fileStats": {
    "totalFiles": 10,
    "imageFiles": 7,
    "audioFiles": 3,
    "totalSize": 2048000,
    "uploadsToday": 5
  },
  "activityStats": {
    "messagesPerHour": 6,
    "recentMessagesCount": 25
  }
}
```

## 🔌 WebSocket Events

### Eventos do Cliente para o Servidor

#### `user-join`
Usuário entra no chat.
```javascript
socket.emit('user-join', 'Nome do Usuário');
```

#### `user-heartbeat`
Mantém o usuário online (enviado periodicamente).
```javascript
socket.emit('user-heartbeat', 'Nome do Usuário');
```

### Eventos do Servidor para o Cliente

#### `user-joined`
Notifica que um usuário entrou no chat.
```javascript
socket.on('user-joined', (data) => {
  console.log(`${data.username} entrou no chat`);
});
```

#### `user-left`
Notifica que um usuário saiu do chat.
```javascript
socket.on('user-left', (data) => {
  console.log(`${data.username} saiu do chat`);
});
```

#### `users-updated`
Atualiza lista de usuários online.
```javascript
socket.on('users-updated', (data) => {
  console.log('Usuários online:', data.onlineUsers);
});
```

#### `username-taken`
Notifica que o nome de usuário já está em uso.
```javascript
socket.on('username-taken', (data) => {
  console.log(data.message);
});
```

## 🛡️ Segurança e Validações

- **Validação de tipos de arquivo**: Apenas imagens (JPG, PNG) e áudios (MP3, WAV)
- **Limite de tamanho**: Máximo 10MB por arquivo
- **Validação de campos obrigatórios**: Todos os endpoints validam campos necessários
- **CORS configurado**: Apenas origens permitidas podem acessar a API
- **Validação de edição**: Usuários só podem editar suas próprias mensagens

## 📊 Monitoramento

O servidor inclui:

- **Sistema de heartbeat**: Detecta usuários offline automaticamente
- **Estatísticas em tempo real**: Contadores de mensagens, usuários e arquivos
- **Logs de erro**: Tratamento e log de erros
- **Limpeza automática**: Remove usuários inativos após 60 segundos

## 🐛 Tratamento de Erros

Todos os endpoints incluem tratamento de erros com:

- **Códigos HTTP apropriados**: 400, 403, 404, 500
- **Mensagens de erro em português**
- **Validação de entrada**
- **Logs detalhados no console**

## 🔄 Funcionalidades Especiais

### Sistema de Usuários Únicos
- Rastreia usuários únicos que já acessaram o chat
- Impede nomes de usuário duplicados
- Mantém histórico de usuários

### Upload Inteligente
- Gera nomes únicos para arquivos
- Estatísticas de upload em tempo real
- Validação de tipos MIME

### Chat Persistente
- Mensagens ficam salvas na memória durante a execução
- Ordenação automática por timestamp
- Sistema de edição com marcação temporal

## 🚀 Deploy

Para fazer deploy em produção:

1. **Configure variáveis de ambiente**:
   ```bash
   export PORT=3000
   export NODE_ENV=production
   ```

2. **Instale dependências de produção**:
   ```bash
   npm install --production
   ```

3. **Execute o servidor**:
   ```bash
   npm start
   ```

## 📝 Scripts Disponíveis

- `npm start`: Executa o servidor em modo produção
- `npm run dev`: Executa o servidor em modo desenvolvimento com auto-reload

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Para suporte ou dúvidas, abra uma issue no repositório ou entre em contato com a equipe de desenvolvimento.
