# Guide de Déploiement sur GitHub et Vercel

## 📋 Étape 1 : Créer le Dépôt sur GitHub

1. **Allez sur GitHub**
   - Connectez-vous à https://github.com
   - Allez sur https://github.com/organizations/cons-cloud/repositories/new
   - Ou créez un nouveau dépôt dans votre organisation `cons-cloud`

2. **Créer le dépôt**
   - **Repository name** : `aggroupe`
   - **Description** : `Site web AG Groupe Officiel avec dashboard et intégration Supabase`
   - **Visibility** : Public ou Private (selon vos préférences)
   - **NE COCHEZ PAS** "Initialize this repository with a README"
   - Cliquez sur **"Create repository"**

## 📤 Étape 2 : Pousser le Code sur GitHub

Une fois le dépôt créé, exécutez ces commandes dans le terminal :

```bash
cd "/Users/jamilaaitbouchnani/ag groupe"

# Vérifier que le remote est bien configuré
git remote -v

# Si le remote n'existe pas ou est incorrect, supprimez-le et ajoutez-le
git remote remove origin
git remote add origin https://github.com/cons-cloud/aggroupe.git

# Pousser le code
git push -u origin main
```

**Note** : Si vous êtes demandé de vous authentifier :
- Utilisez un **Personal Access Token** (pas votre mot de passe)
- Créez-en un ici : https://github.com/settings/tokens
- Sélectionnez les permissions : `repo` (accès complet aux dépôts)

## 🚀 Étape 3 : Déployer sur Vercel

### Option A : Via l'Interface Web (Recommandé)

1. **Allez sur Vercel**
   - Connectez-vous à https://vercel.com
   - Cliquez sur **"Add New Project"**

2. **Importez le Dépôt**
   - Cliquez sur **"Import Git Repository"**
   - Sélectionnez `cons-cloud/aggroupe`
   - Cliquez sur **"Import"**

3. **Configurez le Projet**
   - **Project Name** : `aggroupe` (ou laissez par défaut)
   - **Framework Preset** : Vercel détectera automatiquement "Other"
   - **Root Directory** : `./` (laissez par défaut)
   - **Build Command** : Laissez vide (site statique)
   - **Output Directory** : Laissez vide (site statique)

4. **Variables d'Environnement (Optionnel)**
   - Si vous souhaitez utiliser des variables d'environnement pour Supabase :
     - `SUPABASE_URL` = `https://hajfduiipstqtejgqcvg.supabase.co`
     - `SUPABASE_ANON_KEY` = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - **Note** : Les clés sont déjà dans le code, donc ce n'est pas obligatoire

5. **Déployez**
   - Cliquez sur **"Deploy"**
   - Attendez que le déploiement se termine (1-2 minutes)

### Option B : Via la CLI Vercel

```bash
# Installer Vercel CLI (si pas déjà installé)
npm i -g vercel

# Se connecter à Vercel
vercel login

# Dans le dossier du projet
cd "/Users/jamilaaitbouchnani/ag groupe"

# Déployer
vercel

# Pour la production
vercel --prod
```

## ✅ Vérification

Après le déploiement :

1. **Vérifiez l'URL**
   - Vercel vous donnera une URL comme : `https://aggroupe.vercel.app`
   - Testez toutes les pages :
     - Page d'accueil : `/`
     - À propos : `/about.html`
     - Services : `/services.html`
     - Contact : `/contact.html`
     - Dashboard : `/login.html`

2. **Testez le Dashboard**
   - Allez sur `/login.html`
   - Connectez-vous avec :
     - Email : `aggroupe@gmail.com`
     - Mot de passe : `Aggroupe1@`
   - Vérifiez que les services se chargent depuis Supabase

3. **Testez le Formulaire de Contact**
   - Allez sur `/contact.html`
   - Remplissez et soumettez le formulaire
   - Vérifiez dans le dashboard que le message apparaît

## 🔧 Configuration Vercel

Le projet est déjà configuré avec :
- ✅ `vercel.json` - Configuration Vercel
- ✅ `package.json` - Métadonnées du projet
- ✅ `.vercelignore` - Fichiers à ignorer

## 📝 Notes Importantes

- **Supabase** : Assurez-vous d'avoir exécuté les scripts SQL dans Supabase avant de tester
- **Favicon** : Utilise `ag.jpeg` comme favicon
- **Images** : Toutes les images sont incluses dans le dépôt
- **Dashboard** : Accessible uniquement via `/login.html` avec les identifiants

## 🐛 Dépannage

### Erreur : "Repository not found"
- Vérifiez que le dépôt existe sur GitHub
- Vérifiez que vous avez les permissions d'accès
- Vérifiez l'URL du dépôt

### Erreur lors du push
- Vérifiez votre authentification GitHub (utilisez un Personal Access Token)
- Vérifiez que le dépôt existe

### Erreur lors du déploiement Vercel
- Vérifiez les logs dans Vercel Dashboard
- Vérifiez que tous les fichiers sont bien poussés sur GitHub
- Vérifiez la configuration dans `vercel.json`

## 📞 Support

Pour toute question, consultez :
- Documentation Vercel : https://vercel.com/docs
- Documentation Supabase : https://supabase.com/docs

