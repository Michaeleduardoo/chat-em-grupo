let uniqueUsers = new Set();
let totalUsersCount = 0;

console.log('=== TESTE DE USUÁRIOS ÚNICOS ===');

const testUsers = ['Michael', 'Michael', 'Micon', 'Michael', 'Ana', 'Micon', 'João'];

testUsers.forEach((username, index) => {
  console.log(`\n${index + 1}. Tentativa de entrada: ${username}`);
  console.log(`Usuários únicos antes: ${Array.from(uniqueUsers)}`);
  console.log(`Total antes: ${totalUsersCount}`);

  if (!uniqueUsers.has(username)) {
    uniqueUsers.add(username);
    totalUsersCount = uniqueUsers.size;
    console.log(`NOVO USUÁRIO ÚNICO: ${username} adicionado!`);
  } else {
    console.log(`Usuário ${username} já existe, não adicionado ao contador`);
  }

  console.log(`Usuários únicos agora: ${Array.from(uniqueUsers)}`);
  console.log(`Total agora: ${totalUsersCount}`);
});

console.log('\n=== RESULTADO FINAL ===');
console.log(`Usuários únicos: ${Array.from(uniqueUsers)}`);
console.log(`Total de usuários únicos: ${totalUsersCount}`);
console.log(`Esperado: Michael, Micon, Ana, João = 4 usuários`);
