# 🚀 Étapes pour Déployer sur Vercel

## ⚠️ IMPORTANT : Le dépôt GitHub n'existe pas encore

Le remote est configuré, mais vous devez **créer le dépôt sur GitHub** avant de pouvoir pousser le code.

## 📝 Étapes à Suivre

### 1️⃣ Créer le Dépôt sur GitHub

1. Allez sur **https://github.com/cons-cloud** (ou créez l'organisation si elle n'existe pas)
2. Cliquez sur **"New repository"** (bouton vert)
3. Remplissez :
   - **Repository name** : `aggroupe`
   - **Description** : "Site web AG Groupe Officiel avec dashboard"
   - **Visibility** : Public ou Private
   - ⚠️ **NE COCHEZ PAS** "Add a README file"
   - ⚠️ **NE COCHEZ PAS** "Add .gitignore"
   - ⚠️ **NE COCHEZ PAS** "Choose a license"
4. Cliquez sur **"Create repository"**

### 2️⃣ Pousser le Code

Une fois le dépôt créé, exécutez :

```bash
cd "/Users/jamilaaitbouchnani/ag groupe"
git push -u origin main
```

Si vous avez des erreurs d'authentification, utilisez un token GitHub :
```bash
git remote set-url origin https://VOTRE_TOKEN@github.com/cons-cloud/aggroupe.git
git push -u origin main
```

### 3️⃣ Déployer sur Vercel

1. Allez sur **https://vercel.com**
2. Connectez-vous avec GitHub
3. Cliquez sur **"Add New Project"**
4. Sélectionnez le dépôt `cons-cloud/aggroupe`
5. Cliquez sur **"Import"**
6. Vercel détectera automatiquement la configuration
7. Cliquez sur **"Deploy"**

## ✅ État Actuel

- ✅ Remote GitHub configuré : `https://github.com/cons-cloud/aggroupe.git`
- ✅ Code prêt à être poussé
- ✅ Configuration Vercel prête (`vercel.json`)
- ⏳ **En attente** : Création du dépôt sur GitHub

## 📋 Commandes Prêtes

Une fois le dépôt créé sur GitHub :

```bash
# Vérifier le remote
git remote -v

# Pousser le code
git push -u origin main

# Si erreur d'authentification, utiliser HTTPS avec token
# ou configurer SSH
```

## 🔐 Authentification GitHub

Si vous avez des problèmes d'authentification :

1. **Créer un Personal Access Token** :
   - GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
   - Generate new token
   - Permissions : `repo` (toutes les cases sous repo)

2. **Utiliser le token** :
   ```bash
   git remote set-url origin https://VOTRE_TOKEN@github.com/cons-cloud/aggroupe.git
   git push -u origin main
   ```

## 📞 Besoin d'Aide ?

Consultez le fichier `GUIDE-DEPLOY-VERCEL.md` pour un guide complet.

