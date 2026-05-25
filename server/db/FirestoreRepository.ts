import admin from 'firebase-admin';
import BaseRepository from './BaseRepository';
import { Oppdrag, Hjelper, Bruker } from '../../src/types';

export default class FirestoreRepository extends BaseRepository {
  private db: admin.firestore.Firestore;

  constructor() {
    super();
    if (admin.apps.length === 0) {
      admin.initializeApp();
    }
    this.db = admin.firestore();
  }

  async listOppdrag(filters: {
    kategori?: string;
    søk?: string;
    minPris?: number | string;
    maxPris?: number | string;
  } = {}): Promise<Oppdrag[]> {
    const colRef = this.db.collection('oppdrag');
    const snapshot = await colRef.get();
    
    let list: Oppdrag[] = [];
    snapshot.forEach(doc => {
      list.push({ id: doc.id, ...doc.data() } as Oppdrag);
    });

    list.sort((a, b) => b.opprettetDato.localeCompare(a.opprettetDato));

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
    const doc = await this.db.collection('oppdrag').doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() } as Oppdrag;
  }

  async createOppdrag(
    oppdrag: Omit<Oppdrag, 'id' | 'opprettetDato' | 'status'>,
    userId: string
  ): Promise<Oppdrag> {
    const newJob = {
      ...oppdrag,
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
    };

    const docRef = await this.db.collection('oppdrag').add(newJob);
    return { id: docRef.id, ...newJob } as Oppdrag;
  }

  async listHjelpere(): Promise<Hjelper[]> {
    const colRef = this.db.collection('hjelpere');
    const snapshot = await colRef.get();
    
    if (snapshot.empty) {
      const initialHelpers = [
        {
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

      const batch = this.db.batch();
      initialHelpers.forEach(h => {
        const docRef = this.db.collection('hjelpere').doc();
        batch.set(docRef, h);
      });
      await batch.commit();
      
      const newSnapshot = await colRef.get();
      let list: Hjelper[] = [];
      newSnapshot.forEach(doc => {
        list.push({ id: doc.id, ...doc.data() } as Hjelper);
      });
      return list;
    }

    let list: Hjelper[] = [];
    snapshot.forEach(doc => {
      list.push({ id: doc.id, ...doc.data() } as Hjelper);
    });
    return list;
  }

  async getUser(userId: string): Promise<Bruker | null> {
    const doc = await this.db.collection('brukere').doc(userId).get();
    if (!doc.exists) return null;
    const data = doc.data();
    if (!data) return null;
    const { sub, ...userProps } = data;
    return { id: doc.id, ...userProps } as Bruker;
  }

  async getUserByOidcSub(oidcSub: string): Promise<Bruker | null> {
    const snapshot = await this.db.collection('brukere').where('sub', '==', oidcSub).limit(1).get();
    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    const data = doc.data();
    const { sub, ...userProps } = data;
    return { id: doc.id, ...userProps } as Bruker;
  }

  async createUserOrUpdate(profile: Omit<Bruker, 'id'> & { sub: string }): Promise<Bruker> {
    const existingUser = await this.getUserByOidcSub(profile.sub);
    
    if (existingUser) {
      const updated = {
        ...existingUser,
        ...profile,
        id: existingUser.id,
        sub: profile.sub
      };
      await this.db.collection('brukere').doc(existingUser.id).set(updated);
      const { sub, ...userProps } = updated;
      return userProps as Bruker;
    } else {
      const docRef = this.db.collection('brukere').doc();
      const newUser = {
        ...profile,
        opprettetDato: new Date().toISOString()
      };
      await docRef.set(newUser);
      const { sub, ...userProps } = newUser;
      return { id: docRef.id, ...userProps } as Bruker;
    }
  }
}
