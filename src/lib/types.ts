export interface Exercise {
  id: string;
  type: ExerciseType;
  subject: Subject;
  chapter: string;
  title: string;
  difficulty: 1 | 2 | 3;
  xpReward: number;
  data: ExerciseData;
}

export type ExerciseType =
  | "matrix_multiplication"
  | "matrix_addition"
  | "matrix_determinant"
  | "matrix_inverse"
  | "graph_dijkstra"
  | "graph_coloring"
  | "graph_path"
  | "graph_mpm"
  | "graph_pert"
  | "boolean_truth_table"
  | "boolean_simplify"
  | "boolean_expression"
  | "arithmetic_congruence"
  | "arithmetic_pgcd"
  | "arithmetic_base_conversion"
  | "set_operations"
  | "set_relations"
  | "algorithm_sort"
  | "algorithm_complexity"
  | "algorithm_trace";

export type Subject =
  | "matrices"
  | "graphes"
  | "logique"
  | "arithmetique"
  | "ensembles"
  | "algorithmique";

export interface ExerciseData {
  [key: string]: unknown;
}

export interface User {
  id: number;
  username: string;
  xp: number;
  level: number;
  streak: number;
  last_activity: string | null;
  created_at: string;
}

export interface DailyQuest {
  id: number;
  type: ExerciseType;
  description: string;
  target: number;
  current: number;
  completed: boolean;
}

export type GameMode =
  | "training"
  | "sprint"
  | "survival"
  | "duel"
  | "boss"
  | "express"
  | "exam";

export interface GameModeConfig {
  id: GameMode;
  name: string;
  description: string;
  icon: string;
  rules: GameModeRules;
}

export interface GameModeRules {
  timeLimit?: number;
  questionCount?: number;
  maxErrors?: number;
  mixSubjects: boolean;
  difficultyProgression: boolean;
  showTimer: boolean;
  xpMultiplier: number;
}

export interface Chapter {
  id: string;
  subject: Subject;
  name: string;
  order: number;
  exerciseTypes: ExerciseType[];
}

export const CHAPTERS: Chapter[] = [
  { id: "mat_calc", subject: "matrices", name: "Calcul matriciel", order: 1, exerciseTypes: ["matrix_multiplication", "matrix_addition"] },
  { id: "mat_det", subject: "matrices", name: "Déterminants", order: 2, exerciseTypes: ["matrix_determinant"] },
  { id: "mat_inv", subject: "matrices", name: "Matrices inverses", order: 3, exerciseTypes: ["matrix_inverse"] },
  { id: "graph_base", subject: "graphes", name: "Graphes finis simples", order: 1, exerciseTypes: ["graph_path", "graph_coloring"] },
  { id: "graph_dijkstra", subject: "graphes", name: "Algorithme de Dijkstra", order: 2, exerciseTypes: ["graph_dijkstra"] },
  { id: "graph_mpm", subject: "graphes", name: "Méthode MPM", order: 3, exerciseTypes: ["graph_mpm"] },
  { id: "graph_pert", subject: "graphes", name: "Méthode PERT", order: 4, exerciseTypes: ["graph_pert"] },
  { id: "bool_table", subject: "logique", name: "Tables de vérité", order: 1, exerciseTypes: ["boolean_truth_table"] },
  { id: "bool_simplify", subject: "logique", name: "Simplification booléenne", order: 2, exerciseTypes: ["boolean_simplify"] },
  { id: "bool_expr", subject: "logique", name: "Expressions booléennes", order: 3, exerciseTypes: ["boolean_expression"] },
  { id: "arith_cong", subject: "arithmetique", name: "Congruences", order: 1, exerciseTypes: ["arithmetic_congruence"] },
  { id: "arith_pgcd", subject: "arithmetique", name: "PGCD et Euclide", order: 2, exerciseTypes: ["arithmetic_pgcd"] },
  { id: "arith_base", subject: "arithmetique", name: "Conversions de bases", order: 3, exerciseTypes: ["arithmetic_base_conversion"] },
  { id: "ens_op", subject: "ensembles", name: "Opérations ensemblistes", order: 1, exerciseTypes: ["set_operations"] },
  { id: "ens_rel", subject: "ensembles", name: "Relations binaires", order: 2, exerciseTypes: ["set_relations"] },
  { id: "algo_tri", subject: "algorithmique", name: "Algorithmes de tri", order: 1, exerciseTypes: ["algorithm_sort"] },
  { id: "algo_complex", subject: "algorithmique", name: "Complexité", order: 2, exerciseTypes: ["algorithm_complexity"] },
  { id: "algo_trace", subject: "algorithmique", name: "Interprétation", order: 3, exerciseTypes: ["algorithm_trace"] },
];

export const GAME_MODES: GameModeConfig[] = [
  {
    id: "training",
    name: "Entraînement",
    description: "Exercices libres par thème, sans pression",
    icon: "📚",
    rules: {
      mixSubjects: false,
      difficultyProgression: false,
      showTimer: false,
      xpMultiplier: 1,
    },
  },
  {
    id: "sprint",
    name: "Sprint",
    description: "10 exercices en 5 minutes, tous sujets",
    icon: "⚡",
    rules: {
      timeLimit: 300,
      questionCount: 10,
      mixSubjects: true,
      difficultyProgression: false,
      showTimer: true,
      xpMultiplier: 1.5,
    },
  },
  {
    id: "survival",
    name: "Survie",
    description: "Enchaînez jusqu'à 3 erreurs",
    icon: "❤️",
    rules: {
      maxErrors: 3,
      mixSubjects: true,
      difficultyProgression: true,
      showTimer: false,
      xpMultiplier: 2,
    },
  },
  {
    id: "duel",
    name: "Duel",
    description: "Battez le fantôme IA",
    icon: "⚔️",
    rules: {
      questionCount: 10,
      mixSubjects: true,
      difficultyProgression: false,
      showTimer: true,
      xpMultiplier: 1.75,
    },
  },
  {
    id: "boss",
    name: "Boss",
    description: "Un exercice complexe multi-notions",
    icon: "👑",
    rules: {
      questionCount: 1,
      mixSubjects: true,
      difficultyProgression: false,
      showTimer: true,
      timeLimit: 600,
      xpMultiplier: 3,
    },
  },
  {
    id: "express",
    name: "Révision Express",
    description: "5 questions sur vos points faibles",
    icon: "🎯",
    rules: {
      questionCount: 5,
      mixSubjects: true,
      difficultyProgression: false,
      showTimer: false,
      xpMultiplier: 1.25,
    },
  },
  {
    id: "exam",
    name: "Examen Blanc",
    description: "Simulation d'épreuve complète",
    icon: "📝",
    rules: {
      timeLimit: 3600,
      questionCount: 20,
      mixSubjects: true,
      difficultyProgression: false,
      showTimer: true,
      xpMultiplier: 2.5,
    },
  },
];
