# Guide de Déploiement - AG Groupe

## Configuration Supabase

### 1. Créer les tables dans Supabase

1. Connectez-vous à votre projet Supabase : https://hajfduiipstqtejgqcvg.supabase.co
2. Allez dans l'éditeur SQL
3. Copiez et exécutez le contenu du fichier `supabase-schema.sql`
4. Vérifiez que toutes les tables sont créées :
   - `contact_messages`
   - `notifications`
   - `admin_users`

### 2. Vérifier les politiques RLS

Les politiques Row Level Security (RLS) sont déjà configurées dans le script SQL :
- Les utilisateurs anonymes peuvent insérer dans `contact_messages` (pour le formulaire)
- Les utilisateurs authentifiés peuvent lire/mettre à jour/supprimer toutes les données

## Configuration Vercel

### 1. Préparer le projet

Le projet est déjà configuré avec :
- `vercel.json` - Configuration Vercel
- `package.json` - Métadonnées du projet

### 2. Déployer sur Vercel

#### Option 1 : Via l'interface Vercel

1. Allez sur https://vercel.com
2. Connectez votre compte GitHub/GitLab/Bitbucket
3. Importez le projet
4. Vercel détectera automatiquement la configuration
5. Cliquez sur "Deploy"

#### Option 2 : Via la CLI Vercel

```bash
# Installer Vercel CLI
npm i -g vercel

# Se connecter
vercel login

# Déployer
vercel

# Pour la production
vercel --prod
```

### 3. Variables d'environnement (optionnel)

Si vous souhaitez utiliser des variables d'environnement pour Supabase :

1. Dans Vercel Dashboard → Settings → Environment Variables
2. Ajoutez :
   - `VITE_SUPABASE_URL` = `https://hajfduiipstqtejgqcvg.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## Accès au Dashboard

### Identifiants de connexion

- **Email** : `aggroupe@gmail.com`
- **Mot de passe** : `Aggroupe1@`

### URL du Dashboard

Après déploiement, accédez au dashboard via :
- `https://votre-domaine.vercel.app/login.html`

## Fonctionnalités

### Dashboard

- **Tableau de bord** : Vue d'ensemble avec statistiques
- **Messages de contact** : Tous les messages du formulaire de contact
- **Notifications** : Notifications automatiques pour nouveaux messages
- **Paramètres** : Gestion du compte

### Notifications en temps réel

Le dashboard utilise Supabase Realtime pour :
- Recevoir les nouveaux messages instantanément
- Mettre à jour les notifications automatiquement
- Synchroniser les données en temps réel

## Support

Pour toute question ou problème, contactez l'équipe de développement.

