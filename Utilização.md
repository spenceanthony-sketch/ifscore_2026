Baixe os arquivos, upload no Github e abra uma sessão no Codespace.

CODESPACE

Baixe as extensões "Rest client", e opcionalmente a extensão View Sqlite para ler o banco de dados em sql.

Vá para o terminal e digite: 
npm install
npx prisma generate
npm run dev

Caso o npm install não baixe todas as bibliotecas, o que é comum de ocorrer, digite os seguintes comandos:
npm install morgan
npm install cors

Ambos comandos acima instalam manualmente as bibliotecas que ele pode pedir, caso não sejam essas repitam o comando e substituam pela que ele pede.
