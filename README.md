# AG Groupe - Site Web Officiel

Site web professionnel pour AG Groupe, entreprise basée à Brazzaville, Congo.

## 🚀 Fonctionnalités

- **Site web responsive** : Optimisé pour tous les appareils (mobile, tablette, desktop)
- **Mode sombre** : Interface moderne avec thème sombre
- **Formulaire de contact** : Intégré avec Supabase pour stocker les messages
- **Dashboard administrateur** : Gestion des messages et notifications
- **SEO optimisé** : Meta tags, données structurées, Open Graph
- **Animations** : Transitions fluides et animations AOS

## 📁 Structure du Projet

```
ag groupe/
├── index.html              # Page d'accueil
├── about.html              # Page À propos
├── services.html           # Page Services
├── contact.html            # Page Contact
├── login.html              # Page de connexion
├── dashboard.html          # Dashboard administrateur
├── 404.html                # Page d'erreur 404
├── assets/
│   ├── css/
│   │   ├── style.css       # Styles principaux
│   │   └── dashboard.css   # Styles du dashboard
│   ├── js/
│   │   ├── main.js         # JavaScript principal
│   │   ├── supabase-config.js  # Configuration Supabase
│   │   ├── login.js        # Logique de connexion
│   │   └── dashboard.js    # Logique du dashboard
│   └── images/             # Images du site
├── supabase-schema.sql     # Script SQL pour Supabase
├── vercel.json             # Configuration Vercel
└── package.json            # Métadonnées du projet
```

## 🔐 Accès Dashboard

- **URL** : `/login.html`
- **Email** : `aggroupe@gmail.com`
- **Mot de passe** : `Aggroupe1@`

## 🗄️ Configuration Supabase

### 1. Créer les tables

1. Connectez-vous à votre projet Supabase
2. Allez dans **SQL Editor**
3. Exécutez le script `supabase-schema.sql`

### 2. Tables créées

- **contact_messages** : Stocke tous les messages du formulaire de contact
- **notifications** : Notifications automatiques pour nouveaux messages
- **admin_users** : Table pour les utilisateurs administrateurs (optionnel)

### 3. Politiques RLS

Les politiques Row Level Security sont configurées pour :
- Permettre l'insertion publique dans `contact_messages` (formulaire)
- Permettre la lecture/mise à jour/suppression pour les utilisateurs authentifiés

## 📝 Formulaire de Contact

Le formulaire de contact sur `/contact.html` envoie automatiquement les données à Supabase :
- Nom
- Email
- Sujet
- Service concerné
- Message

Les messages apparaissent instantanément dans le dashboard avec notifications en temps réel.

## 🎨 Dashboard

Le dashboard (`/dashboard.html`) permet de :
- Voir tous les messages de contact
- Marquer les messages comme lus/non lus
- Filtrer les messages (tous, lus, non lus)
- Voir les notifications en temps réel
- Consulter les statistiques

## 🌐 Déploiement Vercel

### Méthode 1 : Via GitHub

1. Poussez votre code sur GitHub
2. Connectez votre repo à Vercel
3. Vercel détectera automatiquement la configuration
4. Déployez !

### Méthode 2 : Via CLI

```bash
npm i -g vercel
vercel login
vercel
vercel --prod
```

## 📱 Responsive Design

Le site est entièrement responsive avec breakpoints pour :
- Mobile (< 576px)
- Tablette (576px - 991px)
- Desktop (992px+)
- Large Desktop (1200px+)

## 🔧 Technologies Utilisées

- HTML5 / CSS3
- JavaScript (Vanilla)
- Supabase (Backend)
- Font Awesome (Icônes)
- AOS (Animations)
- Google Fonts (Poppins)

## 📞 Contact

- **Téléphone** : +242 06 42 15 730 / +242 05 64 94 555
- **Email** : aggroupeofficiel83@gmail.com
- **Adresse** : Boulevard du Maréchal Lyautey, en face du Stade Michel d'Ornano, Centre-ville, Brazzaville, Congo

## 📄 Licence

© 2025 AG Groupe Officiel. Tous droits réservés.
