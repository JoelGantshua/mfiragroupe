# Guide d'Installation - AG Groupe

## 📋 Prérequis

- Compte Supabase
- Compte Vercel (pour le déploiement)
- Accès au projet Supabase : https://hajfduiipstqtejgqcvg.supabase.co

## 🗄️ Étape 1 : Configuration Supabase

### 1.1 Créer les tables

1. Connectez-vous à votre projet Supabase
2. Allez dans **SQL Editor** (menu de gauche)
3. Cliquez sur **New Query**
4. Copiez tout le contenu du fichier `supabase-schema.sql`
5. Collez-le dans l'éditeur SQL
6. Cliquez sur **Run** (ou appuyez sur Ctrl+Enter)

### 1.2 Vérifier les tables

Après l'exécution, vérifiez que les tables suivantes sont créées :
- ✅ `contact_messages`
- ✅ `notifications`
- ✅ `admin_users`

### 1.3 Vérifier les politiques RLS

Les politiques Row Level Security sont automatiquement créées :
- Les utilisateurs anonymes peuvent insérer dans `contact_messages` (pour le formulaire)
- Les utilisateurs anonymes peuvent lire/mettre à jour les données (pour le dashboard)
- Les triggers créent automatiquement des notifications lors de nouveaux messages

## 🌐 Étape 2 : Déploiement sur Vercel

### Option A : Via l'interface web Vercel

1. Allez sur https://vercel.com
2. Créez un compte ou connectez-vous
3. Cliquez sur **Add New Project**
4. Importez votre repository GitHub/GitLab/Bitbucket
5. Vercel détectera automatiquement la configuration
6. Cliquez sur **Deploy**

### Option B : Via la CLI Vercel

```bash
# Installer Vercel CLI globalement
npm install -g vercel

# Se connecter à Vercel
vercel login

# Dans le dossier du projet
cd "ag groupe"

# Déployer
vercel

# Pour la production
vercel --prod
```

### Option C : Via GitHub

1. Poussez votre code sur GitHub
2. Allez sur https://vercel.com
3. Importez le repository
4. Vercel déploiera automatiquement

## 🔐 Étape 3 : Accès au Dashboard

### Identifiants de connexion

- **Email** : `aggroupe@gmail.com`
- **Mot de passe** : `Aggroupe1@`

### URL du Dashboard

Après déploiement, accédez au dashboard via :
- `https://votre-domaine.vercel.app/login.html`

## ✅ Vérification

### Vérifier que tout fonctionne

1. **Formulaire de contact** :
   - Allez sur `/contact.html`
   - Remplissez et soumettez le formulaire
   - Vérifiez dans Supabase que le message apparaît dans `contact_messages`

2. **Dashboard** :
   - Connectez-vous avec les identifiants
   - Vérifiez que les messages apparaissent
   - Vérifiez que les notifications fonctionnent

3. **Notifications en temps réel** :
   - Ouvrez le dashboard
   - Soumettez un nouveau message depuis le formulaire
   - Vérifiez que la notification apparaît automatiquement

## 🔧 Configuration Supabase

### Variables d'environnement (optionnel)

Si vous souhaitez utiliser des variables d'environnement :

1. Dans Vercel Dashboard → Settings → Environment Variables
2. Ajoutez :
   - `SUPABASE_URL` = `https://hajfduiipstqtejgqcvg.supabase.co`
   - `SUPABASE_ANON_KEY` = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

Note : Les clés sont déjà codées en dur dans `supabase-config.js` pour simplifier.

## 📊 Structure des Données

### Table contact_messages

```sql
- id (UUID) : Identifiant unique
- name (VARCHAR) : Nom du contact
- email (VARCHAR) : Email du contact
- subject (VARCHAR) : Sujet du message
- message (TEXT) : Contenu du message
- service (VARCHAR) : Service concerné (optionnel)
- is_read (BOOLEAN) : Message lu ou non
- created_at (TIMESTAMP) : Date de création
- updated_at (TIMESTAMP) : Date de mise à jour
```

### Table notifications

```sql
- id (UUID) : Identifiant unique
- title (VARCHAR) : Titre de la notification
- message (TEXT) : Message de la notification
- type (VARCHAR) : Type de notification
- is_read (BOOLEAN) : Notification lue ou non
- created_at (TIMESTAMP) : Date de création
```

## 🐛 Dépannage

### Les messages n'apparaissent pas dans le dashboard

1. Vérifiez que les tables sont créées dans Supabase
2. Vérifiez que les politiques RLS sont activées
3. Vérifiez la console du navigateur pour les erreurs
4. Vérifiez que `supabase-config.js` contient les bonnes clés

### Erreur de connexion au dashboard

1. Vérifiez que vous utilisez les bons identifiants
2. Vérifiez que `login.js` est chargé correctement
3. Vérifiez la console du navigateur

### Les notifications ne fonctionnent pas

1. Vérifiez que le trigger `on_new_contact_message` est créé
2. Vérifiez que les subscriptions Realtime sont actives dans Supabase
3. Vérifiez la console du navigateur

## 📞 Support

Pour toute question ou problème, consultez la documentation Supabase ou contactez le support.

