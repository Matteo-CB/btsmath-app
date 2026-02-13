import React, { useState, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { FLASHCARDS, FLASHCARD_SUBJECTS } from "../lib/flashcards";
import { colors, spacing, borderRadius, fontSize, fontWeight } from "../components/theme";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function FlashcardsScreen() {
  const [selectedSubject, setSelectedSubject] = useState("Tous");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [knownCards, setKnownCards] = useState<Set<string>>(new Set());
  const [studyMode, setStudyMode] = useState<"browse" | "study">("browse");

  const flipAnim = useRef(new Animated.Value(0)).current;

  const filteredCards = selectedSubject === "Tous"
    ? FLASHCARDS
    : FLASHCARDS.filter((c) => c.subject === selectedSubject);

  const currentCard = filteredCards[currentIndex];
  const progress = FLASHCARDS.length > 0
    ? Math.round((knownCards.size / FLASHCARDS.length) * 100)
    : 0;

  const flipCard = () => {
    Animated.spring(flipAnim, {
      toValue: isFlipped ? 0 : 1,
      friction: 8,
      tension: 10,
      useNativeDriver: true,
    }).start();
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    setIsFlipped(false);
    flipAnim.setValue(0);
    setCurrentIndex((currentIndex + 1) % filteredCards.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    flipAnim.setValue(0);
    setCurrentIndex(currentIndex === 0 ? filteredCards.length - 1 : currentIndex - 1);
  };

  const markAsKnown = () => {
    if (currentCard) {
      setKnownCards((prev) => new Set([...prev, currentCard.id]));
      handleNext();
    }
  };

  const resetProgress = () => {
    setKnownCards(new Set());
    setCurrentIndex(0);
    setIsFlipped(false);
    flipAnim.setValue(0);
  };

  const frontInterpolate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  const backInterpolate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["180deg", "360deg"],
  });

  const frontAnimatedStyle = {
    transform: [{ rotateY: frontInterpolate }],
  };

  const backAnimatedStyle = {
    transform: [{ rotateY: backInterpolate }],
  };

  return (
    <ScrollView style={styles.container}>
      {/* Hero */}
      <LinearGradient colors={["#8b5cf6", "#a78bfa", "#c4b5fd"]} style={styles.hero}>
        <Ionicons name="albums" size={50} color="#fff" />
        <Text style={styles.heroTitle}>Flashcards</Text>
        <Text style={styles.heroSubtitle}>
          Mémorisez les formules et concepts essentiels
        </Text>
      </LinearGradient>

      <View style={styles.content}>
        {/* Progress */}
        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>
              Progression: {knownCards.size}/{FLASHCARDS.length} cartes maîtrisées
            </Text>
            <Text style={styles.progressPercent}>{progress}%</Text>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
        </View>

        {/* Subject filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScroll}
          contentContainerStyle={styles.filterContainer}
        >
          {FLASHCARD_SUBJECTS.map((subject) => (
            <TouchableOpacity
              key={subject}
              style={[
                styles.filterButton,
                selectedSubject === subject && styles.filterButtonActive,
              ]}
              onPress={() => {
                setSelectedSubject(subject);
                setCurrentIndex(0);
                setIsFlipped(false);
                flipAnim.setValue(0);
              }}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  selectedSubject === subject && styles.filterButtonTextActive,
                ]}
              >
                {subject}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Mode toggle */}
        <View style={styles.modeToggle}>
          <TouchableOpacity
            style={[styles.modeButton, studyMode === "browse" && styles.modeButtonActive]}
            onPress={() => setStudyMode("browse")}
          >
            <View style={{flexDirection:'row',alignItems:'center',gap:4}}>
              <Ionicons name="book" size={16} color={studyMode === "browse" ? "#8b5cf6" : colors.textSecondary} />
              <Text style={[styles.modeButtonText, studyMode === "browse" && styles.modeButtonTextActive]}>
                Parcourir
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modeButton, studyMode === "study" && styles.modeButtonActive]}
            onPress={() => setStudyMode("study")}
          >
            <View style={{flexDirection:'row',alignItems:'center',gap:4}}>
              <Ionicons name="locate" size={16} color={studyMode === "study" ? "#8b5cf6" : colors.textSecondary} />
              <Text style={[styles.modeButtonText, studyMode === "study" && styles.modeButtonTextActive]}>
                Révision
              </Text>
            </View>
          </TouchableOpacity>
          {knownCards.size > 0 && (
            <TouchableOpacity style={styles.resetButton} onPress={resetProgress}>
              <Ionicons name="refresh" size={20} color="#ef4444" />
            </TouchableOpacity>
          )}
        </View>

        {/* Flashcard */}
        {filteredCards.length > 0 && currentCard ? (
          <View style={styles.cardContainer}>
            <TouchableOpacity activeOpacity={0.9} onPress={flipCard}>
              {/* Front */}
              <Animated.View style={[styles.card, styles.cardFront, frontAnimatedStyle]}>
                <View style={[styles.cardTag, { backgroundColor: currentCard.color + "20" }]}>
                  <Text style={[styles.cardTagText, { color: currentCard.color }]}>
                    {currentCard.subject}
                  </Text>
                </View>
                <Text style={styles.cardIndex}>
                  {currentIndex + 1} / {filteredCards.length}
                </Text>
                <View style={styles.cardContent}>
                  <Text style={styles.cardQuestion}>{currentCard.question}</Text>
                </View>
                <Text style={styles.tapHint}>Touchez pour voir la réponse</Text>
              </Animated.View>

              {/* Back */}
              <Animated.View style={[styles.card, styles.cardBack, backAnimatedStyle, { backgroundColor: currentCard.color }]}>
                <View style={styles.cardBackHeader}>
                  <View style={styles.cardBackTag}>
                    <Text style={styles.cardBackTagText}>Réponse</Text>
                  </View>
                  {knownCards.has(currentCard.id) && (
                    <View style={styles.cardBackTag}>
                      <View style={{flexDirection:'row',alignItems:'center',gap:3}}>
                      <Ionicons name="checkmark" size={12} color="#fff" />
                      <Text style={styles.cardBackTagText}>Maîtrisée</Text>
                    </View>
                    </View>
                  )}
                </View>
                <ScrollView style={styles.cardBackContent} showsVerticalScrollIndicator={false}>
                  <Text style={styles.cardAnswer}>{currentCard.answer}</Text>
                  {currentCard.formula && (
                    <View style={styles.formulaBox}>
                      <Text style={styles.formulaLabel}>Formule :</Text>
                      <Text style={styles.formulaText}>{currentCard.formula}</Text>
                    </View>
                  )}
                  {currentCard.example && (
                    <View style={styles.exampleBox}>
                      <Text style={styles.exampleLabel}>Exemple :</Text>
                      <Text style={styles.exampleText}>{currentCard.example}</Text>
                    </View>
                  )}
                </ScrollView>
              </Animated.View>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="happy" size={50} color={colors.text} />
            <Text style={styles.emptyTitle}>Félicitations !</Text>
            <Text style={styles.emptyText}>
              Vous avez révisé toutes les cartes de cette catégorie.
            </Text>
          </View>
        )}

        {/* Navigation */}
        {filteredCards.length > 0 && (
          <View style={styles.navigation}>
            <TouchableOpacity style={styles.navButton} onPress={handlePrev}>
              <Text style={styles.navButtonText}>←</Text>
            </TouchableOpacity>

            {studyMode === "study" && currentCard && !knownCards.has(currentCard.id) && (
              <TouchableOpacity style={styles.knownButton} onPress={markAsKnown}>
                <LinearGradient colors={["#10b981", "#34d399"]} style={styles.knownButtonGradient}>
                  <View style={{flexDirection:'row',alignItems:'center',gap:4}}>
                    <Ionicons name="checkmark" size={16} color="#fff" />
                    <Text style={styles.knownButtonText}>Je connais</Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            )}

            <TouchableOpacity style={styles.navButtonNext} onPress={handleNext}>
              <LinearGradient colors={["#8b5cf6", "#a78bfa"]} style={styles.navButtonNextGradient}>
                <Text style={styles.navButtonNextText}>→</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}

        {/* Study Stats */}
        {studyMode === "study" && (
          <View style={styles.studyStats}>
            <View style={styles.studyStat}>
              <Text style={[styles.studyStatValue, { color: "#10b981" }]}>{knownCards.size}</Text>
              <Text style={styles.studyStatLabel}>Maîtrisées</Text>
            </View>
            <View style={styles.studyStat}>
              <Text style={[styles.studyStatValue, { color: "#f59e0b" }]}>
                {FLASHCARDS.length - knownCards.size}
              </Text>
              <Text style={styles.studyStatLabel}>À réviser</Text>
            </View>
            <View style={styles.studyStat}>
              <Text style={[styles.studyStatValue, { color: "#8b5cf6" }]}>{FLASHCARDS.length}</Text>
              <Text style={styles.studyStatLabel}>Total</Text>
            </View>
          </View>
        )}

        {/* Tip */}
        <View style={styles.tipBox}>
          <View style={{flexDirection:'row',alignItems:'center',gap:6}}>
            <Ionicons name="bulb" size={16} color="#7c3aed" />
            <Text style={styles.tipTitle}>Conseil de révision</Text>
          </View>
          <Text style={styles.tipText}>
            Utilisez la méthode de répétition espacée : révisez les cartes difficiles plus souvent et les cartes maîtrisées moins fréquemment.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  hero: {
    paddingTop: 60,
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.lg,
    alignItems: "center",
  },
  heroIcon: {
    fontSize: 50,
    marginBottom: spacing.sm,
  },
  heroTitle: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.extrabold,
    color: "#fff",
  },
  heroSubtitle: {
    fontSize: fontSize.md,
    color: "rgba(255,255,255,0.9)",
    marginTop: spacing.xs,
    textAlign: "center",
  },
  content: {
    padding: spacing.lg,
  },
  progressSection: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.sm,
  },
  progressTitle: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.text,
  },
  progressPercent: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    color: "#8b5cf6",
  },
  progressBar: {
    height: 8,
    backgroundColor: "#f1f5f9",
    borderRadius: borderRadius.full,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#8b5cf6",
    borderRadius: borderRadius.full,
  },
  filterScroll: {
    marginBottom: spacing.md,
  },
  filterContainer: {
    gap: spacing.sm,
  },
  filterButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: "#f1f5f9",
    borderRadius: borderRadius.full,
  },
  filterButtonActive: {
    backgroundColor: "#8b5cf6",
  },
  filterButtonText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.textSecondary,
  },
  filterButtonTextActive: {
    color: "#fff",
  },
  modeToggle: {
    flexDirection: "row",
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  modeButton: {
    flex: 1,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: "center",
  },
  modeButtonActive: {
    borderColor: "#8b5cf6",
    backgroundColor: "#f5f3ff",
  },
  modeButtonText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.textSecondary,
  },
  modeButtonTextActive: {
    color: "#8b5cf6",
  },
  resetButton: {
    padding: spacing.md,
    backgroundColor: "#fef2f2",
    borderRadius: borderRadius.md,
    borderWidth: 2,
    borderColor: "#ef4444",
    justifyContent: "center",
    alignItems: "center",
  },
  resetButtonText: {
    fontSize: fontSize.lg,
  },
  cardContainer: {
    height: 350,
    marginBottom: spacing.lg,
  },
  card: {
    position: "absolute",
    width: "100%",
    height: 350,
    borderRadius: borderRadius.xl,
    backfaceVisibility: "hidden",
    padding: spacing.lg,
  },
  cardFront: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  cardBack: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 5,
  },
  cardTag: {
    alignSelf: "flex-start",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  cardTagText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
  },
  cardIndex: {
    position: "absolute",
    top: spacing.lg,
    right: spacing.lg,
    fontSize: fontSize.sm,
    color: colors.textMuted,
  },
  cardContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cardQuestion: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.text,
    textAlign: "center",
    lineHeight: 32,
  },
  tapHint: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    textAlign: "center",
  },
  cardBackHeader: {
    flexDirection: "row",
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  cardBackTag: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  cardBackTagText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    color: "#fff",
  },
  cardBackContent: {
    flex: 1,
  },
  cardAnswer: {
    fontSize: fontSize.md,
    color: "#fff",
    lineHeight: 26,
    marginBottom: spacing.md,
  },
  formulaBox: {
    backgroundColor: "rgba(0,0,0,0.2)",
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
  },
  formulaLabel: {
    fontSize: fontSize.xs,
    color: "rgba(255,255,255,0.8)",
    marginBottom: spacing.xs,
  },
  formulaText: {
    fontSize: fontSize.md,
    color: "#fff",
    fontFamily: "monospace",
  },
  exampleBox: {
    backgroundColor: "rgba(255,255,255,0.1)",
    padding: spacing.md,
    borderRadius: borderRadius.md,
  },
  exampleLabel: {
    fontSize: fontSize.xs,
    color: "rgba(255,255,255,0.8)",
    marginBottom: spacing.xs,
  },
  exampleText: {
    fontSize: fontSize.sm,
    color: "#fff",
    fontFamily: "monospace",
  },
  emptyState: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.xxl,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg,
  },
  emptyIcon: {
    fontSize: 50,
    marginBottom: spacing.md,
  },
  emptyTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  emptyText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    textAlign: "center",
  },
  navigation: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  navButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.border,
    justifyContent: "center",
    alignItems: "center",
  },
  navButtonText: {
    fontSize: fontSize.xxl,
    color: colors.textSecondary,
  },
  navButtonNext: {
    width: 56,
    height: 56,
    borderRadius: 28,
    overflow: "hidden",
  },
  navButtonNextGradient: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  navButtonNextText: {
    fontSize: fontSize.xxl,
    color: "#fff",
  },
  knownButton: {
    borderRadius: borderRadius.md,
    overflow: "hidden",
  },
  knownButtonGradient: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  knownButtonText: {
    color: "#fff",
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
  },
  studyStats: {
    flexDirection: "row",
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  studyStat: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  studyStatValue: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.extrabold,
  },
  studyStatLabel: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  tipBox: {
    backgroundColor: "#f5f3ff",
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: "#c4b5fd",
  },
  tipTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: "#7c3aed",
    marginBottom: spacing.xs,
  },
  tipText: {
    fontSize: fontSize.sm,
    color: "#6b21a8",
    lineHeight: 22,
  },
});
