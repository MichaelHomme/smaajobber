import crypto from 'crypto';
import { Express, Request, Response, NextFunction } from 'express';
import { getDb } from './db/index';

// Session encryption settings
const ALGORITHM = 'aes-256-cbc';
const SESSION_SECRET = process.env.SESSION_SECRET 
  ? crypto.createHash('sha256').update(process.env.SESSION_SECRET).digest()
  : crypto.createHash('sha256').update('default-smaajobber-secret-key-change-in-prod').digest();
const IV_LENGTH = 16;

export interface SessionData {
  userId: string;
  sub: string;
  navn: string;
  epost: string;
  verified: boolean;
}

export interface AuthenticatedRequest extends Request {
  user?: SessionData;
}

/**
 * Encrypt session data into a secure token
 */
function encryptSession(data: SessionData): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, SESSION_SECRET, iv);
  let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return `${iv.toString('hex')}:${encrypted}`;
}

/**
 * Decrypt session token
 */
function decryptSession(token: string): SessionData | null {
  try {
    const parts = token.split(':');
    if (parts.length !== 2) return null;
    const iv = Buffer.from(parts[0], 'hex');
    const decipher = crypto.createDecipheriv(ALGORITHM, SESSION_SECRET, iv);
    let decrypted = decipher.update(parts[1], 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return JSON.parse(decrypted) as SessionData;
  } catch (err) {
    return null;
  }
}

/**
 * Hash Norwegian National Identity Number (fødselsnummer) for GDPR compliance
 */
function hashNnin(nnin: string): string {
  const salt = process.env.NNIN_SALT || 'smaajobber-governance-salt-norway-2026';
  return crypto.createHmac('sha256', salt).update(nnin.trim()).digest('hex');
}

/**
 * Register auth routes on Express app
 */
export function registerAuthRoutes(app: Express): void {
  
  // 1. Initiate Login (Vipps / BankID OIDC or Mock Fallback)
  app.get('/api/auth/vipps', (req: Request, res: Response) => {
    const isOidcConfigured = process.env.VIPPS_CLIENT_ID && process.env.VIPPS_CLIENT_SECRET;

    if (isOidcConfigured) {
      // Production Vipps OIDC Flow Redirect
      const discoveryUrl = process.env.VIPPS_DISCOVERY_URL || 'https://signin.vipps.no/as/authorization.oauth2';
      const clientId = process.env.VIPPS_CLIENT_ID || '';
      const redirectUri = `${req.protocol}://${req.get('host')}/api/auth/vipps/callback`;
      const state = crypto.randomBytes(8).toString('hex');
      const nonce = crypto.randomBytes(8).toString('hex');
      
      const authUrl = `${discoveryUrl}?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=openid%20name%20email%20phone%20nnin&state=${state}&nonce=${nonce}`;
      res.redirect(authUrl);
    } else {
      // Render simple, elegant Mock Login HTML page for developer local testing
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
            <p>Dette er en sikker, mock-basert autentisering for lokal testing. Velg en testperson for å logge på med verifisert identitet.</p>
            
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

  // 2. Auth Callback Endpoint
  app.get('/api/auth/vipps/callback', async (req: Request, res: Response) => {
    const { code, mock_user } = req.query;
    const isOidcConfigured = process.env.VIPPS_CLIENT_ID && process.env.VIPPS_CLIENT_SECRET;

    try {
      let userProfile = null;

      if (isOidcConfigured) {
        // Exchange Code for Access Token and Query UserInfo
        const tokenEndpoint = process.env.VIPPS_TOKEN_ENDPOINT || 'https://signin.vipps.no/as/token.oauth2';
        const userinfoEndpoint = process.env.VIPPS_USERINFO_ENDPOINT || 'https://signin.vipps.no/as/userinfo.oauth2';
        
        const redirectUri = `${req.protocol}://${req.get('host')}/api/auth/vipps/callback`;
        const clientCredentials = Buffer.from(`${process.env.VIPPS_CLIENT_ID}:${process.env.VIPPS_CLIENT_SECRET}`).toString('base64');
        
        const tokenResponse = await fetch(tokenEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${clientCredentials}`
          },
          body: new URLSearchParams({
            grant_type: 'authorization_code',
            code: code as string,
            redirect_uri: redirectUri
          })
        });

        if (!tokenResponse.ok) {
          throw new Error(`Token exchange failed: ${tokenResponse.statusText}`);
        }

        const tokenData: any = await tokenResponse.json();
        
        const userinfoResponse = await fetch(userinfoEndpoint, {
          headers: {
            'Authorization': `Bearer ${tokenData.access_token}`
          }
        });

        if (!userinfoResponse.ok) {
          throw new Error(`UserInfo retrieval failed: ${userinfoResponse.statusText}`);
        }

        const vippsProfile: any = await userinfoResponse.json();
        
        const nnin = vippsProfile.nnin || vippsProfile.nin || '';
        if (!nnin) {
          throw new Error('Vipps Login did not return Norwegian identity number (nnin). Verification failed.');
        }

        const hashedNnin = hashNnin(nnin);

        userProfile = {
          sub: hashedNnin,
          navn: vippsProfile.name || 'Uverifisert Bruker',
          epost: vippsProfile.email || '',
          mobil: vippsProfile.phone_number || '',
          verified: true
        };
      } else {
        // Mock Login Handler (Development)
        if (mock_user === 'kari') {
          userProfile = {
            sub: hashNnin('12128543210'),
            navn: 'Kari Nordmann',
            epost: 'kari.nordmann@norge.no',
            mobil: '+47 900 12 345',
            verified: true
          };
        } else {
          // Default to Ola Nordmann
          userProfile = {
            sub: hashNnin('01018512345'),
            navn: 'Ola Nordmann',
            epost: 'ola.nordmann@norge.no',
            mobil: '+47 999 88 777',
            verified: true
          };
        }
      }

      // Upsert User into Database Repository
      const db = await getDb();
      const user = await db.createUserOrUpdate(userProfile);

      // Create session cookie content
      const sessionToken = encryptSession({
        userId: user.id,
        sub: userProfile.sub,
        navn: user.navn,
        epost: user.epost,
        verified: user.verified
      });

      // Write session cookie
      res.cookie('session', sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000 // 1 day
      });

      res.redirect('/');
    } catch (err: any) {
      console.error('Authentication callback error:', err);
      res.status(500).send(`Autentisering feilet: ${err.message}`);
    }
  });

  // 3. Get Current Session Profile
  app.get('/api/auth/me', async (req: Request, res: Response) => {
    const sessionToken = req.cookies?.session;
    if (!sessionToken) {
      return res.json({ loggedIn: false });
    }

    const sessionData = decryptSession(sessionToken);
    if (!sessionData) {
      res.clearCookie('session');
      return res.json({ loggedIn: false });
    }

    const db = await getDb();
    const user = await db.getUser(sessionData.userId);
    
    if (!user) {
      res.clearCookie('session');
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

  // 4. Logout Action
  app.get('/api/auth/logout', (_req: Request, res: Response) => {
    res.clearCookie('session');
    res.redirect('/');
  });
}

/**
 * Express middleware to enforce authentication
 */
export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const sessionToken = req.cookies?.session;
  if (!sessionToken) {
    res.status(401).json({ error: 'Uautorisert. Vennligst logg inn via Vipps / BankID.' });
    return;
  }

  const sessionData = decryptSession(sessionToken);
  if (!sessionData) {
    res.clearCookie('session');
    res.status(401).json({ error: 'Ugyldig sesjon. Vennligst logg inn på nytt.' });
    return;
  }

  req.user = sessionData;
  next();
}
