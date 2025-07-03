-- CreateTable
CREATE TABLE "Usuario" (
    "Username" VARCHAR(30) NOT NULL,
    "Password" VARCHAR(128) NOT NULL,
    "Nome" VARCHAR(120) NOT NULL,
    "Tipo" CHAR(1) NOT NULL,
    "Status" CHAR(1) NOT NULL,
    "Quant_Acesso" INTEGER,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("Username")
);
