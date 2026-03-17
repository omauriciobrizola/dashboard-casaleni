-- Migration manual para rodar no Portainer
-- Adiciona colunas status_pix e status_producao na tabela pedidos sem perder dados

ALTER TABLE pedidos ADD COLUMN IF NOT EXISTS status_pix VARCHAR(20) DEFAULT 'pendente';
ALTER TABLE pedidos ADD COLUMN IF NOT EXISTS status_producao VARCHAR(30) DEFAULT 'aguardando';
