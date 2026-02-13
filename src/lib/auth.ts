import { supabase } from "./supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { User } from "./types";

const USER_ID_KEY = "btsmath_user_id";

export async function createUser(username: string, password: string): Promise<{ success: boolean; error?: string; user?: User }> {
  // Check if username exists
  const { data: existing } = await supabase
    .from("users")
    .select("id")
    .eq("username", username)
    .single();

  if (existing) {
    return { success: false, error: "Ce nom d'utilisateur est déjà pris" };
  }

  // Simple hash (in production, use proper hashing)
  const passwordHash = btoa(password);

  const { data, error } = await supabase
    .from("users")
    .insert({
      username,
      password_hash: passwordHash,
      xp: 0,
      level: 1,
      streak: 0,
    })
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  await AsyncStorage.setItem(USER_ID_KEY, String(data.id));
  return { success: true, user: data as User };
}

export async function authenticateUser(username: string, password: string): Promise<{ success: boolean; error?: string; user?: User }> {
  const passwordHash = btoa(password);

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("username", username)
    .eq("password_hash", passwordHash)
    .single();

  if (error || !data) {
    return { success: false, error: "Identifiants incorrects" };
  }

  await AsyncStorage.setItem(USER_ID_KEY, String(data.id));

  // Update streak
  await updateStreak(data.id);

  return { success: true, user: data as User };
}

export async function getCurrentUser(): Promise<User | null> {
  const userId = await AsyncStorage.getItem(USER_ID_KEY);
  if (!userId) return null;
  return getUserById(parseInt(userId));
}

export async function getUserById(userId: number): Promise<User | null> {
  const { data } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  return data as User | null;
}

export async function updateUserXp(userId: number, xpToAdd: number): Promise<boolean> {
  try {
    const user = await getUserById(userId);
    if (!user) {
      console.error("[XP] User not found:", userId);
      return false;
    }

    if (xpToAdd <= 0) {
      console.log("[XP] No XP to add (xpToAdd =", xpToAdd, ")");
      return true;
    }

    const newXp = user.xp + xpToAdd;
    const newLevel = Math.floor(newXp / 100) + 1;

    const { error } = await supabase
      .from("users")
      .update({ xp: newXp, level: newLevel })
      .eq("id", userId);

    if (error) {
      console.error("[XP] Failed to update XP:", error.message, error.code);
      return false;
    }

    console.log("[XP] Updated:", user.xp, "->", newXp, "(+", xpToAdd, ") Level:", newLevel);
    return true;
  } catch (e) {
    console.error("[XP] Exception updating XP:", e);
    return false;
  }
}

export async function updateStreak(userId: number): Promise<void> {
  const user = await getUserById(userId);
  if (!user) return;

  const today = new Date().toISOString().split("T")[0];
  const lastActivity = user.last_activity;

  let newStreak = user.streak;

  if (lastActivity) {
    const lastDate = new Date(lastActivity);
    const todayDate = new Date(today);
    const diffTime = todayDate.getTime() - lastDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      newStreak = user.streak + 1;
    } else if (diffDays > 1) {
      newStreak = 1;
    }
  } else {
    newStreak = 1;
  }

  await supabase
    .from("users")
    .update({ streak: newStreak, last_activity: today })
    .eq("id", userId);
}

export async function logout(): Promise<void> {
  await AsyncStorage.removeItem(USER_ID_KEY);
}
