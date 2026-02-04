import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors, spacing, borderRadius, fontSize, fontWeight } from "../components/theme";
import { COURSES, getCourseById, getTotalLessons, type Course, type Lesson, type LessonContent } from "../lib/courses";
import {
  MatrixDisplay,
  MatrixCalculator,
  TruthTable,
  LogicGateVisualizer,
  BaseConverter,
  BinaryVisualizer,
  QuickQuiz,
  MiniExercise,
  StepByStep,
} from "../components/courses";

type ViewMode = "list" | "course" | "lesson";

export default function CoursesScreen() {
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  const handleSelectCourse = (course: Course) => {
    setSelectedCourse(course);
    setViewMode("course");
  };

  const handleSelectLesson = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setViewMode("lesson");
  };

  const handleBack = () => {
    if (viewMode === "lesson") {
      setViewMode("course");
      setSelectedLesson(null);
    } else if (viewMode === "course") {
      setViewMode("list");
      setSelectedCourse(null);
    }
  };

  if (viewMode === "lesson" && selectedCourse && selectedLesson) {
    return (
      <LessonView
        course={selectedCourse}
        lesson={selectedLesson}
        onBack={handleBack}
        onNextLesson={() => {
          const currentIndex = selectedCourse.lessons.findIndex(l => l.id === selectedLesson.id);
          if (currentIndex < selectedCourse.lessons.length - 1) {
            setSelectedLesson(selectedCourse.lessons[currentIndex + 1]);
          }
        }}
      />
    );
  }

  if (viewMode === "course" && selectedCourse) {
    return (
      <CourseView
        course={selectedCourse}
        onBack={handleBack}
        onSelectLesson={handleSelectLesson}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={["#0f0f0f", "#1a1a1a"]}
          style={styles.header}
        >
          <Text style={styles.headerTitle}>📚 Cours</Text>
          <Text style={styles.headerSubtitle}>
            Maîtrisez toutes les notions du programme BTS SIO
          </Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{COURSES.length}</Text>
              <Text style={styles.statLabel}>Matières</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{getTotalLessons()}</Text>
              <Text style={styles.statLabel}>Leçons</Text>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Toutes les matières</Text>
          {COURSES.map((course) => (
            <TouchableOpacity
              key={course.id}
              style={styles.courseCard}
              onPress={() => handleSelectCourse(course)}
              activeOpacity={0.7}
            >
              <View style={[styles.courseIcon, { backgroundColor: course.color }]}>
                <Text style={styles.courseIconText}>{course.icon}</Text>
              </View>
              <View style={styles.courseInfo}>
                <Text style={styles.courseName}>{course.name}</Text>
                <Text style={styles.courseDesc}>{course.description}</Text>
                <View style={styles.courseMeta}>
                  <Text style={styles.courseMetaText}>
                    📖 {course.lessons.length} leçons
                  </Text>
                  <Text style={styles.courseMetaText}>
                    ⏱️ {course.lessons.reduce((sum, l) => sum + l.duration, 0)} min
                  </Text>
                </View>
              </View>
              <Text style={[styles.courseArrow, { color: course.color }]}>→</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function CourseView({
  course,
  onBack,
  onSelectLesson,
}: {
  course: Course;
  onBack: () => void;
  onSelectLesson: (lesson: Lesson) => void;
}) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.navHeader}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Retour</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={[course.color, course.color + "cc"]}
          style={styles.courseHeader}
        >
          <Text style={styles.courseHeaderIcon}>{course.icon}</Text>
          <Text style={styles.courseHeaderTitle}>{course.name}</Text>
          <Text style={styles.courseHeaderDesc}>{course.description}</Text>
          <View style={styles.courseHeaderMeta}>
            <Text style={styles.courseHeaderMetaText}>
              {course.lessons.length} leçons • {course.lessons.reduce((sum, l) => sum + l.duration, 0)} min
            </Text>
          </View>
        </LinearGradient>

        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Programme du cours</Text>
          {course.lessons.map((lesson, index) => (
            <TouchableOpacity
              key={lesson.id}
              style={styles.lessonCard}
              onPress={() => onSelectLesson(lesson)}
              activeOpacity={0.7}
            >
              <View style={styles.lessonNumber}>
                <Text style={styles.lessonNumberText}>{index + 1}</Text>
              </View>
              <View style={styles.lessonInfo}>
                <Text style={styles.lessonTitle}>{lesson.title}</Text>
                <Text style={styles.lessonMeta}>
                  ⏱️ {lesson.duration} min • 📝 {lesson.content.length} notions
                </Text>
              </View>
              <Text style={styles.lessonArrow}>→</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function LessonView({
  course,
  lesson,
  onBack,
  onNextLesson,
}: {
  course: Course;
  lesson: Lesson;
  onBack: () => void;
  onNextLesson: () => void;
}) {
  const currentIndex = course.lessons.findIndex(l => l.id === lesson.id);
  const hasNext = currentIndex < course.lessons.length - 1;

  const getContentStyle = (type: string) => {
    switch (type) {
      case "definition":
        return { borderColor: course.color, backgroundColor: "#f8fafc" };
      case "theorem":
        return { borderColor: "#f59e0b", backgroundColor: "#fef3c7" };
      case "property":
        return { borderColor: "#3b82f6", backgroundColor: "#dbeafe" };
      case "example":
        return { borderColor: "#10b981", backgroundColor: "#f0fdf4" };
      case "method":
        return { borderColor: "#a855f7", backgroundColor: "#fae8ff" };
      case "warning":
        return { borderColor: "#ef4444", backgroundColor: "#fef2f2" };
      case "formula":
        return { borderColor: "#0f0f0f", backgroundColor: "#0f0f0f" };
      case "interactive":
        return { borderColor: colors.primary, backgroundColor: "#fff7ed" };
      default:
        return { borderColor: "#e5e5e5", backgroundColor: "#f8fafc" };
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "definition": return "📘 Définition";
      case "theorem": return "📐 Théorème";
      case "property": return "📋 Propriété";
      case "example": return "💡 Exemple";
      case "method": return "🔧 Méthode";
      case "warning": return "⚠️ Attention";
      case "formula": return "📝 Formule";
      case "interactive": return "🎮 Interactif";
      default: return "📄 Note";
    }
  };

  const renderInteractiveContent = (item: LessonContent) => {
    if (item.type !== "interactive" || !item.interactive) return null;

    const interactiveData = item.interactive;

    switch (interactiveData.type) {
      case "matrix_display":
        return (
          <MatrixDisplay
            matrix={interactiveData.matrix || [[0]]}
            label={interactiveData.label}
          />
        );
      case "matrix_calculator":
        const matrixMode = interactiveData.mode as "add" | "multiply" | "determinant" | "transpose" | undefined;
        return (
          <MatrixCalculator
            mode={matrixMode || "add"}
            matrixA={interactiveData.matrixA}
            matrixB={interactiveData.matrixB}
          />
        );
      case "truth_table":
        return (
          <TruthTable
            variables={interactiveData.variables || ["A", "B"]}
            expression={interactiveData.expression || "A ET B"}
            interactive={interactiveData.interactive}
          />
        );
      case "logic_gate":
        const gateType = interactiveData.gate as "AND" | "OR" | "NOT" | "XOR" | "NAND" | "NOR" | undefined;
        return (
          <LogicGateVisualizer
            gate={gateType || "AND"}
            inputs={interactiveData.inputs || [true, false]}
          />
        );
      case "base_converter":
        const baseMode = interactiveData.mode as "full" | "binary" | "hex" | undefined;
        return <BaseConverter mode={baseMode || "full"} />;
      case "binary_visualizer":
        return <BinaryVisualizer value={interactiveData.value || 42} bits={interactiveData.bits || 8} />;
      case "quick_quiz":
        return (
          <QuickQuiz
            questions={interactiveData.questions || []}
            title={interactiveData.title}
          />
        );
      case "mini_exercise":
        return (
          <MiniExercise
            question={interactiveData.question || ""}
            answer={interactiveData.answer || ""}
            hint={interactiveData.hint}
            inputType={interactiveData.inputType}
          />
        );
      case "step_by_step":
        return (
          <StepByStep
            title={interactiveData.title || "Étapes"}
            steps={interactiveData.steps || []}
            autoPlay={interactiveData.autoPlay}
            speed={interactiveData.speed}
          />
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.navHeader}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← {course.name}</Text>
        </TouchableOpacity>
        <Text style={styles.lessonProgress}>
          {currentIndex + 1}/{course.lessons.length}
        </Text>
      </View>

      <View style={[styles.progressBar, { backgroundColor: "#e5e5e5" }]}>
        <View
          style={[
            styles.progressFill,
            {
              backgroundColor: course.color,
              width: `${((currentIndex + 1) / course.lessons.length) * 100}%`,
            },
          ]}
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.lessonContent}>
        <View style={[styles.lessonBadge, { backgroundColor: course.color }]}>
          <Text style={styles.lessonBadgeText}>Leçon {currentIndex + 1}</Text>
        </View>
        <Text style={styles.lessonViewTitle}>{lesson.title}</Text>
        <Text style={styles.lessonDuration}>⏱️ {lesson.duration} min de lecture</Text>

        {lesson.content.map((item, index) => {
          const contentStyle = getContentStyle(item.type);
          const isFormula = item.type === "formula";
          const isInteractive = item.type === "interactive";

          return (
            <View
              key={index}
              style={[
                styles.contentCard,
                {
                  borderLeftColor: contentStyle.borderColor,
                  backgroundColor: contentStyle.backgroundColor,
                },
                isInteractive && styles.interactiveCard,
              ]}
            >
              <Text style={[styles.contentType, isFormula && { color: "#a0a0a0" }]}>
                {getTypeLabel(item.type)}
              </Text>
              {item.title && (
                <Text style={[styles.contentTitle, isFormula && { color: "#ffffff" }]}>
                  {item.title}
                </Text>
              )}
              {!isInteractive && (
                <Text style={[styles.contentText, isFormula && { color: "#e0e0e0" }]}>
                  {item.content}
                </Text>
              )}
              {isInteractive && renderInteractiveContent(item)}
              {item.formula && (
                <View style={styles.formulaBox}>
                  <Text style={styles.formulaText}>{item.formula}</Text>
                </View>
              )}
            </View>
          );
        })}

        <View style={styles.lessonFooter}>
          {hasNext && (
            <TouchableOpacity
              style={[styles.nextButton, { backgroundColor: course.color }]}
              onPress={onNextLesson}
            >
              <Text style={styles.nextButtonText}>Leçon suivante →</Text>
            </TouchableOpacity>
          )}
          {!hasNext && (
            <View style={styles.completedBox}>
              <Text style={styles.completedIcon}>✅</Text>
              <Text style={styles.completedText}>Cours terminé !</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: spacing.lg,
    paddingTop: spacing.xl,
  },
  headerTitle: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.extrabold,
    color: "#ffffff",
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    fontSize: fontSize.md,
    color: "#a0a0a0",
    marginBottom: spacing.lg,
  },
  statsRow: {
    flexDirection: "row",
    gap: spacing.xl,
  },
  statItem: {},
  statValue: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.extrabold,
    color: colors.primary,
  },
  statLabel: {
    fontSize: fontSize.sm,
    color: "#666666",
  },
  content: {
    padding: spacing.md,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  courseCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  courseIcon: {
    width: 50,
    height: 50,
    borderRadius: borderRadius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  courseIconText: {
    fontSize: fontSize.xl,
    color: "#ffffff",
  },
  courseInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  courseName: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  courseDesc: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  courseMeta: {
    flexDirection: "row",
    gap: spacing.md,
    marginTop: spacing.xs,
  },
  courseMetaText: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
  },
  courseArrow: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
  },
  navHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: spacing.xs,
  },
  backButtonText: {
    fontSize: fontSize.md,
    color: colors.primary,
    fontWeight: fontWeight.semibold,
  },
  courseHeader: {
    padding: spacing.xl,
    alignItems: "center",
  },
  courseHeaderIcon: {
    fontSize: 60,
    marginBottom: spacing.sm,
  },
  courseHeaderTitle: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.extrabold,
    color: "#ffffff",
    textAlign: "center",
  },
  courseHeaderDesc: {
    fontSize: fontSize.md,
    color: "rgba(255,255,255,0.9)",
    textAlign: "center",
    marginTop: spacing.xs,
  },
  courseHeaderMeta: {
    marginTop: spacing.md,
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  courseHeaderMetaText: {
    fontSize: fontSize.sm,
    color: "#ffffff",
    fontWeight: fontWeight.semibold,
  },
  lessonCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  lessonNumber: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.sm,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "center",
  },
  lessonNumberText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.textSecondary,
  },
  lessonInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  lessonTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text,
  },
  lessonMeta: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    marginTop: 4,
  },
  lessonArrow: {
    fontSize: fontSize.lg,
    color: colors.textMuted,
  },
  lessonProgress: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    fontWeight: fontWeight.semibold,
  },
  progressBar: {
    height: 3,
  },
  progressFill: {
    height: "100%",
  },
  lessonContent: {
    flex: 1,
    padding: spacing.md,
  },
  lessonBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.sm,
  },
  lessonBadgeText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    color: "#ffffff",
    textTransform: "uppercase",
  },
  lessonViewTitle: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.extrabold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  lessonDuration: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    marginBottom: spacing.lg,
  },
  contentCard: {
    padding: spacing.md,
    marginBottom: spacing.md,
    borderLeftWidth: 4,
    borderRadius: borderRadius.sm,
  },
  interactiveCard: {
    borderLeftWidth: 0,
    borderWidth: 1,
    borderColor: colors.primary,
    padding: spacing.sm,
    backgroundColor: "transparent",
  },
  contentType: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    color: "#666666",
    marginBottom: spacing.xs,
  },
  contentTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  contentText: {
    fontSize: fontSize.md,
    lineHeight: 24,
    color: "#374151",
  },
  formulaBox: {
    backgroundColor: "#1a1a1a",
    padding: spacing.md,
    borderRadius: borderRadius.sm,
    marginTop: spacing.sm,
    alignItems: "center",
  },
  formulaText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: "#10b981",
    fontFamily: "monospace",
  },
  lessonFooter: {
    marginTop: spacing.xl,
    marginBottom: spacing.xxl,
  },
  nextButton: {
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: "center",
  },
  nextButtonText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: "#ffffff",
  },
  completedBox: {
    backgroundColor: "#f0fdf4",
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#bbf7d0",
  },
  completedIcon: {
    fontSize: 48,
    marginBottom: spacing.sm,
  },
  completedText: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: "#166534",
  },
});
