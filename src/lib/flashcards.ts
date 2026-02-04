export interface Flashcard {
  id: string;
  subject: string;
  question: string;
  answer: string;
  formula?: string;
  example?: string;
  color: string;
}

export const FLASHCARDS: Flashcard[] = [
  // Matrices
  {
    id: "mat1",
    subject: "Matrices",
    question: "Comment multiplier deux matrices A et B ?",
    answer: "L'élément (i,j) de A×B est la somme des produits de la ligne i de A par la colonne j de B.",
    formula: "(A×B)ᵢⱼ = Σₖ Aᵢₖ × Bₖⱼ",
    example: "Pour 2×2: C₁₁ = A₁₁×B₁₁ + A₁₂×B₂₁",
    color: "#3b82f6",
  },
  {
    id: "mat2",
    subject: "Matrices",
    question: "Qu'est-ce que le déterminant d'une matrice 2×2 ?",
    answer: "Le déterminant mesure le facteur d'échelle de la transformation. Pour une matrice 2×2, c'est ad-bc.",
    formula: "det([a b; c d]) = ad - bc",
    example: "det([2 3; 1 4]) = 2×4 - 3×1 = 5",
    color: "#3b82f6",
  },
  {
    id: "mat3",
    subject: "Matrices",
    question: "Quand une matrice est-elle inversible ?",
    answer: "Une matrice est inversible si et seulement si son déterminant est non nul.",
    formula: "det(A) ≠ 0 ⟺ A⁻¹ existe",
    color: "#3b82f6",
  },
  // Logique booléenne
  {
    id: "bool1",
    subject: "Logique",
    question: "Quelles sont les lois de De Morgan ?",
    answer: "La négation d'une conjonction est la disjonction des négations, et vice versa.",
    formula: "¬(A ∧ B) = ¬A ∨ ¬B\n¬(A ∨ B) = ¬A ∧ ¬B",
    color: "#10b981",
  },
  {
    id: "bool2",
    subject: "Logique",
    question: "Qu'est-ce que l'implication logique ?",
    answer: "A implique B est faux seulement quand A est vrai et B est faux.",
    formula: "A → B ≡ ¬A ∨ B",
    example: "Si A=1 et B=0, alors A→B = 0",
    color: "#10b981",
  },
  {
    id: "bool3",
    subject: "Logique",
    question: "Comment simplifier A + AB ?",
    answer: "En factorisant A, on obtient A(1+B) = A×1 = A",
    formula: "A + AB = A(1 + B) = A",
    color: "#10b981",
  },
  // Arithmétique
  {
    id: "arith1",
    subject: "Arithmétique",
    question: "Qu'est-ce que la congruence modulo n ?",
    answer: "Deux nombres a et b sont congrus modulo n si leur différence est divisible par n.",
    formula: "a ≡ b (mod n) ⟺ n | (a-b)",
    example: "17 ≡ 2 (mod 5) car 17-2=15 divisible par 5",
    color: "#f59e0b",
  },
  {
    id: "arith2",
    subject: "Arithmétique",
    question: "Comment fonctionne l'algorithme d'Euclide ?",
    answer: "Le PGCD de a et b égale le PGCD de b et a mod b, jusqu'à atteindre 0.",
    formula: "PGCD(a,b) = PGCD(b, a mod b)",
    example: "PGCD(48,18) = PGCD(18,12) = PGCD(12,6) = PGCD(6,0) = 6",
    color: "#f59e0b",
  },
  {
    id: "arith3",
    subject: "Arithmétique",
    question: "Comment convertir de base 10 en base 2 ?",
    answer: "Diviser successivement par 2 et lire les restes de bas en haut.",
    example: "13 en binaire:\n13÷2=6 r1\n6÷2=3 r0\n3÷2=1 r1\n1÷2=0 r1\nRésultat: 1101",
    color: "#f59e0b",
  },
  // Graphes
  {
    id: "graph1",
    subject: "Graphes",
    question: "Qu'est-ce que l'algorithme de Dijkstra ?",
    answer: "Algorithme qui trouve le plus court chemin depuis un sommet source vers tous les autres dans un graphe pondéré positif.",
    formula: "d[v] = min(d[v], d[u] + poids(u,v))",
    color: "#8b5cf6",
  },
  {
    id: "graph2",
    subject: "Graphes",
    question: "Qu'est-ce qu'un graphe eulérien ?",
    answer: "Un graphe qui possède un chemin passant par toutes les arêtes exactement une fois. Tous les sommets doivent avoir un degré pair.",
    color: "#8b5cf6",
  },
  {
    id: "graph3",
    subject: "Graphes",
    question: "Qu'est-ce que la méthode MPM ?",
    answer: "Méthode des Potentiels Métra pour ordonnancer des tâches. Calcule dates au plus tôt et au plus tard.",
    formula: "Marge = Date au plus tard - Date au plus tôt",
    color: "#8b5cf6",
  },
  // Algorithmique
  {
    id: "algo1",
    subject: "Algorithmique",
    question: "Quelle est la complexité du tri par insertion ?",
    answer: "O(n²) dans le pire cas et en moyenne, O(n) dans le meilleur cas (liste déjà triée).",
    formula: "Meilleur: O(n)\nMoyen/Pire: O(n²)",
    color: "#ec4899",
  },
  {
    id: "algo2",
    subject: "Algorithmique",
    question: "Quelle est la complexité du tri rapide (Quicksort) ?",
    answer: "O(n log n) en moyenne, O(n²) dans le pire cas (pivot mal choisi).",
    formula: "Moyen: O(n log n)\nPire: O(n²)",
    color: "#ec4899",
  },
  {
    id: "algo3",
    subject: "Algorithmique",
    question: "Quelle est la complexité de la recherche dichotomique ?",
    answer: "O(log n) car on divise l'espace de recherche par 2 à chaque étape.",
    formula: "T(n) = T(n/2) + O(1) = O(log n)",
    color: "#ec4899",
  },
  // Ensembles
  {
    id: "ens1",
    subject: "Ensembles",
    question: "Quelles sont les opérations ensemblistes de base ?",
    answer: "Union (∪), Intersection (∩), Différence (\\), Complémentaire (C)",
    formula: "A ∪ B = {x | x∈A ou x∈B}\nA ∩ B = {x | x∈A et x∈B}",
    color: "#06b6d4",
  },
  {
    id: "ens2",
    subject: "Ensembles",
    question: "Qu'est-ce qu'une relation d'équivalence ?",
    answer: "Une relation binaire qui est réflexive, symétrique et transitive.",
    formula: "Réflexive: xRx\nSymétrique: xRy ⟹ yRx\nTransitive: xRy ∧ yRz ⟹ xRz",
    color: "#06b6d4",
  },
];

export const FLASHCARD_SUBJECTS = ["Tous", "Matrices", "Logique", "Arithmétique", "Graphes", "Algorithmique", "Ensembles"];
