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

interface BaseConverterProps {
  mode?: "full" | "binary" | "hex";
}

export function BaseConverter({ mode = "full" }: BaseConverterProps) {
  const [inputValue, setInputValue] = useState("42");
  const [inputBase, setInputBase] = useState(10);
  const [showSteps, setShowSteps] = useState(false);

  const bases = mode === "full"
    ? [2, 8, 10, 16]
    : mode === "binary"
    ? [2, 10]
    : [2, 10, 16];

  const baseNames: Record<number, string> = {
    2: "Binaire",
    8: "Octal",
    10: "Décimal",
    16: "Hexa",
  };

  const baseColors: Record<number, string> = {
    2: "#3B82F6",
    8: "#10B981",
    10: "#8B5CF6",
    16: "#F59E0B",
  };

  const parseValue = (val: string, base: number): number => {
    return parseInt(val, base);
  };

  const convertTo = (decimal: number, base: number): string => {
    if (isNaN(decimal)) return "Erreur";
    return decimal.toString(base).toUpperCase();
  };

  const getConversionSteps = (decimal: number, targetBase: number): string[] => {
    if (isNaN(decimal) || decimal < 0) return ["Valeur invalide"];
    if (decimal === 0) return ["0 = 0"];

    const steps: string[] = [];
    let current = decimal;
    const digits: string[] = [];

    while (current > 0) {
      const remainder = current % targetBase;
      const quotient = Math.floor(current / targetBase);
      const digitStr = remainder >= 10 ? String.fromCharCode(55 + remainder) : remainder.toString();
      digits.unshift(digitStr);
      steps.push(`${current} ÷ ${targetBase} = ${quotient} reste ${digitStr}`);
      current = quotient;
    }

    steps.push(`Résultat : ${digits.join("")}`);
    return steps;
  };

  const decimalValue = parseValue(inputValue, inputBase);
  const steps = getConversionSteps(decimalValue, 2);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <Text style={styles.headerIconText}>#</Text>
        </View>
        <View>
          <Text style={styles.headerTitle}>Convertisseur de bases</Text>
          <Text style={styles.headerSubtitle}>Conversion instantanée</Text>
        </View>
      </View>

      <View style={styles.inputSection}>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.valueInput}
            value={inputValue}
            onChangeText={(text) => setInputValue(text.toUpperCase())}
            placeholder="42"
            placeholderTextColor="#94a3b8"
            autoCapitalize="characters"
          />
        </View>

        <Text style={styles.baseLabel}>Base d'entrée</Text>
        <View style={styles.baseButtons}>
          {bases.map((base) => (
            <TouchableOpacity
              key={base}
              onPress={() => setInputBase(base)}
              style={[
                styles.baseButton,
                inputBase === base && { backgroundColor: baseColors[base], borderColor: baseColors[base] },
              ]}
            >
              <Text
                style={[
                  styles.baseButtonText,
                  inputBase === base && { color: "white" },
                ]}
              >
                {base}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.resultsGrid}>
        {bases.map((base) => {
          const result = convertTo(decimalValue, base);
          const isInput = base === inputBase;

          return (
            <View
              key={base}
              style={[
                styles.resultCard,
                isInput && { borderColor: baseColors[base], borderWidth: 2, backgroundColor: baseColors[base] + "10" },
              ]}
            >
              <Text style={[styles.resultLabel, { color: baseColors[base] }]}>
                Base {base} - {baseNames[base]}
              </Text>
              <Text style={styles.resultValue}>{result}</Text>
              {base === 2 && result !== "Erreur" && (
                <View style={styles.bitsRow}>
                  {result.split("").map((bit, i) => (
                    <View
                      key={i}
                      style={[
                        styles.bitBox,
                        { backgroundColor: bit === "1" ? "#3B82F6" : "#f1f5f9" },
                      ]}
                    >
                      <Text
                        style={[
                          styles.bitText,
                          { color: bit === "1" ? "white" : "#64748b" },
                        ]}
                      >
                        {bit}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          );
        })}
      </View>

      <TouchableOpacity
        onPress={() => setShowSteps(!showSteps)}
        style={[styles.stepsButton, showSteps && styles.stepsButtonActive]}
      >
        <Text style={[styles.stepsButtonText, showSteps && styles.stepsButtonTextActive]}>
          {showSteps ? "Masquer les étapes" : "Voir les étapes → binaire"}
        </Text>
      </TouchableOpacity>

      {showSteps && (
        <View style={styles.stepsContainer}>
          <Text style={styles.stepsTitle}>
            Conversion de {decimalValue} en base 2 :
          </Text>
          {steps.map((step, i) => (
            <View key={i} style={[styles.step, i === steps.length - 1 && styles.stepFinal]}>
              <Text style={styles.stepText}>{step}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

interface BinaryVisualizerProps {
  value: number;
  bits?: number;
}

export function BinaryVisualizer({ value, bits = 8 }: BinaryVisualizerProps) {
  const binary = value.toString(2).padStart(bits, "0");
  const [selectedBit, setSelectedBit] = useState<number | null>(null);

  return (
    <View style={styles.binaryContainer}>
      <Text style={styles.binaryTitle}>
        {value} en binaire ({bits} bits)
      </Text>

      <View style={styles.binaryBitsRow}>
        {binary.split("").map((bit, i) => {
          const power = bits - 1 - i;
          const bitValue = bit === "1" ? Math.pow(2, power) : 0;
          const isSelected = selectedBit === i;

          return (
            <TouchableOpacity
              key={i}
              onPress={() => setSelectedBit(isSelected ? null : i)}
              style={styles.bitContainer}
            >
              <Text style={[styles.bitPower, isSelected && { color: "#3B82F6" }]}>
                2^{power}
              </Text>
              <View
                style={[
                  styles.bitCell,
                  { backgroundColor: bit === "1" ? "#3B82F6" : "#f1f5f9" },
                  isSelected && styles.bitCellSelected,
                ]}
              >
                <Text
                  style={[
                    styles.bitCellText,
                    { color: bit === "1" ? "white" : "#94a3b8" },
                  ]}
                >
                  {bit}
                </Text>
              </View>
              {isSelected && (
                <Text style={styles.bitValueText}>= {bitValue}</Text>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={styles.binarySum}>
        = {binary.split("").map((bit, i) => bit === "1" ? Math.pow(2, bits - 1 - i) : 0).filter(v => v > 0).join(" + ")} = {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fffbeb",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#fcd34d",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#F59E0B",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  headerIconText: {
    color: "white",
    fontSize: 20,
    fontWeight: "700",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#92400e",
  },
  headerSubtitle: {
    fontSize: 12,
    color: "#b45309",
  },
  inputSection: {
    marginBottom: 16,
  },
  inputRow: {
    marginBottom: 12,
  },
  valueInput: {
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: "#fcd34d",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 20,
    fontWeight: "700",
    fontFamily: "monospace",
    color: "#0f172a",
  },
  baseLabel: {
    fontSize: 12,
    color: "#92400e",
    fontWeight: "600",
    marginBottom: 8,
  },
  baseButtons: {
    flexDirection: "row",
    gap: 8,
  },
  baseButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#e2e8f0",
    backgroundColor: "white",
  },
  baseButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#64748b",
  },
  resultsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 16,
  },
  resultCard: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  resultLabel: {
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  resultValue: {
    fontSize: 18,
    fontWeight: "700",
    fontFamily: "monospace",
    color: "#0f172a",
  },
  bitsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 2,
    marginTop: 8,
  },
  bitBox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  bitText: {
    fontSize: 11,
    fontWeight: "600",
  },
  stepsButton: {
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: "#F59E0B",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  stepsButtonActive: {
    backgroundColor: "#F59E0B",
  },
  stepsButtonText: {
    color: "#92400e",
    fontWeight: "600",
    fontSize: 14,
  },
  stepsButtonTextActive: {
    color: "white",
  },
  stepsContainer: {
    marginTop: 16,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: "#fcd34d",
  },
  stepsTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#92400e",
    marginBottom: 12,
  },
  step: {
    backgroundColor: "#f8fafc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: "transparent",
  },
  stepFinal: {
    borderLeftColor: "#F59E0B",
    backgroundColor: "#fef3c7",
  },
  stepText: {
    fontFamily: "monospace",
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
  },
  binaryContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: "#e2e8f0",
    alignItems: "center",
  },
  binaryTitle: {
    fontSize: 14,
    color: "#64748b",
    fontWeight: "600",
    marginBottom: 12,
  },
  binaryBitsRow: {
    flexDirection: "row",
    gap: 4,
  },
  bitContainer: {
    alignItems: "center",
  },
  bitPower: {
    fontSize: 10,
    color: "#94a3b8",
    fontWeight: "500",
    marginBottom: 4,
  },
  bitCell: {
    width: 32,
    height: 40,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  bitCellSelected: {
    transform: [{ scale: 1.1 }],
  },
  bitCellText: {
    fontSize: 16,
    fontWeight: "700",
  },
  bitValueText: {
    fontSize: 10,
    color: "#3B82F6",
    fontWeight: "600",
    marginTop: 4,
  },
  binarySum: {
    marginTop: 12,
    fontSize: 14,
    color: "#64748b",
  },
});
