export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  category: "progression" | "streak" | "score" | "special";
  condition: (stats: UserStats) => boolean;
  xpReward: number;
}

export interface UserStats {
  totalXp: number;
  level: number;
  streak: number;
  maxStreak: number;
  totalExercises: number;
  perfectScores: number;
  totalGames: number;
  totalPlayTime: number;
  questsCompleted: number;
  chaptersUnlocked: number;
}

export const ACHIEVEMENTS: Achievement[] = [
  // Progression
  {
    id: "first_steps",
    name: "Premiers Pas",
    description: "Complétez votre premier exercice",
    icon: "👶",
    color: "#10b981",
    category: "progression",
    condition: (stats) => stats.totalExercises >= 1,
    xpReward: 50,
  },
  {
    id: "getting_started",
    name: "En Route",
    description: "Complétez 10 exercices",
    icon: "🚶",
    color: "#06b6d4",
    category: "progression",
    condition: (stats) => stats.totalExercises >= 10,
    xpReward: 100,
  },
  {
    id: "dedicated_learner",
    name: "Apprenti Dévoué",
    description: "Complétez 50 exercices",
    icon: "📚",
    color: "#8b5cf6",
    category: "progression",
    condition: (stats) => stats.totalExercises >= 50,
    xpReward: 250,
  },
  {
    id: "math_warrior",
    name: "Guerrier des Maths",
    description: "Complétez 100 exercices",
    icon: "⚔️",
    color: "#ef4444",
    category: "progression",
    condition: (stats) => stats.totalExercises >= 100,
    xpReward: 500,
  },
  {
    id: "math_master",
    name: "Maître des Maths",
    description: "Complétez 500 exercices",
    icon: "🎓",
    color: "#f59e0b",
    category: "progression",
    condition: (stats) => stats.totalExercises >= 500,
    xpReward: 1000,
  },
  // Levels
  {
    id: "level_5",
    name: "Niveau 5",
    description: "Atteignez le niveau 5",
    icon: "⭐",
    color: "#eab308",
    category: "progression",
    condition: (stats) => stats.level >= 5,
    xpReward: 150,
  },
  {
    id: "level_10",
    name: "Double Digits",
    description: "Atteignez le niveau 10",
    icon: "🌟",
    color: "#f97316",
    category: "progression",
    condition: (stats) => stats.level >= 10,
    xpReward: 300,
  },
  {
    id: "level_25",
    name: "Expert Confirmé",
    description: "Atteignez le niveau 25",
    icon: "💫",
    color: "#ec4899",
    category: "progression",
    condition: (stats) => stats.level >= 25,
    xpReward: 750,
  },
  {
    id: "level_50",
    name: "Légende Vivante",
    description: "Atteignez le niveau 50",
    icon: "👑",
    color: "#fbbf24",
    category: "progression",
    condition: (stats) => stats.level >= 50,
    xpReward: 1500,
  },
  // Streak
  {
    id: "streak_3",
    name: "Régulier",
    description: "Maintenez une série de 3 jours",
    icon: "🔥",
    color: "#f97316",
    category: "streak",
    condition: (stats) => stats.maxStreak >= 3,
    xpReward: 100,
  },
  {
    id: "streak_7",
    name: "Semaine Parfaite",
    description: "Maintenez une série de 7 jours",
    icon: "🔥",
    color: "#ef4444",
    category: "streak",
    condition: (stats) => stats.maxStreak >= 7,
    xpReward: 250,
  },
  {
    id: "streak_14",
    name: "Deux Semaines",
    description: "Maintenez une série de 14 jours",
    icon: "💪",
    color: "#dc2626",
    category: "streak",
    condition: (stats) => stats.maxStreak >= 14,
    xpReward: 500,
  },
  {
    id: "streak_30",
    name: "Mois Complet",
    description: "Maintenez une série de 30 jours",
    icon: "🏆",
    color: "#b91c1c",
    category: "streak",
    condition: (stats) => stats.maxStreak >= 30,
    xpReward: 1000,
  },
  // Score / Performance
  {
    id: "perfect_1",
    name: "Sans Faute",
    description: "Obtenez un score parfait",
    icon: "✨",
    color: "#a855f7",
    category: "score",
    condition: (stats) => stats.perfectScores >= 1,
    xpReward: 75,
  },
  {
    id: "perfect_10",
    name: "Perfectionniste",
    description: "Obtenez 10 scores parfaits",
    icon: "💎",
    color: "#6366f1",
    category: "score",
    condition: (stats) => stats.perfectScores >= 10,
    xpReward: 300,
  },
  {
    id: "perfect_50",
    name: "Excellence",
    description: "Obtenez 50 scores parfaits",
    icon: "🏅",
    color: "#4f46e5",
    category: "score",
    condition: (stats) => stats.perfectScores >= 50,
    xpReward: 750,
  },
  // XP Milestones
  {
    id: "xp_1000",
    name: "Premier Millier",
    description: "Accumulez 1 000 XP",
    icon: "💰",
    color: "#10b981",
    category: "progression",
    condition: (stats) => stats.totalXp >= 1000,
    xpReward: 100,
  },
  {
    id: "xp_5000",
    name: "Cinq Mille",
    description: "Accumulez 5 000 XP",
    icon: "💵",
    color: "#059669",
    category: "progression",
    condition: (stats) => stats.totalXp >= 5000,
    xpReward: 250,
  },
  {
    id: "xp_10000",
    name: "Dix Mille",
    description: "Accumulez 10 000 XP",
    icon: "💎",
    color: "#047857",
    category: "progression",
    condition: (stats) => stats.totalXp >= 10000,
    xpReward: 500,
  },
  // Games
  {
    id: "games_10",
    name: "Joueur",
    description: "Jouez 10 parties",
    icon: "🎮",
    color: "#3b82f6",
    category: "special",
    condition: (stats) => stats.totalGames >= 10,
    xpReward: 100,
  },
  {
    id: "games_50",
    name: "Gamer",
    description: "Jouez 50 parties",
    icon: "🕹️",
    color: "#2563eb",
    category: "special",
    condition: (stats) => stats.totalGames >= 50,
    xpReward: 300,
  },
  {
    id: "games_100",
    name: "Pro Gamer",
    description: "Jouez 100 parties",
    icon: "🎯",
    color: "#1d4ed8",
    category: "special",
    condition: (stats) => stats.totalGames >= 100,
    xpReward: 500,
  },
  // Time played
  {
    id: "time_60",
    name: "Une Heure",
    description: "Jouez pendant 1 heure au total",
    icon: "⏰",
    color: "#64748b",
    category: "special",
    condition: (stats) => stats.totalPlayTime >= 60,
    xpReward: 150,
  },
  {
    id: "time_300",
    name: "Cinq Heures",
    description: "Jouez pendant 5 heures au total",
    icon: "⌛",
    color: "#475569",
    category: "special",
    condition: (stats) => stats.totalPlayTime >= 300,
    xpReward: 400,
  },
  {
    id: "time_600",
    name: "Dix Heures",
    description: "Jouez pendant 10 heures au total",
    icon: "🕐",
    color: "#334155",
    category: "special",
    condition: (stats) => stats.totalPlayTime >= 600,
    xpReward: 750,
  },
  // Chapters
  {
    id: "chapters_3",
    name: "Explorateur",
    description: "Débloquez 3 chapitres",
    icon: "🗺️",
    color: "#14b8a6",
    category: "special",
    condition: (stats) => stats.chaptersUnlocked >= 3,
    xpReward: 150,
  },
  {
    id: "chapters_all",
    name: "Complet",
    description: "Débloquez tous les chapitres",
    icon: "🌍",
    color: "#0d9488",
    category: "special",
    condition: (stats) => stats.chaptersUnlocked >= 10,
    xpReward: 500,
  },
  // Quests
  {
    id: "quests_5",
    name: "Quêteur",
    description: "Complétez 5 quêtes quotidiennes",
    icon: "📜",
    color: "#d97706",
    category: "special",
    condition: (stats) => stats.questsCompleted >= 5,
    xpReward: 150,
  },
  {
    id: "quests_25",
    name: "Aventurier",
    description: "Complétez 25 quêtes quotidiennes",
    icon: "⚡",
    color: "#b45309",
    category: "special",
    condition: (stats) => stats.questsCompleted >= 25,
    xpReward: 400,
  },
];

export function getAchievementById(id: string): Achievement | undefined {
  return ACHIEVEMENTS.find((a) => a.id === id);
}

export function checkNewAchievements(
  stats: UserStats,
  unlockedIds: string[]
): Achievement[] {
  return ACHIEVEMENTS.filter(
    (achievement) =>
      !unlockedIds.includes(achievement.id) && achievement.condition(stats)
  );
}

export function getCategoryName(category: Achievement["category"]): string {
  const names = {
    progression: "Progression",
    streak: "Séries",
    score: "Performance",
    special: "Spécial",
  };
  return names[category];
}
