-- ============================================================
-- Sports Minigame Hub — Full Schema
-- Run this entire file in the Supabase SQL Editor
-- ============================================================

-- 1. PROFILES
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  total_xp INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_streak_date DATE,
  join_date TIMESTAMPTZ DEFAULT NOW(),
  best_scores JSONB DEFAULT '{}'::jsonb,
  unlocked_cosmetics TEXT[] DEFAULT '{}'::text[],
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. GAME RESULTS
CREATE TABLE game_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  game_id TEXT NOT NULL,
  score INTEGER NOT NULL,
  details JSONB,
  xp_earned INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. DAILY CHALLENGE COMPLETIONS (drives streak system)
CREATE TABLE daily_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  game_id TEXT NOT NULL,
  completed_date DATE NOT NULL DEFAULT CURRENT_DATE,
  guesses_used INTEGER,
  won BOOLEAN NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, game_id, completed_date)
);

-- 4. INDEXES for leaderboard performance
CREATE INDEX idx_game_results_game_id_score ON game_results(game_id, score DESC);
CREATE INDEX idx_game_results_user_id ON game_results(user_id);
CREATE INDEX idx_game_results_created_at ON game_results(created_at DESC);
CREATE INDEX idx_profiles_total_xp ON profiles(total_xp DESC);
CREATE INDEX idx_daily_challenges_user_date ON daily_challenges(user_id, completed_date DESC);

-- 5. AUTO-CREATE PROFILE ON SIGNUP
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', 'Player_' || substr(NEW.id::text, 1, 8)),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- 6. ROW LEVEL SECURITY
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_challenges ENABLE ROW LEVEL SECURITY;

-- Profiles: anyone can read, only owner can update
CREATE POLICY "profiles_select"
  ON profiles FOR SELECT USING (true);
CREATE POLICY "profiles_update"
  ON profiles FOR UPDATE USING (auth.uid() = id);

-- Game results: anyone can read (for leaderboards), only owner can insert
CREATE POLICY "game_results_select"
  ON game_results FOR SELECT USING (true);
CREATE POLICY "game_results_insert"
  ON game_results FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Daily challenges: only owner can read/insert
CREATE POLICY "daily_challenges_select"
  ON daily_challenges FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "daily_challenges_insert"
  ON daily_challenges FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 7. FOLLOWS (one-sided)
CREATE TABLE follows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  following_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(follower_id, following_id)
);

CREATE INDEX idx_follows_follower ON follows(follower_id);
CREATE INDEX idx_follows_following ON follows(following_id);

ALTER TABLE follows ENABLE ROW LEVEL SECURITY;

CREATE POLICY "follows_select"
  ON follows FOR SELECT USING (true);
CREATE POLICY "follows_insert"
  ON follows FOR INSERT WITH CHECK (auth.uid() = follower_id);
CREATE POLICY "follows_delete"
  ON follows FOR DELETE USING (auth.uid() = follower_id);

-- 8. HEAD-TO-HEAD CHALLENGES
CREATE TABLE challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenger_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  challenged_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  game_id TEXT NOT NULL,
  challenger_score NUMERIC NOT NULL,
  challenged_score NUMERIC,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed')),
  winner_id UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

CREATE INDEX idx_challenges_challenger ON challenges(challenger_id);
CREATE INDEX idx_challenges_challenged ON challenges(challenged_id);
CREATE INDEX idx_challenges_status ON challenges(status);

ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "challenges_select"
  ON challenges FOR SELECT USING (auth.uid() = challenger_id OR auth.uid() = challenged_id);
CREATE POLICY "challenges_insert"
  ON challenges FOR INSERT WITH CHECK (auth.uid() = challenger_id);
CREATE POLICY "challenges_update"
  ON challenges FOR UPDATE USING (auth.uid() = challenger_id OR auth.uid() = challenged_id);

-- 9. NOTIFICATIONS
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  link TEXT,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id, created_at DESC);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "notifications_select"
  ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "notifications_insert"
  ON notifications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "notifications_update"
  ON notifications FOR UPDATE USING (auth.uid() = user_id);
