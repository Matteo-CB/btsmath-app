export interface Lesson {
  id: string;
  title: string;
  order: number;
  duration: number;
  content: LessonContent[];
}

export interface LessonContent {
  type: "definition" | "theorem" | "property" | "example" | "method" | "warning" | "formula" | "table";
  title?: string;
  content: string;
  formula?: string;
}

export interface Course {
  id: string;
  subject: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  lessons: Lesson[];
}

export const COURSES: Course[] = [
  {
    id: "matrices",
    subject: "matrices",
    name: "Matrices",
    description: "Calcul matriciel, déterminants et applications",
    icon: "▦",
    color: "#3B82F6",
    lessons: [
      {
        id: "mat_intro",
        title: "Introduction aux matrices",
        order: 1,
        duration: 15,
        content: [
          {
            type: "definition",
            title: "Matrice",
            content: "Une matrice est un tableau rectangulaire de nombres disposés en lignes et en colonnes. Une matrice à n lignes et p colonnes est appelée matrice de type (n, p)."
          },
          {
            type: "formula",
            title: "Notation générale",
            content: "On note une matrice A avec ses coefficients aᵢⱼ.",
            formula: "A = (aᵢⱼ) avec 1 ≤ i ≤ n et 1 ≤ j ≤ p"
          },
          {
            type: "example",
            title: "Exemple de matrice 2×3",
            content: "La matrice A = [[1, 2, 3], [4, 5, 6]] est une matrice à 2 lignes et 3 colonnes."
          },
          {
            type: "definition",
            title: "Matrice carrée",
            content: "Une matrice carrée est une matrice qui a autant de lignes que de colonnes (n = p)."
          }
        ]
      },
      {
        id: "mat_types",
        title: "Types de matrices particulières",
        order: 2,
        duration: 12,
        content: [
          {
            type: "definition",
            title: "Matrice nulle",
            content: "La matrice nulle O est la matrice dont tous les coefficients sont égaux à 0."
          },
          {
            type: "definition",
            title: "Matrice identité",
            content: "La matrice identité Iₙ est la matrice carrée dont les éléments de la diagonale valent 1 et tous les autres valent 0."
          },
          {
            type: "property",
            title: "Propriété de l'identité",
            content: "Pour toute matrice carrée A d'ordre n : A × Iₙ = Iₙ × A = A"
          },
          {
            type: "definition",
            title: "Matrice diagonale",
            content: "Une matrice diagonale est une matrice carrée dont tous les coefficients en dehors de la diagonale principale sont nuls."
          }
        ]
      },
      {
        id: "mat_operations",
        title: "Opérations sur les matrices",
        order: 3,
        duration: 20,
        content: [
          {
            type: "definition",
            title: "Addition de matrices",
            content: "L'addition de deux matrices A et B de même type donne une matrice C dont chaque coefficient est la somme des coefficients correspondants.",
            formula: "cᵢⱼ = aᵢⱼ + bᵢⱼ"
          },
          {
            type: "definition",
            title: "Multiplication par un scalaire",
            content: "Le produit d'une matrice A par un scalaire k est une matrice dont chaque coefficient est multiplié par k."
          },
          {
            type: "definition",
            title: "Transposée",
            content: "La transposée de A, notée Aᵀ, est obtenue en échangeant lignes et colonnes."
          }
        ]
      },
      {
        id: "mat_multiplication",
        title: "Multiplication matricielle",
        order: 4,
        duration: 25,
        content: [
          {
            type: "definition",
            title: "Produit de deux matrices",
            content: "Le produit de A (n×p) par B (p×q) est une matrice C (n×q). Le nombre de colonnes de A doit égaler le nombre de lignes de B.",
            formula: "cᵢⱼ = Σₖ aᵢₖ × bₖⱼ"
          },
          {
            type: "warning",
            title: "Non-commutativité",
            content: "La multiplication matricielle n'est PAS commutative ! En général, AB ≠ BA."
          },
          {
            type: "method",
            title: "Méthode de calcul",
            content: "Pour calculer cᵢⱼ : prendre la ligne i de A et la colonne j de B, multiplier terme à terme et additionner."
          }
        ]
      },
      {
        id: "mat_determinant",
        title: "Déterminants",
        order: 5,
        duration: 30,
        content: [
          {
            type: "definition",
            title: "Déterminant",
            content: "Le déterminant est un nombre associé à une matrice carrée. Il permet de savoir si une matrice est inversible."
          },
          {
            type: "formula",
            title: "Déterminant 2×2",
            content: "Pour une matrice 2×2 : A = [[a, b], [c, d]]",
            formula: "det(A) = ad - bc"
          },
          {
            type: "theorem",
            title: "Critère d'inversibilité",
            content: "Une matrice carrée A est inversible si et seulement si det(A) ≠ 0."
          }
        ]
      },
      {
        id: "mat_inverse",
        title: "Matrice inverse",
        order: 6,
        duration: 25,
        content: [
          {
            type: "definition",
            title: "Matrice inversible",
            content: "Une matrice carrée A est inversible s'il existe une matrice B telle que AB = BA = I. Cette matrice B est notée A⁻¹."
          },
          {
            type: "formula",
            title: "Inverse d'une matrice 2×2",
            content: "Pour A = [[a, b], [c, d]] avec det(A) ≠ 0 :",
            formula: "A⁻¹ = (1/det(A)) × [[d, -b], [-c, a]]"
          }
        ]
      }
    ]
  },
  {
    id: "graphes",
    subject: "graphes",
    name: "Graphes et Ordonnancement",
    description: "Théorie des graphes, Dijkstra, MPM et PERT",
    icon: "◉",
    color: "#10B981",
    lessons: [
      {
        id: "graph_intro",
        title: "Introduction aux graphes",
        order: 1,
        duration: 15,
        content: [
          {
            type: "definition",
            title: "Graphe",
            content: "Un graphe G est un couple (S, A) où S est un ensemble de sommets et A est un ensemble d'arêtes ou d'arcs."
          },
          {
            type: "definition",
            title: "Graphe orienté vs non orienté",
            content: "Graphe non orienté : arêtes sans direction. Graphe orienté : arcs avec direction."
          },
          {
            type: "definition",
            title: "Degré d'un sommet",
            content: "Le degré d'un sommet est le nombre d'arêtes incidentes à ce sommet."
          }
        ]
      },
      {
        id: "graph_paths",
        title: "Chemins et connexité",
        order: 2,
        duration: 20,
        content: [
          {
            type: "definition",
            title: "Chaîne et chemin",
            content: "Chaîne : suite de sommets adjacents. Chemin : chaîne orientée dans un graphe orienté."
          },
          {
            type: "definition",
            title: "Graphe connexe",
            content: "Un graphe est connexe si pour tout couple de sommets, il existe une chaîne les reliant."
          },
          {
            type: "definition",
            title: "Cycle et circuit",
            content: "Cycle : chaîne fermée. Circuit : chemin fermé dans un graphe orienté."
          }
        ]
      },
      {
        id: "graph_dijkstra",
        title: "Algorithme de Dijkstra",
        order: 3,
        duration: 25,
        content: [
          {
            type: "definition",
            title: "Problème du plus court chemin",
            content: "Trouver le chemin de poids minimum entre un sommet source et tous les autres sommets."
          },
          {
            type: "method",
            title: "Principe de Dijkstra",
            content: "À chaque étape, sélectionner le sommet non visité ayant la plus petite distance, le marquer visité, puis mettre à jour les distances de ses voisins."
          },
          {
            type: "warning",
            title: "Limitation",
            content: "Dijkstra ne fonctionne qu'avec des poids positifs ou nuls."
          }
        ]
      },
      {
        id: "graph_mpm",
        title: "Méthode MPM",
        order: 4,
        duration: 30,
        content: [
          {
            type: "definition",
            title: "Ordonnancement",
            content: "Organiser dans le temps un ensemble de tâches liées par des contraintes de précédence."
          },
          {
            type: "definition",
            title: "Date au plus tôt",
            content: "Moment le plus précoce où une tâche peut commencer."
          },
          {
            type: "definition",
            title: "Date au plus tard",
            content: "Moment le plus tardif où une tâche peut commencer sans retarder le projet."
          },
          {
            type: "definition",
            title: "Chemin critique",
            content: "Plus long chemin du début à la fin. Les tâches sur ce chemin ont une marge nulle."
          }
        ]
      },
      {
        id: "graph_pert",
        title: "Méthode PERT",
        order: 5,
        duration: 25,
        content: [
          {
            type: "definition",
            title: "Graphe PERT",
            content: "En méthode PERT, les sommets sont des étapes et les arcs sont des tâches."
          },
          {
            type: "property",
            title: "Comparaison MPM/PERT",
            content: "MPM : tâches = sommets. PERT : tâches = arcs. Les deux donnent le même chemin critique."
          }
        ]
      }
    ]
  },
  {
    id: "logique",
    subject: "logique",
    name: "Algèbre de Boole",
    description: "Logique propositionnelle et calcul booléen",
    icon: "⊕",
    color: "#8B5CF6",
    lessons: [
      {
        id: "bool_propositions",
        title: "Propositions logiques",
        order: 1,
        duration: 15,
        content: [
          {
            type: "definition",
            title: "Proposition",
            content: "Une proposition est un énoncé qui est soit vrai (1), soit faux (0)."
          },
          {
            type: "example",
            title: "Exemples",
            content: "\"2 + 2 = 4\" est vrai. \"Paris est en Allemagne\" est faux."
          }
        ]
      },
      {
        id: "bool_operators",
        title: "Connecteurs logiques",
        order: 2,
        duration: 20,
        content: [
          {
            type: "definition",
            title: "NON (négation)",
            content: "¬p inverse la valeur de vérité : ¬0 = 1, ¬1 = 0"
          },
          {
            type: "definition",
            title: "ET (conjonction)",
            content: "p ∧ q est vraie seulement si p ET q sont vraies."
          },
          {
            type: "definition",
            title: "OU (disjonction)",
            content: "p ∨ q est vraie si au moins l'une est vraie."
          }
        ]
      },
      {
        id: "bool_laws",
        title: "Lois de l'algèbre de Boole",
        order: 3,
        duration: 25,
        content: [
          {
            type: "property",
            title: "Éléments neutres",
            content: "p ∧ 1 = p, p ∨ 0 = p"
          },
          {
            type: "property",
            title: "Complémentarité",
            content: "p ∧ ¬p = 0, p ∨ ¬p = 1"
          },
          {
            type: "theorem",
            title: "Lois de De Morgan",
            content: "¬(p ∧ q) = ¬p ∨ ¬q et ¬(p ∨ q) = ¬p ∧ ¬q"
          }
        ]
      },
      {
        id: "bool_truth_tables",
        title: "Tables de vérité",
        order: 4,
        duration: 20,
        content: [
          {
            type: "definition",
            title: "Table de vérité",
            content: "Liste toutes les combinaisons possibles de valeurs des variables et la valeur résultante."
          },
          {
            type: "method",
            title: "Construction",
            content: "Pour n variables, il y a 2ⁿ lignes."
          }
        ]
      },
      {
        id: "bool_karnaugh",
        title: "Tableaux de Karnaugh",
        order: 5,
        duration: 30,
        content: [
          {
            type: "definition",
            title: "Tableau de Karnaugh",
            content: "Représentation graphique de la table de vérité pour faciliter la simplification."
          },
          {
            type: "method",
            title: "Simplification",
            content: "Regrouper les 1 adjacents par puissances de 2. Chaque groupe donne un terme simplifié."
          }
        ]
      }
    ]
  },
  {
    id: "arithmetique",
    subject: "arithmetique",
    name: "Arithmétique",
    description: "Divisibilité, PGCD, congruences et bases",
    icon: "÷",
    color: "#F59E0B",
    lessons: [
      {
        id: "arith_divisibility",
        title: "Divisibilité",
        order: 1,
        duration: 18,
        content: [
          {
            type: "definition",
            title: "Divisibilité",
            content: "a divise b (noté a | b) s'il existe k tel que b = k × a."
          },
          {
            type: "definition",
            title: "Division euclidienne",
            content: "a = b × q + r avec 0 ≤ r < b"
          }
        ]
      },
      {
        id: "arith_primes",
        title: "Nombres premiers",
        order: 2,
        duration: 15,
        content: [
          {
            type: "definition",
            title: "Nombre premier",
            content: "Un entier p > 1 est premier s'il n'a que deux diviseurs : 1 et lui-même."
          },
          {
            type: "theorem",
            title: "Théorème fondamental",
            content: "Tout entier > 1 se décompose de manière unique en produit de facteurs premiers."
          }
        ]
      },
      {
        id: "arith_pgcd",
        title: "PGCD et algorithme d'Euclide",
        order: 3,
        duration: 22,
        content: [
          {
            type: "definition",
            title: "PGCD",
            content: "Le Plus Grand Commun Diviseur est le plus grand entier qui divise à la fois a et b."
          },
          {
            type: "method",
            title: "Algorithme d'Euclide",
            content: "PGCD(a, b) = PGCD(b, a mod b). Répéter jusqu'à obtenir reste = 0."
          },
          {
            type: "theorem",
            title: "Identité de Bézout",
            content: "Il existe u et v tels que au + bv = PGCD(a, b)."
          }
        ]
      },
      {
        id: "arith_congruence",
        title: "Congruences",
        order: 4,
        duration: 25,
        content: [
          {
            type: "definition",
            title: "Congruence",
            content: "a ≡ b [n] si n divise (a - b), autrement dit si a et b ont le même reste modulo n."
          },
          {
            type: "property",
            title: "Propriétés",
            content: "Si a ≡ b [n] et c ≡ d [n], alors a+c ≡ b+d [n] et a×c ≡ b×d [n]."
          }
        ]
      },
      {
        id: "arith_bases",
        title: "Conversions de bases",
        order: 5,
        duration: 20,
        content: [
          {
            type: "definition",
            title: "Bases courantes",
            content: "Base 2 (binaire), Base 8 (octal), Base 10 (décimal), Base 16 (hexadécimal)."
          },
          {
            type: "method",
            title: "Base 10 vers base b",
            content: "Divisions successives par b. Lire les restes de bas en haut."
          },
          {
            type: "method",
            title: "Base b vers base 10",
            content: "Multiplier chaque chiffre par sa puissance de b et additionner."
          }
        ]
      }
    ]
  },
  {
    id: "ensembles",
    subject: "ensembles",
    name: "Théorie des ensembles",
    description: "Ensembles, relations et applications",
    icon: "∪",
    color: "#EC4899",
    lessons: [
      {
        id: "ens_basics",
        title: "Notion d'ensemble",
        order: 1,
        duration: 15,
        content: [
          {
            type: "definition",
            title: "Ensemble",
            content: "Collection d'objets distincts appelés éléments. x ∈ E signifie x appartient à E."
          },
          {
            type: "definition",
            title: "Cardinal",
            content: "Le cardinal |E| est le nombre d'éléments d'un ensemble fini."
          }
        ]
      },
      {
        id: "ens_operations",
        title: "Opérations sur les ensembles",
        order: 2,
        duration: 20,
        content: [
          {
            type: "definition",
            title: "Union",
            content: "A ∪ B : éléments dans A OU dans B."
          },
          {
            type: "definition",
            title: "Intersection",
            content: "A ∩ B : éléments dans A ET dans B."
          },
          {
            type: "definition",
            title: "Différence",
            content: "A \\ B : éléments dans A mais pas dans B."
          },
          {
            type: "property",
            title: "Lois de De Morgan",
            content: "(A ∪ B)ᶜ = Aᶜ ∩ Bᶜ et (A ∩ B)ᶜ = Aᶜ ∪ Bᶜ"
          }
        ]
      },
      {
        id: "ens_relations",
        title: "Relations binaires",
        order: 3,
        duration: 22,
        content: [
          {
            type: "definition",
            title: "Relation binaire",
            content: "Sous-ensemble de E × E. xRy signifie (x, y) ∈ R."
          },
          {
            type: "definition",
            title: "Propriétés",
            content: "Réflexive : xRx. Symétrique : xRy ⟹ yRx. Transitive : xRy et yRz ⟹ xRz."
          }
        ]
      },
      {
        id: "ens_applications",
        title: "Applications",
        order: 4,
        duration: 20,
        content: [
          {
            type: "definition",
            title: "Application",
            content: "f : E → F associe à chaque x de E un unique f(x) de F."
          },
          {
            type: "definition",
            title: "Injection",
            content: "f(x) = f(y) ⟹ x = y (éléments distincts ont images distinctes)."
          },
          {
            type: "definition",
            title: "Surjection",
            content: "Tout élément de F a au moins un antécédent."
          },
          {
            type: "definition",
            title: "Bijection",
            content: "À la fois injective et surjective. Chaque élément de F a exactement un antécédent."
          }
        ]
      }
    ]
  },
  {
    id: "algorithmique",
    subject: "algorithmique",
    name: "Algorithmique",
    description: "Bases de l'algorithmique et complexité",
    icon: "{}",
    color: "#6366F1",
    lessons: [
      {
        id: "algo_intro",
        title: "Introduction à l'algorithmique",
        order: 1,
        duration: 12,
        content: [
          {
            type: "definition",
            title: "Algorithme",
            content: "Suite finie d'instructions permettant de résoudre un problème."
          },
          {
            type: "property",
            title: "Caractéristiques",
            content: "Correct, complet, clair, efficace, terminaison garantie."
          }
        ]
      },
      {
        id: "algo_variables",
        title: "Variables et types",
        order: 2,
        duration: 18,
        content: [
          {
            type: "definition",
            title: "Variable",
            content: "Emplacement mémoire identifié par un nom, stockant une valeur d'un certain type."
          },
          {
            type: "definition",
            title: "Types simples",
            content: "Entier, Réel, Booléen, Caractère, Chaîne."
          }
        ]
      },
      {
        id: "algo_conditions",
        title: "Structures conditionnelles",
        order: 3,
        duration: 18,
        content: [
          {
            type: "definition",
            title: "Si...Alors...Sinon",
            content: "Exécuter des instructions selon une condition."
          },
          {
            type: "example",
            title: "Exemple",
            content: "Si age >= 18 Alors Afficher(\"Majeur\") Sinon Afficher(\"Mineur\") FinSi"
          }
        ]
      },
      {
        id: "algo_loops",
        title: "Structures itératives",
        order: 4,
        duration: 22,
        content: [
          {
            type: "definition",
            title: "Boucle Pour",
            content: "Répète un nombre connu de fois."
          },
          {
            type: "definition",
            title: "Boucle Tant que",
            content: "Répète tant qu'une condition est vraie."
          },
          {
            type: "warning",
            title: "Boucle infinie",
            content: "S'assurer que la condition de sortie sera atteinte !"
          }
        ]
      },
      {
        id: "algo_arrays",
        title: "Tableaux",
        order: 5,
        duration: 20,
        content: [
          {
            type: "definition",
            title: "Tableau",
            content: "Structure stockant plusieurs éléments de même type, accessibles par indice."
          },
          {
            type: "example",
            title: "Parcours",
            content: "Pour i de 0 à n-1 Faire Afficher(T[i]) FinPour"
          }
        ]
      },
      {
        id: "algo_complexity",
        title: "Complexité algorithmique",
        order: 6,
        duration: 25,
        content: [
          {
            type: "definition",
            title: "Complexité temporelle",
            content: "Nombre d'opérations en fonction de la taille n de l'entrée."
          },
          {
            type: "definition",
            title: "Notation O",
            content: "O(1) constant, O(log n) logarithmique, O(n) linéaire, O(n²) quadratique, O(2ⁿ) exponentiel."
          }
        ]
      }
    ]
  }
];

export function getCourseById(id: string): Course | undefined {
  return COURSES.find(c => c.id === id);
}

export function getLessonById(courseId: string, lessonId: string): Lesson | undefined {
  const course = getCourseById(courseId);
  return course?.lessons.find(l => l.id === lessonId);
}

export function getNextLesson(courseId: string, currentLessonId: string): Lesson | undefined {
  const course = getCourseById(courseId);
  if (!course) return undefined;
  const currentIndex = course.lessons.findIndex(l => l.id === currentLessonId);
  if (currentIndex === -1 || currentIndex === course.lessons.length - 1) return undefined;
  return course.lessons[currentIndex + 1];
}

export function getTotalLessons(): number {
  return COURSES.reduce((sum, course) => sum + course.lessons.length, 0);
}
