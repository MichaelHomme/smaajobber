var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/db/BaseRepository.ts
var BaseRepository;
var init_BaseRepository = __esm({
  "server/db/BaseRepository.ts"() {
    BaseRepository = class {
    };
  }
});

// server/db/FirestoreRepository.ts
var FirestoreRepository_exports = {};
__export(FirestoreRepository_exports, {
  default: () => FirestoreRepository
});
import admin from "firebase-admin";
var FirestoreRepository;
var init_FirestoreRepository = __esm({
  "server/db/FirestoreRepository.ts"() {
    init_BaseRepository();
    FirestoreRepository = class extends BaseRepository {
      constructor() {
        super();
        if (admin.apps.length === 0) {
          admin.initializeApp();
        }
        this.db = admin.firestore();
      }
      async listOppdrag(filters = {}) {
        const colRef = this.db.collection("oppdrag");
        const snapshot = await colRef.get();
        let list = [];
        snapshot.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });
        list.sort((a, b) => b.opprettetDato.localeCompare(a.opprettetDato));
        if (filters.kategori && filters.kategori !== "alle") {
          list = list.filter((item) => item.kategori === filters.kategori);
        }
        if (filters.s\u00F8k) {
          const term = filters.s\u00F8k.toLowerCase();
          list = list.filter(
            (item) => item.tittel.toLowerCase().includes(term) || item.beskrivelse.toLowerCase().includes(term) || item.sted.toLowerCase().includes(term)
          );
        }
        if (filters.minPris !== void 0 && filters.minPris !== "") {
          list = list.filter((item) => item.pris >= Number(filters.minPris));
        }
        if (filters.maxPris !== void 0 && filters.maxPris !== "") {
          list = list.filter((item) => item.pris <= Number(filters.maxPris));
        }
        return list;
      }
      async getOppdrag(id) {
        const doc = await this.db.collection("oppdrag").doc(id).get();
        if (!doc.exists) return null;
        return { id: doc.id, ...doc.data() };
      }
      async createOppdrag(oppdrag, userId) {
        const newJob = {
          ...oppdrag,
          opprettetDato: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
          status: "Aktiv",
          opprettetAv: userId,
          bilde: oppdrag.bilde || (oppdrag.kategori === "hage" ? "https://images.unsplash.com/photo-1558905612-df7f833f28cf?auto=format&fit=crop&q=80&w=400" : oppdrag.kategori === "vasking" ? "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=400" : oppdrag.kategori === "flytting" ? "https://images.unsplash.com/photo-1603796846097-bee99e4a60c9?auto=format&fit=crop&q=80&w=400" : "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=400")
        };
        const docRef = await this.db.collection("oppdrag").add(newJob);
        return { id: docRef.id, ...newJob };
      }
      async listHjelpere() {
        const colRef = this.db.collection("hjelpere");
        const snapshot = await colRef.get();
        if (snapshot.empty) {
          const initialHelpers = [
            {
              navn: "Maren Kristensen",
              rolle: "Erfaren Pianol\xE6rer",
              pris: 450,
              enhet: "per time",
              rating: 4.9,
              antallVurderinger: 42,
              beskrivelse: "Jeg har spilt piano i 15 \xE5r og elsker \xE5 l\xE6re bort musikkglede til b\xE5de barn og voksne. Tilpasser undervisningen etter ditt niv\xE5 og dine favorittsanger.",
              bilde: "https://lh3.googleusercontent.com/aida-public/AB6AXuD_pJTMZDNjdwoJaa18DLzraufoyWaN1SyrTcei3YFOKlAfVOazMq5lSWM9L55JerKkSIEL-pmmXtDRtvu5ERJ-tQbX96E6AQwrIwPFcb0bE3Ga9E6GrVYquqV9fX2amsOHkUe8mxxotYS8PevK19oCupKCDFrNU-wd6QkAfhtG9VY0FE8rVrjYqCCBB32c4JpEpN_3iRlifJQu9pL0rAamr_ezRjbfLFhTe6E3cbkUX37ZjV52nTklbAuY_S-2N98-XHvv4nVVPBY",
              fremhevet: true
            },
            {
              navn: "Thomas Berg",
              rolle: "Matematikk-ekspert",
              pris: 350,
              enhet: "per time",
              rating: 5,
              antallVurderinger: 18,
              beskrivelse: "Mastergrad i ingeni\xF8rfag og lang erfaring med leksehjelp for ungdomskole og VGS. Jeg gj\xF8r matte forst\xE5elig og g\xF8y!",
              bilde: "https://lh3.googleusercontent.com/aida-public/AB6AXuD_r1nM7DMAt5KG7n11r8RERDHDbMESwRsp-iYjC4Gaum-DhY7KOnxdsCBTGYFJ5ezF0AKA3pB4gSV_am6goMJbSkiWSJBruKJ_prwaZHsO_GNqvoyyKmPaejRG-EuvZrFF1dkPiP6JFnH0AOHZkfDGy51QKD_VnTxWEtrprgYEK_OKxfQ3m-vkCu7LIAKLOpy6WLTfzo9iMQaDLrgGPu-tmdrY24Czwi5GiheDmilQLqAHRJinnciLNckoSNbUuJtNzixQDKzH7mI",
              fremhevet: false
            },
            {
              navn: "Sofie Lund",
              rolle: "Profesjonell hundelufter",
              pris: 200,
              enhet: "per tur",
              rating: 4.8,
              antallVurderinger: 124,
              beskrivelse: "Trenger hunden din litt ekstra aktivitet i hverdagen? Jeg tilbyr trygge og morsomme turer i skog og mark for alle typer hunder.",
              bilde: "https://lh3.googleusercontent.com/aida-public/AB6AXuBobMvhm2V8y4CJ8NyzbpYe7azvotqFGD1X4mY4IzOk1LUGZTmwJmk56yRHToyc6Q4MoXTo5nSVSwXCPwc5Y1ZV9hwBIFPPHKXedv2aB0YQtLAKR0ZXvQTMxw8I5g5PYd2uz1AUzBKBZkEOxS4hbFjjON1LRnw1idCP3_MJd-Rlzlaov_bREE-BfTXDxREe1PHJ991oValoa2FrI5laFMMs7JFzvRLI29ekFyXfBhB7tM9qm6Ls9J2QJGXO0_zlJ5pBJloLHfwVg-0",
              fremhevet: false
            }
          ];
          const batch = this.db.batch();
          initialHelpers.forEach((h) => {
            const docRef = this.db.collection("hjelpere").doc();
            batch.set(docRef, h);
          });
          await batch.commit();
          const newSnapshot = await colRef.get();
          let list2 = [];
          newSnapshot.forEach((doc) => {
            list2.push({ id: doc.id, ...doc.data() });
          });
          return list2;
        }
        let list = [];
        snapshot.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });
        return list;
      }
      async getUser(userId) {
        const doc = await this.db.collection("brukere").doc(userId).get();
        if (!doc.exists) return null;
        const data = doc.data();
        if (!data) return null;
        const { sub, ...userProps } = data;
        return { id: doc.id, ...userProps };
      }
      async getUserByOidcSub(oidcSub) {
        const snapshot = await this.db.collection("brukere").where("sub", "==", oidcSub).limit(1).get();
        if (snapshot.empty) return null;
        const doc = snapshot.docs[0];
        const data = doc.data();
        const { sub, ...userProps } = data;
        return { id: doc.id, ...userProps };
      }
      async createUserOrUpdate(profile) {
        const existingUser = await this.getUserByOidcSub(profile.sub);
        if (existingUser) {
          const updated = {
            ...existingUser,
            ...profile,
            id: existingUser.id,
            sub: profile.sub
          };
          await this.db.collection("brukere").doc(existingUser.id).set(updated);
          const { sub, ...userProps } = updated;
          return userProps;
        } else {
          const docRef = this.db.collection("brukere").doc();
          const newUser = {
            ...profile,
            opprettetDato: (/* @__PURE__ */ new Date()).toISOString()
          };
          await docRef.set(newUser);
          const { sub, ...userProps } = newUser;
          return { id: docRef.id, ...userProps };
        }
      }
    };
  }
});

// server.ts
import express from "express";
import path2 from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import "dotenv/config";

// server/db/LocalJsonRepository.ts
init_BaseRepository();
import fs from "fs/promises";
import path from "path";
var INITIAL_OPPDRAG = [
  {
    id: "o1",
    tittel: "Klipping av plen og trimming av hekk",
    beskrivelse: "Trenger hjelp til \xE5 klippe ca 200kvm plen og trimme en b\xF8khekk. Alt utstyr finnes p\xE5 stedet.",
    kategori: "hage",
    pris: 850,
    sted: "Oslo, Nordstrand",
    dato: "Innen 15. Juni",
    bilde: "https://lh3.googleusercontent.com/aida-public/AB6AXuB8Naujp1p1KD9VN825TOk0Nf0InYsBFe8divYF68yFWOuw34k-Y4H2DENJZhZYb-46Mg7vwU0-JfTKfx8J_7EOq_lFEX-WW8YLoRrsKe8TklQeN7vimYBPsfePK09jOE7UCenhuCIlUwhttUeh9qOIoNqLYCILZq_RaNtBjA20PA7KufxCUl_gV2rOi1JDJX7f7zlMg5Ugnvg2FYNyyo4LKvDe_YGyT7oZOYB1gmjXs2TBnKhslKPODvcBuQLL0h7ryIGflW4QDLk",
    status: "Aktiv",
    opprettetDato: "2026-05-20"
  },
  {
    id: "o2",
    tittel: "Montering av IKEA PAX garderobe",
    beskrivelse: "Trenger montering av 2 stk PAX skap (100cm bredde). Skapene er levert.",
    kategori: "annet",
    pris: 1200,
    sted: "Bergen, Sentrum",
    dato: "Snarest",
    bilde: "https://lh3.googleusercontent.com/aida-public/AB6AXuDD7g6u2qGP2bnYGq_vX7pLulUxWeQNJT7m9llEXJ_WNOKldAuVTgorX_vtaGt659XMOPXzO578SrkMJIapbpZtSQs5IZ_vvCDJ16P2z-cH1Wu8pyntU61X7xBOMtGEqEYxryJFb29Y-bgLzPGYuE_CTwn0w-OVdOwma5B7O7J8_aQGSDSCAMBNVsHWB8BeE9TKatTQfQV5nLa2EXoZE030X_4XwN5va2GqaJEVzshor4KUZQPmiGqwOQu6zH9xrk0K6wN0zdKQFd4",
    status: "Vurdert av eier",
    opprettetDato: "2026-05-22"
  },
  {
    id: "o3",
    tittel: "Utvask av leilighet",
    beskrivelse: "35 kvm, trenger grundig vask innen fredag. St\xF8vsuger, mopp og vaskemidler er klare.",
    kategori: "vasking",
    pris: 1500,
    sted: "Oslo, Frogner",
    dato: "Innen fredag",
    bilde: "https://lh3.googleusercontent.com/aida-public/AB6AXuCNO4XIoPuZPv4Gwts24ESvpSgbf9OohXVCOIbDSh_uVwEBbAIsGck0swyt8ql2B3uttoV9qzLBTaJeDDkTnh-drHJ8Gw6ppdp4vEYCAepxBNStmKd_yDkFjnidZRzaqqCMM6IXtRjgUUc_BTWymnndEgiA0t0bGEXipjwQvoU5NYAEQsLoQY3iv6qQ5hVZf4MBxWDQlSSfgBesveg032P6b-LCEKkovU193IFqf8i1zDaYBn0Z6uH5qN2H8R2Im0yTbrd1EF3q6kU",
    status: "Aktiv",
    opprettetDato: "2026-05-23"
  },
  {
    id: "o4",
    tittel: "Flyttehjelp - 2 timer",
    beskrivelse: "Hjelpe til med \xE5 b\xE6re esker og noen lette m\xF8bler fra 1. etasje til flyttebil.",
    kategori: "flytting",
    pris: 1200,
    sted: "Sandvika",
    dato: "S\xF8ndag 24. Mai",
    status: "Vurdert av eier",
    opprettetDato: "2026-05-21"
  }
];
var INITIAL_HJELPERE = [
  {
    id: "h1",
    navn: "Maren Kristensen",
    rolle: "Erfaren Pianol\xE6rer",
    pris: 450,
    enhet: "per time",
    rating: 4.9,
    antallVurderinger: 42,
    beskrivelse: "Jeg har spilt piano i 15 \xE5r og elsker \xE5 l\xE6re bort musikkglede til b\xE5de barn og voksne. Tilpasser undervisningen etter ditt niv\xE5 og dine favorittsanger.",
    bilde: "https://lh3.googleusercontent.com/aida-public/AB6AXuD_pJTMZDNjdwoJaa18DLzraufoyWaN1SyrTcei3YFOKlAfVOazMq5lSWM9L55JerKkSIEL-pmmXtDRtvu5ERJ-tQbX96E6AQwrIwPFcb0bE3Ga9E6GrVYquqV9fX2amsOHkUe8mxxotYS8PevK19oCupKCDFrNU-wd6QkAfhtG9VY0FE8rVrjYqCCBB32c4JpEpN_3iRlifJQu9pL0rAamr_ezRjbfLFhTe6E3cbkUX37ZjV52nTklbAuY_S-2N98-XHvv4nVVPBY",
    fremhevet: true
  },
  {
    id: "h2",
    navn: "Thomas Berg",
    rolle: "Matematikk-ekspert",
    pris: 350,
    enhet: "per time",
    rating: 5,
    antallVurderinger: 18,
    beskrivelse: "Mastergrad i ingeni\xF8rfag og lang erfaring med leksehjelp for ungdomskole og VGS. Jeg gj\xF8r matte forst\xE5elig og g\xF8y!",
    bilde: "https://lh3.googleusercontent.com/aida-public/AB6AXuD_r1nM7DMAt5KG7n11r8RERDHDbMESwRsp-iYjC4Gaum-DhY7KOnxdsCBTGYFJ5ezF0AKA3pB4gSV_am6goMJbSkiWSJBruKJ_prwaZHsO_GNqvoyyKmPaejRG-EuvZrFF1dkPiP6JFnH0AOHZkfDGy51QKD_VnTxWEtrprgYEK_OKxfQ3m-vkCu7LIAKLOpy6WLTfzo9iMQaDLrgGPu-tmdrY24Czwi5GiheDmilQLqAHRJinnciLNckoSNbUuJtNzixQDKzH7mI",
    fremhevet: false
  },
  {
    id: "h3",
    navn: "Sofie Lund",
    rolle: "Profesjonell hundelufter",
    pris: 200,
    enhet: "per tur",
    rating: 4.8,
    antallVurderinger: 124,
    beskrivelse: "Trenger hunden din litt ekstra aktivitet i hverdagen? Jeg tilbyr trygge og morsomme turer i skog og mark for alle typer hunder.",
    bilde: "https://lh3.googleusercontent.com/aida-public/AB6AXuBobMvhm2V8y4CJ8NyzbpYe7azvotqFGD1X4mY4IzOk1LUGZTmwJmk56yRHToyc6Q4MoXTo5nSVSwXCPwc5Y1ZV9hwBIFPPHKXedv2aB0YQtLAKR0ZXvQTMxw8I5g5PYd2uz1AUzBKBZkEOxS4hbFjjON1LRnw1idCP3_MJd-Rlzlaov_bREE-BfTXDxREe1PHJ991oValoa2FrI5laFMMs7JFzvRLI29ekFyXfBhB7tM9qm6Ls9J2QJGXO0_zlJ5pBJloLHfwVg-0",
    fremhevet: false
  }
];
var LocalJsonRepository = class extends BaseRepository {
  constructor() {
    super();
    this.filePath = path.join(process.cwd(), "data", "db.json");
  }
  async _readDb() {
    try {
      await fs.mkdir(path.dirname(this.filePath), { recursive: true });
      const data = await fs.readFile(this.filePath, "utf8");
      return JSON.parse(data);
    } catch (error) {
      const initialDb = {
        oppdrag: INITIAL_OPPDRAG.map((o) => ({ ...o, opprettetAv: "user-mock-1" })),
        hjelpere: INITIAL_HJELPERE,
        brukere: [
          {
            id: "user-mock-1",
            navn: "Ola Nordmann",
            epost: "ola@nordmann.no",
            mobil: "+47 999 99 999",
            sub: "mock-sub-1",
            verified: true
          }
        ]
      };
      await this._writeDb(initialDb);
      return initialDb;
    }
  }
  async _writeDb(data) {
    await fs.mkdir(path.dirname(this.filePath), { recursive: true });
    await fs.writeFile(this.filePath, JSON.stringify(data, null, 2), "utf8");
  }
  async listOppdrag(filters = {}) {
    const db2 = await this._readDb();
    let list = db2.oppdrag || [];
    if (filters.kategori && filters.kategori !== "alle") {
      list = list.filter((item) => item.kategori === filters.kategori);
    }
    if (filters.s\u00F8k) {
      const term = filters.s\u00F8k.toLowerCase();
      list = list.filter(
        (item) => item.tittel.toLowerCase().includes(term) || item.beskrivelse.toLowerCase().includes(term) || item.sted.toLowerCase().includes(term)
      );
    }
    if (filters.minPris !== void 0 && filters.minPris !== "") {
      list = list.filter((item) => item.pris >= Number(filters.minPris));
    }
    if (filters.maxPris !== void 0 && filters.maxPris !== "") {
      list = list.filter((item) => item.pris <= Number(filters.maxPris));
    }
    return list;
  }
  async getOppdrag(id) {
    const db2 = await this._readDb();
    return db2.oppdrag.find((item) => item.id === id) || null;
  }
  async createOppdrag(oppdrag, userId) {
    const db2 = await this._readDb();
    const newJob = {
      ...oppdrag,
      id: `job-${Date.now()}`,
      opprettetDato: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      status: "Aktiv",
      opprettetAv: userId,
      bilde: oppdrag.bilde || (oppdrag.kategori === "hage" ? "https://images.unsplash.com/photo-1558905612-df7f833f28cf?auto=format&fit=crop&q=80&w=400" : oppdrag.kategori === "vasking" ? "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=400" : oppdrag.kategori === "flytting" ? "https://images.unsplash.com/photo-1603796846097-bee99e4a60c9?auto=format&fit=crop&q=80&w=400" : "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=400")
    };
    db2.oppdrag.unshift(newJob);
    await this._writeDb(db2);
    return newJob;
  }
  async listHjelpere() {
    const db2 = await this._readDb();
    return db2.hjelpere || [];
  }
  async getUser(userId) {
    const db2 = await this._readDb();
    const found = db2.brukere.find((user) => user.id === userId);
    if (!found) return null;
    const { sub, ...userProps } = found;
    return userProps;
  }
  async getUserByOidcSub(oidcSub) {
    const db2 = await this._readDb();
    const found = db2.brukere.find((user) => user.sub === oidcSub);
    if (!found) return null;
    const { sub, ...userProps } = found;
    return userProps;
  }
  async createUserOrUpdate(profile) {
    const db2 = await this._readDb();
    const existingIndex = db2.brukere.findIndex((user) => user.sub === profile.sub);
    let userRecord;
    if (existingIndex > -1) {
      userRecord = {
        ...db2.brukere[existingIndex],
        ...profile,
        id: db2.brukere[existingIndex].id
      };
      db2.brukere[existingIndex] = userRecord;
    } else {
      userRecord = {
        ...profile,
        id: `user-${Date.now()}`
      };
      db2.brukere.push(userRecord);
    }
    await this._writeDb(db2);
    const { sub, ...userProps } = userRecord;
    return userProps;
  }
};

// server/db/index.ts
var dbInstance;
async function getDb() {
  if (dbInstance) {
    return dbInstance;
  }
  const useFirestore = process.env.USE_FIRESTORE === "true";
  if (useFirestore) {
    console.log("Database configuration: Cloud Firestore (GCP)");
    try {
      const { default: FirestoreRepository2 } = await Promise.resolve().then(() => (init_FirestoreRepository(), FirestoreRepository_exports));
      dbInstance = new FirestoreRepository2();
    } catch (err) {
      console.error("Failed to initialize Firestore Repository. Falling back to Local JSON database.", err);
      dbInstance = new LocalJsonRepository();
    }
  } else {
    console.log("Database configuration: Local JSON Database (data/db.json)");
    dbInstance = new LocalJsonRepository();
  }
  return dbInstance;
}

// server/auth.ts
import crypto from "crypto";
var ALGORITHM = "aes-256-cbc";
var SESSION_SECRET = process.env.SESSION_SECRET ? crypto.createHash("sha256").update(process.env.SESSION_SECRET).digest() : crypto.createHash("sha256").update("default-smaajobber-secret-key-change-in-prod").digest();
var IV_LENGTH = 16;
function encryptSession(data) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, SESSION_SECRET, iv);
  let encrypted = cipher.update(JSON.stringify(data), "utf8", "hex");
  encrypted += cipher.final("hex");
  return `${iv.toString("hex")}:${encrypted}`;
}
function decryptSession(token) {
  try {
    const parts = token.split(":");
    if (parts.length !== 2) return null;
    const iv = Buffer.from(parts[0], "hex");
    const decipher = crypto.createDecipheriv(ALGORITHM, SESSION_SECRET, iv);
    let decrypted = decipher.update(parts[1], "hex", "utf8");
    decrypted += decipher.final("utf8");
    return JSON.parse(decrypted);
  } catch (err) {
    return null;
  }
}
function hashNnin(nnin) {
  const salt = process.env.NNIN_SALT || "smaajobber-governance-salt-norway-2026";
  return crypto.createHmac("sha256", salt).update(nnin.trim()).digest("hex");
}
function registerAuthRoutes(app2) {
  app2.get("/api/auth/vipps", (req, res) => {
    const isOidcConfigured = process.env.VIPPS_CLIENT_ID && process.env.VIPPS_CLIENT_SECRET;
    if (isOidcConfigured) {
      const discoveryUrl = process.env.VIPPS_DISCOVERY_URL || "https://signin.vipps.no/as/authorization.oauth2";
      const clientId = process.env.VIPPS_CLIENT_ID || "";
      const redirectUri = `${req.protocol}://${req.get("host")}/api/auth/vipps/callback`;
      const state = crypto.randomBytes(8).toString("hex");
      const nonce = crypto.randomBytes(8).toString("hex");
      const authUrl = `${discoveryUrl}?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=openid%20name%20email%20phone%20nnin&state=${state}&nonce=${nonce}`;
      res.redirect(authUrl);
    } else {
      res.send(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Vipps Logg inn (Utviklingsmodus)</title>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body {
              font-family: 'Inter', -apple-system, sans-serif;
              background-color: #f9f9f9;
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              margin: 0;
            }
            .card {
              background: white;
              padding: 2.5rem;
              border-radius: 1.5rem;
              box-shadow: 0 10px 25px rgba(0,0,0,0.05);
              border: 1px solid #e1e1e1;
              max-width: 400px;
              width: 100%;
              text-align: center;
            }
            .orange-dot {
              width: 64px;
              height: 64px;
              background-color: #ff5b24; /* Vipps brand orange */
              color: white;
              font-size: 32px;
              font-weight: bold;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              margin: 0 auto 1.5rem auto;
            }
            h1 {
              font-size: 20px;
              color: #1b1b1b;
              margin-bottom: 0.5rem;
            }
            p {
              font-size: 13px;
              color: #666;
              margin-bottom: 2rem;
              line-height: 1.5;
            }
            .btn {
              display: block;
              background-color: #ff5b24;
              color: white;
              text-decoration: none;
              padding: 0.75rem 1.5rem;
              border-radius: 0.75rem;
              font-weight: 600;
              font-size: 14px;
              margin-bottom: 0.75rem;
              transition: transform 0.1s;
              border: none;
              cursor: pointer;
              width: 100%;
            }
            .btn:active {
              transform: scale(0.98);
            }
            .btn-secondary {
              background-color: #005cbd;
            }
            .footer-info {
              font-size: 11px;
              color: #aaa;
              margin-top: 1.5rem;
            }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="orange-dot">v</div>
            <h1>Vipps / BankID Logg inn</h1>
            <p>Dette er en sikker, mock-basert autentisering for lokal testing. Velg en testperson for \xE5 logge p\xE5 med verifisert identitet.</p>
            
            <form method="GET" action="/api/auth/vipps/callback">
              <input type="hidden" name="state" value="mock-state">
              <button type="submit" name="mock_user" value="ola" class="btn">
                Logg inn som Ola Nordmann (Verifisert)
              </button>
              <button type="submit" name="mock_user" value="kari" class="btn btn-secondary">
                Logg inn som Kari Nordmann (Verifisert)
              </button>
            </form>
            
            <div class="footer-info">
              ID-nummer blir automatisk hashet med SHA-256 for personvern.
            </div>
          </div>
        </body>
        </html>
      `);
    }
  });
  app2.get("/api/auth/vipps/callback", async (req, res) => {
    const { code, mock_user } = req.query;
    const isOidcConfigured = process.env.VIPPS_CLIENT_ID && process.env.VIPPS_CLIENT_SECRET;
    try {
      let userProfile = null;
      if (isOidcConfigured) {
        const tokenEndpoint = process.env.VIPPS_TOKEN_ENDPOINT || "https://signin.vipps.no/as/token.oauth2";
        const userinfoEndpoint = process.env.VIPPS_USERINFO_ENDPOINT || "https://signin.vipps.no/as/userinfo.oauth2";
        const redirectUri = `${req.protocol}://${req.get("host")}/api/auth/vipps/callback`;
        const clientCredentials = Buffer.from(`${process.env.VIPPS_CLIENT_ID}:${process.env.VIPPS_CLIENT_SECRET}`).toString("base64");
        const tokenResponse = await fetch(tokenEndpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": `Basic ${clientCredentials}`
          },
          body: new URLSearchParams({
            grant_type: "authorization_code",
            code,
            redirect_uri: redirectUri
          })
        });
        if (!tokenResponse.ok) {
          throw new Error(`Token exchange failed: ${tokenResponse.statusText}`);
        }
        const tokenData = await tokenResponse.json();
        const userinfoResponse = await fetch(userinfoEndpoint, {
          headers: {
            "Authorization": `Bearer ${tokenData.access_token}`
          }
        });
        if (!userinfoResponse.ok) {
          throw new Error(`UserInfo retrieval failed: ${userinfoResponse.statusText}`);
        }
        const vippsProfile = await userinfoResponse.json();
        const nnin = vippsProfile.nnin || vippsProfile.nin || "";
        if (!nnin) {
          throw new Error("Vipps Login did not return Norwegian identity number (nnin). Verification failed.");
        }
        const hashedNnin = hashNnin(nnin);
        userProfile = {
          sub: hashedNnin,
          navn: vippsProfile.name || "Uverifisert Bruker",
          epost: vippsProfile.email || "",
          mobil: vippsProfile.phone_number || "",
          verified: true
        };
      } else {
        if (mock_user === "kari") {
          userProfile = {
            sub: hashNnin("12128543210"),
            navn: "Kari Nordmann",
            epost: "kari.nordmann@norge.no",
            mobil: "+47 900 12 345",
            verified: true
          };
        } else {
          userProfile = {
            sub: hashNnin("01018512345"),
            navn: "Ola Nordmann",
            epost: "ola.nordmann@norge.no",
            mobil: "+47 999 88 777",
            verified: true
          };
        }
      }
      const db2 = await getDb();
      const user = await db2.createUserOrUpdate(userProfile);
      const sessionToken = encryptSession({
        userId: user.id,
        sub: userProfile.sub,
        navn: user.navn,
        epost: user.epost,
        verified: user.verified
      });
      res.cookie("session", sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 24 * 60 * 60 * 1e3
        // 1 day
      });
      res.redirect("/");
    } catch (err) {
      console.error("Authentication callback error:", err);
      res.status(500).send(`Autentisering feilet: ${err.message}`);
    }
  });
  app2.get("/api/auth/me", async (req, res) => {
    const sessionToken = req.cookies?.session;
    if (!sessionToken) {
      return res.json({ loggedIn: false });
    }
    const sessionData = decryptSession(sessionToken);
    if (!sessionData) {
      res.clearCookie("session");
      return res.json({ loggedIn: false });
    }
    const db2 = await getDb();
    const user = await db2.getUser(sessionData.userId);
    if (!user) {
      res.clearCookie("session");
      return res.json({ loggedIn: false });
    }
    res.json({
      loggedIn: true,
      user: {
        id: user.id,
        navn: user.navn,
        epost: user.epost,
        mobil: user.mobil,
        verified: user.verified
      }
    });
  });
  app2.get("/api/auth/logout", (_req, res) => {
    res.clearCookie("session");
    res.redirect("/");
  });
}
function requireAuth(req, res, next) {
  const sessionToken = req.cookies?.session;
  if (!sessionToken) {
    res.status(401).json({ error: "Uautorisert. Vennligst logg inn via Vipps / BankID." });
    return;
  }
  const sessionData = decryptSession(sessionToken);
  if (!sessionData) {
    res.clearCookie("session");
    res.status(401).json({ error: "Ugyldig sesjon. Vennligst logg inn p\xE5 nytt." });
    return;
  }
  req.user = sessionData;
  next();
}

// server/ai/assistant.ts
import { GoogleGenAI, Type } from "@google/genai";
var ai = new GoogleGenAI({});
var s\u00F8kOppdragDecl = {
  name: "sok_oppdrag",
  description: "S\xF8k etter aktive oppdrag p\xE5 plattformen. Kan filtreres p\xE5 kategori, pris og s\xF8ketekst.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      kategori: {
        type: Type.STRING,
        description: "Kategori \xE5 filtrere p\xE5. M\xE5 v\xE6re en av: hage, flytting, vasking, annet, alle.",
        enum: ["hage", "flytting", "vasking", "annet", "alle"]
      },
      s\u00F8k: {
        type: Type.STRING,
        description: "Fritekst s\xF8keord for tittel, beskrivelse eller sted."
      },
      minPris: {
        type: Type.NUMBER,
        description: "Minimum pris/budsjett i NOK."
      },
      maxPris: {
        type: Type.NUMBER,
        description: "Maksimum pris/budsjett i NOK."
      }
    }
  }
};
var s\u00F8kHjelpereDecl = {
  name: "sok_hjelpere",
  description: "Hent listen over registrerte hjelpere p\xE5 plattformen med ratings, priser og beskrivelser.",
  parameters: {
    type: Type.OBJECT,
    properties: {}
  }
};
var opprettOppdragDecl = {
  name: "opprett_oppdrag",
  description: "Publiserer et nytt oppdrag p\xE5 plattformen p\xE5 vegne av brukeren. Bruk dette verkt\xF8yet n\xE5r brukeren ber om \xE5 legge ut en jobb og all n\xF8dvendig informasjon er oppgitt.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      tittel: {
        type: Type.STRING,
        description: 'En kort og beskrivende tittel p\xE5 jobben (minst 5 tegn), f.eks. "Male gjerde p\xE5 Nordstrand".'
      },
      beskrivelse: {
        type: Type.STRING,
        description: "En detaljert beskrivelse av hva som skal gj\xF8res og eventuelt utstyrsbehov (minst 10 tegn)."
      },
      kategori: {
        type: Type.STRING,
        description: "Kategori for jobben. M\xE5 v\xE6re en av: hage, flytting, vasking, annet.",
        enum: ["hage", "flytting", "vasking", "annet"]
      },
      pris: {
        type: Type.NUMBER,
        description: "Budsjett/pris tilbudt for oppdraget i NOK (minst 200 kr)."
      },
      sted: {
        type: Type.STRING,
        description: 'Sted der jobben skal gj\xF8res, f.eks. "Majorstuen, Oslo".'
      },
      dato: {
        type: Type.STRING,
        description: 'N\xE5r jobben \xF8nskes utf\xF8rt, f.eks. "Snarest" eller "Innen 15. juni".'
      }
    },
    required: ["tittel", "beskrivelse", "kategori", "pris", "sted", "dato"]
  }
};
var SYSTEM_INSTRUCTION = `
Du er AI-assistenten (AI Supporter) for "Sm\xE5jobber", en moderne plattform som formidler sm\xE5jobber (hagearbeid, flytting, vasking, montering osv.) i Norge.
Du snakker med en innlogget, verifisert bruker.

Retningslinjer:
1. svar ALLTID p\xE5 norsk. V\xE6r vennlig, profesjonell og l\xF8sningsorientert.
2. Bruk de tilgjengelige verkt\xF8yene (tools) aktivt:
   - Hvis brukeren ser etter ledige jobber, sp\xF8r om sted/kategori eller bruk 'sok_oppdrag' direkte.
   - Hvis brukeren ser etter hjelpere, bruk 'sok_hjelpere' for \xE5 finne relevante profiler.
   - Hvis brukeren vil legge ut en jobb: Hjelp dem \xE5 formulere tittel, beskrivelse, pris osv. N\xE5r du har alle detaljene (tittel, beskrivelse, kategori, pris, sted, dato), sp\xF8r du: "Vil du at jeg skal publisere dette oppdraget n\xE5?". Hvis de sier ja (eller allerede har gitt eksplisitt samtykke), bruker du 'opprett_oppdrag'.
3. N\xE5r du mottar resultater fra verkt\xF8yene (f.eks. oppdrag eller hjelpere), formuler et pent og strukturert svar til brukeren der du oppsummerer funnene (inkludert budsjetter, steder, og lenker/navn).
4. Unng\xE5 \xE5 nevne tekniske detaljer som "JSON", "funksjonskall" eller "verkt\xF8y" til brukeren. Fremst\xE5 som en intelligent, menneskelig assistent.
`;
async function handleAIChat(userMessage, history = [], userId) {
  try {
    const db2 = await getDb();
    const contents = [];
    for (const msg of history) {
      const role = msg.sender === "user" ? "user" : "model";
      contents.push({
        role,
        parts: [{ text: msg.tekst }]
      });
    }
    contents.push({
      role: "user",
      parts: [{ text: userMessage }]
    });
    const config = {
      systemInstruction: SYSTEM_INSTRUCTION,
      tools: [{ functionDeclarations: [s\u00F8kOppdragDecl, s\u00F8kHjelpereDecl, opprettOppdragDecl] }]
    };
    let loopCount = 0;
    let currentResponse = null;
    while (loopCount < 5) {
      currentResponse = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents,
        config
      });
      const functionCalls = currentResponse.functionCalls;
      if (!functionCalls || functionCalls.length === 0) {
        break;
      }
      console.log(`Gemini requested ${functionCalls.length} function call(s) during turn:`, functionCalls.map((f) => f.name));
      const toolResponses = [];
      for (const call of functionCalls) {
        let result = null;
        try {
          if (call.name === "sok_oppdrag") {
            result = await db2.listOppdrag(call.args);
          } else if (call.name === "sok_hjelpere") {
            result = await db2.listHjelpere();
          } else if (call.name === "opprett_oppdrag") {
            result = await db2.createOppdrag(call.args, userId);
            result = { success: true, createdOppdrag: result };
          } else {
            result = { error: `Uskjent verkt\xF8y: ${call.name}` };
          }
        } catch (dbErr) {
          console.error(`Database error executing tool ${call.name}:`, dbErr);
          result = { error: `Kunne ikke utf\xF8re handlingen i databasen: ${dbErr.message}` };
        }
        toolResponses.push({
          name: call.name,
          response: { result },
          id: call.id
        });
      }
      contents.push(currentResponse.candidates[0].content);
      contents.push({
        role: "tool",
        parts: toolResponses
      });
      loopCount++;
    }
    return currentResponse.text || "Beklager, jeg klarte ikke \xE5 generere et svar.";
  } catch (err) {
    console.error("Gemini chat helper error:", err);
    return "Beklager, det oppstod en intern feil under kommunikasjon med AI-tjenesten. Vennligst pr\xF8v igjen senere.";
  }
}

// server.ts
var __filename = fileURLToPath(import.meta.url);
var __dirname = path2.dirname(__filename);
var app = express();
var PORT = Number(process.env.PORT) || 8080;
app.use(express.json());
app.use(cookieParser());
var db;
getDb().then((database) => {
  db = database;
  console.log("Database initialized successfully.");
}).catch((err) => {
  console.error("Failed to initialize database:", err);
});
registerAuthRoutes(app);
app.get("/api/oppdrag", async (req, res) => {
  try {
    const filters = {
      kategori: req.query.kategori,
      s\u00F8k: req.query.s\u00F8k,
      minPris: req.query.minPris,
      maxPris: req.query.maxPris
    };
    const list = await db.listOppdrag(filters);
    res.json(list);
  } catch (err) {
    console.error("Error fetching jobs:", err);
    res.status(500).json({ error: "Kunne ikke hente oppdrag." });
  }
});
app.get("/api/oppdrag/:id", async (req, res) => {
  try {
    const job = await db.getOppdrag(req.params.id);
    if (!job) {
      res.status(404).json({ error: "Oppdraget ble ikke funnet." });
      return;
    }
    res.json(job);
  } catch (err) {
    console.error("Error fetching job details:", err);
    res.status(500).json({ error: "Kunne ikke hente oppdragsdetaljer." });
  }
});
app.post("/api/oppdrag", requireAuth, async (req, res) => {
  try {
    const { tittel, beskrivelse, kategori, pris, sted, dato } = req.body;
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: "Bruker ikke identifisert i sesjon." });
      return;
    }
    if (!tittel || tittel.trim().length < 5) {
      res.status(400).json({ error: "Tittel m\xE5 ha minst 5 tegn." });
      return;
    }
    if (!beskrivelse || beskrivelse.trim().length < 10) {
      res.status(400).json({ error: "Beskrivelse m\xE5 ha minst 10 tegn." });
      return;
    }
    if (!["hage", "flytting", "vasking", "annet"].includes(kategori)) {
      res.status(400).json({ error: "Ugyldig kategori." });
      return;
    }
    if (!pris || Number(pris) < 200) {
      res.status(400).json({ error: "Minstepris er 200 kr." });
      return;
    }
    if (!sted || sted.trim().length < 2) {
      res.status(400).json({ error: "Sted m\xE5 oppgis." });
      return;
    }
    if (!dato || dato.trim().length < 2) {
      res.status(400).json({ error: "Dato m\xE5 oppgis." });
      return;
    }
    const cleanJob = {
      tittel: tittel.trim(),
      beskrivelse: beskrivelse.trim(),
      kategori,
      pris: Number(pris),
      sted: sted.trim(),
      dato: dato.trim()
    };
    const created = await db.createOppdrag(cleanJob, userId);
    res.status(201).json(created);
  } catch (err) {
    console.error("Error creating job:", err);
    res.status(500).json({ error: "Kunne ikke lagre oppdraget." });
  }
});
app.get("/api/hjelpere", async (_req, res) => {
  try {
    const list = await db.listHjelpere();
    res.json(list);
  } catch (err) {
    console.error("Error fetching helpers:", err);
    res.status(500).json({ error: "Kunne ikke hente hjelpere." });
  }
});
app.post("/api/chat", requireAuth, async (req, res) => {
  try {
    const { melding, historikk } = req.body;
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: "Bruker ikke identifisert i sesjon." });
      return;
    }
    if (!melding || !melding.trim()) {
      res.status(400).json({ error: "Melding kan ikke v\xE6re tom." });
      return;
    }
    const reply = await handleAIChat(melding.trim(), historikk || [], userId);
    res.json({ response: reply });
  } catch (err) {
    console.error("AI chat endpoint error:", err);
    res.status(500).json({ error: "Feil ved behandling av AI-foresp\xF8rsel." });
  }
});
app.use(express.static(path2.join(__dirname, "dist")));
app.get("*", (_req, res) => {
  res.sendFile(path2.join(__dirname, "dist", "index.html"));
});
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Express server is running on port ${PORT}`);
});
