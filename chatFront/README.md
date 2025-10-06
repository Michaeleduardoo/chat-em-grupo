# ChatGrupo Frontend

Interface moderna e responsiva para aplicação de chat em grupo desenvolvida com React e Vite.

## 📋 Descrição

Este é o frontend da aplicação ChatGrupo, uma interface de chat em tempo real com design moderno e funcionalidades avançadas. O projeto oferece uma experiência de usuário fluida e intuitiva para comunicação em grupo.

## ✨ Funcionalidades

### 🎯 **Funcionalidades Principais**
- **Chat em tempo real** com WebSockets
- **Interface responsiva** para desktop e mobile
- **Temas claro e escuro** com persistência
- **Upload de arquivos** (imagens e áudios)
- **Sistema de emojis** integrado
- **Indicador de digitação** em tempo real
- **Notificações toast** para eventos
- **Estatísticas do chat** em tempo real
- **Sistema de resposta** a mensagens
- **Menu mobile** otimizado

### 🎨 **Interface e UX**
- **Design moderno** com gradientes e animações
- **Animações suaves** e transições
- **Loading states** e feedback visual
- **Validação em tempo real** de formulários
- **Acessibilidade** com ARIA labels
- **Responsividade** completa

### 🔧 **Funcionalidades Técnicas**
- **Gerenciamento de estado** com Context API
- **Auto-scroll inteligente** nas mensagens
- **Sistema de heartbeat** para usuários online
- **Validação de arquivos** no frontend
- **Persistência de tema** no localStorage
- **Tratamento de erros** robusto

## 🚀 Tecnologias Utilizadas

### **Core**
- **React 19.1.1** - Biblioteca principal
- **Vite 7.1.14** - Build tool e dev server
- **JavaScript ES6+** - Linguagem principal

### **Comunicação**
- **Axios 1.12.2** - Cliente HTTP
- **Socket.IO Client 4.8.1** - WebSocket para tempo real

### **UI/UX**
- **React Icons 5.5.0** - Ícones
- **CSS3** - Estilização com variáveis CSS
- **Gradientes e animações** - Efeitos visuais

### **Desenvolvimento**
- **ESLint 9.36.0** - Linting
- **Nodemon** - Auto-reload em desenvolvimento

## 📦 Instalação

1. **Instale as dependências**:
   ```bash
   npm install
   ```

2. **Execute o servidor de desenvolvimento**:
   ```bash
   npm run dev
   ```

3. **Acesse a aplicação**:
   - URL: `http://localhost:5173`
   - A aplicação estará rodando na porta 5173

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento com hot-reload
npm run dev

# Build para produção
npm run build

# Preview do build de produção
npm run preview

# Linting do código
npm run lint
```

## 🏗️ Estrutura do Projeto

```
chatFront/
├── public/                 # Arquivos estáticos
│   ├── icon.png           # Ícone da aplicação
│   └── vite.svg           # Logo do Vite
├── src/                   # Código fonte
│   ├── components/        # Componentes React
│   │   ├── AnimatedBackground/  # Fundo animado
│   │   ├── AudioPlayer/         # Player de áudio
│   │   ├── Chat/               # Componente principal do chat
│   │   ├── ChatStats/          # Estatísticas do chat
│   │   ├── EmojiPicker/        # Seletor de emojis
│   │   ├── FilePreview/        # Preview de arquivos
│   │   ├── FileUploadModal/    # Modal de upload
│   │   ├── Login/              # Tela de login
│   │   ├── LogoutLoading/      # Loading de logout
│   │   ├── Message/            # Componente de mensagem
│   │   ├── MessageInput/       # Input de mensagem
│   │   ├── MessageList/        # Lista de mensagens
│   │   ├── MobileMenu/         # Menu mobile
│   │   ├── OnlineUsers/        # Lista de usuários online
│   │   ├── Popconfirm/         # Modal de confirmação
│   │   ├── SoundEffects/       # Efeitos sonoros
│   │   ├── ToastContainer/     # Container de notificações
│   │   ├── ToastNotification/  # Componente de notificação
│   │   └── TypingIndicator/    # Indicador de digitação
│   ├── context/           # Context API
│   │   ├── ChatContext.jsx     # Contexto do chat
│   │   ├── ChatProvider.jsx    # Provider do contexto
│   │   └── useChat.jsx         # Hook personalizado
│   ├── App.jsx            # Componente principal
│   ├── App.css            # Estilos globais
│   ├── index.css          # Estilos base
│   └── main.jsx           # Ponto de entrada
├── index.html             # HTML principal
├── package.json           # Dependências e scripts
├── vite.config.js         # Configuração do Vite
└── README.md              # Este arquivo
```

## 🎨 Componentes Principais

### **App.jsx**
Componente raiz que gerencia o estado de inicialização e renderiza Login ou Chat.

### **Login (components/Login/)**
- Interface de entrada com validação
- Design moderno com animações
- Validação de nome de usuário
- Preview de funcionalidades

### **Chat (components/Chat/)**
- Interface principal do chat
- Gerenciamento de mensagens
- Upload de arquivos
- Sistema de temas
- Menu mobile

### **Context API (context/)**
- **ChatProvider**: Gerencia todo o estado da aplicação
- **useChat**: Hook personalizado para acessar o contexto
- **ChatContext**: Contexto React para compartilhamento de estado

## 🔌 Integração com Backend

### **Configuração de Proxy**
O Vite está configurado para fazer proxy das requisições para o backend:

```javascript
// vite.config.js
server: {
  proxy: {
    '/messages': 'http://localhost:3000',
    '/upload': 'http://localhost:3000',
    '/users': 'http://localhost:3000',
    '/stats': 'http://localhost:3000'
  }
}
```

### **Endpoints Utilizados**
- `GET /messages` - Buscar mensagens
- `POST /messages` - Enviar mensagem
- `PUT /messages/:id` - Editar mensagem
- `POST /upload` - Upload de arquivo
- `GET /users/online` - Usuários online
- `GET /stats` - Estatísticas

### **WebSocket Events**
- `user-join` - Usuário entra no chat
- `user-heartbeat` - Manter usuário online
- `user-joined` - Notificação de entrada
- `user-left` - Notificação de saída
- `users-updated` - Atualização de usuários

## 🎯 Funcionalidades Detalhadas

### **Sistema de Login**
- Validação de nome de usuário (2-50 caracteres)
- Verificação de nomes duplicados
- Feedback visual de loading
- Persistência de sessão

### **Chat em Tempo Real**
- Mensagens instantâneas via WebSocket
- Auto-scroll inteligente
- Indicador de digitação
- Sistema de resposta a mensagens
- Edição de mensagens próprias

### **Upload de Arquivos**
- Suporte a imagens (JPG, PNG) e áudios (MP3, WAV)
- Validação de tipo e tamanho (máx. 10MB)
- Preview antes do envio
- Progress indicator

### **Sistema de Temas**
- Tema claro e escuro
- Persistência no localStorage
- Transições suaves
- Variáveis CSS para fácil customização

### **Responsividade**
- Design mobile-first
- Menu mobile otimizado
- Breakpoints responsivos
- Touch-friendly interface

### **Notificações**
- Toast notifications para eventos
- Notificações de entrada/saída de usuários
- Feedback de ações
- Auto-dismiss configurável

## 🎨 Customização

### **Temas**
Os temas são controlados via atributo `data-theme` no HTML:

```css
/* Tema escuro (padrão) */
[data-theme="dark"] {
  --bg-primary: #1a1a1a;
  --text-primary: #ffffff;
}

/* Tema claro */
[data-theme="light"] {
  --bg-primary: #ffffff;
  --text-primary: #1a1a1a;
}
```

### **Variáveis CSS**
Principais variáveis customizáveis:

```css
:root {
  --primary-color: #6366f1;
  --secondary-color: #8b5cf6;
  --success-color: #10b981;
  --error-color: #ef4444;
  --warning-color: #f59e0b;
  --border-radius: 12px;
  --transition: all 0.3s ease;
}
```

## 📱 Responsividade

### **Breakpoints**
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### **Funcionalidades Mobile**
- Menu hambúrguer
- Touch gestures
- Otimização de teclado virtual
- Swipe gestures

## 🔧 Configuração de Desenvolvimento

### **Variáveis de Ambiente**
Crie um arquivo `.env.local` para configurações locais:

```env
VITE_API_URL=http://localhost:3000
VITE_SOCKET_URL=http://localhost:3000
```

### **Proxy de Desenvolvimento**
O Vite está configurado para fazer proxy automático das requisições para o backend durante o desenvolvimento.

## 🚀 Build e Deploy

### **Build de Produção**
```bash
npm run build
```

### **Preview Local**
```bash
npm run preview
```

### **Deploy**
1. Execute `npm run build`
2. Os arquivos estarão na pasta `dist/`
3. Faça upload para seu servidor web
4. Configure o servidor para servir o `index.html` para todas as rotas (SPA)

## 🐛 Tratamento de Erros

### **Tipos de Erro**
- **Erros de rede**: Conexão com backend
- **Erros de validação**: Formulários e uploads
- **Erros de WebSocket**: Conexão em tempo real
- **Erros de upload**: Arquivos inválidos

### **Feedback Visual**
- Mensagens de erro contextuais
- Loading states
- Toast notifications
- Validação em tempo real

## 🎯 Performance

### **Otimizações**
- **Lazy loading** de componentes
- **Memoização** com useCallback e useMemo
- **Debounce** em inputs
- **Virtual scrolling** para listas grandes
- **Image optimization** para uploads

### **Bundle Size**
- **Tree shaking** automático
- **Code splitting** por rotas
- **Minificação** em produção
- **Gzip compression**

## 🧪 Testes

### **Estrutura de Testes**
```bash
# Instalar dependências de teste
npm install --save-dev @testing-library/react @testing-library/jest-dom

# Executar testes
npm test
```

## 📊 Monitoramento

### **Métricas Disponíveis**
- Usuários online em tempo real
- Contador de mensagens
- Estatísticas de arquivos
- Atividade por hora

### **Debugging**
- Console logs em desenvolvimento
- React DevTools
- Network tab para requisições
- WebSocket inspector

## 🤝 Contribuição

1. **Fork** o projeto
2. **Crie** uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. **Push** para a branch (`git push origin feature/AmazingFeature`)
5. **Abra** um Pull Request

### **Padrões de Código**
- Use ESLint para manter consistência
- Siga as convenções do React
- Documente componentes complexos
- Mantenha componentes pequenos e focados

## 🔗 Links Úteis

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Socket.IO Client](https://socket.io/docs/v4/client-api/)
- [Axios Documentation](https://axios-http.com/)

---

**Desenvolvido com ❤️ para uma experiência de chat moderna e intuitiva.**
