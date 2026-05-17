-- Phase 1 初期スキーマ。詳細は /Users/kosuke/.claude/plans/claude-code-api-delegated-wall.md データモデル節を参照。

-- ============================================================
-- profiles: auth.users と 1:1。アプリ固有の display_name / plan_tier / 使用量
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  plan_tier TEXT NOT NULL DEFAULT 'free',          -- 'free' | 'pro' | 'team' (Phase 3)
  monthly_generation_count INT NOT NULL DEFAULT 0,
  monthly_generation_reset_at TIMESTAMPTZ NOT NULL DEFAULT (date_trunc('month', now()) + interval '1 month'),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 新規ユーザ作成時に profiles 行を自動作成する trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (new.id, COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)));
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- trips: 1 旅行プラン = 1 JSONB ドキュメント (TripSchema)
-- ============================================================
CREATE TABLE IF NOT EXISTS trips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'draft',            -- 'draft' | 'saved' | 'archived'
  title TEXT NOT NULL,                              -- content から切り出し (一覧表示用)
  cover_color TEXT,
  cover_icon TEXT,
  prompt JSONB,                                     -- 生成時のユーザ入力 (再生成・履歴用)
  content JSONB NOT NULL,                           -- TripSchema 本体
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_trips_owner ON trips(owner_id, updated_at DESC);

CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trips_touch ON trips;
CREATE TRIGGER trips_touch BEFORE UPDATE ON trips
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- ============================================================
-- shares: 共有スナップショット (read-only)
-- ============================================================
CREATE TABLE IF NOT EXISTS shares (
  public_id TEXT PRIMARY KEY,                       -- nanoid(10)
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  snapshot JSONB NOT NULL,                          -- 共有時点の content をフリーズ
  title TEXT NOT NULL,
  cover_color TEXT,
  view_count INT NOT NULL DEFAULT 0,
  revoked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_shares_trip ON shares(trip_id);

-- ============================================================
-- generations: コスト追跡 & 悪用検知
-- ============================================================
CREATE TABLE IF NOT EXISTS generations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  prompt JSONB NOT NULL,
  model TEXT NOT NULL,
  input_tokens INT,
  cache_read_tokens INT,
  cache_write_tokens INT,
  output_tokens INT,
  cost_usd_micro BIGINT,                            -- usd × 1e6
  trip_id UUID REFERENCES trips(id) ON DELETE SET NULL,
  status TEXT NOT NULL,                             -- 'success' | 'failed' | 'rate_limited'
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_generations_owner_date ON generations(owner_id, created_at DESC);

-- ============================================================
-- geocode_cache: Nominatim 結果を 30 日キャッシュ
-- ============================================================
CREATE TABLE IF NOT EXISTS geocode_cache (
  query_hash TEXT PRIMARY KEY,                      -- sha256(normalized_address)
  lat NUMERIC(9, 6),
  lng NUMERIC(9, 6),
  raw JSONB,
  hit_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_geocode_expires ON geocode_cache(expires_at);

-- ============================================================
-- Row Level Security
-- ============================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE generations ENABLE ROW LEVEL SECURITY;

-- profiles: 自身のみ読み書き
DROP POLICY IF EXISTS profile_self ON profiles;
CREATE POLICY profile_self ON profiles FOR ALL
  USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- trips: 所有者のみ全権
DROP POLICY IF EXISTS trips_owner_all ON trips;
CREATE POLICY trips_owner_all ON trips FOR ALL
  USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);

-- shares: 公開閲覧は誰でも (revoked_at IS NULL のとき)、書込は trip 所有者のみ
DROP POLICY IF EXISTS shares_public_read ON shares;
CREATE POLICY shares_public_read ON shares FOR SELECT
  USING (revoked_at IS NULL);

DROP POLICY IF EXISTS shares_owner_write ON shares;
CREATE POLICY shares_owner_write ON shares FOR INSERT
  WITH CHECK (auth.uid() = (SELECT owner_id FROM trips WHERE trips.id = shares.trip_id));

DROP POLICY IF EXISTS shares_owner_update ON shares;
CREATE POLICY shares_owner_update ON shares FOR UPDATE
  USING (auth.uid() = (SELECT owner_id FROM trips WHERE trips.id = shares.trip_id));

DROP POLICY IF EXISTS shares_owner_delete ON shares;
CREATE POLICY shares_owner_delete ON shares FOR DELETE
  USING (auth.uid() = (SELECT owner_id FROM trips WHERE trips.id = shares.trip_id));

-- generations: 所有者のみ
DROP POLICY IF EXISTS gen_owner ON generations;
CREATE POLICY gen_owner ON generations FOR ALL
  USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);

-- geocode_cache は RLS 不要 (service_role からしか触らない)。明示的に無効化
ALTER TABLE geocode_cache DISABLE ROW LEVEL SECURITY;
