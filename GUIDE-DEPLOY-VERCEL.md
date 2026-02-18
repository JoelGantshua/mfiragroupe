# Guide de Déploiement sur Vercel - AG Groupe

## 📋 Prérequis

1. ✅ Compte GitHub
2. ✅ Compte Vercel
3. ✅ Projet Supabase configuré

## 🚀 Étape 1 : Créer le Dépôt GitHub

### Option A : Via l'interface GitHub

1. Allez sur https://github.com
2. Cliquez sur le bouton **"+"** en haut à droite → **"New repository"**
3. Remplissez les informations :
   - **Repository name** : `aggroupe`
   - **Description** : "Site web AG Groupe Officiel avec dashboard"
   - **Visibility** : Public ou Private (selon votre choix)
   - ⚠️ **NE COCHEZ PAS** "Initialize this repository with a README"
4. Cliquez sur **"Create repository"**

### Option B : Via GitHub CLI

```bash
gh repo create cons-cloud/aggroupe --public --description "Site web AG Groupe Officiel"
```

## 🔗 Étape 2 : Pousser le Code sur GitHub

Une fois le dépôt créé, exécutez ces commandes :

```bash
cd "/Users/jamilaaitbouchnani/ag groupe"

# Vérifier que le remote est configuré
git remote -v

# Si le remote n'existe pas, l'ajouter
git remote add origin https://github.com/cons-cloud/aggroupe.git

# Pousser le code
git push -u origin main
```

**Si vous avez déjà fait un commit local :**
```bash
git push -u origin main
```

**Si c'est la première fois :**
```bash
git add .
git commit -m "Initial commit: Site web AG Groupe avec dashboard et intégration Supabase"
git push -u origin main
```

## 🌐 Étape 3 : Déployer sur Vercel

### Méthode 1 : Via l'Interface Web (Recommandé)

1. **Connectez-vous à Vercel**
   - Allez sur https://vercel.com
   - Connectez-vous avec votre compte GitHub

2. **Importez le Projet**
   - Cliquez sur **"Add New..."** → **"Project"**
   - Sélectionnez le dépôt `cons-cloud/aggroupe`
   - Cliquez sur **"Import"**

3. **Configuration du Projet**
   - **Framework Preset** : Vercel détectera automatiquement "Other" (site statique)
   - **Root Directory** : `./` (laisser par défaut)
   - **Build Command** : Laisser vide (site statique)
   - **Output Directory** : Laisser vide (site statique)
   - **Install Command** : Laisser vide

4. **Variables d'Environnement (Optionnel)**
   - Si vous souhaitez utiliser des variables d'environnement pour Supabase :
     - `VITE_SUPABASE_URL` = `https://hajfduiipstqtejgqcvg.supabase.co`
     - `VITE_SUPABASE_ANON_KEY` = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - ⚠️ **Note** : Les clés sont déjà codées en dur dans `supabase-config.js`, donc ce n'est pas obligatoire

5. **Déployer**
   - Cliquez sur **"Deploy"**
   - Attendez que le déploiement se termine (2-3 minutes)

### Méthode 2 : Via la CLI Vercel

```bash
# Installer Vercel CLI
npm install -g vercel

# Se connecter
vercel login

# Dans le dossier du projet
cd "/Users/jamilaaitbouchnani/ag groupe"

# Déployer
vercel

# Pour la production
vercel --prod
```

## ✅ Étape 4 : Vérification

Après le déploiement :

1. **Vérifiez l'URL du site**
   - Vercel vous donnera une URL comme : `https://aggroupe.vercel.app`
   - Vous pouvez aussi configurer un domaine personnalisé

2. **Testez le Site**
   - Visitez l'URL fournie par Vercel
   - Testez toutes les pages
   - Testez le formulaire de contact
   - Testez le dashboard (login : `aggroupe@gmail.com` / `Aggroupe1@`)

3. **Vérifiez Supabase**
   - Les formulaires doivent fonctionner
   - Le dashboard doit pouvoir charger les données

## 🔧 Configuration Vercel

Le projet contient déjà `vercel.json` avec la configuration optimale :

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ]
}
```

## 📝 Notes Importantes

### Avant le Déploiement

- ✅ Vérifiez que tous les fichiers sont commités
- ✅ Vérifiez que le dépôt GitHub est à jour
- ✅ Vérifiez que Supabase est configuré et que les tables existent
- ✅ Testez le site en local

### Après le Déploiement

- ✅ Configurez un domaine personnalisé si nécessaire
- ✅ Vérifiez que les formulaires fonctionnent
- ✅ Testez le dashboard
- ✅ Vérifiez les performances (PageSpeed Insights)

## 🐛 Dépannage

### Erreur : "Repository not found"
**Solution** : Le dépôt GitHub n'existe pas encore. Créez-le d'abord (voir Étape 1).

### Erreur : "Permission denied"
**Solution** : Vérifiez que vous avez les droits d'accès au dépôt GitHub.

### Le site ne charge pas les services depuis Supabase
**Solution** : 
1. Vérifiez que les tables Supabase sont créées
2. Vérifiez que les politiques RLS sont configurées
3. Vérifiez la console du navigateur pour les erreurs

### Le dashboard ne fonctionne pas
**Solution** :
1. Vérifiez que `supabase-config.js` contient les bonnes clés
2. Vérifiez que les tables existent dans Supabase
3. Vérifiez la console du navigateur

## 🔐 Sécurité

- ⚠️ Les clés Supabase sont publiques (clé anon)
- ⚠️ C'est normal pour un site statique
- ⚠️ Les politiques RLS protègent les données
- ⚠️ Ne partagez jamais la clé service_role

## 📞 Support

Pour toute question :
- Documentation Vercel : https://vercel.com/docs
- Documentation Supabase : https://supabase.com/docs

## ✅ Checklist Finale

Avant de considérer le déploiement terminé :

- [ ] Dépôt GitHub créé
- [ ] Code poussé sur GitHub
- [ ] Projet importé dans Vercel
- [ ] Déploiement réussi
- [ ] Site accessible via l'URL Vercel
- [ ] Formulaire de contact fonctionne
- [ ] Dashboard accessible et fonctionnel
- [ ] Services chargés depuis Supabase
- [ ] Responsive testé sur mobile/tablette/desktop
- [ ] SEO vérifié

---

**🎉 Félicitations ! Votre site est maintenant en ligne !**

