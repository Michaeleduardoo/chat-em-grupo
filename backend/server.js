const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = {
      "image/jpeg": ".jpg",
      "image/png": ".png",
      "audio/mpeg": ".mp3",
      "audio/wav": ".wav",
    };

    if (allowedTypes[file.mimetype]) {
      cb(null, true);
    } else {
      cb(new Error("Tipo de arquivo não permitido"), false);
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

let messages = [];

let onlineUsers = new Map();
let totalUsersCount = 0;
let uniqueUsersHistory = new Set();

let fileStats = {
  totalFiles: 0,
  imageFiles: 0,
  audioFiles: 0,
  totalSize: 0,
  uploadsToday: 0,
};

app.post("/messages", (req, res) => {
  try {
    const { content, sender, type } = req.body;

    if (!content || !sender || !type) {
      return res
        .status(400)
        .json({ error: "Campos obrigatórios: content, sender, type" });
    }

    const message = {
      id: uuidv4(),
      content,
      sender,
      type,
      timestamp: new Date().toISOString(),
    };

    messages.push(message);

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

app.get("/messages", (req, res) => {
  try {
    const sortedMessages = messages.sort(
      (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
    );

    res.json(sortedMessages);
  } catch (error) {
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

app.put("/messages/:id", (req, res) => {
  try {
    const { id } = req.params;
    const { content, sender } = req.body;

    console.log("PUT /messages/:id - ID:", id);
    console.log("PUT /messages/:id - Content:", content);
    console.log("PUT /messages/:id - Sender:", sender);
    console.log("PUT /messages/:id - Messages count:", messages.length);

    if (!content || !sender) {
      console.log("PUT /messages/:id - Missing required fields");
      return res
        .status(400)
        .json({ error: "Campos obrigatórios: content, sender" });
    }

    const messageIndex = messages.findIndex((msg) => msg.id === id);
    console.log("PUT /messages/:id - Message index:", messageIndex);

    if (messageIndex === -1) {
      console.log("PUT /messages/:id - Message not found");
      return res.status(404).json({ error: "Mensagem não encontrada" });
    }

    if (messages[messageIndex].sender !== sender) {
      console.log("PUT /messages/:id - User not authorized to edit");
      return res
        .status(403)
        .json({ error: "Você só pode editar suas próprias mensagens" });
    }

    messages[messageIndex] = {
      ...messages[messageIndex],
      content,
      edited: true,
      editedAt: new Date().toISOString(),
    };

    console.log("PUT /messages/:id - Message updated successfully");
    res.json(messages[messageIndex]);
  } catch (error) {
    console.error("PUT /messages/:id - Error:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

app.post("/upload", upload.single("file"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Nenhum arquivo enviado" });
    }

    fileStats.totalFiles++;
    fileStats.totalSize += req.file.size;

    if (req.file.mimetype.startsWith("image/")) {
      fileStats.imageFiles++;
    } else if (req.file.mimetype.startsWith("audio/")) {
      fileStats.audioFiles++;
    }

    const today = new Date().toDateString();
    const fileDate = new Date().toDateString();
    if (fileDate === today) {
      fileStats.uploadsToday++;
    }

    const fileUrl = `http://localhost:${PORT}/uploads/${req.file.filename}`;

    res.json({
      url: fileUrl,
      stats: {
        totalFiles: fileStats.totalFiles,
        totalSize: fileStats.totalSize,
        fileType: req.file.mimetype.startsWith("image/") ? "image" : "audio",
      },
    });
  } catch (error) {
    console.error("Erro no upload:", error);
    res.status(500).json({ error: "Erro no upload do arquivo" });
  }
});

app.get("/users/online", (req, res) => {
  try {
    const users = Array.from(onlineUsers.values());
    res.json({
      onlineUsers: users,
      count: users.length,
    });
  } catch (error) {
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

app.get("/stats", (req, res) => {
  try {
    const now = new Date();
    const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const recentMessages = messages.filter(
      (msg) => new Date(msg.timestamp) > last24Hours
    );
    const messagesPerHour = Math.round(recentMessages.length / 24);

    const fileMessages = messages.filter(
      (msg) => msg.type === "image" || msg.type === "audio"
    );
    const imageFiles = fileMessages.filter(
      (msg) => msg.type === "image"
    ).length;
    const audioFiles = fileMessages.filter(
      (msg) => msg.type === "audio"
    ).length;

    console.log(`=== STATS REQUEST ===`);
    console.log(
      `Usuários online: ${Array.from(onlineUsers.values()).map(
        (u) => u.username
      )}`
    );
    console.log(`Total online: ${onlineUsers.size}`);
    console.log(`Total únicos no histórico: ${uniqueUsersHistory.size}`);
    console.log(`Enviando onlineUsersCount: ${onlineUsers.size}`);
    console.log(`Enviando totalUsersCount: ${onlineUsers.size}`);
    console.log(`Enviando uniqueUsersCount: ${uniqueUsersHistory.size}`);

    res.json({
      totalMessages: messages.length,
      onlineUsersCount: onlineUsers.size,
      totalUsersCount: onlineUsers.size,
      uniqueUsersCount: uniqueUsersHistory.size,
      uniqueUsersList: Array.from(onlineUsers.values()).map((u) => u.username),
      fileStats: {
        totalFiles: fileStats.totalFiles,
        imageFiles: imageFiles,
        audioFiles: audioFiles,
        totalSize: fileStats.totalSize,
        uploadsToday: fileStats.uploadsToday,
      },
      activityStats: {
        messagesPerHour: messagesPerHour,
        recentMessagesCount: recentMessages.length,
      },
    });
  } catch (error) {
    console.error("Erro ao buscar estatísticas:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

app.delete("/messages", (req, res) => {
  messages = [];
  res.json({ message: "Mensagens limpas" });
});

app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res
        .status(400)
        .json({ error: "Arquivo muito grande. Máximo 10MB." });
    }
  }

  res.status(500).json({ error: error.message || "Erro interno do servidor" });
});

io.on("connection", (socket) => {
  console.log("Cliente conectado:", socket.id);

  socket.on("user-join", (username) => {
    console.log(`Tentativa de entrada: ${username}`);
    console.log(`Total antes: ${totalUsersCount}`);

    if (username) {
      const isUsernameOnline = Array.from(onlineUsers.values()).some(
        (user) => user.username.toLowerCase() === username.toLowerCase()
      );

      if (isUsernameOnline) {
        console.log(`❌ Nome '${username}' já está em uso`);
        socket.emit("username-taken", {
          message: `O nome "${username}" já está sendo usado. Escolha outro nome.`,
          username: username,
        });
        return;
      }

      uniqueUsersHistory.add(username);

      onlineUsers.set(socket.id, {
        username: username,
        joinedAt: new Date().toISOString(),
        socketId: socket.id,
      });

      totalUsersCount = onlineUsers.size;
      console.log(`Usuário ${username} entrou no chat (online)`);
      console.log(`Total de usuários online agora: ${onlineUsers.size}`);
      console.log(
        `Total de usuários únicos no histórico: ${uniqueUsersHistory.size}`
      );
      console.log(`Total agora: ${totalUsersCount}`);

      const updateData = {
        onlineUsers: Array.from(onlineUsers.values()),
        totalUsersCount: totalUsersCount,
        uniqueUsersCount: uniqueUsersHistory.size,
      };

      const userJoinedData = {
        username: username,
        timestamp: new Date().toISOString(),
        onlineUsers: Array.from(onlineUsers.values()),
        totalUsersCount: totalUsersCount,
        uniqueUsersCount: uniqueUsersHistory.size,
      };

      console.log("🟢 BACKEND - Emitindo user-joined:", userJoinedData);
      io.emit("user-joined", userJoinedData);

      io.emit("users-updated", updateData);
      console.log(
        "Evento users-updated enviado para todos os clientes:",
        updateData
      );
    }
  });

  socket.on("disconnect", () => {
    const user = onlineUsers.get(socket.id);
    if (user) {
      console.log(`Usuário ${user.username} saiu do chat`);
      onlineUsers.delete(socket.id);
      totalUsersCount = onlineUsers.size;
      console.log(`Total de usuários online agora: ${onlineUsers.size}`);
      console.log(
        `Total de usuários únicos no histórico: ${uniqueUsersHistory.size}`
      );
      console.log(`Total agora: ${totalUsersCount}`);

      const updateData = {
        onlineUsers: Array.from(onlineUsers.values()),
        totalUsersCount: totalUsersCount,
        uniqueUsersCount: uniqueUsersHistory.size,
      };

      const userLeftData = {
        username: user.username,
        timestamp: new Date().toISOString(),
        onlineUsers: Array.from(onlineUsers.values()),
        totalUsersCount: totalUsersCount,
        uniqueUsersCount: uniqueUsersHistory.size,
      };

      console.log("🔴 BACKEND - Emitindo user-left:", userLeftData);
      io.emit("user-left", userLeftData);

      io.emit("users-updated", updateData);
      console.log(
        "Evento users-updated enviado para todos os clientes (disconnect):",
        updateData
      );
    }
  });

  socket.on("user-heartbeat", (username) => {
    if (username) {
      const user = onlineUsers.get(socket.id);
      if (user && user.username === username) {
        onlineUsers.set(socket.id, {
          ...user,
          lastSeen: new Date().toISOString(),
        });
      }
    }
  });
});

setInterval(() => {
  const now = new Date();
  const timeout = 60 * 1000;

  for (const [socketId, user] of onlineUsers.entries()) {
    const lastSeen = user.lastSeen
      ? new Date(user.lastSeen)
      : new Date(user.joinedAt);
    if (now - lastSeen > timeout) {
      onlineUsers.delete(socketId);
      console.log(`Usuário ${user.username} removido por inatividade`);
    }
  }

  if (onlineUsers.size > 0) {
    totalUsersCount = onlineUsers.size;
    io.emit("users-updated", {
      onlineUsers: Array.from(onlineUsers.values()),
      totalUsersCount: totalUsersCount,
      uniqueUsersCount: uniqueUsersHistory.size,
    });
  }
}, 30000);

server.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  console.log("Endpoints disponíveis:");
  console.log("POST /messages - Salvar mensagem");
  console.log("GET /messages - Buscar mensagens");
  console.log("PUT /messages/:id - Editar mensagem");
  console.log("POST /upload - Upload de arquivo");
  console.log("GET /users/online - Usuários online");
  console.log("GET /stats - Estatísticas do chat");
  console.log("DELETE /messages - Limpar mensagens");
});
