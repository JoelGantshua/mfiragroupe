-- ============================================
-- Script SQL COMPLET pour les Services
-- AG Groupe - Supabase
-- ============================================
-- Ce script crée la table services et insère tous les services
-- Exécutez ce script EN ENTIER dans l'éditeur SQL de Supabase
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- Créer la table services si elle n'existe pas
-- ============================================
CREATE TABLE IF NOT EXISTS services (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT NOT NULL,
    short_description TEXT,
    icon VARCHAR(100),
    image_url VARCHAR(500),
    features JSONB,
    service_type VARCHAR(100),
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    show_on_homepage BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ============================================
-- Créer les index pour de meilleures performances
-- ============================================
CREATE INDEX IF NOT EXISTS idx_services_is_active ON services(is_active);
CREATE INDEX IF NOT EXISTS idx_services_display_order ON services(display_order);
CREATE INDEX IF NOT EXISTS idx_services_slug ON services(slug);
CREATE INDEX IF NOT EXISTS idx_services_show_on_homepage ON services(show_on_homepage);

-- ============================================
-- Fonction pour mettre à jour updated_at automatiquement
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- ============================================
-- Trigger pour mettre à jour updated_at
-- ============================================
DROP TRIGGER IF EXISTS update_services_updated_at ON services;
CREATE TRIGGER update_services_updated_at 
    BEFORE UPDATE ON services 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Activer Row Level Security (RLS)
-- ============================================
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- ============================================
-- Supprimer les anciennes politiques si elles existent
-- ============================================
DROP POLICY IF EXISTS "Allow public read active services" ON services;
DROP POLICY IF EXISTS "Allow anon read all services for dashboard" ON services;
DROP POLICY IF EXISTS "Allow authenticated read all services" ON services;
DROP POLICY IF EXISTS "Allow authenticated insert services" ON services;
DROP POLICY IF EXISTS "Allow anon insert services" ON services;
DROP POLICY IF EXISTS "Allow authenticated update services" ON services;
DROP POLICY IF EXISTS "Allow anon update services" ON services;
DROP POLICY IF EXISTS "Allow authenticated delete services" ON services;
DROP POLICY IF EXISTS "Allow anon delete services" ON services;

-- ============================================
-- Créer les politiques RLS (Row Level Security)
-- ============================================

-- Permettre au public de lire uniquement les services actifs (pour le site web)
CREATE POLICY "Allow public read active services"
    ON services
    FOR SELECT
    TO anon, authenticated
    USING (is_active = true);

-- Permettre à anon de lire TOUS les services (pour le dashboard)
CREATE POLICY "Allow anon read all services for dashboard"
    ON services
    FOR SELECT
    TO anon
    USING (true);

-- Permettre aux utilisateurs authentifiés de lire tous les services
CREATE POLICY "Allow authenticated read all services"
    ON services
    FOR SELECT
    TO authenticated
    USING (true);

-- Permettre aux utilisateurs authentifiés d'insérer des services
CREATE POLICY "Allow authenticated insert services"
    ON services
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Permettre à anon d'insérer des services (pour le dashboard)
CREATE POLICY "Allow anon insert services"
    ON services
    FOR INSERT
    TO anon
    WITH CHECK (true);

-- Permettre aux utilisateurs authentifiés de mettre à jour des services
CREATE POLICY "Allow authenticated update services"
    ON services
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Permettre à anon de mettre à jour des services (pour le dashboard)
CREATE POLICY "Allow anon update services"
    ON services
    FOR UPDATE
    TO anon
    USING (true)
    WITH CHECK (true);

-- Permettre aux utilisateurs authentifiés de supprimer des services
CREATE POLICY "Allow authenticated delete services"
    ON services
    FOR DELETE
    TO authenticated
    USING (true);

-- Permettre à anon de supprimer des services (pour le dashboard)
CREATE POLICY "Allow anon delete services"
    ON services
    FOR DELETE
    TO anon
    USING (true);

-- ============================================
-- Accorder les permissions nécessaires
-- ============================================
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON services TO anon, authenticated;

-- ============================================
-- Insérer tous les services du site public
-- ============================================
INSERT INTO services (title, slug, description, short_description, icon, image_url, display_order, is_active, show_on_homepage, service_type, features) VALUES

-- Service 1: Véhicules
('Vente et Location de Véhicules', 'vehicules', 
'AG Groupe vous propose une large sélection de véhicules neufs et d''occasion à la vente ou à la location. Que vous ayez besoin d''une voiture particulière, d''un utilitaire ou d''une flotte complète pour votre entreprise, nous avons la solution adaptée à vos besoins.', 
'Vente et location de voitures neuves et d''occasion pour tous vos besoins de mobilité. Large gamme disponible.', 
'fas fa-car', 
'assets/images/location.jpg', 
1, 
true, 
true, 
'Véhicules',
'["Location de voitures à court et long terme", "Vente de véhicules neufs et d''occasion", "Gestion de flotte automobile", "Services d''entretien et de réparation", "Assistance routière 24/7"]'::jsonb),

-- Service 2: Nettoyage
('Nettoyage Professionnel', 'nettoyage', 
'Notre service de nettoyage professionnel garantit des espaces de travail propres, sains et accueillants. Nous utilisons des produits écologiques et des méthodes de nettoyage efficaces pour répondre aux normes les plus exigeantes.', 
'Entretien et nettoyage professionnel de bureaux, entrepôts et espaces commerciaux avec des produits écologiques.', 
'fas fa-broom', 
'assets/images/entretien.jpg', 
2, 
true, 
true, 
'Nettoyage',
'["Nettoyage de bureaux et locaux professionnels", "Nettoyage d''entrepôts et espaces industriels", "Nettoyage après travaux", "Nettoyage de vitres et façades", "Désinfection et assainissement"]'::jsonb),

-- Service 3: Espaces Verts
('Aménagement et Entretien des Espaces Verts', 'espaces-verts', 
'Créez un environnement extérieur attrayant et bien entretenu avec nos services d''aménagement et d''entretien des espaces verts. Notre équipe d''experts vous propose des solutions sur mesure pour valoriser vos espaces extérieurs.', 
'Création et aménagement de jardins pour un environnement agréable et durable.', 
'fas fa-tree', 
'assets/images/vert.jpg', 
3, 
true, 
true, 
'Espaces Verts',
'["Création et aménagement de jardins", "Entretien régulier des espaces verts", "Taille et élagage des arbres et arbustes", "Installation de systèmes d''arrosage", "Désherbage et traitement des plantes"]'::jsonb),

-- Service 4: Services 4D
('Services 4D', 'services-4d', 
'Nos services 4D (Désinfection, Désinsectisation, Dératisation, Désertion) vous garantissent un environnement sain et sécurisé, exempt de nuisibles et de micro-organismes pathogènes.', 
'Un environnement sain et sécurisé grâce à nos services de désinfection, désinsectisation et dératisation.', 
'fas fa-bug', 
'assets/images/4D.jpg', 
4, 
true, 
true, 
'Services 4D',
'["Désinfection des locaux et espaces communs", "Lutte contre les insectes nuisibles", "Dératisation complète", "Traitement contre les reptiles indésirables", "Solutions écologiques et durables"]'::jsonb),

-- Service 5: Solutions Numériques
('Solutions Numériques', 'numerique', 
'Développez votre présence en ligne avec nos solutions numériques sur mesure. De la création de sites web au développement d''applications mobiles, nous vous accompagnons dans votre transformation digitale.', 
'Développez votre présence numérique avec nos solutions web, applications et services informatiques sur mesure.', 
'fas fa-laptop-code', 
'assets/images/informatique.avif', 
5, 
true, 
true, 
'Solutions Numériques',
'["Création de sites web professionnels", "Développement d''applications mobiles", "Référencement naturel (SEO)", "Gestion des réseaux sociaux", "Solutions e-commerce"]'::jsonb),

-- Service 6: Formation
('Formation Professionnelle', 'formation', 
'Développez les compétences de vos équipes avec nos programmes de formation professionnelle. Nos formations sont dispensées par des experts et adaptées aux besoins spécifiques de votre entreprise.', 
'Formation professionnelle adaptée aux besoins de votre entreprise.', 
'fas fa-graduation-cap', 
'assets/images/bureautique.avif', 
6, 
true, 
true, 
'Formation',
'["Formation en informatique et bureautique", "Développement des compétences managériales", "Formation aux métiers du numérique", "Langues étrangères", "Formations sectorielles spécifiques"]'::jsonb)

-- Mettre à jour si le service existe déjà (basé sur le slug)
ON CONFLICT (slug) 
DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    short_description = EXCLUDED.short_description,
    icon = EXCLUDED.icon,
    image_url = EXCLUDED.image_url,
    display_order = EXCLUDED.display_order,
    service_type = EXCLUDED.service_type,
    features = EXCLUDED.features,
    updated_at = TIMEZONE('utc'::text, NOW());

-- ============================================
-- Vérification : Afficher les services insérés
-- ============================================
-- Exécutez cette requête pour vérifier que tout fonctionne :
-- SELECT id, title, slug, is_active, display_order, created_at FROM services ORDER BY display_order;

-- ============================================
-- Script terminé avec succès !
-- ============================================
-- Les 6 services sont maintenant disponibles dans :
-- 1. Le dashboard (tous les services, actifs et inactifs)
-- 2. Le site public (uniquement les services actifs)
-- ============================================
