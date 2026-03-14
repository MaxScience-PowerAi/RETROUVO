-- ════════════════════════════════════════════════════════
-- RETROUVO — Schéma base de données Supabase
-- Copie ce fichier dans Supabase → SQL Editor → Run
-- ════════════════════════════════════════════════════════

-- Table des pièces trouvées
create table if not exists found_items (
  id           uuid default gen_random_uuid() primary key,
  type         text not null check (type in ('CNI','ACTE','STUDENT','OTHER')),
  name         text not null,
  city         text not null,
  area         text not null,
  finder_name  text not null,
  finder_phone text not null,
  account_name text not null,
  has_proof    boolean default false,
  custom_price integer not null default 0,
  status       text default 'Disponible',
  created_at   timestamptz default now()
);

-- Table des alertes disparitions
create table if not exists missing_persons (
  id          uuid default gen_random_uuid() primary key,
  name        text not null,
  age         text,
  city        text not null,
  area        text,
  description text,
  type        text default 'missing_alert' check (type in ('found_by_samaritan','missing_alert')),
  family_phone text not null,
  created_at  timestamptz default now()
);

-- Table des messages chat
create table if not exists chat_messages (
  id         uuid default gen_random_uuid() primary key,
  item_id    uuid not null,
  item_type  text default 'found_item' check (item_type in ('found_item','missing_person')),
  sender     text not null,
  text       text not null,
  created_at timestamptz default now()
);

-- Table des signalements de perte
create table if not exists loss_reports (
  id           uuid default gen_random_uuid() primary key,
  doc_type     text not null,
  doc_name     text not null,
  phone        text not null,
  created_at   timestamptz default now()
);

-- Table des dons
create table if not exists donations (
  id          uuid default gen_random_uuid() primary key,
  amount      integer not null,
  method      text not null check (method in ('momo','om')),
  donor_name  text,
  message     text,
  created_at  timestamptz default now()
);

-- Table des membres communauté
create table if not exists community_members (
  id         uuid default gen_random_uuid() primary key,
  name       text not null,
  city       text not null,
  role       text not null,
  phone      text not null,
  message    text,
  created_at timestamptz default now()
);

-- ── Sécurité : Row Level Security ──
alter table found_items       enable row level security;
alter table missing_persons   enable row level security;
alter table chat_messages     enable row level security;
alter table loss_reports      enable row level security;
alter table donations         enable row level security;
alter table community_members enable row level security;

-- Lecture publique pour found_items et missing_persons
create policy "lecture publique found_items"
  on found_items for select using (true);

create policy "lecture publique missing_persons"
  on missing_persons for select using (true);

-- Insertion publique (tout citoyen peut signaler)
create policy "insertion publique found_items"
  on found_items for insert with check (true);

create policy "insertion publique missing_persons"
  on missing_persons for insert with check (true);

create policy "insertion publique loss_reports"
  on loss_reports for insert with check (true);

create policy "insertion publique donations"
  on donations for insert with check (true);

create policy "insertion publique community_members"
  on community_members for insert with check (true);

create policy "lecture publique chat_messages"
  on chat_messages for select using (true);

create policy "insertion publique chat_messages"
  on chat_messages for insert with check (true);
