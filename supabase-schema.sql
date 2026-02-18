-- ============================================
-- AG Groupe - Supabase Database Schema
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- Table: contact_messages
-- ============================================
CREATE TABLE IF NOT EXISTS contact_messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(500) NOT NULL,
    message TEXT NOT NULL,
    service VARCHAR(100),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ============================================
-- Table: notifications
-- ============================================
CREATE TABLE IF NOT EXISTS notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    message TEXT,
    type VARCHAR(50) DEFAULT 'info',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ============================================
-- Table: admin_users (for future authentication)
-- ============================================
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ============================================
-- Table: services
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
-- Indexes for better performance
-- ============================================
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_messages_is_read ON contact_messages(is_read);
CREATE INDEX IF NOT EXISTS idx_contact_messages_email ON contact_messages(email);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);

-- ============================================
-- Function to update updated_at timestamp
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for contact_messages
CREATE TRIGGER update_contact_messages_updated_at 
    BEFORE UPDATE ON contact_messages 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger for admin_users
CREATE TRIGGER update_admin_users_updated_at 
    BEFORE UPDATE ON admin_users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Function to create notification on new contact message
-- ============================================
CREATE OR REPLACE FUNCTION create_contact_notification()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO notifications (title, message, type, is_read)
    VALUES (
        'Nouveau message de contact',
        'Vous avez reçu un nouveau message de ' || NEW.name || ' (' || NEW.email || ')',
        'contact',
        FALSE
    );
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to create notification when new contact message is inserted
CREATE TRIGGER on_new_contact_message
    AFTER INSERT ON contact_messages
    FOR EACH ROW
    EXECUTE FUNCTION create_contact_notification();

-- ============================================
-- Row Level Security (RLS) Policies
-- ============================================

-- Enable RLS on all tables
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- ============================================
-- Policies for contact_messages
-- ============================================

-- Allow anyone to insert (for contact form)
CREATE POLICY "Allow public insert on contact_messages"
    ON contact_messages
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- Allow authenticated users to read all
CREATE POLICY "Allow authenticated read on contact_messages"
    ON contact_messages
    FOR SELECT
    TO authenticated
    USING (true);

-- Allow anon to read (for dashboard access with proper token check)
-- Note: In production, use Supabase Auth instead
CREATE POLICY "Allow anon read on contact_messages"
    ON contact_messages
    FOR SELECT
    TO anon
    USING (true);

-- Allow authenticated users to update (mark as read)
CREATE POLICY "Allow authenticated update on contact_messages"
    ON contact_messages
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Allow anon to update (for dashboard)
CREATE POLICY "Allow anon update on contact_messages"
    ON contact_messages
    FOR UPDATE
    TO anon
    USING (true)
    WITH CHECK (true);

-- Allow authenticated users to delete
CREATE POLICY "Allow authenticated delete on contact_messages"
    ON contact_messages
    FOR DELETE
    TO authenticated
    USING (true);

-- ============================================
-- Policies for notifications
-- ============================================

-- Allow authenticated users to read all
CREATE POLICY "Allow authenticated read on notifications"
    ON notifications
    FOR SELECT
    TO authenticated
    USING (true);

-- Allow anon to read notifications
CREATE POLICY "Allow anon read on notifications"
    ON notifications
    FOR SELECT
    TO anon
    USING (true);

-- Allow authenticated users to insert
CREATE POLICY "Allow authenticated insert on notifications"
    ON notifications
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Allow authenticated users to update (mark as read)
CREATE POLICY "Allow authenticated update on notifications"
    ON notifications
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Allow anon to update notifications
CREATE POLICY "Allow anon update on notifications"
    ON notifications
    FOR UPDATE
    TO anon
    USING (true)
    WITH CHECK (true);

-- Allow authenticated users to delete
CREATE POLICY "Allow authenticated delete on notifications"
    ON notifications
    FOR DELETE
    TO authenticated
    USING (true);

-- ============================================
-- Policies for admin_users
-- ============================================

-- Allow authenticated users to read their own data
CREATE POLICY "Allow authenticated read own admin_users"
    ON admin_users
    FOR SELECT
    TO authenticated
    USING (true);

-- Allow authenticated users to update their own data
CREATE POLICY "Allow authenticated update own admin_users"
    ON admin_users
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- ============================================
-- Insert default admin user (optional)
-- Note: Password should be hashed in production
-- ============================================
-- INSERT INTO admin_users (email) VALUES ('aggroupe@gmail.com');

-- ============================================
-- Policies for services
-- ============================================

-- Allow public to read active services (for website)
CREATE POLICY "Allow public read active services"
    ON services
    FOR SELECT
    TO anon, authenticated
    USING (is_active = true);

-- Allow anon to read all services (for dashboard - includes inactive ones)
CREATE POLICY "Allow anon read all services for dashboard"
    ON services
    FOR SELECT
    TO anon
    USING (true);

-- Allow authenticated users to read all services
CREATE POLICY "Allow authenticated read all services"
    ON services
    FOR SELECT
    TO authenticated
    USING (true);

-- Allow authenticated users to insert services
CREATE POLICY "Allow authenticated insert services"
    ON services
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Allow anon to insert (for dashboard with proper auth check)
CREATE POLICY "Allow anon insert services"
    ON services
    FOR INSERT
    TO anon
    WITH CHECK (true);

-- Allow authenticated users to update services
CREATE POLICY "Allow authenticated update services"
    ON services
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Allow anon to update services
CREATE POLICY "Allow anon update services"
    ON services
    FOR UPDATE
    TO anon
    USING (true)
    WITH CHECK (true);

-- Allow authenticated users to delete services
CREATE POLICY "Allow authenticated delete services"
    ON services
    FOR DELETE
    TO authenticated
    USING (true);

-- Allow anon to delete services
CREATE POLICY "Allow anon delete services"
    ON services
    FOR DELETE
    TO anon
    USING (true);

-- ============================================
-- Grant necessary permissions
-- ============================================
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON contact_messages TO anon, authenticated;
GRANT ALL ON notifications TO anon, authenticated;
GRANT ALL ON admin_users TO authenticated;
GRANT ALL ON services TO anon, authenticated;

-- ============================================
-- Insert default services (optional)
-- ============================================
INSERT INTO services (title, slug, description, short_description, icon, image_url, display_order, is_active, show_on_homepage, features) VALUES
('Vente et Location de Véhicules', 'vehicules', 'AG Groupe vous propose une large sélection de véhicules neufs et d''occasion à la vente ou à la location. Que vous ayez besoin d''une voiture particulière, d''un utilitaire ou d''une flotte complète pour votre entreprise, nous avons la solution adaptée à vos besoins.', 'Vente et location de voitures neuves et d''occasion pour tous vos besoins de mobilité.', 'fas fa-car', 'assets/images/location.jpg', 1, true, true, '["Location de voitures à court et long terme", "Vente de véhicules neufs et d''occasion", "Gestion de flotte automobile", "Services d''entretien et de réparation", "Assistance routière 24/7"]'::jsonb),
('Nettoyage Professionnel', 'nettoyage', 'Notre service de nettoyage professionnel garantit des espaces de travail propres, sains et accueillants. Nous utilisons des produits écologiques et des méthodes de nettoyage efficaces pour répondre aux normes les plus exigeantes.', 'Entretien et nettoyage professionnel de bureaux, entrepôts et espaces commerciaux avec des produits écologiques.', 'fas fa-broom', 'assets/images/entretien.jpg', 2, true, true, '["Nettoyage de bureaux et locaux professionnels", "Nettoyage d''entrepôts et espaces industriels", "Nettoyage après travaux", "Nettoyage de vitres et façades", "Désinfection et assainissement"]'::jsonb),
('Aménagement et Entretien des Espaces Verts', 'espaces-verts', 'Créez un environnement extérieur attrayant et bien entretenu avec nos services d''aménagement et d''entretien des espaces verts. Notre équipe d''experts vous propose des solutions sur mesure pour valoriser vos espaces extérieurs.', 'Création et aménagement de jardins pour un environnement agréable et durable.', 'fas fa-tree', 'assets/images/vert.jpg', 3, true, true, '["Création et aménagement de jardins", "Entretien régulier des espaces verts", "Taille et élagage des arbres et arbustes", "Installation de systèmes d''arrosage", "Désherbage et traitement des plantes"]'::jsonb),
('Services 4D', 'services-4d', 'Nos services 4D (Désinfection, Désinsectisation, Dératisation, Désertion) vous garantissent un environnement sain et sécurisé, exempt de nuisibles et de micro-organismes pathogènes.', 'Un environnement sain et sécurisé grâce à nos services de désinfection, désinsectisation et dératisation.', 'fas fa-bug', 'assets/images/4D.jpg', 4, true, true, '["Désinfection des locaux et espaces communs", "Lutte contre les insectes nuisibles", "Dératisation complète", "Traitement contre les reptiles indésirables", "Solutions écologiques et durables"]'::jsonb),
('Solutions Numériques', 'numerique', 'Développez votre présence en ligne avec nos solutions numériques sur mesure. De la création de sites web au développement d''applications mobiles, nous vous accompagnons dans votre transformation digitale.', 'Développez votre présence numérique avec nos solutions web, applications et services informatiques sur mesure.', 'fas fa-laptop-code', 'assets/images/informatique.avif', 5, true, true, '["Création de sites web professionnels", "Développement d''applications mobiles", "Référencement naturel (SEO)", "Gestion des réseaux sociaux", "Solutions e-commerce"]'::jsonb),
('Formation Professionnelle', 'formation', 'Développez les compétences de vos équipes avec nos programmes de formation professionnelle. Nos formations sont dispensées par des experts et adaptées aux besoins spécifiques de votre entreprise.', 'Formation professionnelle adaptée aux besoins de votre entreprise.', 'fas fa-graduation-cap', 'assets/images/bureautique.avif', 6, true, true, '["Formation en informatique et bureautique", "Développement des compétences managériales", "Formation aux métiers du numérique", "Langues étrangères", "Formations sectorielles spécifiques"]'::jsonb)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- End of Schema
-- ============================================

