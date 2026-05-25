import fs from 'fs/promises';
import path from 'path';
import BaseRepository from './BaseRepository';
import { Oppdrag, Hjelper, Bruker } from '../../src/types';

interface DatabaseSchema {
  oppdrag: Oppdrag[];
  hjelpere: Hjelper[];
  brukere: (Bruker & { sub: string })[];
}

const INITIAL_OPPDRAG: Oppdrag[] = [
  {
    id: 'o1',
    tittel: 'Klipping av plen og trimming av hekk',
    beskrivelse: 'Trenger hjelp til å klippe ca 200kvm plen og trimme en bøkhekk. Alt utstyr finnes på stedet.',
    kategori: 'hage',
    pris: 850,
    sted: 'Oslo, Nordstrand',
    dato: 'Innen 15. Juni',
    bilde: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB8Naujp1p1KD9VN825TOk0Nf0InYsBFe8divYF68yFWOuw34k-Y4H2DENJZhZYb-46Mg7vwU0-JfTKfx8J_7EOq_lFEX-WW8YLoRrsKe8TklQeN7vimYBPsfePK09jOE7UCenhuCIlUwhttUeh9qOIoNqLYCILZq_RaNtBjA20PA7KufxCUl_gV2rOi1JDJX7f7zlMg5Ugnvg2FYNyyo4LKvDe_YGyT7oZOYB1gmjXs2TBnKhslKPODvcBuQLL0h7ryIGflW4QDLk',
    status: 'Aktiv',
    opprettetDato: '2026-05-20'
  },
  {
    id: 'o2',
    tittel: 'Montering av IKEA PAX garderobe',
    beskrivelse: 'Trenger montering av 2 stk PAX skap (100cm bredde). Skapene er levert.',
    kategori: 'annet',
    pris: 1200,
    sted: 'Bergen, Sentrum',
    dato: 'Snarest',
    bilde: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDD7g6u2qGP2bnYGq_vX7pLulUxWeQNJT7m9llEXJ_WNOKldAuVTgorX_vtaGt659XMOPXzO578SrkMJIapbpZtSQs5IZ_vvCDJ16P2z-cH1Wu8pyntU61X7xBOMtGEqEYxryJFb29Y-bgLzPGYuE_CTwn0w-OVdOwma5B7O7J8_aQGSDSCAMBNVsHWB8BeE9TKatTQfQV5nLa2EXoZE030X_4XwN5va2GqaJEVzshor4KUZQPmiGqwOQu6zH9xrk0K6wN0zdKQFd4',
    status: 'Vurdert av eier',
    opprettetDato: '2026-05-22'
  },
  {
    id: 'o3',
    tittel: 'Utvask av leilighet',
    beskrivelse: '35 kvm, trenger grundig vask innen fredag. Støvsuger, mopp og vaskemidler er klare.',
    kategori: 'vasking',
    pris: 1500,
    sted: 'Oslo, Frogner',
    dato: 'Innen fredag',
    bilde: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCNO4XIoPuZPv4Gwts24ESvpSgbf9OohXVCOIbDSh_uVwEBbAIsGck0swyt8ql2B3uttoV9qzLBTaJeDDkTnh-drHJ8Gw6ppdp4vEYCAepxBNStmKd_yDkFjnidZRzaqqCMM6IXtRjgUUc_BTWymnndEgiA0t0bGEXipjwQvoU5NYAEQsLoQY3iv6qQ5hVZf4MBxWDQlSSfgBesveg032P6b-LCEKkovU193IFqf8i1zDaYBn0Z6uH5qN2H8R2Im0yTbrd1EF3q6kU',
    status: 'Aktiv',
    opprettetDato: '2026-05-23'
  },
  {
    id: 'o4',
    tittel: 'Flyttehjelp - 2 timer',
    beskrivelse: 'Hjelpe til med å bære esker og noen lette møbler fra 1. etasje til flyttebil.',
    kategori: 'flytting',
    pris: 1200,
    sted: 'Sandvika',
    dato: 'Søndag 24. Mai',
    status: 'Vurdert av eier',
    opprettetDato: '2026-05-21'
  }
];

const INITIAL_HJELPERE: Hjelper[] = [
  {
    id: 'h1',
    navn: 'Maren Kristensen',
    rolle: 'Erfaren Pianolærer',
    pris: 450,
    enhet: 'per time',
    rating: 4.9,
    antallVurderinger: 42,
    beskrivelse: 'Jeg har spilt piano i 15 år og elsker å lære bort musikkglede til både barn og voksne. Tilpasser undervisningen etter ditt nivå og dine favorittsanger.',
    bilde: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD_pJTMZDNjdwoJaa18DLzraufoyWaN1SyrTcei3YFOKlAfVOazMq5lSWM9L55JerKkSIEL-pmmXtDRtvu5ERJ-tQbX96E6AQwrIwPFcb0bE3Ga9E6GrVYquqV9fX2amsOHkUe8mxxotYS8PevK19oCupKCDFrNU-wd6QkAfhtG9VY0FE8rVrjYqCCBB32c4JpEpN_3iRlifJQu9pL0rAamr_ezRjbfLFhTe6E3cbkUX37ZjV52nTklbAuY_S-2N98-XHvv4nVVPBY',
    fremhevet: true
  },
  {
    id: 'h2',
    navn: 'Thomas Berg',
    rolle: 'Matematikk-ekspert',
    pris: 350,
    enhet: 'per time',
    rating: 5.0,
    antallVurderinger: 18,
    beskrivelse: 'Mastergrad i ingeniørfag og lang erfaring med leksehjelp for ungdomskole og VGS. Jeg gjør matte forståelig og gøy!',
    bilde: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD_r1nM7DMAt5KG7n11r8RERDHDbMESwRsp-iYjC4Gaum-DhY7KOnxdsCBTGYFJ5ezF0AKA3pB4gSV_am6goMJbSkiWSJBruKJ_prwaZHsO_GNqvoyyKmPaejRG-EuvZrFF1dkPiP6JFnH0AOHZkfDGy51QKD_VnTxWEtrprgYEK_OKxfQ3m-vkCu7LIAKLOpy6WLTfzo9iMQaDLrgGPu-tmdrY24Czwi5GiheDmilQLqAHRJinnciLNckoSNbUuJtNzixQDKzH7mI',
    fremhevet: false
  },
  {
    id: 'h3',
    navn: 'Sofie Lund',
    rolle: 'Profesjonell hundelufter',
    pris: 200,
    enhet: 'per tur',
    rating: 4.8,
    antallVurderinger: 124,
    beskrivelse: 'Trenger hunden din litt ekstra aktivitet i hverdagen? Jeg tilbyr trygge og morsomme turer i skog og mark for alle typer hunder.',
    bilde: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBobMvhm2V8y4CJ8NyzbpYe7azvotqFGD1X4mY4IzOk1LUGZTmwJmk56yRHToyc6Q4MoXTo5nSVSwXCPwc5Y1ZV9hwBIFPPHKXedv2aB0YQtLAKR0ZXvQTMxw8I5g5PYd2uz1AUzBKBZkEOxS4hbFjjON1LRnw1idCP3_MJd-Rlzlaov_bREE-BfTXDxREe1PHJ991oValoa2FrI5laFMMs7JFzvRLI29ekFyXfBhB7tM9qm6Ls9J2QJGXO0_zlJ5pBJloLHfwVg-0',
    fremhevet: false
  }
];

export default class LocalJsonRepository extends BaseRepository {
  private filePath: string;

  constructor() {
    super();
    this.filePath = path.join(process.cwd(), 'data', 'db.json');
  }

  private async _readDb(): Promise<DatabaseSchema> {
    try {
      await fs.mkdir(path.dirname(this.filePath), { recursive: true });
      const data = await fs.readFile(this.filePath, 'utf8');
      return JSON.parse(data) as DatabaseSchema;
    } catch (error) {
      const initialDb: DatabaseSchema = {
        oppdrag: INITIAL_OPPDRAG.map(o => ({ ...o, opprettetAv: 'user-mock-1' })),
        hjelpere: INITIAL_HJELPERE,
        brukere: [
          {
            id: 'user-mock-1',
            navn: 'Ola Nordmann',
            epost: 'ola@nordmann.no',
            mobil: '+47 999 99 999',
            sub: 'mock-sub-1',
            verified: true
          }
        ]
      };
      await this._writeDb(initialDb);
      return initialDb;
    }
  }

  private async _writeDb(data: DatabaseSchema): Promise<void> {
    await fs.mkdir(path.dirname(this.filePath), { recursive: true });
    await fs.writeFile(this.filePath, JSON.stringify(data, null, 2), 'utf8');
  }

  async listOppdrag(filters: {
    kategori?: string;
    søk?: string;
    minPris?: number | string;
    maxPris?: number | string;
  } = {}): Promise<Oppdrag[]> {
    const db = await this._readDb();
    let list = db.oppdrag || [];

    if (filters.kategori && filters.kategori !== 'alle') {
      list = list.filter(item => item.kategori === filters.kategori);
    }

    if (filters.søk) {
      const term = filters.søk.toLowerCase();
      list = list.filter(item => 
        item.tittel.toLowerCase().includes(term) || 
        item.beskrivelse.toLowerCase().includes(term) ||
        item.sted.toLowerCase().includes(term)
      );
    }

    if (filters.minPris !== undefined && filters.minPris !== '') {
      list = list.filter(item => item.pris >= Number(filters.minPris));
    }

    if (filters.maxPris !== undefined && filters.maxPris !== '') {
      list = list.filter(item => item.pris <= Number(filters.maxPris));
    }

    return list;
  }

  async getOppdrag(id: string): Promise<Oppdrag | null> {
    const db = await this._readDb();
    return db.oppdrag.find(item => item.id === id) || null;
  }

  async createOppdrag(
    oppdrag: Omit<Oppdrag, 'id' | 'opprettetDato' | 'status'>,
    userId: string
  ): Promise<Oppdrag> {
    const db = await this._readDb();
    const newJob: Oppdrag = {
      ...oppdrag,
      id: `job-${Date.now()}`,
      opprettetDato: new Date().toISOString().split('T')[0],
      status: 'Aktiv',
      opprettetAv: userId,
      bilde: oppdrag.bilde || (oppdrag.kategori === 'hage'
        ? 'https://images.unsplash.com/photo-1558905612-df7f833f28cf?auto=format&fit=crop&q=80&w=400'
        : oppdrag.kategori === 'vasking'
          ? 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=400'
          : oppdrag.kategori === 'flytting'
            ? 'https://images.unsplash.com/photo-1603796846097-bee99e4a60c9?auto=format&fit=crop&q=80&w=400'
            : 'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=400')
    } as Oppdrag;

    db.oppdrag.unshift(newJob);
    await this._writeDb(db);
    return newJob;
  }

  async listHjelpere(): Promise<Hjelper[]> {
    const db = await this._readDb();
    return db.hjelpere || [];
  }

  async getUser(userId: string): Promise<Bruker | null> {
    const db = await this._readDb();
    const found = db.brukere.find(user => user.id === userId);
    if (!found) return null;
    const { sub, ...userProps } = found;
    return userProps as Bruker;
  }

  async getUserByOidcSub(oidcSub: string): Promise<Bruker | null> {
    const db = await this._readDb();
    const found = db.brukere.find(user => user.sub === oidcSub);
    if (!found) return null;
    const { sub, ...userProps } = found;
    return userProps as Bruker;
  }

  async createUserOrUpdate(profile: Omit<Bruker, 'id'> & { sub: string }): Promise<Bruker> {
    const db = await this._readDb();
    const existingIndex = db.brukere.findIndex(user => user.sub === profile.sub);
    
    let userRecord: Bruker & { sub: string };
    if (existingIndex > -1) {
      userRecord = {
        ...db.brukere[existingIndex],
        ...profile,
        id: db.brukere[existingIndex].id
      };
      db.brukere[existingIndex] = userRecord;
    } else {
      userRecord = {
        ...profile,
        id: `user-${Date.now()}`
      };
      db.brukere.push(userRecord);
    }
    
    await this._writeDb(db);
    const { sub, ...userProps } = userRecord;
    return userProps as Bruker;
  }
}
