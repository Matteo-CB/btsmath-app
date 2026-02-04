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
import { getGlobalLeaderboard, getWeeklyLeaderboard, getUserRank } from "../lib/db";
import type { User } from "../lib/types";
import { colors, spacing, borderRadius, fontSize, fontWeight } from "../components/theme";

export default function LeaderboardScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [globalLeaderboard, setGlobalLeaderboard] = useState<any[]>([]);
  const [weeklyLeaderboard, setWeeklyLeaderboard] = useState<any[]>([]);
  const [userRank, setUserRank] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<"global" | "weekly">("global");

  const loadData = useCallback(async () => {
    const currentUser = await getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      const [global, weekly, rank] = await Promise.all([
        getGlobalLeaderboard(50),
        getWeeklyLeaderboard(20),
        getUserRank(currentUser.id),
      ]);
      setGlobalLeaderboard(global);
      setWeeklyLeaderboard(weekly);
      setUserRank(rank);
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

  const getMedal = (index: number) => {
    if (index === 0) return { emoji: "🥇", bg: "#fef3c7", border: "#f59e0b" };
    if (index === 1) return { emoji: "🥈", bg: "#f1f5f9", border: "#94a3b8" };
    if (index === 2) return { emoji: "🥉", bg: "#fed7aa", border: "#f97316" };
    return { emoji: `#${index + 1}`, bg: "#f8fafc", border: "#e2e8f0" };
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const currentLeaderboard = activeTab === "global" ? globalLeaderboard : weeklyLeaderboard;

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Hero */}
      <LinearGradient colors={["#1e293b", "#334155", "#475569"]} style={styles.hero}>
        <Text style={styles.heroIcon}>🏆</Text>
        <Text style={styles.heroTitle}>Classement</Text>
        <Text style={styles.heroSubtitle}>Les meilleurs mathématiciens du BTS SIO</Text>

        {user && userRank > 0 && (
          <View style={styles.userRankBox}>
            <Text style={styles.userRankLabel}>Votre position</Text>
            <Text style={styles.userRankValue}>#{userRank}</Text>
            <Text style={styles.userRankLabel}>sur {globalLeaderboard.length} joueurs</Text>
          </View>
        )}
      </LinearGradient>

      <View style={styles.content}>
        {/* Tabs */}
        <View style={styles.tabs}>
          <TouchableTab
            active={activeTab === "global"}
            onPress={() => setActiveTab("global")}
            label="🌍 Global"
            badge="XP Total"
            badgeColor="#FF5722"
          />
          <TouchableTab
            active={activeTab === "weekly"}
            onPress={() => setActiveTab("weekly")}
            label="📅 Cette semaine"
            badge="7 jours"
            badgeColor="#10b981"
          />
        </View>

        {/* Podium for top 3 */}
        {activeTab === "global" && globalLeaderboard.length >= 3 && (
          <View style={styles.podium}>
            {/* 2nd place */}
            <PodiumItem
              player={globalLeaderboard[1]}
              rank={2}
              size="medium"
              color="#94a3b8"
            />
            {/* 1st place */}
            <PodiumItem
              player={globalLeaderboard[0]}
              rank={1}
              size="large"
              color="#fbbf24"
            />
            {/* 3rd place */}
            <PodiumItem
              player={globalLeaderboard[2]}
              rank={3}
              size="small"
              color="#f97316"
            />
          </View>
        )}

        {/* Leaderboard list */}
        <View style={styles.leaderboardList}>
          {currentLeaderboard.slice(activeTab === "global" ? 3 : 0).map((player, index) => {
            const actualIndex = activeTab === "global" ? index + 3 : index;
            const medal = getMedal(actualIndex);
            const isCurrentUser = user && player.id === user.id;

            return (
              <View
                key={player.id}
                style={[
                  styles.leaderboardItem,
                  { backgroundColor: medal.bg, borderColor: medal.border },
                  isCurrentUser && styles.leaderboardItemCurrent,
                ]}
              >
                <View style={styles.leaderboardRank}>
                  <Text style={styles.leaderboardRankText}>{medal.emoji}</Text>
                </View>
                <View style={styles.leaderboardAvatar}>
                  <Text style={styles.avatarText}>
                    {player.username.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <View style={styles.leaderboardInfo}>
                  <Text style={styles.leaderboardName}>
                    {player.username} {isCurrentUser && <Text style={styles.youText}>(vous)</Text>}
                  </Text>
                  <Text style={styles.leaderboardLevel}>
                    Niveau {player.level} {player.streak ? `• 🔥 ${player.streak}` : ""}
                  </Text>
                </View>
                <Text style={[styles.leaderboardXp, { color: activeTab === "global" ? "#FF5722" : "#10b981" }]}>
                  {activeTab === "global" ? player.xp?.toLocaleString() : `+${player.weeklyXp?.toLocaleString()}`} XP
                </Text>
              </View>
            );
          })}
        </View>

        {currentLeaderboard.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              {activeTab === "global" ? "Aucun joueur dans le classement" : "Aucune activité cette semaine"}
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

function TouchableTab({ active, onPress, label, badge, badgeColor }: {
  active: boolean;
  onPress: () => void;
  label: string;
  badge: string;
  badgeColor: string;
}) {
  return (
    <TouchableOpacity
      style={[styles.tab, active && styles.tabActive]}
      onPress={onPress}
    >
      <Text style={[styles.tabText, active && styles.tabTextActive]}>{label}</Text>
      <View style={[styles.tabBadge, { backgroundColor: badgeColor }]}>
        <Text style={styles.tabBadgeText}>{badge}</Text>
      </View>
    </TouchableOpacity>
  );
}

function PodiumItem({ player, rank, size, color }: {
  player: any;
  rank: number;
  size: "small" | "medium" | "large";
  color: string;
}) {
  const sizes = {
    small: { avatar: 50, podium: 40, margin: spacing.md },
    medium: { avatar: 60, podium: 50, margin: 0 },
    large: { avatar: 70, podium: 60, margin: 0 },
  };
  const s = sizes[size];
  const medals = ["", "🥇", "🥈", "🥉"];

  return (
    <View style={[styles.podiumItem, { marginTop: s.margin }]}>
      <View style={[styles.podiumAvatar, { width: s.avatar, height: s.avatar, borderColor: color }]}>
        <Text style={styles.podiumAvatarText}>{player.username.charAt(0).toUpperCase()}</Text>
      </View>
      <Text style={styles.podiumName}>{player.username}</Text>
      <Text style={styles.podiumXp}>{player.xp?.toLocaleString()} XP</Text>
      <View style={[styles.podiumBase, { height: s.podium, backgroundColor: color + "30" }]}>
        <Text style={styles.podiumMedal}>{medals[rank]}</Text>
      </View>
    </View>
  );
}

import { TouchableOpacity } from "react-native";

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
  heroIcon: {
    fontSize: 60,
    marginBottom: spacing.md,
  },
  heroTitle: {
    fontSize: fontSize.xxxl,
    fontWeight: fontWeight.extrabold,
    color: "#fff",
  },
  heroSubtitle: {
    fontSize: fontSize.md,
    color: "rgba(255,255,255,0.8)",
    marginTop: spacing.xs,
  },
  userRankBox: {
    marginTop: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    gap: spacing.sm,
  },
  userRankLabel: {
    fontSize: fontSize.sm,
    color: "rgba(255,255,255,0.8)",
  },
  userRankValue: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.extrabold,
    color: "#fbbf24",
  },
  content: {
    padding: spacing.lg,
  },
  tabs: {
    flexDirection: "row",
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.xs,
  },
  tabActive: {
    borderColor: colors.primary,
    backgroundColor: "#fff7ed",
  },
  tabText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.textSecondary,
  },
  tabTextActive: {
    color: colors.primary,
  },
  tabBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
  },
  tabBadgeText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    color: "#fff",
  },
  podium: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
    marginBottom: spacing.xl,
    paddingVertical: spacing.lg,
  },
  podiumItem: {
    alignItems: "center",
    marginHorizontal: spacing.sm,
  },
  podiumAvatar: {
    borderRadius: 999,
    borderWidth: 3,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.primary,
    marginBottom: spacing.xs,
  },
  podiumAvatarText: {
    color: "#fff",
    fontWeight: fontWeight.bold,
    fontSize: fontSize.lg,
  },
  podiumName: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.text,
  },
  podiumXp: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
  podiumBase: {
    marginTop: spacing.sm,
    width: 50,
    borderTopLeftRadius: borderRadius.sm,
    borderTopRightRadius: borderRadius.sm,
    justifyContent: "center",
    alignItems: "center",
  },
  podiumMedal: {
    fontSize: fontSize.xl,
  },
  leaderboardList: {
    gap: spacing.sm,
  },
  leaderboardItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
  },
  leaderboardItemCurrent: {
    borderWidth: 2,
    borderColor: colors.primary,
  },
  leaderboardRank: {
    width: 32,
    alignItems: "center",
  },
  leaderboardRankText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.textSecondary,
  },
  leaderboardAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },
  avatarText: {
    color: "#fff",
    fontWeight: fontWeight.bold,
    fontSize: fontSize.md,
  },
  leaderboardInfo: {
    flex: 1,
  },
  leaderboardName: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.text,
  },
  youText: {
    color: colors.primary,
  },
  leaderboardLevel: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
  leaderboardXp: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
  },
  emptyState: {
    padding: spacing.xxl,
    alignItems: "center",
  },
  emptyText: {
    color: colors.textMuted,
  },
});
