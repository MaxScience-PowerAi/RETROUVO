-- ============================================================
-- RETROUVO — Script SQL Supabase
-- À coller dans : Supabase → SQL Editor → New Query → Run
-- ============================================================

-- Table principale : tous les événements de RETROUVO
CREATE TABLE IF NOT EXISTS historique (
  id          BIGSERIAL PRIMARY KEY,
  type        TEXT NOT NULL CHECK (type IN (
                'objet_rendu',
                'objet_recu',
                'personne_retrouvee',
                'depot_recu',
                'transfert_envoye'
              )),
  titre       TEXT NOT NULL,
  detail      TEXT,
  montant     INTEGER DEFAULT 0,
  signe       TEXT DEFAULT '0' CHECK (signe IN ('+', '-', '0')),
  methode     TEXT,
  ville       TEXT,
  quartier    TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour trier rapidement par date
CREATE INDEX IF NOT EXISTS idx_historique_date ON historique (created_at DESC);

-- Permissions publiques en lecture (pour afficher l'historique)
ALTER TABLE historique ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lecture publique historique"
  ON historique FOR SELECT
  USING (true);

CREATE POLICY "Insertion authentifiée historique"
  ON historique FOR INSERT
  WITH CHECK (true);

-- ============================================================
-- DONNÉES DE DÉPART (optionnel - supprime ces lignes si tu
-- veux une page vraiment vide au lancement)
-- ============================================================

-- Décommenter ci-dessous pour avoir des données de test :
/*
INSERT INTO historique (type, titre, detail, montant, signe, methode, ville, quartier) VALUES
  ('objet_rendu',       '[NOM SUR LA PIÈCE]',  'CNI récupérée par son propriétaire',       1000, '+', 'MTN MoMo',      'Douala',  'Akwa'),
  ('personne_retrouvee','[CITOYEN RETROUVÉ]',   'Personne âgée réunie avec sa famille',     0,    '0', NULL,            'Douala',  'Bonabéri'),
  ('depot_recu',        'Don reçu',             'Soutien anonyme à la mission RETROUVO',   2000, '+', 'Orange Money',  'Douala',  NULL),
  ('transfert_envoye',  'Transfert Samaritain', 'Récompense pour CNI rendue',              1000, '-', 'MTN MoMo',      'Douala',  'Akwa');
*/


-- ============================================================
-- TABLE MEMBRES — La Famille RETROUVO
-- ============================================================

CREATE TABLE IF NOT EXISTS membres (
  id          BIGSERIAL PRIMARY KEY,
  prenom      TEXT NOT NULL,
  ville       TEXT NOT NULL DEFAULT 'Cameroun',
  role        TEXT NOT NULL DEFAULT 'citoyen' CHECK (role IN (
                'citoyen', 'samaritain', 'relais',
                'technique', 'partenaire', 'ami'
              )),
  statut      TEXT NOT NULL DEFAULT 'actif' CHECK (statut IN ('actif', 'suspendu', 'retiré')),
  joined_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour trier par date d'adhésion
CREATE INDEX IF NOT EXISTS idx_membres_date ON membres (joined_at DESC);
CREATE INDEX IF NOT EXISTS idx_membres_statut ON membres (statut);

-- Sécurité ligne par ligne
ALTER TABLE membres ENABLE ROW LEVEL SECURITY;

-- Lecture publique : tout le monde peut voir les membres actifs
CREATE POLICY "Lecture publique membres actifs"
  ON membres FOR SELECT
  USING (statut = 'actif');

-- Insertion publique : le formulaire peut ajouter un membre
CREATE POLICY "Inscription membre"
  ON membres FOR INSERT
  WITH CHECK (true);

-- Mise à jour : seulement via service_role (admin/système)
-- Le bouton "Sortir" côté client appelle une API route sécurisée
CREATE POLICY "Retrait membre"
  ON membres FOR UPDATE
  USING (true);
