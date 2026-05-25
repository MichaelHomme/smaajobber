import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import 'dotenv/config';

import { getDb } from './server/db/index';
import { registerAuthRoutes, requireAuth, AuthenticatedRequest } from './server/auth';
import { handleAIChat } from './server/ai/assistant';
import BaseRepository from './server/db/BaseRepository';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 8080;

app.use(express.json());
app.use(cookieParser());

let db: BaseRepository;

getDb().then(database => {
  db = database;
  console.log('Database initialized successfully.');
}).catch(err => {
  console.error('Failed to initialize database:', err);
});

// 1. Register Vipps/BankID authentication routes
registerAuthRoutes(app);

// 2. Job (Oppdrag) REST Routes
app.get('/api/oppdrag', async (req: Request, res: Response) => {
  try {
    const filters = {
      kategori: req.query.kategori as string,
      søk: req.query.søk as string,
      minPris: req.query.minPris as string,
      maxPris: req.query.maxPris as string
    };
    const list = await db.listOppdrag(filters);
    res.json(list);
  } catch (err) {
    console.error('Error fetching jobs:', err);
    res.status(500).json({ error: 'Kunne ikke hente oppdrag.' });
  }
});

app.get('/api/oppdrag/:id', async (req: Request, res: Response) => {
  try {
    const job = await db.getOppdrag(req.params.id);
    if (!job) {
      res.status(404).json({ error: 'Oppdraget ble ikke funnet.' });
      return;
    }
    res.json(job);
  } catch (err) {
    console.error('Error fetching job details:', err);
    res.status(500).json({ error: 'Kunne ikke hente oppdragsdetaljer.' });
  }
});

app.post('/api/oppdrag', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { tittel, beskrivelse, kategori, pris, sted, dato } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ error: 'Bruker ikke identifisert i sesjon.' });
      return;
    }
    
    // Server-side input validation
    if (!tittel || tittel.trim().length < 5) {
      res.status(400).json({ error: 'Tittel må ha minst 5 tegn.' });
      return;
    }
    if (!beskrivelse || beskrivelse.trim().length < 10) {
      res.status(400).json({ error: 'Beskrivelse må ha minst 10 tegn.' });
      return;
    }
    if (!['hage', 'flytting', 'vasking', 'annet'].includes(kategori)) {
      res.status(400).json({ error: 'Ugyldig kategori.' });
      return;
    }
    if (!pris || Number(pris) < 200) {
      res.status(400).json({ error: 'Minstepris er 200 kr.' });
      return;
    }
    if (!sted || sted.trim().length < 2) {
      res.status(400).json({ error: 'Sted må oppgis.' });
      return;
    }
    if (!dato || dato.trim().length < 2) {
      res.status(400).json({ error: 'Dato må oppgis.' });
      return;
    }

    const cleanJob = {
      tittel: tittel.trim(),
      beskrivelse: beskrivelse.trim(),
      kategori: kategori as 'hage' | 'flytting' | 'vasking' | 'annet',
      pris: Number(pris),
      sted: sted.trim(),
      dato: dato.trim()
    };

    const created = await db.createOppdrag(cleanJob, userId);
    res.status(201).json(created);
  } catch (err) {
    console.error('Error creating job:', err);
    res.status(500).json({ error: 'Kunne ikke lagre oppdraget.' });
  }
});

// 3. Helpers (Hjelpere) REST Routes
app.get('/api/hjelpere', async (_req: Request, res: Response) => {
  try {
    const list = await db.listHjelpere();
    res.json(list);
  } catch (err) {
    console.error('Error fetching helpers:', err);
    res.status(500).json({ error: 'Kunne ikke hente hjelpere.' });
  }
});

// 4. AI-First Assistant Endpoint
app.post('/api/chat', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { melding, historikk } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ error: 'Bruker ikke identifisert i sesjon.' });
      return;
    }
    
    if (!melding || !melding.trim()) {
      res.status(400).json({ error: 'Melding kan ikke være tom.' });
      return;
    }

    const reply = await handleAIChat(melding.trim(), historikk || [], userId);
    res.json({ response: reply });
  } catch (err) {
    console.error('AI chat endpoint error:', err);
    res.status(500).json({ error: 'Feil ved behandling av AI-forespørsel.' });
  }
});

// Serve static frontend assets
app.use(express.static(path.join(__dirname, 'dist')));

// SPA router fallback
app.get('*', (_req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Express server is running on port ${PORT}`);
});
