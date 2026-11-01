-- CreateTable
CREATE TABLE "ArquivoPartida" (
    "id_arquivo" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome_original" TEXT NOT NULL,
    "nome_servidor" TEXT NOT NULL,
    "caminho_publico" TEXT NOT NULL,
    "mime_type" TEXT NOT NULL,
    "tamanho_bytes" INTEGER NOT NULL,
    "data_upload" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_jogo" INTEGER NOT NULL,
    CONSTRAINT "ArquivoPartida_id_jogo_fkey" FOREIGN KEY ("id_jogo") REFERENCES "Jogo" ("id_jogo") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "ArquivoPartida_nome_servidor_key" ON "ArquivoPartida"("nome_servidor");
CREATE UNIQUE INDEX "ArquivoPartida_id_jogo_key" ON "ArquivoPartida"("id_jogo");
