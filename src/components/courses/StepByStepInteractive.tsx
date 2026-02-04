import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";
import { colors } from "../theme";

interface Step {
  title: string;
  content: string;
  highlight?: string;
}

interface StepByStepProps {
  title: string;
  steps: Step[];
  autoPlay?: boolean;
  speed?: number;
}

export function StepByStep({
  title,
  steps,
  autoPlay = false,
  speed = 2000,
}: StepByStepProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isPlaying && currentStep < steps.length) {
      const timer = setTimeout(() => {
        setCompletedSteps((prev) => [...prev, currentStep]);
        if (currentStep < steps.length - 1) {
          animateStep();
          setCurrentStep((prev) => prev + 1);
        } else {
          setIsPlaying(false);
        }
      }, speed);
      return () => clearTimeout(timer);
    }
  }, [isPlaying, currentStep, steps.length, speed]);

  const animateStep = () => {
    slideAnim.setValue(20);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const goToStep = (index: number) => {
    setCurrentStep(index);
    setIsPlaying(false);
    animateStep();
  };

  const play = () => {
    if (currentStep >= steps.length - 1) {
      setCurrentStep(0);
      setCompletedSteps([]);
    }
    setIsPlaying(true);
  };

  const pause = () => setIsPlaying(false);

  const reset = () => {
    setCurrentStep(0);
    setCompletedSteps([]);
    setIsPlaying(false);
  };

  const step = steps[currentStep];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.headerIcon}>
            <Text style={styles.headerIconText}>▶</Text>
          </View>
          <Text style={styles.headerTitle}>{title}</Text>
        </View>
        <View style={styles.headerActions}>
          {isPlaying ? (
            <TouchableOpacity onPress={pause} style={styles.pauseButton}>
              <Text style={styles.pauseButtonText}>⏸ Pause</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={play} style={styles.playButton}>
              <Text style={styles.playButtonText}>
                ▶ {currentStep >= steps.length - 1 ? "Rejouer" : "Lancer"}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.stepsIndicator}>
        {steps.map((s, i) => (
          <TouchableOpacity
            key={i}
            onPress={() => goToStep(i)}
            style={[
              styles.stepDot,
              i === currentStep && styles.stepDotActive,
              completedSteps.includes(i) && styles.stepDotCompleted,
            ]}
          >
            <Text
              style={[
                styles.stepDotText,
                (i === currentStep || completedSteps.includes(i)) && { color: "white" },
              ]}
            >
              {i + 1}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Animated.View
        style={[
          styles.stepContent,
          { transform: [{ translateX: slideAnim }] },
        ]}
      >
        <View style={styles.stepBadge}>
          <Text style={styles.stepBadgeText}>
            Étape {currentStep + 1}/{steps.length}
          </Text>
        </View>
        <Text style={styles.stepTitle}>{step.title}</Text>
        <Text style={styles.stepText}>{step.content}</Text>
        {step.highlight && (
          <View style={styles.highlightBox}>
            <Text style={styles.highlightText}>{step.highlight}</Text>
          </View>
        )}
      </Animated.View>

      <View style={styles.navigation}>
        <TouchableOpacity
          onPress={() => currentStep > 0 && goToStep(currentStep - 1)}
          disabled={currentStep === 0}
          style={[styles.navButton, currentStep === 0 && styles.navButtonDisabled]}
        >
          <Text
            style={[
              styles.navButtonText,
              currentStep === 0 && styles.navButtonTextDisabled,
            ]}
          >
            ← Précédent
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => currentStep < steps.length - 1 && goToStep(currentStep + 1)}
          disabled={currentStep === steps.length - 1}
          style={[
            styles.navButtonNext,
            currentStep === steps.length - 1 && styles.navButtonDisabled,
          ]}
        >
          <Text
            style={[
              styles.navButtonNextText,
              currentStep === steps.length - 1 && styles.navButtonTextDisabled,
            ]}
          >
            Suivant →
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#eff6ff",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#bfdbfe",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  headerIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#3B82F6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  headerIconText: {
    color: "white",
    fontSize: 14,
    fontWeight: "700",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1e40af",
    flex: 1,
  },
  headerActions: {
    flexDirection: "row",
    gap: 8,
  },
  playButton: {
    backgroundColor: "#3B82F6",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  playButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },
  pauseButton: {
    backgroundColor: "#F59E0B",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  pauseButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },
  stepsIndicator: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  stepDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#e2e8f0",
    justifyContent: "center",
    alignItems: "center",
  },
  stepDotActive: {
    backgroundColor: "#3B82F6",
    transform: [{ scale: 1.15 }],
  },
  stepDotCompleted: {
    backgroundColor: "#10B981",
  },
  stepDotText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#64748b",
  },
  stepContent: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  stepBadge: {
    backgroundColor: "#3B82F6",
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 12,
  },
  stepBadgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 8,
  },
  stepText: {
    fontSize: 14,
    lineHeight: 22,
    color: "#374151",
  },
  highlightBox: {
    marginTop: 12,
    backgroundColor: "#0f172a",
    borderRadius: 8,
    padding: 12,
  },
  highlightText: {
    fontFamily: "monospace",
    fontSize: 14,
    fontWeight: "600",
    color: "#10B981",
    textAlign: "center",
  },
  navigation: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  navButton: {
    backgroundColor: "white",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#e2e8f0",
  },
  navButtonDisabled: {
    backgroundColor: "#f1f5f9",
  },
  navButtonText: {
    color: "#374151",
    fontWeight: "600",
    fontSize: 14,
  },
  navButtonTextDisabled: {
    color: "#94a3b8",
  },
  navButtonNext: {
    backgroundColor: "#3B82F6",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  navButtonNextText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },
});
