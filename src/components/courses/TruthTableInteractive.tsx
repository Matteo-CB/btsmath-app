import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";
import { colors } from "../theme";

interface TruthTableProps {
  variables: string[];
  expression: string;
  showResult?: boolean;
  interactive?: boolean;
}

export function TruthTable({
  variables,
  expression,
  showResult = true,
  interactive = false,
}: TruthTableProps) {
  const [userAnswers, setUserAnswers] = useState<Record<string, boolean | null>>({});
  const [revealed, setRevealed] = useState(false);

  const rows = Math.pow(2, variables.length);

  const generateCombinations = () => {
    const combinations: boolean[][] = [];
    for (let i = 0; i < rows; i++) {
      const row: boolean[] = [];
      for (let j = 0; j < variables.length; j++) {
        row.push(Boolean((i >> (variables.length - 1 - j)) & 1));
      }
      combinations.push(row);
    }
    return combinations;
  };

  const evaluateExpression = (values: Record<string, boolean>, expr: string): boolean => {
    let result = expr;
    Object.keys(values).forEach((key) => {
      result = result.replace(new RegExp(key, "g"), values[key] ? "1" : "0");
    });
    result = result.replace(/¬|NOT|!/gi, "!");
    result = result.replace(/∧|AND|&|\./gi, "&&");
    result = result.replace(/∨|OR|\||\+/gi, "||");
    result = result.replace(/⊕|XOR/gi, "!==");

    try {
      return eval(result) ? true : false;
    } catch {
      return false;
    }
  };

  const combinations = generateCombinations();

  const handleUserAnswer = (rowIndex: number, value: boolean) => {
    if (!interactive || revealed) return;
    setUserAnswers((prev) => ({ ...prev, [rowIndex]: value }));
  };

  const checkAnswers = () => {
    setRevealed(true);
  };

  const reset = () => {
    setUserAnswers({});
    setRevealed(false);
  };

  const getScore = () => {
    return Object.keys(userAnswers).filter((k) => {
      const values: Record<string, boolean> = {};
      variables.forEach((v, i) => {
        values[v] = combinations[parseInt(k)][i];
      });
      return userAnswers[parseInt(k)] === evaluateExpression(values, expression);
    }).length;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <Text style={styles.headerIconText}>⊕</Text>
        </View>
        <View>
          <Text style={styles.headerTitle}>Table de vérité</Text>
          <Text style={styles.headerExpression}>{expression}</Text>
        </View>
      </View>

      <View style={styles.table}>
        <View style={styles.tableHeader}>
          {variables.map((v) => (
            <View key={v} style={styles.tableHeaderCell}>
              <Text style={styles.tableHeaderText}>{v}</Text>
            </View>
          ))}
          <View style={[styles.tableHeaderCell, styles.resultHeaderCell]}>
            <Text style={styles.tableHeaderText}>{expression}</Text>
          </View>
        </View>

        {combinations.map((combo, rowIndex) => {
          const values: Record<string, boolean> = {};
          variables.forEach((v, i) => {
            values[v] = combo[i];
          });
          const correctResult = evaluateExpression(values, expression);
          const userAnswer = userAnswers[rowIndex];
          const isCorrect = userAnswer === correctResult;

          return (
            <View
              key={rowIndex}
              style={[styles.tableRow, rowIndex % 2 === 0 && styles.tableRowEven]}
            >
              {combo.map((val, i) => (
                <View key={i} style={styles.tableCell}>
                  <Text style={[styles.tableCellText, { color: val ? "#10B981" : "#ef4444" }]}>
                    {val ? "1" : "0"}
                  </Text>
                </View>
              ))}
              <View style={[styles.tableCell, styles.resultCell]}>
                {interactive && !showResult && !revealed ? (
                  <View style={styles.answerButtons}>
                    <TouchableOpacity
                      onPress={() => handleUserAnswer(rowIndex, false)}
                      style={[
                        styles.answerButton,
                        userAnswer === false && styles.answerButtonSelected,
                      ]}
                    >
                      <Text
                        style={[
                          styles.answerButtonText,
                          userAnswer === false && styles.answerButtonTextSelected,
                        ]}
                      >
                        0
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleUserAnswer(rowIndex, true)}
                      style={[
                        styles.answerButton,
                        userAnswer === true && styles.answerButtonSelected,
                      ]}
                    >
                      <Text
                        style={[
                          styles.answerButtonText,
                          userAnswer === true && styles.answerButtonTextSelected,
                        ]}
                      >
                        1
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={styles.resultDisplay}>
                    <View
                      style={[
                        styles.resultBadge,
                        { backgroundColor: correctResult ? "#dcfce7" : "#fef2f2" },
                      ]}
                    >
                      <Text
                        style={[
                          styles.resultBadgeText,
                          { color: correctResult ? "#166534" : "#dc2626" },
                        ]}
                      >
                        {correctResult ? "1" : "0"}
                      </Text>
                    </View>
                    {revealed && userAnswer !== null && userAnswer !== undefined && (
                      <Text style={{ marginLeft: 8, fontSize: 16 }}>
                        {isCorrect ? "✓" : "✗"}
                      </Text>
                    )}
                  </View>
                )}
              </View>
            </View>
          );
        })}
      </View>

      {interactive && !showResult && (
        <View style={styles.actions}>
          {!revealed ? (
            <TouchableOpacity
              onPress={checkAnswers}
              disabled={Object.keys(userAnswers).length < rows}
              style={[
                styles.checkButton,
                Object.keys(userAnswers).length < rows && styles.checkButtonDisabled,
              ]}
            >
              <Text style={styles.checkButtonText}>
                Vérifier ({Object.keys(userAnswers).length}/{rows})
              </Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.resultActions}>
              <View style={styles.scoreDisplay}>
                <Text style={styles.scoreText}>
                  Score : {getScore()}/{rows}
                </Text>
              </View>
              <TouchableOpacity onPress={reset} style={styles.resetButton}>
                <Text style={styles.resetButtonText}>Recommencer</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

interface LogicGateProps {
  gate: "AND" | "OR" | "NOT" | "XOR" | "NAND" | "NOR";
  inputs: boolean[];
}

export function LogicGateVisualizer({ gate, inputs }: LogicGateProps) {
  const [showOutput, setShowOutput] = useState(false);
  const [scaleAnim] = useState(new Animated.Value(0.8));

  const calculateOutput = () => {
    switch (gate) {
      case "AND": return inputs.every(Boolean);
      case "OR": return inputs.some(Boolean);
      case "NOT": return !inputs[0];
      case "XOR": return inputs.filter(Boolean).length % 2 === 1;
      case "NAND": return !inputs.every(Boolean);
      case "NOR": return !inputs.some(Boolean);
    }
  };

  const output = calculateOutput();

  useEffect(() => {
    setShowOutput(false);
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.8, duration: 100, useNativeDriver: true }),
      Animated.delay(300),
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, tension: 100 }),
    ]).start(() => setShowOutput(true));
  }, [inputs, gate]);

  const gateSymbols: Record<string, string> = {
    AND: "&",
    OR: "≥1",
    NOT: "1",
    XOR: "=1",
    NAND: "&",
    NOR: "≥1",
  };

  return (
    <View style={styles.gateContainer}>
      <View style={styles.gateInputs}>
        {inputs.map((input, i) => (
          <View
            key={i}
            style={[
              styles.gateInputBox,
              { backgroundColor: input ? "#10B981" : "#ef4444" },
            ]}
          >
            <Text style={styles.gateInputText}>{input ? "1" : "0"}</Text>
          </View>
        ))}
      </View>

      <View style={styles.gateBox}>
        <Text style={styles.gateSymbol}>{gateSymbols[gate]}</Text>
        {(gate === "NOT" || gate === "NAND" || gate === "NOR") && (
          <View style={styles.gateNegation} />
        )}
      </View>

      <Animated.View
        style={[
          styles.gateOutput,
          {
            backgroundColor: showOutput ? (output ? "#10B981" : "#ef4444") : "#94a3b8",
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Text style={styles.gateOutputText}>
          {showOutput ? (output ? "1" : "0") : "?"}
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#faf5ff",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e9d5ff",
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
    backgroundColor: "#8B5CF6",
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
    color: "#5b21b6",
  },
  headerExpression: {
    fontSize: 14,
    color: "#8B5CF6",
    fontFamily: "monospace",
  },
  table: {
    backgroundColor: "white",
    borderRadius: 12,
    overflow: "hidden",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#8B5CF6",
  },
  tableHeaderCell: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
  },
  resultHeaderCell: {
    backgroundColor: colors.primary,
  },
  tableHeaderText: {
    color: "white",
    fontWeight: "700",
    fontSize: 14,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e9d5ff",
  },
  tableRowEven: {
    backgroundColor: "#faf5ff",
  },
  tableCell: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  resultCell: {
    flex: 1.5,
  },
  tableCellText: {
    fontSize: 16,
    fontWeight: "600",
  },
  answerButtons: {
    flexDirection: "row",
    gap: 8,
  },
  answerButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#e2e8f0",
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  answerButtonSelected: {
    borderColor: "#8B5CF6",
    backgroundColor: "#8B5CF6",
  },
  answerButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#64748b",
  },
  answerButtonTextSelected: {
    color: "white",
  },
  resultDisplay: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  resultBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
  },
  resultBadgeText: {
    fontSize: 14,
    fontWeight: "700",
  },
  actions: {
    marginTop: 16,
  },
  checkButton: {
    backgroundColor: "#8B5CF6",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  checkButtonDisabled: {
    backgroundColor: "#94a3b8",
  },
  checkButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  resultActions: {
    flexDirection: "row",
    gap: 12,
  },
  scoreDisplay: {
    flex: 1,
    backgroundColor: "#dcfce7",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  scoreText: {
    color: "#166534",
    fontWeight: "600",
    fontSize: 16,
  },
  resetButton: {
    backgroundColor: "white",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#e2e8f0",
  },
  resetButtonText: {
    color: "#64748b",
    fontWeight: "600",
    fontSize: 16,
  },
  gateContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    backgroundColor: "white",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#e9d5ff",
  },
  gateInputs: {
    gap: 8,
  },
  gateInputBox: {
    width: 40,
    height: 32,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  gateInputText: {
    color: "white",
    fontWeight: "700",
    fontSize: 14,
  },
  gateBox: {
    width: 56,
    height: 56,
    backgroundColor: "#8B5CF6",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 16,
  },
  gateSymbol: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
  gateNegation: {
    position: "absolute",
    right: -6,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: "#8B5CF6",
  },
  gateOutput: {
    width: 50,
    height: 42,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  gateOutputText: {
    color: "white",
    fontWeight: "700",
    fontSize: 18,
  },
});
