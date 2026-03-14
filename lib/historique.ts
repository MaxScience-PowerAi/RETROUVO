import { supabase } from './supabase'

// ─── Type d'entrée ────────────────────────────────────────
export type EntryType =
  | 'objet_rendu'
  | 'objet_recu'
  | 'personne_retrouvee'
  | 'depot_recu'
  | 'transfert_envoye'

export interface NewHistoryEntry {
  type:      EntryType
  titre:     string
  detail?:   string
  montant?:  number
  signe:     '+' | '-' | '0'
  methode?:  string
  ville?:    string
  quartier?: string
}

// ─── Enregistrer un événement ─────────────────────────────
// À appeler dans chaque formulaire au moment de la soumission
export async function logHistorique(entry: NewHistoryEntry) {
  const { error } = await supabase
    .from('historique')
    .insert([{
      type:      entry.type,
      titre:     entry.titre,
      detail:    entry.detail    ?? '',
      montant:   entry.montant   ?? 0,
      signe:     entry.signe,
      methode:   entry.methode   ?? null,
      ville:     entry.ville     ?? null,
      quartier:  entry.quartier  ?? null,
    }])

  if (error) {
    console.error('Erreur logHistorique:', error.message)
  }
}

// ─── Exemples d'appel depuis les formulaires ──────────────
//
// 1. Quand une pièce est signalée (SignalerClient.tsx) :
//    await logHistorique({
//      type: 'objet_recu',
//      titre: nomSurLaPiece,
//      detail: `${docType} trouvée à ${quartier}, ${ville}`,
//      montant: gainEstime,
//      signe: '+',
//      methode: 'MTN MoMo',
//      ville, quartier,
//    })
//
// 2. Quand une pièce est récupérée (chat/[id]) :
//    await logHistorique({
//      type: 'objet_rendu',
//      titre: nomSurLaPiece,
//      detail: `CNI rendue au propriétaire`,
//      montant: montantTransfere,
//      signe: '+',
//      methode: 'MTN MoMo',
//    })
//
// 3. Quand une personne est retrouvée :
//    await logHistorique({
//      type: 'personne_retrouvee',
//      titre: nomDeLaPersonne,
//      detail: 'Famille réunie',
//      montant: 0,
//      signe: '0',
//    })
//
// 4. Quand un don est reçu (SoutenirClient.tsx) :
//    await logHistorique({
//      type: 'depot_recu',
//      titre: 'Don reçu',
//      detail: `Donateur : ${nomDonateur || 'Anonyme'}`,
//      montant: parseInt(amount),
//      signe: '+',
//      methode: donationMethod === 'momo' ? 'MTN MoMo' : 'Orange Money',
//    })
