export type Screen =
  | 'landingsside'
  | 'se_oppdrag'
  | 'legg_ut_oppdrag'
  | 'dashbord'
  | 'finn_hjelper';

export interface Oppdrag {
  id: string;
  tittel: string;
  beskrivelse: string;
  kategori: 'hage' | 'flytting' | 'vasking' | 'annet';
  pris: number;
  sted: string;
  dato: string;
  bilde?: string;
  status?: string;
  opprettetDato: string;
}

export interface Hjelper {
  id: string;
  navn: string;
  rolle: string;
  pris: number;
  enhet: string; // F.eks. "per time", "per tur"
  rating: number;
  antallVurderinger: number;
  beskrivelse: string;
  bilde: string;
  fremhevet?: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  tekst: string;
  tid: string;
}
