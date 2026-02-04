import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ActivityIndicator,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { getCurrentUser, updateUserXp } from "../lib/auth";
import { createGameSession, updateGameSession, saveHighScore } from "../lib/db";
import { generateExercises, checkAnswer } from "../lib/exercises";
import { GAME_MODES } from "../lib/types";
import type { Exercise, GameMode, User } from "../lib/types";
import { colors, spacing, borderRadius, fontSize, fontWeight } from "../components/theme";

interface Props {
  mode: GameMode;
  onExit: () => void;
}

const MODE_COLORS: Record<string, { primary: string; light: string }> = {
  training: { primary: "#10b981", light: "#ecfdf5" },
  sprint: { primary: "#f59e0b", light: "#fef3c7" },
  survival: { primary: "#ef4444", light: "#fef2f2" },
  duel: { primary: "#8b5cf6", light: "#f5f3ff" },
  boss: { primary: "#ec4899", light: "#fdf2f8" },
  express: { primary: "#06b6d4", light: "#ecfeff" },
  exam: { primary: "#64748b", light: "#f8fafc" },
};

export default function GameScreen({ mode, onExit }: Props) {
  const [user, setUser] = useState<User | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [errors, setErrors] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState<{ correct: boolean; message: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFinished, setIsFinished] = useState(false);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [startTime] = useState(Date.now());
  const [xpEarned, setXpEarned] = useState(0);

  const shakeAnim = useRef(new Animated.Value(0)).current;
  const modeConfig = GAME_MODES.find((m) => m.id === mode)!;
  const modeColor = MODE_COLORS[mode] || MODE_COLORS.training;

  const initGame = useCallback(async () => {
    setLoading(true);
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      Alert.alert("Erreur", "Utilisateur non connecté");
      onExit();
      return;
    }
    setUser(currentUser);

    const questionCount = modeConfig.rules.questionCount || 10;
    const generatedExercises = generateExercises(questionCount);
    setExercises(generatedExercises);

    const session = await createGameSession(currentUser.id, mode);
    setSessionId(session);

    if (modeConfig.rules.timeLimit) {
      setTimeRemaining(modeConfig.rules.timeLimit);
    }

    setCurrentIndex(0);
    setScore(0);
    setErrors(0);
    setCorrectAnswers(0);
    setCombo(0);
    setMaxCombo(0);
    setUserAnswer("");
    setFeedback(null);
    setIsFinished(false);
    setLoading(false);
  }, [mode, modeConfig, onExit]);

  useEffect(() => {
    initGame();
  }, [initGame]);

  // Timer
  useEffect(() => {
    if (!timeRemaining || isFinished) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(timer);
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, isFinished]);

  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  };

  const endGame = async () => {
    if (!user || !sessionId || isFinished) return;
    setIsFinished(true);

    const duration = Math.floor((Date.now() - startTime) / 1000);
    const earnedXp = Math.floor(score * modeConfig.rules.xpMultiplier);

    await updateGameSession(
      sessionId,
      score,
      exercises.length,
      correctAnswers,
      errors,
      earnedXp,
      duration
    );

    await updateUserXp(user.id, earnedXp);
    await saveHighScore(user.id, mode, score);

    setXpEarned(earnedXp);
  };

  const handleSubmit = async () => {
    if (!user || isFinished || feedback) return;

    const currentExercise = exercises[currentIndex];
    const result = checkAnswer(currentExercise, userAnswer);

    if (!result.correct) {
      shake();
    }

    setFeedback({
      correct: result.correct,
      message: result.correct ? "Correct !" : `Réponse : ${result.correctAnswer}`,
    });

    const newCombo = result.correct ? combo + 1 : 0;
    const comboBonus = result.correct && newCombo >= 3 ? Math.floor(newCombo * 2) : 0;
    const basePoints = result.correct ? currentExercise.xpReward : 0;

    setScore((prev) => prev + basePoints + comboBonus);
    setCorrectAnswers((prev) => prev + (result.correct ? 1 : 0));
    setErrors((prev) => prev + (result.correct ? 0 : 1));
    setCombo(newCombo);
    setMaxCombo((prev) => Math.max(prev, newCombo));

    const newErrors = errors + (result.correct ? 0 : 1);

    // Check for game over conditions
    if (modeConfig.rules.maxErrors && newErrors >= modeConfig.rules.maxErrors) {
      setTimeout(() => endGame(), 1000);
    } else if (currentIndex + 1 >= exercises.length) {
      setTimeout(() => endGame(), 1000);
    } else {
      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
        setFeedback(null);
        setUserAnswer("");
      }, 1200);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={modeColor.primary} />
        <Text style={styles.loadingText}>Préparation des exercices...</Text>
      </View>
    );
  }

  if (isFinished) {
    const accuracy = exercises.length > 0
      ? Math.round((correctAnswers / exercises.length) * 100)
      : 0;

    return (
      <View style={styles.container}>
        <View style={styles.resultContainer}>
          <View style={[styles.resultIcon, { backgroundColor: modeColor.primary }]}>
            <Text style={styles.resultIconText}>🏆</Text>
          </View>
          <Text style={styles.resultTitle}>Partie terminée !</Text>

          <View style={styles.statsGrid}>
            <View style={[styles.statBox, { backgroundColor: modeColor.light }]}>
              <Text style={[styles.statValue, { color: modeColor.primary }]}>{score}</Text>
              <Text style={styles.statLabel}>Score</Text>
            </View>
            <View style={[styles.statBox, { backgroundColor: "#fef3c7" }]}>
              <Text style={[styles.statValue, { color: "#f59e0b" }]}>+{xpEarned}</Text>
              <Text style={styles.statLabel}>XP Gagné</Text>
            </View>
            <View style={[styles.statBox, { backgroundColor: "#f0fdf4" }]}>
              <Text style={[styles.statValue, { color: "#10b981" }]}>{accuracy}%</Text>
              <Text style={styles.statLabel}>Précision</Text>
            </View>
            <View style={[styles.statBox, { backgroundColor: "#fdf4ff" }]}>
              <Text style={[styles.statValue, { color: "#a855f7" }]}>x{maxCombo}</Text>
              <Text style={styles.statLabel}>Max Combo</Text>
            </View>
          </View>

          <View style={styles.resultActions}>
            <TouchableOpacity style={styles.replayButton} onPress={initGame}>
              <LinearGradient colors={[modeColor.primary, modeColor.primary + "dd"]} style={styles.buttonGradient}>
                <Text style={styles.buttonText}>🔄 Rejouer</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity style={styles.exitButton} onPress={onExit}>
              <Text style={styles.exitButtonText}>Retour</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  const currentExercise = exercises[currentIndex];
  const progress = ((currentIndex) / exercises.length) * 100;
  const isTimeLow = timeRemaining !== null && timeRemaining < 30;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onExit}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>{modeConfig.icon} {modeConfig.name}</Text>
          <Text style={styles.headerSubtitle}>
            Question {currentIndex + 1}/{exercises.length}
          </Text>
        </View>
        <View style={styles.headerStats}>
          {combo >= 2 && (
            <View style={styles.comboBadge}>
              <Text style={styles.comboText}>🔥 x{combo}</Text>
            </View>
          )}
          {timeRemaining !== null && (
            <View style={styles.timerContainer}>
              <Text style={[styles.timerText, isTimeLow && styles.timerWarning]}>
                {formatTime(timeRemaining)}
              </Text>
            </View>
          )}
          <View style={styles.scoreContainer}>
            <Text style={[styles.scoreText, { color: modeColor.primary }]}>{score}</Text>
          </View>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progress}%`, backgroundColor: modeColor.primary }]} />
      </View>

      {/* Lives */}
      {modeConfig.rules.maxErrors && (
        <View style={styles.livesContainer}>
          {Array.from({ length: modeConfig.rules.maxErrors }).map((_, i) => (
            <Text key={i} style={[styles.life, i < errors && styles.lifeLost]}>❤️</Text>
          ))}
        </View>
      )}

      {/* Exercise Card */}
      <Animated.View style={[styles.exerciseCard, { transform: [{ translateX: shakeAnim }] }]}>
        <View style={styles.exerciseTags}>
          <View style={[styles.tag, { backgroundColor: modeColor.light }]}>
            <Text style={[styles.tagText, { color: modeColor.primary }]}>{currentExercise.subject}</Text>
          </View>
          <View style={styles.xpBadge}>
            <Text style={styles.xpBadgeText}>+{currentExercise.xpReward} XP</Text>
          </View>
        </View>
        <Text style={styles.exerciseTitle}>{currentExercise.title}</Text>

        {/* Exercise Content based on type */}
        <View style={styles.exerciseContent}>
          {renderExerciseContent(currentExercise, modeColor)}
        </View>
      </Animated.View>

      {/* Answer Section */}
      <View style={styles.answerSection}>
        {feedback ? (
          <View style={[styles.feedbackBox, feedback.correct ? styles.feedbackCorrect : styles.feedbackIncorrect]}>
            <Text style={styles.feedbackIcon}>{feedback.correct ? "✓" : "✗"}</Text>
            <View>
              <Text style={styles.feedbackTitle}>{feedback.correct ? "Correct !" : "Incorrect"}</Text>
              {!feedback.correct && <Text style={styles.feedbackMessage}>{feedback.message}</Text>}
            </View>
            {feedback.correct && combo >= 2 && (
              <View style={styles.comboFeedback}>
                <Text style={styles.comboFeedbackText}>🔥 Combo x{combo} !</Text>
              </View>
            )}
          </View>
        ) : (
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              value={userAnswer}
              onChangeText={setUserAnswer}
              placeholder="Entrez votre réponse..."
              placeholderTextColor={colors.textMuted}
              autoCapitalize="none"
              autoCorrect={false}
              onSubmitEditing={handleSubmit}
            />
            <TouchableOpacity
              style={[styles.submitButton, !userAnswer.trim() && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={!userAnswer.trim()}
            >
              <LinearGradient
                colors={userAnswer.trim() ? [modeColor.primary, modeColor.primary + "dd"] : ["#e2e8f0", "#e2e8f0"]}
                style={styles.submitGradient}
              >
                <Text style={[styles.submitText, !userAnswer.trim() && styles.submitTextDisabled]}>
                  Valider
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

function renderExerciseContent(exercise: Exercise, modeColor: { primary: string; light: string }) {
  const data = exercise.data;

  switch (exercise.type) {
    case "matrix_multiplication":
    case "matrix_addition":
    case "matrix_determinant":
      const matrixA = data.matrixA as number[][];
      const matrixB = data.matrixB as number[][] | undefined;
      return (
        <View style={styles.matrixContainer}>
          <MatrixDisplay matrix={matrixA} label="A" />
          {matrixB && (
            <>
              <Text style={styles.operator}>{exercise.type === "matrix_multiplication" ? "×" : "+"}</Text>
              <MatrixDisplay matrix={matrixB} label="B" />
            </>
          )}
          <Text style={styles.operator}>=</Text>
          <View style={[styles.resultPlaceholder, { borderColor: modeColor.primary }]}>
            <Text style={[styles.resultPlaceholderText, { color: modeColor.primary }]}>?</Text>
          </View>
        </View>
      );

    case "arithmetic_congruence":
      const numbers = data.numbers as number[];
      const modulo = data.modulo as number;
      return (
        <View style={styles.arithmeticContainer}>
          <Text style={styles.arithmeticLabel}>Calculez le reste :</Text>
          <Text style={styles.arithmeticExpression}>
            {numbers[0]} <Text style={styles.arithmeticMod}>mod</Text> {modulo}
          </Text>
        </View>
      );

    case "arithmetic_pgcd":
      const nums = data.numbers as number[];
      return (
        <View style={styles.arithmeticContainer}>
          <Text style={styles.arithmeticLabel}>Trouvez le PGCD :</Text>
          <Text style={styles.arithmeticExpression}>
            PGCD({nums[0]}, {nums[1]})
          </Text>
        </View>
      );

    case "arithmetic_base_conversion":
      const num = (data.numbers as number[])[0];
      const base = data.base as number;
      const targetBase = data.targetBase as number;
      return (
        <View style={styles.arithmeticContainer}>
          <Text style={styles.arithmeticLabel}>Convertissez :</Text>
          <View style={styles.conversionRow}>
            <View style={styles.conversionBox}>
              <Text style={styles.conversionValue}>{num.toString(base).toUpperCase()}</Text>
              <Text style={styles.conversionBase}>Base {base}</Text>
            </View>
            <Text style={styles.conversionArrow}>→</Text>
            <View style={[styles.conversionBox, styles.conversionTarget, { borderColor: modeColor.primary }]}>
              <Text style={[styles.conversionValue, { color: modeColor.primary }]}>?</Text>
              <Text style={styles.conversionBase}>Base {targetBase}</Text>
            </View>
          </View>
        </View>
      );

    case "boolean_truth_table":
    case "boolean_simplify":
      const expression = data.expression as string;
      return (
        <View style={styles.booleanContainer}>
          <Text style={styles.booleanLabel}>
            {exercise.type === "boolean_truth_table" ? "Table de vérité pour :" : "Simplifiez :"}
          </Text>
          <View style={styles.booleanExpression}>
            <Text style={styles.booleanExpressionText}>{expression}</Text>
          </View>
          {exercise.type === "boolean_truth_table" && (
            <Text style={styles.booleanHint}>Format: 0,1,1,0 (valeurs séparées par virgules)</Text>
          )}
        </View>
      );

    default:
      return (
        <View style={styles.genericContent}>
          <Text style={styles.genericText}>Résolvez cet exercice</Text>
        </View>
      );
  }
}

function MatrixDisplay({ matrix, label }: { matrix: number[][]; label: string }) {
  return (
    <View style={styles.matrixWrapper}>
      <Text style={styles.matrixLabel}>{label}</Text>
      <View style={styles.matrix}>
        {matrix.map((row, i) => (
          <View key={i} style={styles.matrixRow}>
            {row.map((val, j) => (
              <View key={j} style={styles.matrixCell}>
                <Text style={styles.matrixCellText}>{val}</Text>
              </View>
            ))}
          </View>
        ))}
      </View>
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
  loadingText: {
    marginTop: spacing.md,
    color: colors.textSecondary,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 50,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: borderRadius.sm,
  },
  backButtonText: {
    fontSize: fontSize.xl,
    color: colors.textSecondary,
  },
  headerInfo: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  headerTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  headerSubtitle: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
  headerStats: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  comboBadge: {
    backgroundColor: "#fbbf24",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  comboText: {
    color: "#fff",
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
  },
  timerContainer: {
    alignItems: "center",
  },
  timerText: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    color: colors.text,
  },
  timerWarning: {
    color: colors.error,
  },
  scoreContainer: {
    alignItems: "center",
  },
  scoreText: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
  },
  progressBar: {
    height: 4,
    backgroundColor: colors.border,
  },
  progressFill: {
    height: "100%",
  },
  livesContainer: {
    flexDirection: "row",
    justifyContent: "center",
    padding: spacing.sm,
    gap: spacing.xs,
  },
  life: {
    fontSize: fontSize.lg,
  },
  lifeLost: {
    opacity: 0.3,
  },
  exerciseCard: {
    flex: 1,
    margin: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  exerciseTags: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  tag: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  tagText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    textTransform: "capitalize",
  },
  xpBadge: {
    backgroundColor: "#fbbf24",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  xpBadgeText: {
    color: "#fff",
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
  },
  exerciseTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.lg,
  },
  exerciseContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  matrixContainer: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: spacing.sm,
  },
  matrixWrapper: {
    alignItems: "center",
  },
  matrixLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  matrix: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.sm,
    padding: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
  },
  matrixRow: {
    flexDirection: "row",
  },
  matrixCell: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  matrixCellText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  operator: {
    fontSize: fontSize.xxl,
    color: colors.textMuted,
    marginHorizontal: spacing.xs,
  },
  resultPlaceholder: {
    width: 60,
    height: 60,
    borderWidth: 3,
    borderStyle: "dashed",
    borderRadius: borderRadius.md,
    justifyContent: "center",
    alignItems: "center",
  },
  resultPlaceholderText: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
  },
  arithmeticContainer: {
    alignItems: "center",
  },
  arithmeticLabel: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  arithmeticExpression: {
    fontSize: 32,
    fontWeight: fontWeight.bold,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    color: colors.text,
  },
  arithmeticMod: {
    color: colors.textMuted,
    fontSize: 24,
  },
  conversionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  conversionBox: {
    padding: spacing.lg,
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  conversionTarget: {
    borderWidth: 3,
    borderStyle: "dashed",
    backgroundColor: "transparent",
  },
  conversionValue: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  conversionBase: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  conversionArrow: {
    fontSize: fontSize.xxl,
    color: colors.textMuted,
  },
  booleanContainer: {
    alignItems: "center",
    width: "100%",
  },
  booleanLabel: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  booleanExpression: {
    backgroundColor: "#1e293b",
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.md,
  },
  booleanExpressionText: {
    color: "#10b981",
    fontSize: fontSize.xl,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontWeight: fontWeight.semibold,
  },
  booleanHint: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    marginTop: spacing.md,
  },
  genericContent: {
    alignItems: "center",
  },
  genericText: {
    fontSize: fontSize.lg,
    color: colors.textSecondary,
  },
  answerSection: {
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  inputRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  input: {
    flex: 1,
    backgroundColor: colors.background,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: fontSize.md,
    color: colors.text,
  },
  submitButton: {
    borderRadius: borderRadius.md,
    overflow: "hidden",
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitGradient: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    justifyContent: "center",
    alignItems: "center",
  },
  submitText: {
    color: "#fff",
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
  },
  submitTextDisabled: {
    color: colors.textMuted,
  },
  feedbackBox: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 2,
  },
  feedbackCorrect: {
    backgroundColor: "#ecfdf5",
    borderColor: "#10b981",
  },
  feedbackIncorrect: {
    backgroundColor: "#fef2f2",
    borderColor: "#ef4444",
  },
  feedbackIcon: {
    fontSize: 24,
    marginRight: spacing.md,
  },
  feedbackTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
  },
  feedbackMessage: {
    fontSize: fontSize.sm,
    color: colors.error,
    marginTop: spacing.xs,
  },
  comboFeedback: {
    marginLeft: "auto",
    backgroundColor: "#fbbf24",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  comboFeedbackText: {
    color: "#fff",
    fontWeight: fontWeight.bold,
  },
  resultContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.xl,
  },
  resultIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  resultIconText: {
    fontSize: 40,
  },
  resultTitle: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.extrabold,
    color: colors.text,
    marginBottom: spacing.xl,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  statBox: {
    width: "45%",
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    alignItems: "center",
  },
  statValue: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.extrabold,
  },
  statLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  resultActions: {
    width: "100%",
    gap: spacing.sm,
  },
  replayButton: {
    borderRadius: borderRadius.md,
    overflow: "hidden",
  },
  buttonGradient: {
    paddingVertical: spacing.md,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
  },
  exitButton: {
    padding: spacing.md,
    alignItems: "center",
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
  },
  exitButtonText: {
    color: colors.textSecondary,
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
  },
});

import { Platform } from "react-native";
