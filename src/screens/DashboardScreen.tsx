import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { getCurrentUser, logout } from "../lib/auth";
import { getDailyQuests, getHighScores } from "../lib/db";
import { GAME_MODES } from "../lib/types";
import type { User, GameMode } from "../lib/types";
import { colors, spacing, borderRadius, fontSize, fontWeight } from "../components/theme";
import { COURSES } from "../lib/courses";

interface Props {
  onLogout: () => void;
  onStartGame: (mode: GameMode) => void;
  onGoToCourses?: () => void;
}

export default function DashboardScreen({ onLogout, onStartGame, onGoToCourses }: Props) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [highScores, setHighScores] = useState<any[]>([]);

  const loadData = useCallback(async () => {
    const currentUser = await getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      const scores = await getHighScores(currentUser.id);
      setHighScores(scores);
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

  const handleLogout = async () => {
    await logout();
    onLogout();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!user) return null;

  const xpProgress = user.xp % 100;
  const xpToNext = 100 - xpProgress;

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Hero Section */}
      <LinearGradient colors={["#FF5722", "#FF7043", "#FF8A65"]} style={styles.hero}>
        <View style={styles.heroContent}>
          <View style={styles.heroLeft}>
            <View style={styles.levelBadge}>
              <Text style={styles.levelText}>{user.level}</Text>
            </View>
            <View style={styles.heroInfo}>
              <Text style={styles.greeting}>Bonjour, {user.username} 👋</Text>
              <Text style={styles.streakText}>
                {user.streak > 0
                  ? `🔥 Série de ${user.streak} jours`
                  : "Commencez votre série !"}
              </Text>
            </View>
          </View>
        </View>

        {/* XP Progress */}
        <View style={styles.xpContainer}>
          <View style={styles.xpHeader}>
            <Text style={styles.xpLabel}>Niveau {user.level}</Text>
            <Text style={styles.xpValue}>{user.xp} XP</Text>
          </View>
          <View style={styles.xpBarBg}>
            <View style={[styles.xpBarFill, { width: `${xpProgress}%` }]} />
          </View>
          <Text style={styles.xpToNext}>{xpToNext} XP jusqu'au niveau {user.level + 1}</Text>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        {/* Courses Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>📚 Continuer à apprendre</Text>
            {onGoToCourses && (
              <TouchableOpacity onPress={onGoToCourses} style={styles.seeAllButton}>
                <Text style={styles.seeAllText}>Voir tout →</Text>
              </TouchableOpacity>
            )}
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.coursesScroll}>
            {COURSES.map((course) => {
              const totalLessons = course.lessons.length;
              const totalDuration = course.lessons.reduce((sum, l) => sum + l.duration, 0);
              return (
                <TouchableOpacity
                  key={course.id}
                  style={styles.courseCard}
                  onPress={onGoToCourses}
                >
                  <View style={[styles.courseTopBar, { backgroundColor: course.color }]} />
                  <View style={[styles.courseIcon, { backgroundColor: course.color }]}>
                    <Text style={styles.courseIconText}>{course.icon}</Text>
                  </View>
                  <Text style={styles.courseName} numberOfLines={1}>{course.name}</Text>
                  <Text style={styles.courseDesc} numberOfLines={2}>{course.description}</Text>
                  <View style={styles.courseMeta}>
                    <Text style={styles.courseMetaText}>📖 {totalLessons} leçons</Text>
                    <Text style={styles.courseMetaText}>⏱️ {totalDuration} min</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Game Modes */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🎮 Modes de jeu</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{GAME_MODES.length} modes</Text>
            </View>
          </View>

          {GAME_MODES.map((mode) => (
            <TouchableOpacity
              key={mode.id}
              style={styles.modeCard}
              onPress={() => onStartGame(mode.id)}
            >
              <View style={styles.modeIcon}>
                <Text style={styles.modeIconText}>{mode.icon}</Text>
              </View>
              <View style={styles.modeInfo}>
                <View style={styles.modeHeader}>
                  <Text style={styles.modeName}>{mode.name}</Text>
                  {mode.rules.xpMultiplier > 1 && (
                    <LinearGradient
                      colors={["#FF5722", "#FF7043"]}
                      style={styles.xpMultiplier}
                    >
                      <Text style={styles.xpMultiplierText}>
                        x{mode.rules.xpMultiplier} XP
                      </Text>
                    </LinearGradient>
                  )}
                </View>
                <Text style={styles.modeDescription}>{mode.description}</Text>
                <View style={styles.modeRules}>
                  {mode.rules.timeLimit && (
                    <Text style={styles.modeRule}>
                      ⏱️ {Math.floor(mode.rules.timeLimit / 60)} min
                    </Text>
                  )}
                  {mode.rules.questionCount && (
                    <Text style={styles.modeRule}>
                      📝 {mode.rules.questionCount} questions
                    </Text>
                  )}
                  {mode.rules.maxErrors && (
                    <Text style={styles.modeRule}>
                      ❤️ {mode.rules.maxErrors} vies
                    </Text>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Stats Grid */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📊 Statistiques</Text>
          <View style={styles.statsGrid}>
            <View style={[styles.statCard, { backgroundColor: "#fff7ed" }]}>
              <Text style={[styles.statValue, { color: "#FF5722" }]}>{user.streak}</Text>
              <Text style={styles.statLabel}>🔥 Série</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: "#f0fdf4" }]}>
              <Text style={[styles.statValue, { color: "#16a34a" }]}>{user.level}</Text>
              <Text style={styles.statLabel}>⭐ Niveau</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: "#eff6ff" }]}>
              <Text style={[styles.statValue, { color: "#2563eb" }]}>{user.xp.toLocaleString()}</Text>
              <Text style={styles.statLabel}>💎 XP Total</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: "#fdf4ff" }]}>
              <Text style={[styles.statValue, { color: "#a855f7" }]}>{highScores.length}</Text>
              <Text style={styles.statLabel}>🏆 Records</Text>
            </View>
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Déconnexion</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
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
  },
  heroContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  heroLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  levelBadge: {
    width: 60,
    height: 60,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: borderRadius.md,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.3)",
    marginRight: spacing.md,
  },
  levelText: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.extrabold,
    color: "#fff",
  },
  heroInfo: {
    flex: 1,
  },
  greeting: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: "#fff",
    marginBottom: spacing.xs,
  },
  streakText: {
    fontSize: fontSize.md,
    color: "rgba(255,255,255,0.9)",
  },
  xpContainer: {
    marginTop: spacing.lg,
  },
  xpHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.xs,
  },
  xpLabel: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: "#fff",
  },
  xpValue: {
    fontSize: fontSize.sm,
    color: "rgba(255,255,255,0.9)",
  },
  xpBarBg: {
    height: 10,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: borderRadius.full,
    overflow: "hidden",
  },
  xpBarFill: {
    height: "100%",
    backgroundColor: "#fff",
    borderRadius: borderRadius.full,
  },
  xpToNext: {
    fontSize: fontSize.xs,
    color: "rgba(255,255,255,0.8)",
    marginTop: spacing.xs,
  },
  content: {
    padding: spacing.lg,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  badge: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  badgeText: {
    color: "#fff",
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
  },
  modeCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    flexDirection: "row",
    borderWidth: 1,
    borderColor: colors.border,
  },
  modeIcon: {
    width: 50,
    height: 50,
    backgroundColor: "#fff7ed",
    borderRadius: borderRadius.md,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },
  modeIconText: {
    fontSize: fontSize.xxl,
  },
  modeInfo: {
    flex: 1,
  },
  modeHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.xs,
  },
  modeName: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text,
    marginRight: spacing.sm,
  },
  xpMultiplier: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  xpMultiplierText: {
    color: "#fff",
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
  },
  modeDescription: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  modeRules: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
  },
  modeRule: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  statCard: {
    flex: 1,
    minWidth: "45%",
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: "center",
  },
  statValue: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.extrabold,
  },
  statLabel: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  logoutButton: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: "center",
    marginTop: spacing.md,
  },
  logoutText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  seeAllButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  seeAllText: {
    color: "#fff",
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
  },
  coursesScroll: {
    marginHorizontal: -spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  courseCard: {
    width: 180,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    position: "relative",
    overflow: "hidden",
  },
  courseTopBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 4,
  },
  courseIcon: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  courseIconText: {
    fontSize: fontSize.xl,
    color: "#fff",
  },
  courseName: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  courseDesc: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    lineHeight: 16,
    marginBottom: spacing.sm,
  },
  courseMeta: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  courseMetaText: {
    fontSize: 10,
    color: colors.textMuted,
  },
});
