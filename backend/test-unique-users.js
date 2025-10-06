let uniqueUsers = new Set();
let totalUsersCount = 0;

// Teste de usuários únicos

const testUsers = ['Michael', 'Michael', 'Micon', 'Michael', 'Ana', 'Micon', 'João'];

testUsers.forEach((username, index) => {
  // Tentativa de entrada
  // Usuários únicos antes
  // Total antes

  if (!uniqueUsers.has(username)) {
    uniqueUsers.add(username);
    totalUsersCount = uniqueUsers.size;
    // NOVO USUÁRIO ÚNICO adicionado
  } else {
    // Usuário já existe, não adicionado ao contador
  }

  // Usuários únicos agora
  // Total agora
});

// RESULTADO FINAL
// Usuários únicos
// Total de usuários únicos
// Esperado: Michael, Micon, Ana, João = 4 usuários
