-- CreateTable
CREATE TABLE "Papel" (
    "id_papel" TEXT NOT NULL PRIMARY KEY,
    "nome_papel" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Usuario" (
    "id_usuario" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "senha" TEXT NOT NULL,
    "nome_completo" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "data_registro" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "perfil" TEXT NOT NULL,
    CONSTRAINT "Usuario_perfil_fkey" FOREIGN KEY ("perfil") REFERENCES "Papel" ("id_papel") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ConfigSistema" (
    "id_config_sistema" TEXT NOT NULL PRIMARY KEY,
    "politicas_gerais" TEXT NOT NULL,
    "id_papel_fk" TEXT NOT NULL,
    CONSTRAINT "ConfigSistema_id_papel_fk_fkey" FOREIGN KEY ("id_papel_fk") REFERENCES "Papel" ("id_papel") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Denuncia" (
    "id_denuncia" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "relato_usuario" TEXT NOT NULL,
    "data_registro" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL,
    "id_usuario_fk" INTEGER NOT NULL,
    CONSTRAINT "Denuncia_id_usuario_fk_fkey" FOREIGN KEY ("id_usuario_fk") REFERENCES "Usuario" ("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SetorResponsavel" (
    "id_setor" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome_setor" TEXT NOT NULL,
    "email_setor" TEXT NOT NULL,
    "id_denuncia_fk" INTEGER NOT NULL,
    CONSTRAINT "SetorResponsavel_id_denuncia_fk_fkey" FOREIGN KEY ("id_denuncia_fk") REFERENCES "Denuncia" ("id_denuncia") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ContatoAdmin" (
    "id_contato" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "numero_suporte" TEXT NOT NULL,
    "id_usuario_fk" INTEGER NOT NULL,
    CONSTRAINT "ContatoAdmin_id_usuario_fk_fkey" FOREIGN KEY ("id_usuario_fk") REFERENCES "Usuario" ("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Jogo" (
    "id_jogo" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "data_jogo" DATETIME NOT NULL,
    "time_casa" TEXT NOT NULL,
    "time_fora" TEXT NOT NULL,
    "placar_casa" INTEGER NOT NULL DEFAULT 0,
    "placar_fora" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'Agendado'
);

-- CreateTable
CREATE TABLE "EstatisticaJogo" (
    "id_stats" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "player_stats" INTEGER NOT NULL,
    "descricao_stats" TEXT NOT NULL,
    "timestamp_registro" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_jogo" INTEGER NOT NULL,
    CONSTRAINT "EstatisticaJogo_id_jogo_fkey" FOREIGN KEY ("id_jogo") REFERENCES "Jogo" ("id_jogo") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");
