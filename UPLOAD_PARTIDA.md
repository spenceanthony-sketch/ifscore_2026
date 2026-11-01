# Upload de arquivo da partida

A aplicação agora associa um único arquivo visual a cada registro `Jogo`. O arquivo representa dados da partida, como uma súmula, imagem do placar ou documento visual da partida. O exemplo utiliza JPEG, PNG e GIF.

## Configuração

- Campo multipart: `arquivo_partida`
- Limite: 2 MB
- MIME permitido: `image/jpeg`, `image/png`, `image/gif`
- Pasta física: `uploads/matches/`
- URL pública: `/uploads/matches/<nome-gerado>`
- Nome físico: UUID gerado pelo servidor com extensão definida pelo MIME
- Arquivos reais: ignorados pelo Git; `uploads/matches/.gitkeep` mantém a estrutura

## Segurança e fluxo

As rotas executam nesta ordem:

```text
authMiddleware → adminMiddleware → validate(params) → Multer → Controller
```

Portanto, uma requisição sem JWT recebe 401 antes que o Multer leia ou grave o arquivo. Tipo inválido e tamanho acima de 2 MB geram 400; o errorHandler remove eventual arquivo parcial. O nome enviado pelo cliente nunca é usado como nome físico.

## Rotas

```text
POST /api/matches/:id/arquivo  (cria/substitui)
PUT  /api/matches/:id/arquivo  (substitui)
```

Ambas exigem JWT de administrador P01 e recebem multipart com `arquivo_partida`. O registro `ArquivoPartida` possui `id_jogo @unique`, garantindo um arquivo por partida. O reenvio executa `upsert`, atualiza o mesmo registro e remove o arquivo físico anterior.

## Execução

```bash
npm install
npx prisma generate
npx prisma migrate deploy
cp .env.example .env
npm start
```

## Testes

Abra `testes_upload_partida.http` no VS Code REST Client e execute os requests na ordem. O arquivo contém casos de 401 sem token, criação de partida, upload 201, acesso ao caminho público, MIME proibido 400, arquivo acima de 2 MB 400 e reenvio com substituição.

O frontend possui `input type="file"`, usa `FormData` sem definir `Content-Type` manualmente, envia o Bearer token, exibe mensagens de erro e mostra a imagem anexada no card da partida.
