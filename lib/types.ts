// ── Types métier RETROUVO ──────────────────────────────────

export type DocType = 'CNI' | 'ACTE' | 'STUDENT' | 'OTHER'

export interface DocTypeConfig {
  label: string
  price: number | 'VARIABLE'
  fees:  number | 'DYNAMIC'
}

export interface FoundItem {
  id:          string
  type:        DocType
  name:        string
  city:        string
  area:        string
  finder_name: string
  created_at:  string
  status:      string
  has_proof:   boolean
  custom_price: number
}

export interface MissingPerson {
  id:          string
  name:        string
  age:         string
  city:        string
  area:        string
  description: string
  type:        'found_by_samaritan' | 'missing_alert'
  created_at:  string
}

export interface ChatMessage {
  id:         string
  item_id:    string
  sender:     'SYSTEM' | 'ALERT_CALL' | 'SUCCESS' | 'USER'
  text:       string
  created_at: string
}

export interface DonationRecord {
  id:          string
  amount:      number
  method:      'momo' | 'om'
  donor_name:  string | null
  message:     string | null
  created_at:  string
}

export interface CommunityMember {
  id:         string
  name:       string
  city:       string
  role:       CommunityRole
  phone:      string
  message:    string | null
  created_at: string
}

export type CommunityRole =
  | 'citoyen'
  | 'samaritain'
  | 'relais'
  | 'technique'
  | 'partenaire'
  | 'ami'

// ── Configuration financière (INCHANGÉE) ──────────────────

export const DOC_TYPES: Record<DocType, DocTypeConfig> = {
  CNI:     { label: 'CNI / Passeport',            price: 2000, fees: 100 },
  ACTE:    { label: 'Actes (Naissance, Mariage)',  price: 1500, fees: 100 },
  STUDENT: { label: 'Carte Étudiant / Badge',      price: 500,  fees: 50  },
  OTHER:   { label: 'Titres de Haute Valeur',      price: 'VARIABLE', fees: 'DYNAMIC' },
}

export const QUARTIERS_RELAIS: Record<string, string[]> = {
  Douala:  ['Akwa (Boulangerie Zepol)', 'Bonabéri (Ancienne Route)', 'Village (Marché)', 'Logbessou (Carrefour)', 'Bassa (Zone Industrielle)'],
  Yaoundé: ['Bastos (Ambassade)', 'Mvan (Agences)', 'Mokolo (Marché)', 'Biyem-Assi (Carrefour)', 'Soa (Université)'],
}

export const DONATION_PRESETS = [500, 1000, 2000, 5000, 10000]

export function calculateSamaritainGain(type: DocType, value?: string): number {
  if (type !== 'OTHER') return (DOC_TYPES[type].price as number) / 2
  return Math.round(parseInt(value || '0') / 2)
}

export function calculateFees(type: DocType, value?: string): number {
  if (type !== 'OTHER') return DOC_TYPES[type].fees as number
  return Math.max(100, Math.round(parseInt(value || '0') * 0.01))
}
