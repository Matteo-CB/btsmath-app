import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";
import { colors } from "../theme";

interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
  explanation?: string;
}

interface QuickQuizProps {
  questions: QuizQuestion[];
  title?: string;
}

export function QuickQuiz({ questions, title = "Quiz rapide" }: QuickQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(Array(questions.length).fill(null));
  const [isFinished, setIsFinished] = useState(false);

  const handleAnswer = (index: number) => {
    if (showResult) return;
    setSelectedAnswer(index);
  };

  const checkAnswer = () => {
    if (selectedAnswer === null) return;

    const newAnswers = [...answers];
    newAnswers[currentQuestion] = selectedAnswer;
    setAnswers(newAnswers);

    if (selectedAnswer === questions[currentQuestion].correct) {
      setScore((s) => s + 1);
    }
    setShowResult(true);
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((q) => q + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setIsFinished(true);
    }
  };

  const restart = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setAnswers(Array(questions.length).fill(null));
    setIsFinished(false);
  };

  const question = questions[currentQuestion];
  const isCorrect = selectedAnswer === question.correct;

  if (isFinished) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <View style={styles.container}>
        <View
          style={[
            styles.scoreCircle,
            {
              backgroundColor:
                percentage >= 70 ? "#10B981" : percentage >= 50 ? "#F59E0B" : "#EF4444",
            },
          ]}
        >
          <Text style={styles.scorePercentage}>{percentage}%</Text>
        </View>

        <Text style={styles.resultTitle}>
          {percentage >= 70 ? "Excellent !" : percentage >= 50 ? "Pas mal !" : "Continuez à réviser !"}
        </Text>
        <Text style={styles.resultSubtitle}>
          Vous avez obtenu {score} sur {questions.length} questions
        </Text>

        <View style={styles.answersGrid}>
          {answers.map((answer, i) => (
            <View
              key={i}
              style={[
                styles.answerDot,
                {
                  backgroundColor:
                    answer === questions[i].correct ? "#dcfce7" : "#fef2f2",
                },
              ]}
            >
              <Text
                style={{
                  color: answer === questions[i].correct ? "#166534" : "#dc2626",
                  fontWeight: "700",
                }}
              >
                {answer === questions[i].correct ? "✓" : "✗"}
              </Text>
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.restartButton} onPress={restart}>
          <Text style={styles.restartButtonText}>Recommencer</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <Text style={styles.headerIconText}>?</Text>
        </View>
        <Text style={styles.headerTitle}>{title}</Text>
        <View style={styles.progressDots}>
          {questions.map((_, i) => (
            <View
              key={i}
              style={[
                styles.progressDot,
                {
                  backgroundColor:
                    i === currentQuestion
                      ? colors.primary
                      : i < currentQuestion
                      ? "#10B981"
                      : "#e2e8f0",
                },
              ]}
            />
          ))}
        </View>
      </View>

      <View style={styles.questionCard}>
        <Text style={styles.questionText}>{question.question}</Text>

        <View style={styles.optionsContainer}>
          {question.options.map((option, i) => {
            const isSelected = selectedAnswer === i;
            const isCorrectAnswer = i === question.correct;
            const showCorrectness = showResult;

            let bgColor = "white";
            let borderColor = "#e2e8f0";
            let textColor = "#374151";

            if (showCorrectness) {
              if (isCorrectAnswer) {
                bgColor = "#dcfce7";
                borderColor = "#10B981";
                textColor = "#166534";
              } else if (isSelected && !isCorrectAnswer) {
                bgColor = "#fef2f2";
                borderColor = "#ef4444";
                textColor = "#dc2626";
              }
            } else if (isSelected) {
              bgColor = "#fff7ed";
              borderColor = colors.primary;
              textColor = "#c2410c";
            }

            return (
              <TouchableOpacity
                key={i}
                onPress={() => handleAnswer(i)}
                disabled={showResult}
                style={[
                  styles.optionButton,
                  { backgroundColor: bgColor, borderColor },
                ]}
              >
                <View
                  style={[
                    styles.optionLetter,
                    {
                      backgroundColor: isSelected
                        ? showCorrectness
                          ? isCorrectAnswer
                            ? "#10B981"
                            : "#ef4444"
                          : colors.primary
                        : "#f1f5f9",
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.optionLetterText,
                      { color: isSelected ? "white" : "#64748b" },
                    ]}
                  >
                    {String.fromCharCode(65 + i)}
                  </Text>
                </View>
                <Text style={[styles.optionText, { color: textColor, flex: 1 }]}>
                  {option}
                </Text>
                {showCorrectness && isCorrectAnswer && (
                  <Text style={styles.checkMark}>✓</Text>
                )}
                {showCorrectness && isSelected && !isCorrectAnswer && (
                  <Text style={styles.crossMark}>✗</Text>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {showResult && question.explanation && (
          <View
            style={[
              styles.explanationBox,
              { backgroundColor: isCorrect ? "#f0fdf4" : "#fef2f2" },
            ]}
          >
            <Text
              style={[
                styles.explanationTitle,
                { color: isCorrect ? "#166534" : "#dc2626" },
              ]}
            >
              {isCorrect ? "Bonne réponse !" : "Pas tout à fait..."}
            </Text>
            <Text style={styles.explanationText}>{question.explanation}</Text>
          </View>
        )}
      </View>

      <View style={styles.actions}>
        {!showResult ? (
          <TouchableOpacity
            onPress={checkAnswer}
            disabled={selectedAnswer === null}
            style={[
              styles.validateButton,
              selectedAnswer === null && styles.validateButtonDisabled,
            ]}
          >
            <Text style={styles.validateButtonText}>Valider</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={nextQuestion} style={styles.nextButton}>
            <Text style={styles.nextButtonText}>
              {currentQuestion < questions.length - 1 ? "Question suivante" : "Voir le résultat"}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

interface MiniExerciseProps {
  question: string;
  answer: string;
  hint?: string;
  inputType?: "text" | "number";
}

export function MiniExercise({
  question,
  answer,
  hint,
  inputType = "text",
}: MiniExerciseProps) {
  const [userAnswer, setUserAnswer] = useState("");
  const [checked, setChecked] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const isCorrect = userAnswer.toLowerCase().trim() === answer.toLowerCase().trim();

  const check = () => setChecked(true);
  const reset = () => {
    setUserAnswer("");
    setChecked(false);
    setShowHint(false);
  };

  return (
    <View
      style={[
        styles.exerciseContainer,
        checked && { borderColor: isCorrect ? "#10B981" : "#ef4444" },
      ]}
    >
      <Text style={styles.exerciseQuestion}>{question}</Text>

      <View style={styles.exerciseInputRow}>
        <TextInput
          style={styles.exerciseInput}
          value={userAnswer}
          onChangeText={setUserAnswer}
          editable={!checked}
          placeholder="Votre réponse..."
          placeholderTextColor="#94a3b8"
          keyboardType={inputType === "number" ? "numeric" : "default"}
          onSubmitEditing={() => !checked && check()}
        />

        {!checked ? (
          <View style={styles.exerciseButtons}>
            <TouchableOpacity
              onPress={check}
              disabled={!userAnswer}
              style={[
                styles.exerciseCheckButton,
                !userAnswer && styles.exerciseCheckButtonDisabled,
              ]}
            >
              <Text style={styles.exerciseCheckButtonText}>Vérifier</Text>
            </TouchableOpacity>
            {hint && (
              <TouchableOpacity
                onPress={() => setShowHint(true)}
                style={styles.exerciseHintButton}
              >
                <Text style={styles.exerciseHintButtonText}>Indice</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <TouchableOpacity onPress={reset} style={styles.exerciseResetButton}>
            <Text style={styles.exerciseResetButtonText}>Réessayer</Text>
          </TouchableOpacity>
        )}
      </View>

      {showHint && !checked && hint && (
        <View style={styles.hintBox}>
          <Text style={styles.hintText}>💡 {hint}</Text>
        </View>
      )}

      {checked && (
        <View
          style={[
            styles.resultBox,
            { backgroundColor: isCorrect ? "#dcfce7" : "#fef2f2" },
          ]}
        >
          <Text style={styles.resultIcon}>{isCorrect ? "✓" : "✗"}</Text>
          <Text
            style={[
              styles.resultText,
              { color: isCorrect ? "#166534" : "#dc2626" },
            ]}
          >
            {isCorrect ? "Correct !" : `La réponse était : ${answer}`}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff7ed",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#fed7aa",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  headerIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  headerIconText: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#c2410c",
    flex: 1,
  },
  progressDots: {
    flexDirection: "row",
    gap: 4,
  },
  progressDot: {
    width: 20,
    height: 6,
    borderRadius: 3,
  },
  questionCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  questionText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0f172a",
    lineHeight: 24,
    marginBottom: 16,
  },
  optionsContainer: {
    gap: 10,
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 10,
    borderWidth: 2,
  },
  optionLetter: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  optionLetterText: {
    fontSize: 14,
    fontWeight: "700",
  },
  optionText: {
    fontSize: 14,
    fontWeight: "500",
  },
  checkMark: {
    fontSize: 18,
    color: "#10B981",
  },
  crossMark: {
    fontSize: 18,
    color: "#ef4444",
  },
  explanationBox: {
    marginTop: 16,
    padding: 14,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: "#10B981",
  },
  explanationTitle: {
    fontWeight: "600",
    marginBottom: 6,
  },
  explanationText: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 20,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  validateButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  validateButtonDisabled: {
    backgroundColor: "#94a3b8",
  },
  validateButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  nextButton: {
    backgroundColor: "#10B981",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  nextButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  scoreCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 16,
  },
  scorePercentage: {
    color: "white",
    fontSize: 24,
    fontWeight: "700",
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0f172a",
    textAlign: "center",
    marginBottom: 8,
  },
  resultSubtitle: {
    fontSize: 14,
    color: "#64748b",
    textAlign: "center",
    marginBottom: 16,
  },
  answersGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 8,
    marginBottom: 16,
  },
  answerDot: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  restartButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  restartButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  exerciseContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: "#e2e8f0",
  },
  exerciseQuestion: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0f172a",
    marginBottom: 12,
  },
  exerciseInputRow: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  exerciseInput: {
    flex: 1,
    minWidth: 150,
    backgroundColor: "#f8fafc",
    borderWidth: 2,
    borderColor: "#e2e8f0",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
    fontFamily: "monospace",
  },
  exerciseButtons: {
    flexDirection: "row",
    gap: 8,
  },
  exerciseCheckButton: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  exerciseCheckButtonDisabled: {
    backgroundColor: "#94a3b8",
  },
  exerciseCheckButtonText: {
    color: "white",
    fontWeight: "600",
  },
  exerciseHintButton: {
    backgroundColor: "white",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#e2e8f0",
  },
  exerciseHintButtonText: {
    color: "#64748b",
    fontWeight: "600",
  },
  exerciseResetButton: {
    backgroundColor: "white",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#e2e8f0",
  },
  exerciseResetButtonText: {
    color: "#64748b",
    fontWeight: "600",
  },
  hintBox: {
    marginTop: 12,
    backgroundColor: "#fef3c7",
    borderRadius: 8,
    padding: 12,
  },
  hintText: {
    fontSize: 14,
    color: "#92400e",
  },
  resultBox: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
  },
  resultIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  resultText: {
    fontWeight: "500",
  },
});
