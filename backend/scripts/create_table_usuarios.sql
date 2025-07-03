-- Script de criação da tabela Usuarios
CREATE TABLE IF NOT EXISTS Usuarios (
    Username      VARCHAR(30) PRIMARY KEY NOT NULL,
    Password      VARCHAR(128) NOT NULL,
    Nome          VARCHAR(120) NOT NULL,
    Tipo          CHAR(1) NOT NULL, -- 0: Administrador, 1: Usuário Comum
    Status        CHAR(1) NOT NULL, -- A: Ativo, I: Inativo, B: Bloqueado
    Quant_Acesso  INTEGER DEFAULT 0
);
