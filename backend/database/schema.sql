-- ================================================================
-- Schema: Organização Financeira
-- Banco: org_financeira
-- ================================================================

-- Criar banco se não existir (execute separadamente se necessário)
-- CREATE DATABASE org_financeira ENCODING 'UTF8';

-- ================================================================
-- TABELA: categories
-- ================================================================
CREATE TABLE IF NOT EXISTS categories (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        VARCHAR(100) NOT NULL,
    type        VARCHAR(20)  NOT NULL CHECK (type IN ('income', 'expense', 'investment')),
    icon        VARCHAR(50),
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================================================
-- TABELA: transactions
-- ================================================================
CREATE TABLE IF NOT EXISTS transactions (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date        DATE         NOT NULL,
    description VARCHAR(255) NOT NULL,
    amount      DECIMAL(15, 2) NOT NULL CHECK (amount >= 0),
    type        VARCHAR(20)  NOT NULL CHECK (type IN ('income', 'expense', 'investment')),
    category_id UUID         REFERENCES categories(id) ON DELETE SET NULL,
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================================================
-- TABELA: monthly_budgets
-- ================================================================
CREATE TABLE IF NOT EXISTS monthly_budgets (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID         REFERENCES categories(id) ON DELETE CASCADE,
    amount      DECIMAL(15, 2) NOT NULL CHECK (amount >= 0),
    month       SMALLINT     NOT NULL CHECK (month BETWEEN 1 AND 12),
    year        SMALLINT     NOT NULL CHECK (year >= 2000),
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (category_id, month, year)
);

-- ================================================================
-- ÍNDICES para melhor performance
-- ================================================================
CREATE INDEX IF NOT EXISTS idx_transactions_date        ON transactions (date DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_type        ON transactions (type);
CREATE INDEX IF NOT EXISTS idx_transactions_category_id ON transactions (category_id);
CREATE INDEX IF NOT EXISTS idx_monthly_budgets_period   ON monthly_budgets (year, month);

-- ================================================================
-- SEED: Categorias padrão
-- ================================================================
INSERT INTO categories (id, name, type) VALUES
    ('a1b2c3d4-0001-0001-0001-000000000001', 'Alimentação',   'expense'),
    ('a1b2c3d4-0001-0001-0001-000000000002', 'Transporte',    'expense'),
    ('a1b2c3d4-0001-0001-0001-000000000003', 'Moradia',       'expense'),
    ('a1b2c3d4-0001-0001-0001-000000000004', 'Saúde',         'expense'),
    ('a1b2c3d4-0001-0001-0001-000000000005', 'Educação',      'expense'),
    ('a1b2c3d4-0001-0001-0001-000000000006', 'Lazer',         'expense'),
    ('a1b2c3d4-0001-0001-0001-000000000007', 'Salário',       'income'),
    ('a1b2c3d4-0001-0001-0001-000000000008', 'Rendimentos',   'income'),
    ('a1b2c3d4-0001-0001-0001-000000000009', 'Freelance',     'income'),
    ('a1b2c3d4-0001-0001-0001-000000000010', 'Ações',         'investment'),
    ('a1b2c3d4-0001-0001-0001-000000000011', 'Fundos',        'investment'),
    ('a1b2c3d4-0001-0001-0001-000000000012', 'Criptomoedas',  'investment')
ON CONFLICT (id) DO NOTHING;
