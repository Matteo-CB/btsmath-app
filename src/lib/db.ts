import { supabase } from "./supabase";

// Progress
export async function saveProgress(
  userId: number,
  subject: string,
  chapter: string,
  exerciseId: string,
  score: number
) {
  const { data: existing } = await supabase
    .from("progress")
    .select("id, attempts, score")
    .eq("user_id", userId)
    .eq("exercise_id", exerciseId)
    .single();

  if (existing) {
    await supabase
      .from("progress")
      .update({
        score: Math.max(existing.score, score),
        attempts: existing.attempts + 1,
        completed: score >= 70 ? 1 : 0,
        completed_at: score >= 70 ? new Date().toISOString() : null,
      })
      .eq("id", existing.id);
  } else {
    await supabase.from("progress").insert({
      user_id: userId,
      subject,
      chapter,
      exercise_id: exerciseId,
      score,
      attempts: 1,
      completed: score >= 70 ? 1 : 0,
      completed_at: score >= 70 ? new Date().toISOString() : null,
    });
  }
}

export async function getProgress(userId: number) {
  const { data } = await supabase
    .from("progress")
    .select("*")
    .eq("user_id", userId);

  return data || [];
}

// Game Sessions
export async function createGameSession(
  userId: number,
  mode: string
): Promise<number> {
  const { data } = await supabase
    .from("game_sessions")
    .insert({
      user_id: userId,
      mode,
      started_at: new Date().toISOString(),
    })
    .select("id")
    .single();

  return data?.id || 0;
}

export async function updateGameSession(
  sessionId: number,
  score: number,
  totalQuestions: number,
  correctAnswers: number,
  errors: number,
  xpEarned: number,
  durationSeconds: number
) {
  await supabase
    .from("game_sessions")
    .update({
      score,
      total_questions: totalQuestions,
      correct_answers: correctAnswers,
      errors,
      xp_earned: xpEarned,
      duration_seconds: durationSeconds,
      ended_at: new Date().toISOString(),
    })
    .eq("id", sessionId);
}

// High Scores
export async function saveHighScore(userId: number, mode: string, score: number) {
  const { data: existing } = await supabase
    .from("high_scores")
    .select("id, score")
    .eq("user_id", userId)
    .eq("mode", mode)
    .order("score", { ascending: false })
    .limit(1)
    .single();

  if (!existing || score > existing.score) {
    await supabase.from("high_scores").insert({
      user_id: userId,
      mode,
      score,
    });
  }
}

export async function getHighScores(userId: number, limit = 10) {
  const { data } = await supabase
    .from("high_scores")
    .select("mode, score, achieved_at")
    .eq("user_id", userId)
    .order("score", { ascending: false })
    .limit(limit);

  return data || [];
}

// Unlocked Chapters
export async function unlockChapter(userId: number, chapterId: string) {
  await supabase.from("unlocked_chapters").upsert({
    user_id: userId,
    chapter_id: chapterId,
  });
}

export async function getUnlockedChapters(userId: number): Promise<string[]> {
  const { data } = await supabase
    .from("unlocked_chapters")
    .select("chapter_id")
    .eq("user_id", userId);

  return data?.map((d) => d.chapter_id) || [];
}

// Daily Quests
export async function getDailyQuests(userId: number) {
  const today = new Date().toISOString().split("T")[0];

  const { data } = await supabase
    .from("daily_quests")
    .select("*")
    .eq("user_id", userId)
    .eq("quest_date", today);

  return data || [];
}

export async function completeDailyQuest(questId: number) {
  await supabase
    .from("daily_quests")
    .update({ completed: 1 })
    .eq("id", questId);
}

// Global Leaderboard
export async function getGlobalLeaderboard(limit = 50) {
  const { data } = await supabase
    .from("users")
    .select("id, username, xp, level, streak")
    .order("xp", { ascending: false })
    .limit(limit);

  return data || [];
}

export async function getWeeklyLeaderboard(limit = 50) {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const { data } = await supabase
    .from("game_sessions")
    .select("user_id, xp_earned, users(username, level)")
    .gte("started_at", oneWeekAgo.toISOString());

  if (!data) return [];

  // Aggregate XP by user
  const userXp = new Map<number, { username: string; level: number; weeklyXp: number }>();
  for (const session of data) {
    const userId = session.user_id;
    const usersData = session.users as unknown;
    const userData = (Array.isArray(usersData) ? usersData[0] : usersData) as { username: string; level: number } | null;
    if (!userData) continue;

    const current = userXp.get(userId) || { username: userData.username, level: userData.level, weeklyXp: 0 };
    current.weeklyXp += session.xp_earned || 0;
    userXp.set(userId, current);
  }

  return Array.from(userXp.entries())
    .map(([id, data]) => ({ id, ...data }))
    .sort((a, b) => b.weeklyXp - a.weeklyXp)
    .slice(0, limit);
}

export async function getUserRank(userId: number): Promise<number> {
  const { data } = await supabase
    .from("users")
    .select("id")
    .order("xp", { ascending: false });

  if (!data) return 0;
  const index = data.findIndex((u) => u.id === userId);
  return index === -1 ? 0 : index + 1;
}

// Achievements
export async function getUserAchievements(userId: number): Promise<string[]> {
  const { data } = await supabase
    .from("user_achievements")
    .select("achievement_id")
    .eq("user_id", userId);

  return data?.map((d) => d.achievement_id) || [];
}

export async function unlockAchievement(userId: number, achievementId: string) {
  const { data: existing } = await supabase
    .from("user_achievements")
    .select("id")
    .eq("user_id", userId)
    .eq("achievement_id", achievementId)
    .single();

  if (!existing) {
    await supabase.from("user_achievements").insert({
      user_id: userId,
      achievement_id: achievementId,
    });
    return true;
  }
  return false;
}

export async function getUserStats(userId: number) {
  // Get user basic info
  const { data: user } = await supabase
    .from("users")
    .select("xp, level, streak")
    .eq("id", userId)
    .single();

  // Get total exercises completed
  const { count: totalExercises } = await supabase
    .from("progress")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("completed", 1);

  // Get perfect scores (score = 100)
  const { count: perfectScores } = await supabase
    .from("progress")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("score", 100);

  // Get total games
  const { count: totalGames } = await supabase
    .from("game_sessions")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);

  // Get total play time
  const { data: sessions } = await supabase
    .from("game_sessions")
    .select("duration_seconds")
    .eq("user_id", userId);
  const totalPlayTime = Math.floor(
    (sessions?.reduce((acc, s) => acc + (s.duration_seconds || 0), 0) || 0) / 60
  );

  // Get quests completed
  const { count: questsCompleted } = await supabase
    .from("daily_quests")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("completed", 1);

  // Get chapters unlocked
  const { count: chaptersUnlocked } = await supabase
    .from("unlocked_chapters")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);

  const maxStreak = user?.streak || 0;

  return {
    totalXp: user?.xp || 0,
    level: user?.level || 1,
    streak: user?.streak || 0,
    maxStreak,
    totalExercises: totalExercises || 0,
    perfectScores: perfectScores || 0,
    totalGames: totalGames || 0,
    totalPlayTime,
    questsCompleted: questsCompleted || 0,
    chaptersUnlocked: chaptersUnlocked || 0,
  };
}
