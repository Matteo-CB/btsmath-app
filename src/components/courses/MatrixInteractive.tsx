import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";
import { colors } from "../theme";

interface MatrixDisplayProps {
  matrix: number[][];
  highlight?: [number, number][];
  label?: string;
  editable?: boolean;
  onChange?: (matrix: number[][]) => void;
  color?: string;
}

export function MatrixDisplay({
  matrix,
  highlight = [],
  label,
  editable = false,
  onChange,
  color = colors.primary,
}: MatrixDisplayProps) {
  const [values, setValues] = useState(matrix);
  const [animations] = useState(() =>
    matrix.map(row => row.map(() => new Animated.Value(0)))
  );

  useEffect(() => {
    setValues(matrix);
  }, [matrix]);

  useEffect(() => {
    if (highlight.length > 0) {
      animations.flat().forEach(anim => anim.setValue(0));
      highlight.forEach(([i, j], index) => {
        setTimeout(() => {
          Animated.spring(animations[i][j], {
            toValue: 1,
            useNativeDriver: true,
            tension: 100,
            friction: 8,
          }).start();
        }, index * 200);
      });
    }
  }, [highlight]);

  const handleChange = (i: number, j: number, val: string) => {
    const num = parseFloat(val) || 0;
    const newValues = values.map((row, ri) =>
      row.map((cell, ci) => (ri === i && ci === j ? num : cell))
    );
    setValues(newValues);
    onChange?.(newValues);
  };

  const isHighlighted = (i: number, j: number) =>
    highlight.some(([hi, hj]) => hi === i && hj === j);

  return (
    <View style={styles.matrixContainer}>
      {label && <Text style={[styles.matrixLabel, { color }]}>{label}</Text>}
      <View style={styles.matrixContent}>
        <Text style={styles.bracket}>(</Text>
        <View style={styles.matrixGrid}>
          {values.map((row, i) => (
            <View key={i} style={styles.matrixRow}>
              {row.map((cell, j) => {
                const highlighted = isHighlighted(i, j);
                const scale = animations[i]?.[j]?.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 1.15],
                }) || 1;

                return (
                  <Animated.View
                    key={j}
                    style={[
                      styles.matrixCell,
                      highlighted && { borderColor: color, borderWidth: 2, backgroundColor: color + "20" },
                      { transform: [{ scale }] },
                    ]}
                  >
                    {editable ? (
                      <TextInput
                        style={styles.matrixInput}
                        value={String(cell)}
                        onChangeText={(val) => handleChange(i, j, val)}
                        keyboardType="numeric"
                        textAlign="center"
                      />
                    ) : (
                      <Text style={styles.matrixCellText}>{cell}</Text>
                    )}
                  </Animated.View>
                );
              })}
            </View>
          ))}
        </View>
        <Text style={styles.bracket}>)</Text>
      </View>
    </View>
  );
}

interface MatrixCalculatorProps {
  mode: "add" | "multiply" | "determinant" | "transpose";
  matrixA?: number[][];
  matrixB?: number[][];
}

export function MatrixCalculator({
  mode,
  matrixA: initialA,
  matrixB: initialB,
}: MatrixCalculatorProps) {
  const [matrixA, setMatrixA] = useState(initialA || [[1, 2], [3, 4]]);
  const [matrixB, setMatrixB] = useState(initialB || [[5, 6], [7, 8]]);
  const [result, setResult] = useState<number[][] | number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [highlightA, setHighlightA] = useState<[number, number][]>([]);
  const [highlightB, setHighlightB] = useState<[number, number][]>([]);

  const calculate = () => {
    setShowResult(false);

    setTimeout(() => {
      let res: number[][] | number;

      if (mode === "add") {
        res = matrixA.map((row, i) => row.map((val, j) => val + matrixB[i][j]));
      } else if (mode === "multiply") {
        const rowsA = matrixA.length;
        const colsA = matrixA[0].length;
        const colsB = matrixB[0].length;
        res = Array(rowsA).fill(0).map(() => Array(colsB).fill(0));
        for (let i = 0; i < rowsA; i++) {
          for (let j = 0; j < colsB; j++) {
            for (let k = 0; k < colsA; k++) {
              (res as number[][])[i][j] += matrixA[i][k] * matrixB[k][j];
            }
          }
        }
      } else if (mode === "determinant") {
        if (matrixA.length === 2) {
          res = matrixA[0][0] * matrixA[1][1] - matrixA[0][1] * matrixA[1][0];
        } else {
          res = matrixA[0][0] * (matrixA[1][1] * matrixA[2][2] - matrixA[1][2] * matrixA[2][1])
              - matrixA[0][1] * (matrixA[1][0] * matrixA[2][2] - matrixA[1][2] * matrixA[2][0])
              + matrixA[0][2] * (matrixA[1][0] * matrixA[2][1] - matrixA[1][1] * matrixA[2][0]);
        }
      } else {
        res = matrixA[0].map((_, i) => matrixA.map(row => row[i]));
      }

      setResult(res);
      setShowResult(true);
    }, 300);
  };

  const modeLabels: Record<string, string> = {
    add: "Addition",
    multiply: "Multiplication",
    determinant: "Déterminant",
    transpose: "Transposée",
  };

  return (
    <View style={styles.calculatorContainer}>
      <View style={styles.calculatorHeader}>
        <View style={styles.calculatorIcon}>
          <Text style={styles.calculatorIconText}>▦</Text>
        </View>
        <View>
          <Text style={styles.calculatorTitle}>Calculateur - {modeLabels[mode]}</Text>
          <Text style={styles.calculatorSubtitle}>Modifiez les valeurs et calculez</Text>
        </View>
      </View>

      <View style={styles.matricesRow}>
        <MatrixDisplay
          matrix={matrixA}
          label="A"
          editable
          onChange={setMatrixA}
          highlight={highlightA}
          color="#3B82F6"
        />

        {(mode === "add" || mode === "multiply") && (
          <>
            <Text style={styles.operatorText}>{mode === "add" ? "+" : "×"}</Text>
            <MatrixDisplay
              matrix={matrixB}
              label="B"
              editable
              onChange={setMatrixB}
              highlight={highlightB}
              color="#10B981"
            />
          </>
        )}
      </View>

      {showResult && (
        <View style={styles.resultContainer}>
          <Text style={styles.equalsText}>=</Text>
          {typeof result === "number" ? (
            <View style={styles.scalarResult}>
              <Text style={styles.scalarResultText}>{result}</Text>
            </View>
          ) : result && (
            <MatrixDisplay matrix={result} label="Résultat" color={colors.primary} />
          )}
        </View>
      )}

      <TouchableOpacity style={styles.calculateButton} onPress={calculate}>
        <Text style={styles.calculateButtonText}>Calculer</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  matrixContainer: {
    alignItems: "center",
    marginVertical: 8,
  },
  matrixLabel: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
  },
  matrixContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  bracket: {
    fontSize: 48,
    fontWeight: "100",
    color: "#666",
  },
  matrixGrid: {
    marginHorizontal: 4,
  },
  matrixRow: {
    flexDirection: "row",
  },
  matrixCell: {
    width: 48,
    height: 44,
    margin: 2,
    borderRadius: 8,
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    justifyContent: "center",
    alignItems: "center",
  },
  matrixCellText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0f172a",
  },
  matrixInput: {
    width: "100%",
    height: "100%",
    fontSize: 16,
    fontWeight: "600",
    color: "#0f172a",
  },
  calculatorContainer: {
    backgroundColor: "#f8fafc",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  calculatorHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  calculatorIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#3B82F6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  calculatorIconText: {
    color: "white",
    fontSize: 20,
    fontWeight: "700",
  },
  calculatorTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0f172a",
  },
  calculatorSubtitle: {
    fontSize: 12,
    color: "#64748b",
  },
  matricesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  operatorText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#64748b",
  },
  resultContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  equalsText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#64748b",
  },
  scalarResult: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
  },
  scalarResultText: {
    fontSize: 28,
    fontWeight: "700",
    color: "white",
  },
  calculateButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  calculateButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
