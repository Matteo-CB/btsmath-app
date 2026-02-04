import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { getCurrentUser } from "../lib/auth";
import { getUserAchievements, getUserStats, getUserRank } from "../lib/db";
import { ACHIEVEMENTS, getCategoryName, type Achievement } from "../lib/achievements";
import type { User } from "../lib/types";
import { colors, spacing, borderRadius, fontSize, fontWeight } from "../components/theme";

export default function ProfileScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [rank, setRank] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    const currentUser = await getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      const [achievements, userStats, userRank] = await Promise.all([
        getUserAchievements(currentUser.id),
        getUserStats(currentUser.id),
        getUserRank(currentUser.id),
      ]);
      setUnlockedAchievements(achievements);
      setStats(userStats);
      setRank(userRank);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!user || !stats) return null;

  const unlockedSet = new Set(unlockedAchievements);
  const totalAchievements = ACHIEVEMENTS.length;
  const unlockedCount = unlockedAchievements.length;
  const progressPercent = Math.round((unlockedCount / totalAchievements) * 100);

  const groupedAchievements = ACHIEVEMENTS.reduce((acc, achievement) => {
    if (!acc[achievement.category]) {
      acc[achievement.category] = [];
    }
    acc[achievement.category].push(achievement);
    return acc;
  }, {} as Record<string, Achievement[]>);

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Profile Hero */}
      <LinearGradient colors={["#FF5722", "#FF7043", "#FF8A65"]} style={styles.hero}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{user.username.charAt(0).toUpperCase()}</Text>
        </View>
        <Text style={styles.username}>{user.username}</Text>
        <View style={styles.badges}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Niveau {stats.level}</Text>
          </View>
          <Text style={styles.xpText}>{stats.totalXp.toLocaleString()} XP</Text>
          {rank > 0 && <Text style={styles.rankText}>#{rank} au classement</Text>}
        </View>
      </LinearGradient>

      <View style={styles.content}>
        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <StatCard icon="📝" value={stats.totalExercises} label="Exercices" color="#10b981" />
          <StatCard icon="🎮" value={stats.totalGames} label="Parties" color="#3b82f6" />
          <StatCard icon="💎" value={stats.perfectScores} label="Parfaits" color="#8b5cf6" />
          <StatCard icon="🔥" value={`${stats.streak} j`} label="Streak" color="#f97316" />
          <StatCard
            icon="⏱️"
            value={`${Math.floor(stats.totalPlayTime / 60)}h${stats.totalPlayTime % 60}m`}
            label="Temps joué"
            color="#64748b"
          />
          <StatCard icon="📜" value={stats.questsCompleted} label="Quêtes" color="#f59e0b" />
        </View>

        {/* Achievements Progress */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Progression des Achievements</Text>
            <Text style={styles.progressText}>{unlockedCount} / {totalAchievements}</Text>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
          </View>
          <Text style={styles.progressLabel}>{progressPercent}% des achievements débloqués</Text>
        </View>

        {/* Achievements by Category */}
        {(["progression", "streak", "score", "special"] as const).map((category) => (
          <View key={category} style={styles.section}>
            <Text style={styles.categoryTitle}>
              {category === "progression" && "📈 "}
              {category === "streak" && "🔥 "}
              {category === "score" && "🏆 "}
              {category === "special" && "⭐ "}
              {getCategoryName(category)}
            </Text>

            <View style={styles.achievementsList}>
              {groupedAchievements[category]?.map((achievement) => {
                const isUnlocked = unlockedSet.has(achievement.id);
                return (
                  <View
                    key={achievement.id}
                    style={[
                      styles.achievementCard,
                      isUnlocked && { backgroundColor: achievement.color + "15", borderColor: achievement.color + "40" },
                      !isUnlocked && styles.achievementLocked,
                    ]}
                  >
                    <View style={[
                      styles.achievementIcon,
                      { backgroundColor: isUnlocked ? achievement.color : "#e2e8f0" },
                    ]}>
                      <Text style={styles.achievementIconText}>
                        {isUnlocked ? achievement.icon : "🔒"}
                      </Text>
                    </View>
                    <View style={styles.achievementInfo}>
                      <Text style={[
                        styles.achievementName,
                        !isUnlocked && styles.achievementNameLocked,
                      ]}>
                        {achievement.name}
                      </Text>
                      <Text style={[
                        styles.achievementDescription,
                        !isUnlocked && styles.achievementDescriptionLocked,
                      ]}>
                        {achievement.description}
                      </Text>
                    </View>
                    <View style={[
                      styles.xpBadge,
                      { backgroundColor: isUnlocked ? achievement.color : "#e2e8f0" },
                    ]}>
                      <Text style={[
                        styles.xpBadgeText,
                        !isUnlocked && styles.xpBadgeTextLocked,
                      ]}>
                        +{achievement.xpReward} XP
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

function StatCard({ icon, value, label, color }: {
  icon: string;
  value: number | string;
  label: string;
  color: string;
}) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statIcon}>{icon}</Text>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
  hero: {
    paddingTop: 60,
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.lg,
    alignItems: "center",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: fontWeight.extrabold,
    color: colors.primary,
  },
  username: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.extrabold,
    color: "#fff",
    marginBottom: spacing.sm,
  },
  badges: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    flexWrap: "wrap",
    justifyContent: "center",
  },
  badge: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  badgeText: {
    color: "#fff",
    fontWeight: fontWeight.semibold,
    fontSize: fontSize.sm,
  },
  xpText: {
    color: "rgba(255,255,255,0.9)",
    fontSize: fontSize.sm,
  },
  rankText: {
    color: "rgba(255,255,255,0.9)",
    fontSize: fontSize.sm,
  },
  content: {
    padding: spacing.lg,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  statCard: {
    width: "31%",
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  statIcon: {
    fontSize: fontSize.xl,
    marginBottom: spacing.xs,
  },
  statValue: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
  },
  statLabel: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  section: {
    marginBottom: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  progressText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.primary,
  },
  progressBar: {
    height: 12,
    backgroundColor: "#f1f5f9",
    borderRadius: borderRadius.full,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
  },
  progressLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    textAlign: "center",
    marginTop: spacing.sm,
  },
  categoryTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  achievementsList: {
    gap: spacing.sm,
  },
  achievementCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: colors.border,
  },
  achievementLocked: {
    opacity: 0.6,
  },
  achievementIcon: {
    width: 50,
    height: 50,
    borderRadius: borderRadius.md,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },
  achievementIconText: {
    fontSize: fontSize.xxl,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementName: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  achievementNameLocked: {
    color: colors.textMuted,
  },
  achievementDescription: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
  achievementDescriptionLocked: {
    color: colors.textMuted,
  },
  xpBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  xpBadgeText: {
    color: "#fff",
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
  },
  xpBadgeTextLocked: {
    color: colors.textMuted,
  },
});
