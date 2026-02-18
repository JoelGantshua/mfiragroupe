# Instructions pour Exécuter les Scripts SQL dans Supabase

## ⚠️ Erreur "relation services does not exist"

Cette erreur signifie que la table `services` n'existe pas encore dans votre base de données Supabase.

## ✅ Solution : Exécuter le Script Complet

### Option 1 : Utiliser le Script Complet (RECOMMANDÉ)

1. **Ouvrez Supabase Dashboard**
   - Allez sur https://supabase.com
   - Connectez-vous à votre projet
   - URL du projet : `https://hajfduiipstqtejgqcvg.supabase.co`

2. **Ouvrez l'Éditeur SQL**
   - Dans le menu de gauche, cliquez sur **"SQL Editor"**
   - Cliquez sur **"New Query"**

3. **Copiez et Collez le Script Complet**
   - Ouvrez le fichier `supabase-services-complete.sql`
   - **Copiez TOUT le contenu** (du début à la fin)
   - Collez-le dans l'éditeur SQL de Supabase

4. **Exécutez le Script**
   - Cliquez sur **"Run"** (ou appuyez sur `Ctrl+Enter` / `Cmd+Enter`)
   - Attendez que le script se termine

5. **Vérifiez le Résultat**
   - Vous devriez voir "Success. No rows returned" ou un message de succès
   - Exécutez cette requête pour vérifier :
   ```sql
   SELECT id, title, slug, is_active, display_order FROM services ORDER BY display_order;
   ```
   - Vous devriez voir les 6 services listés

### Option 2 : Exécuter le Script Principal d'Abord

Si vous préférez utiliser le script principal `supabase-schema.sql` :

1. **Exécutez d'abord `supabase-schema.sql`**
   - Ce script crée TOUTES les tables (contact_messages, notifications, services, admin_users)
   - Il configure toutes les politiques RLS
   - Il insère les services par défaut

2. **Puis exécutez `supabase-services-complete.sql`** (optionnel)
   - Ce script met à jour les services si nécessaire

## 📋 Ordre d'Exécution Recommandé

### Pour une Installation Complète (Première fois)

1. ✅ Exécutez `supabase-schema.sql` (script principal complet)
   - Crée toutes les tables
   - Configure toutes les politiques
   - Insère les données par défaut

### Si vous avez déjà exécuté `supabase-schema.sql`

1. ✅ Exécutez `supabase-services-complete.sql`
   - Crée la table services si elle n'existe pas
   - Met à jour les services existants
   - Configure les politiques RLS pour les services

## 🔍 Vérification

Après avoir exécuté le script, vérifiez que tout fonctionne :

### 1. Vérifier que la table existe
```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name = 'services';
```
**Résultat attendu** : Une ligne avec `services`

### 2. Vérifier que les services sont insérés
```sql
SELECT id, title, slug, is_active, display_order 
FROM services 
ORDER BY display_order;
```
**Résultat attendu** : 6 lignes avec les services

### 3. Vérifier les politiques RLS
```sql
SELECT policyname, cmd, roles 
FROM pg_policies 
WHERE tablename = 'services';
```
**Résultat attendu** : Plusieurs politiques listées

## 🐛 Dépannage

### Erreur : "relation services does not exist"
**Solution** : Exécutez `supabase-services-complete.sql` qui crée la table avant d'insérer les données.

### Erreur : "duplicate key value violates unique constraint"
**Solution** : C'est normal, cela signifie que les services existent déjà. Le script utilise `ON CONFLICT` pour les mettre à jour.

### Erreur : "permission denied"
**Solution** : Vérifiez que vous êtes connecté en tant qu'administrateur du projet Supabase.

### Les services n'apparaissent pas dans le dashboard
**Solution** :
1. Vérifiez que les politiques RLS sont créées
2. Vérifiez que `is_active = true` pour les services
3. Vérifiez la console du navigateur pour les erreurs

## 📝 Notes Importantes

- ⚠️ **Ne supprimez pas les politiques RLS** : Elles sont nécessaires pour la sécurité
- ⚠️ **Ne modifiez pas les slugs** : Ils sont utilisés dans les URLs
- ✅ **Vous pouvez modifier les services** depuis le dashboard après l'insertion
- ✅ **Le script est idempotent** : Vous pouvez l'exécuter plusieurs fois sans problème

## ✅ Checklist

Avant d'utiliser le dashboard :

- [ ] La table `services` existe dans Supabase
- [ ] Les 6 services sont insérés (vérifiez avec la requête SELECT)
- [ ] Les politiques RLS sont créées
- [ ] Les index sont créés
- [ ] Le trigger `update_services_updated_at` existe
- [ ] Le dashboard peut charger les services (vérifiez dans le navigateur)

## 📞 Support

Si vous rencontrez toujours des problèmes :

1. Vérifiez les logs dans Supabase (Logs → Postgres Logs)
2. Vérifiez la console du navigateur (F12 → Console)
3. Vérifiez que les clés Supabase sont correctes dans `supabase-config.js`

