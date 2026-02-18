# Guide de Gestion des Services - AG Groupe Dashboard

## 📋 Vue d'ensemble

Le dashboard permet de gérer tous les services affichés sur le site public. Tous les services créés ou modifiés dans le dashboard apparaissent automatiquement sur le site public via Supabase.

## 🗄️ Script SQL pour Insérer les Services

### Option 1 : Utiliser le script complet (Recommandé)

Exécutez le fichier `supabase-services-complete.sql` dans l'éditeur SQL de Supabase. Ce script :

- ✅ Insère tous les 6 services existants du site public
- ✅ Met à jour les services existants s'ils sont déjà présents (basé sur le slug)
- ✅ Configure tous les paramètres nécessaires

### Option 2 : Utiliser le script principal

Le fichier `supabase-schema.sql` contient déjà des INSERT pour les services par défaut à la fin du fichier.

## 📝 Structure de la Table Services

```sql
- id (UUID) : Identifiant unique
- title (VARCHAR) : Titre du service
- slug (VARCHAR) : URL-friendly identifier (unique)
- description (TEXT) : Description complète
- short_description (TEXT) : Description courte (pour homepage)
- icon (VARCHAR) : Classe Font Awesome (ex: fas fa-car)
- image_url (VARCHAR) : URL de l'image
- features (JSONB) : Liste des caractéristiques
- service_type (VARCHAR) : Type/catégorie du service
- display_order (INTEGER) : Ordre d'affichage
- is_active (BOOLEAN) : Service actif ou inactif
- show_on_homepage (BOOLEAN) : Afficher sur la page d'accueil
- created_at (TIMESTAMP) : Date de création
- updated_at (TIMESTAMP) : Date de mise à jour
```

## 🎯 Services Existants dans le Site Public

1. **Vente et Location de Véhicules** (slug: `vehicules`)
2. **Nettoyage Professionnel** (slug: `nettoyage`)
3. **Aménagement et Entretien des Espaces Verts** (slug: `espaces-verts`)
4. **Services 4D** (slug: `services-4d`)
5. **Solutions Numériques** (slug: `numerique`)
6. **Formation Professionnelle** (slug: `formation`)

## 🔧 Fonctionnalités du Dashboard

### Ajouter un Service

1. Connectez-vous au dashboard
2. Allez dans "Gestion Services"
3. Cliquez sur "Ajouter un Service"
4. Remplissez le formulaire :
   - **Titre** : Nom du service
   - **Slug** : Généré automatiquement depuis le titre (ou personnalisé)
   - **Icône** : Classe Font Awesome (ex: `fas fa-car`)
   - **Image** : URL de l'image
   - **Description courte** : Pour la page d'accueil
   - **Description complète** : Pour la page services
   - **Caractéristiques** : Une par ligne
   - **Ordre d'affichage** : Pour définir la position
   - **Service actif** : Active/désactive le service
   - **Afficher sur la page d'accueil** : Cocher pour l'afficher
5. Cliquez sur "Enregistrer"

### Modifier un Service

1. Cliquez sur l'icône "Modifier" (crayon) à côté du service
2. Modifiez les champs souhaités
3. Cliquez sur "Enregistrer"

### Supprimer un Service

1. Cliquez sur l'icône "Supprimer" (poubelle) à côté du service
2. Confirmez la suppression

## 🔄 Synchronisation Site Public

### Comment ça fonctionne

1. **Dashboard → Supabase** : Les services créés/modifiés sont sauvegardés dans Supabase
2. **Supabase → Site Public** : Le site public charge les services depuis Supabase via `assets/js/services.js`

### Vérification

Après avoir ajouté/modifié un service dans le dashboard :

1. **Vérifiez dans le dashboard** : Le service doit apparaître dans la liste
2. **Vérifiez sur le site public** :
   - Allez sur `/services.html` → Le service doit apparaître
   - Allez sur `/index.html` → Si `show_on_homepage` est activé, le service apparaît sur la page d'accueil

## 📊 Politiques RLS (Row Level Security)

Les politiques sont configurées pour :

- ✅ **Site public** : Peut lire uniquement les services actifs (`is_active = true`)
- ✅ **Dashboard** : Peut lire TOUS les services (actifs et inactifs) pour la gestion
- ✅ **Dashboard** : Peut créer, modifier et supprimer des services

## 🐛 Dépannage

### Les services n'apparaissent pas dans le dashboard

1. Vérifiez que la table `services` existe dans Supabase
2. Vérifiez que les politiques RLS sont correctement configurées
3. Vérifiez la console du navigateur pour les erreurs
4. Exécutez le script `supabase-services-complete.sql` pour insérer les services

### Les services n'apparaissent pas sur le site public

1. Vérifiez que `is_active = true` pour les services
2. Vérifiez que `assets/js/services.js` est chargé dans `services.html`
3. Vérifiez que Supabase est correctement configuré dans `supabase-config.js`
4. Vérifiez la console du navigateur pour les erreurs

### Erreur lors de l'enregistrement d'un service

1. Vérifiez que tous les champs obligatoires sont remplis
2. Vérifiez que le slug est unique
3. Vérifiez que les politiques RLS permettent l'insertion
4. Vérifiez la console du navigateur pour les erreurs détaillées

## 📝 Notes Importantes

- Les **slugs** doivent être uniques et en minuscules
- Les slugs sont utilisés dans les URLs (ex: `/services.html#vehicules`)
- Les **caractéristiques** sont stockées au format JSONB (tableau)
- L'**ordre d'affichage** détermine la position des services (1 = premier)
- Les services **inactifs** n'apparaissent pas sur le site public mais restent visibles dans le dashboard

## ✅ Checklist

Avant d'utiliser le dashboard :

- [ ] La table `services` est créée dans Supabase
- [ ] Les politiques RLS sont configurées
- [ ] Les services existants sont insérés (script SQL)
- [ ] `supabase-config.js` contient les bonnes clés
- [ ] `services.js` est chargé dans `services.html` et `index.html`
- [ ] Le dashboard peut charger les services
- [ ] Le site public peut charger les services actifs

## 📞 Support

Pour toute question ou problème, consultez la documentation Supabase ou contactez le support technique.

