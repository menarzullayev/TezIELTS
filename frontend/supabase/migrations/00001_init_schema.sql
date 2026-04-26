-- ==========================================
-- TezIELTS Database Schema - Initial Migration
-- ==========================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- SCHEMAS
-- ==========================================
-- Using 'app_auth' instead of 'auth' to avoid conflicts with Supabase's native auth schema
CREATE SCHEMA IF NOT EXISTS app_auth;
CREATE SCHEMA IF NOT EXISTS content;
CREATE SCHEMA IF NOT EXISTS eval;
CREATE SCHEMA IF NOT EXISTS finance;
CREATE SCHEMA IF NOT EXISTS audit;

-- ==========================================
-- ENUMS
-- ==========================================
CREATE TYPE app_auth.user_role AS ENUM ('FRE', 'VIP', 'ADM');
CREATE TYPE content.test_type AS ENUM ('ACADEMIC', 'GENERAL');
CREATE TYPE content.module_type AS ENUM ('L', 'R', 'W', 'S');
CREATE TYPE eval.evaluation_status AS ENUM ('PENDING', 'PROCESSING', 'DONE', 'FAILED');

-- ==========================================
-- AUDIT (Point 5, 30-related)
-- ==========================================
CREATE TABLE audit.audit_log (
    log_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    table_name VARCHAR(255) NOT NULL,
    record_id UUID NOT NULL,
    action VARCHAR(50) NOT NULL,
    old_data JSONB,
    new_data JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- AUTHENTICATION (Points 6-10)
-- ==========================================
CREATE TABLE app_auth.usr (
    uid UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    eml VARCHAR(255) UNIQUE NOT NULL,
    pwd VARCHAR(255), -- Nullable for OAuth users
    rol app_auth.user_role DEFAULT 'FRE',
    setn JSONB DEFAULT '{}'::jsonb, -- Dynamic profile settings
    tok_v INTEGER DEFAULT 1, -- Session Invalidation Token Version
    prv VARCHAR(50), -- Provider (e.g., google, apple)
    prv_id VARCHAR(255), -- Provider ID
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    del_at TIMESTAMPTZ -- Soft Delete
);

CREATE INDEX idx_usr_eml ON app_auth.usr(eml);
CREATE INDEX idx_usr_tok_v ON app_auth.usr(tok_v);

-- ==========================================
-- CONTENT & CURRICULUM (Points 11-15)
-- ==========================================
-- Series
CREATE TABLE content.ser (
    sid UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    del_at TIMESTAMPTZ
);

-- Tests
CREATE TABLE content.tst (
    tid UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sid UUID REFERENCES content.ser(sid) ON DELETE CASCADE,
    typ content.test_type DEFAULT 'ACADEMIC',
    dif INTEGER DEFAULT 1, -- Difficulty (e.g., 1-5)
    pub BOOLEAN DEFAULT FALSE, -- is_public
    ver INTEGER DEFAULT 1, -- Versioning for test updates
    title VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    del_at TIMESTAMPTZ
);

CREATE INDEX idx_tst_sid ON content.tst(sid);

-- Modules (L, R, W, S parts of a test)
CREATE TABLE content.mod (
    mid UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tid UUID REFERENCES content.tst(tid) ON DELETE CASCADE,
    m_typ content.module_type NOT NULL,
    dur INTEGER NOT NULL, -- Duration in seconds
    ord INTEGER NOT NULL DEFAULT 1, -- Order of appearance
    created_at TIMESTAMPTZ DEFAULT NOW(),
    del_at TIMESTAMPTZ
);

-- Context/Passage (Reading texts or Listening audio meta) (Points 16-20)
CREATE TABLE content.ctx (
    cid UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mid UUID REFERENCES content.mod(mid) ON DELETE CASCADE,
    title VARCHAR(255),
    content TEXT, -- The reading passage text
    med_url VARCHAR(1024), -- Media URL for listening audio in R2
    ord INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    del_at TIMESTAMPTZ
);

-- Questions & Dynamic Answers
CREATE TABLE content.qst (
    qid UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cid UUID REFERENCES content.ctx(cid) ON DELETE CASCADE,
    ord INTEGER NOT NULL, -- Question order
    bdy JSONB NOT NULL, -- Dynamic question body (type, prompt, options)
    cor JSONB NOT NULL, -- Correct answers structure (Regex or Array)
    created_at TIMESTAMPTZ DEFAULT NOW(),
    del_at TIMESTAMPTZ
);

CREATE INDEX idx_qst_cid ON content.qst(cid);

-- ==========================================
-- EVALUATION & RESULTS (Points 21-25)
-- ==========================================
-- Attempts
CREATE TABLE eval.atm (
    aid UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    uid UUID REFERENCES app_auth.usr(uid) ON DELETE CASCADE,
    tid UUID REFERENCES content.tst(tid) ON DELETE CASCADE,
    str_at TIMESTAMPTZ DEFAULT NOW(), -- Started at
    end_at TIMESTAMPTZ, -- Ended at
    del_at TIMESTAMPTZ
);

CREATE INDEX idx_atm_uid ON eval.atm(uid);
CREATE INDEX idx_atm_tid ON eval.atm(tid);

-- Raw Input Layer
CREATE TABLE eval.raw (
    rid UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    aid UUID REFERENCES eval.atm(aid) ON DELETE CASCADE,
    state JSONB DEFAULT '{}'::jsonb, -- Raw keystrokes/current state of user input
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Final Results (Band Scores)
CREATE TABLE eval.res (
    rid UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    aid UUID REFERENCES eval.atm(aid) ON DELETE CASCADE,
    l_sco NUMERIC(3,1), -- Listening Score (e.g., 8.5)
    r_sco NUMERIC(3,1), -- Reading Score
    w_sco NUMERIC(3,1), -- Writing Score
    s_sco NUMERIC(3,1), -- Speaking Score
    o_sco NUMERIC(3,1), -- Overall Score
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Evaluation State (Async AI evaluation tracking)
CREATE TABLE eval.evl (
    evl_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    aid UUID REFERENCES eval.atm(aid) ON DELETE CASCADE,
    mid UUID REFERENCES content.mod(mid) ON DELETE CASCADE, -- Which module (W or S) is being evaluated
    evl_st eval.evaluation_status DEFAULT 'PENDING',
    fbk JSONB, -- Feedback from LLM (Grammar, Lexical, corrections)
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_evl_st ON eval.evl(evl_st);

-- ==========================================
-- FINANCE & FREEMIUM LOGIC (Points 26-30)
-- ==========================================
-- Subscriptions
CREATE TABLE finance.sub (
    sub_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    uid UUID REFERENCES app_auth.usr(uid) ON DELETE CASCADE,
    plan_name VARCHAR(50) NOT NULL,
    str_at TIMESTAMPTZ DEFAULT NOW(),
    exp_at TIMESTAMPTZ NOT NULL, -- Expires at
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    del_at TIMESTAMPTZ
);

-- Promo Codes
CREATE TABLE finance.prm (
    pid UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    discount_pct INTEGER CHECK (discount_pct BETWEEN 1 AND 100),
    max_uses INTEGER,
    uses INTEGER DEFAULT 0,
    exp_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    del_at TIMESTAMPTZ
);

-- Transactions
CREATE TABLE finance.trx (
    trx_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    uid UUID REFERENCES app_auth.usr(uid) ON DELETE CASCADE,
    amt INTEGER NOT NULL, -- Amount in smallest unit (e.g., cents, tiyin)
    ext_id VARCHAR(255), -- External Payment ID (Stripe, Payme)
    idp_k VARCHAR(255) UNIQUE NOT NULL, -- Idempotency Key
    pid UUID REFERENCES finance.prm(pid) ON DELETE SET NULL, -- Promo used
    status VARCHAR(50) DEFAULT 'PENDING',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_trx_uid ON finance.trx(uid);

-- ==========================================
-- INDEXES FOR JSONB SEARCHES
-- ==========================================
CREATE INDEX idx_usr_setn_gin ON app_auth.usr USING GIN (setn);
CREATE INDEX idx_qst_bdy_gin ON content.qst USING GIN (bdy);
CREATE INDEX idx_evl_fbk_gin ON eval.evl USING GIN (fbk);

-- ==========================================
-- GENERIC TRIGGERS FOR UPDATED_AT
-- ==========================================
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_timestamp_usr
BEFORE UPDATE ON app_auth.usr
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp_raw
BEFORE UPDATE ON eval.raw
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp_evl
BEFORE UPDATE ON eval.evl
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

-- End of Initial Schema Migration
