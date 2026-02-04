# Instructions pour publier BTS Math sur le Play Store

## CE QUI EST DÉJÀ FAIT

- [x] Configuration `eas.json` pour les builds
- [x] Configuration `app.json` avec package Android
- [x] Page de politique de confidentialité (`privacy-policy.html`)
- [x] Textes de la fiche Play Store (`store-listing.md`)

---

## CE QUE TU DOIS FAIRE

### ÉTAPE 1 : Créer un compte Expo (2 min)

```bash
cd c:\Users\matte\Desktop\btsmath-app
npx eas login
```

Crée un compte sur https://expo.dev si tu n'en as pas.

---

### ÉTAPE 2 : Lier le projet à Expo (1 min)

```bash
npx eas init
```

Cela va créer un `projectId` automatiquement.

---

### ÉTAPE 3 : Créer les assets graphiques

Tu dois créer ces images dans le dossier `assets/` :

| Fichier | Dimensions | Description |
|---------|------------|-------------|
| `icon.png` | 1024 x 1024 px | Icône de l'app (carré) |
| `adaptive-icon.png` | 1024 x 1024 px | Icône adaptive Android |
| `splash-icon.png` | 1284 x 2778 px | Écran de chargement |

**Pour le Play Store** (à préparer séparément) :

| Asset | Dimensions |
|-------|------------|
| Icône Play Store | 512 x 512 px |
| Bannière | 1024 x 500 px |
| Captures d'écran | 1080 x 1920 px (min 2) |

**Conseil** : Utilise Canva (gratuit) ou Figma pour créer ces images.

---

### ÉTAPE 4 : Configurer les variables d'environnement

Crée un fichier `.env` :

```
EXPO_PUBLIC_SUPABASE_URL=ta_url_supabase
EXPO_PUBLIC_SUPABASE_ANON_KEY=ta_cle_supabase
```

---

### ÉTAPE 5 : Lancer le build APK (test)

```bash
npx eas build --platform android --profile preview
```

Attends 10-20 min, puis télécharge l'APK pour tester sur ton téléphone.

---

### ÉTAPE 6 : Lancer le build AAB (production)

```bash
npx eas build --platform android --profile production
```

C'est le fichier `.aab` à uploader sur le Play Store.

---

### ÉTAPE 7 : Créer un compte Google Play Console

1. Va sur https://play.google.com/console
2. Paye **25$ (une seule fois)**
3. Remplis les infos développeur

---

### ÉTAPE 8 : Héberger la politique de confidentialité

Options :
1. **GitHub Pages** (gratuit) : Push `privacy-policy.html` sur un repo GitHub et active Pages
2. **Ton site web** : Upload le fichier sur ton hébergement
3. **Netlify/Vercel** : Déploie gratuitement

URL exemple : `https://ton-username.github.io/btsmath-privacy/`

---

### ÉTAPE 9 : Créer l'app sur Play Console

1. Dashboard > **Créer une application**
2. Nom : `BTS Math`
3. Langue : Français
4. Type : Application
5. Gratuite

---

### ÉTAPE 10 : Remplir la fiche Store

Utilise le contenu de `store-listing.md` :
- Copie la description courte
- Copie la description longue
- Upload les captures d'écran

---

### ÉTAPE 11 : Configuration requise

Dans Play Console, complète :

1. **Politique de confidentialité** : Colle l'URL de ta page
2. **Accès à l'application** : "Toutes les fonctionnalités sont disponibles sans restrictions"
3. **Publicités** : "Non, cette application ne contient pas de publicités"
4. **Classification du contenu** : Réponds au questionnaire IARC
5. **Public cible** : 13 ans et plus (étudiants BTS)
6. **Application News** : Non
7. **COVID-19** : Non

---

### ÉTAPE 12 : Upload et publier

1. **Production** > **Créer une release**
2. Upload le fichier `.aab`
3. Notes de version : "Première version de BTS Math !"
4. **Envoyer pour examen**

---

## COMMANDES RÉSUMÉES

```bash
# 1. Login Expo
npx eas login

# 2. Initialiser le projet
npx eas init

# 3. Build APK (test)
npx eas build --platform android --profile preview

# 4. Build AAB (production)
npx eas build --platform android --profile production

# 5. Soumettre (optionnel, après config)
npx eas submit --platform android
```

---

## DÉLAIS ESTIMÉS

| Étape | Temps |
|-------|-------|
| Créer compte Expo | 2 min |
| Créer assets | 30 min - 1h |
| Build | 15-20 min |
| Créer compte Play Console | 10 min |
| Remplir fiche Store | 20-30 min |
| Validation Google | 1-7 jours |

---

## COÛTS

| Élément | Coût |
|---------|------|
| Compte Expo | Gratuit |
| Build EAS | Gratuit (30 builds/mois) |
| Google Play Console | 25$ (une fois) |
| **Total** | **25$** |

---

## EN CAS DE PROBLÈME

- Erreur de build : `npx eas build --platform android --profile preview --clear-cache`
- Logs de build : Visible sur https://expo.dev après login
- Questions : https://docs.expo.dev/build/introduction/
