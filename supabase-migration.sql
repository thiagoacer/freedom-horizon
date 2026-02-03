-- Migration para adicionar campos de cenário na tabela leads
-- Execute este script no SQL Editor do Supabase

-- 1. Adicionar campo para armazenar o cenário escolhido pelo usuário
ALTER TABLE leads
ADD COLUMN IF NOT EXISTS cenario_escolhido TEXT
CHECK (cenario_escolhido IN ('pessimista', 'realista', 'otimista'));

-- 2. Adicionar campo para armazenar a taxa de retorno do cenário
ALTER TABLE leads
ADD COLUMN IF NOT EXISTS taxa_retorno_cenario DECIMAL(5,4);

-- 3. Adicionar comentários explicativos nos campos
COMMENT ON COLUMN leads.cenario_escolhido IS 'Cenário de rentabilidade escolhido pelo usuário: pessimista (3%), realista (5%), otimista (8%)';
COMMENT ON COLUMN leads.taxa_retorno_cenario IS 'Taxa de retorno anual do cenário escolhido (ex: 0.05 para 5%)';

-- 4. Criar índice para facilitar queries por cenário
CREATE INDEX IF NOT EXISTS idx_leads_cenario ON leads(cenario_escolhido);

-- 5. (OPCIONAL) Atualizar leads existentes com valor padrão 'realista'
UPDATE leads
SET cenario_escolhido = 'realista',
    taxa_retorno_cenario = 0.05
WHERE cenario_escolhido IS NULL;

-- 6. Verificar a estrutura atualizada
-- SELECT column_name, data_type, is_nullable, column_default
-- FROM information_schema.columns
-- WHERE table_name = 'leads'
-- ORDER BY ordinal_position;
