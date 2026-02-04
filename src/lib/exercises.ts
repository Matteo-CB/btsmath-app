import type { Exercise, ExerciseType, Subject } from "./types";

// Generate random matrix
function generateMatrix(rows: number, cols: number, max = 10): number[][] {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => Math.floor(Math.random() * max) - Math.floor(max / 2))
  );
}

// Matrix multiplication
function multiplyMatrices(a: number[][], b: number[][]): number[][] {
  const rowsA = a.length;
  const colsA = a[0].length;
  const colsB = b[0].length;
  const result: number[][] = [];

  for (let i = 0; i < rowsA; i++) {
    result[i] = [];
    for (let j = 0; j < colsB; j++) {
      result[i][j] = 0;
      for (let k = 0; k < colsA; k++) {
        result[i][j] += a[i][k] * b[k][j];
      }
    }
  }
  return result;
}

// Matrix addition
function addMatrices(a: number[][], b: number[][]): number[][] {
  return a.map((row, i) => row.map((val, j) => val + b[i][j]));
}

// Determinant 2x2
function determinant2x2(m: number[][]): number {
  return m[0][0] * m[1][1] - m[0][1] * m[1][0];
}

// GCD using Euclidean algorithm
function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b !== 0) {
    const temp = b;
    b = a % b;
    a = temp;
  }
  return a;
}

// Generate exercise by type
export function generateExercise(type: ExerciseType, difficulty: 1 | 2 | 3 = 1): Exercise {
  const id = `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const xpBase = difficulty * 10;

  switch (type) {
    case "matrix_multiplication": {
      const size = difficulty === 1 ? 2 : difficulty === 2 ? 2 : 3;
      const matrixA = generateMatrix(size, size, 5);
      const matrixB = generateMatrix(size, size, 5);
      const expectedResult = multiplyMatrices(matrixA, matrixB);
      return {
        id,
        type,
        subject: "matrices",
        chapter: "Calcul matriciel",
        title: "Multiplication de matrices",
        difficulty,
        xpReward: xpBase,
        data: { matrixA, matrixB, expectedResult },
      };
    }

    case "matrix_addition": {
      const size = difficulty === 1 ? 2 : 3;
      const matrixA = generateMatrix(size, size, 10);
      const matrixB = generateMatrix(size, size, 10);
      const expectedResult = addMatrices(matrixA, matrixB);
      return {
        id,
        type,
        subject: "matrices",
        chapter: "Calcul matriciel",
        title: "Addition de matrices",
        difficulty,
        xpReward: xpBase,
        data: { matrixA, matrixB, expectedResult },
      };
    }

    case "matrix_determinant": {
      const matrixA = generateMatrix(2, 2, 10);
      const expectedResult = determinant2x2(matrixA);
      return {
        id,
        type,
        subject: "matrices",
        chapter: "Déterminants",
        title: "Calculer le déterminant",
        difficulty,
        xpReward: xpBase,
        data: { matrixA, expectedResult },
      };
    }

    case "arithmetic_congruence": {
      const modulo = difficulty === 1 ? 5 : difficulty === 2 ? 7 : 11;
      const number = Math.floor(Math.random() * 100) + 10;
      const expectedResult = number % modulo;
      return {
        id,
        type,
        subject: "arithmetique",
        chapter: "Congruences",
        title: `Calculer ${number} mod ${modulo}`,
        difficulty,
        xpReward: xpBase,
        data: { numbers: [number], modulo, expectedResult },
      };
    }

    case "arithmetic_pgcd": {
      const maxVal = difficulty === 1 ? 50 : difficulty === 2 ? 100 : 200;
      const a = Math.floor(Math.random() * maxVal) + 10;
      const b = Math.floor(Math.random() * maxVal) + 10;
      const expectedResult = gcd(a, b);
      return {
        id,
        type,
        subject: "arithmetique",
        chapter: "PGCD et Euclide",
        title: `Trouver le PGCD(${a}, ${b})`,
        difficulty,
        xpReward: xpBase,
        data: { numbers: [a, b], expectedResult },
      };
    }

    case "arithmetic_base_conversion": {
      const number = Math.floor(Math.random() * 255) + 1;
      const bases = [[10, 2], [10, 16], [2, 10], [16, 10]];
      const [base, targetBase] = bases[Math.floor(Math.random() * bases.length)];
      const expectedResult = number.toString(targetBase).toUpperCase();
      return {
        id,
        type,
        subject: "arithmetique",
        chapter: "Conversions de bases",
        title: `Convertir de base ${base} en base ${targetBase}`,
        difficulty,
        xpReward: xpBase,
        data: { numbers: [number], base, targetBase, expectedResult },
      };
    }

    case "boolean_truth_table": {
      const expressions = ["A AND B", "A OR B", "NOT A", "A XOR B"];
      const expression = expressions[Math.floor(Math.random() * expressions.length)];
      const variables = expression.includes("B") ? ["A", "B"] : ["A"];
      let expectedResult: string;

      if (expression === "A AND B") expectedResult = "0,0,0,1";
      else if (expression === "A OR B") expectedResult = "0,1,1,1";
      else if (expression === "NOT A") expectedResult = "1,0";
      else expectedResult = "0,1,1,0";

      return {
        id,
        type,
        subject: "logique",
        chapter: "Tables de vérité",
        title: "Compléter la table de vérité",
        difficulty,
        xpReward: xpBase,
        data: { expression, variables, expectedResult },
      };
    }

    case "boolean_simplify": {
      const expressions = [
        { expr: "A + A.B", simplified: "A" },
        { expr: "A.(A + B)", simplified: "A" },
        { expr: "A + NOT(A)", simplified: "1" },
        { expr: "A.NOT(A)", simplified: "0" },
      ];
      const { expr, simplified } = expressions[Math.floor(Math.random() * expressions.length)];
      return {
        id,
        type,
        subject: "logique",
        chapter: "Simplification booléenne",
        title: "Simplifier l'expression",
        difficulty,
        xpReward: xpBase,
        data: { expression: expr, expectedResult: simplified },
      };
    }

    default:
      return {
        id,
        type,
        subject: "matrices" as Subject,
        chapter: "Général",
        title: "Exercice",
        difficulty,
        xpReward: xpBase,
        data: { expectedResult: "0" },
      };
  }
}

// Generate exercises for a game mode
export function generateExercises(count: number, types?: ExerciseType[]): Exercise[] {
  const availableTypes: ExerciseType[] = types || [
    "matrix_multiplication",
    "matrix_addition",
    "matrix_determinant",
    "arithmetic_congruence",
    "arithmetic_pgcd",
    "arithmetic_base_conversion",
    "boolean_truth_table",
    "boolean_simplify",
  ];

  return Array.from({ length: count }, (_, i) => {
    const type = availableTypes[Math.floor(Math.random() * availableTypes.length)];
    const difficulty = (Math.min(Math.floor(i / 3) + 1, 3)) as 1 | 2 | 3;
    return generateExercise(type, difficulty);
  });
}

// Check answer
export function checkAnswer(exercise: Exercise, userAnswer: string): { correct: boolean; correctAnswer: string } {
  const data = exercise.data as { expectedResult: unknown };
  let expected = String(data.expectedResult);

  // Normalize answers
  const normalizedUser = userAnswer.trim().toUpperCase().replace(/\s+/g, "");
  const normalizedExpected = expected.trim().toUpperCase().replace(/\s+/g, "");

  // For matrices, handle array format
  if (Array.isArray(data.expectedResult)) {
    expected = JSON.stringify(data.expectedResult);
    const isCorrect = normalizedUser === expected.replace(/\s+/g, "") ||
      normalizedUser === (data.expectedResult as number[][]).flat().join(",");
    return { correct: isCorrect, correctAnswer: expected };
  }

  return {
    correct: normalizedUser === normalizedExpected,
    correctAnswer: expected,
  };
}
