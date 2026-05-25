import { GoogleGenAI, Type, FunctionDeclaration } from '@google/genai';
import { getDb } from '../db/index';
import { ChatMessage } from '../../src/types';

// Initialize the Gemini SDK client
const ai = new GoogleGenAI({});

// 1. Tool Declarations in TypeScript using Type enum
const søkOppdragDecl: FunctionDeclaration = {
  name: 'sok_oppdrag',
  description: 'Søk etter aktive oppdrag på plattformen. Kan filtreres på kategori, pris og søketekst.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      kategori: {
        type: Type.STRING,
        description: 'Kategori å filtrere på. Må være en av: hage, flytting, vasking, annet, alle.',
        enum: ['hage', 'flytting', 'vasking', 'annet', 'alle']
      },
      søk: {
        type: Type.STRING,
        description: 'Fritekst søkeord for tittel, beskrivelse eller sted.'
      },
      minPris: {
        type: Type.NUMBER,
        description: 'Minimum pris/budsjett i NOK.'
      },
      maxPris: {
        type: Type.NUMBER,
        description: 'Maksimum pris/budsjett i NOK.'
      }
    }
  }
};

const søkHjelpereDecl: FunctionDeclaration = {
  name: 'sok_hjelpere',
  description: 'Hent listen over registrerte hjelpere på plattformen med ratings, priser og beskrivelser.',
  parameters: {
    type: Type.OBJECT,
    properties: {}
  }
};

const opprettOppdragDecl: FunctionDeclaration = {
  name: 'opprett_oppdrag',
  description: 'Publiserer et nytt oppdrag på plattformen på vegne av brukeren. Bruk dette verktøyet når brukeren ber om å legge ut en jobb og all nødvendig informasjon er oppgitt.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      tittel: {
        type: Type.STRING,
        description: 'En kort og beskrivende tittel på jobben (minst 5 tegn), f.eks. "Male gjerde på Nordstrand".'
      },
      beskrivelse: {
        type: Type.STRING,
        description: 'En detaljert beskrivelse av hva som skal gjøres og eventuelt utstyrsbehov (minst 10 tegn).'
      },
      kategori: {
        type: Type.STRING,
        description: 'Kategori for jobben. Må være en av: hage, flytting, vasking, annet.',
        enum: ['hage', 'flytting', 'vasking', 'annet']
      },
      pris: {
        type: Type.NUMBER,
        description: 'Budsjett/pris tilbudt for oppdraget i NOK (minst 200 kr).'
      },
      sted: {
        type: Type.STRING,
        description: 'Sted der jobben skal gjøres, f.eks. "Majorstuen, Oslo".'
      },
      dato: {
        type: Type.STRING,
        description: 'Når jobben ønskes utført, f.eks. "Snarest" eller "Innen 15. juni".'
      }
    },
    required: ['tittel', 'beskrivelse', 'kategori', 'pris', 'sted', 'dato']
  }
};

const SYSTEM_INSTRUCTION = `
Du er AI-assistenten (AI Supporter) for "Småjobber", en moderne plattform som formidler småjobber (hagearbeid, flytting, vasking, montering osv.) i Norge.
Du snakker med en innlogget, verifisert bruker.

Retningslinjer:
1. svar ALLTID på norsk. Vær vennlig, profesjonell og løsningsorientert.
2. Bruk de tilgjengelige verktøyene (tools) aktivt:
   - Hvis brukeren ser etter ledige jobber, spør om sted/kategori eller bruk 'sok_oppdrag' direkte.
   - Hvis brukeren ser etter hjelpere, bruk 'sok_hjelpere' for å finne relevante profiler.
   - Hvis brukeren vil legge ut en jobb: Hjelp dem å formulere tittel, beskrivelse, pris osv. Når du har alle detaljene (tittel, beskrivelse, kategori, pris, sted, dato), spør du: "Vil du at jeg skal publisere dette oppdraget nå?". Hvis de sier ja (eller allerede har gitt eksplisitt samtykke), bruker du 'opprett_oppdrag'.
3. Når du mottar resultater fra verktøyene (f.eks. oppdrag eller hjelpere), formuler et pent og strukturert svar til brukeren der du oppsummerer funnene (inkludert budsjetter, steder, og lenker/navn).
4. Unngå å nevne tekniske detaljer som "JSON", "funksjonskall" eller "verktøy" til brukeren. Fremstå som en intelligent, menneskelig assistent.
`;

/**
 * Handle a chat conversation turn with Gemini and Database Integration
 */
export async function handleAIChat(
  userMessage: string, 
  history: ChatMessage[] = [], 
  userId: string
): Promise<string> {
  try {
    const db = await getDb();

    // Translate UI chat history into Gemini contents structure
    const contents: any[] = [];
    
    // Process previous messages
    for (const msg of history) {
      const role = msg.sender === 'user' ? 'user' : 'model';
      contents.push({
        role: role,
        parts: [{ text: msg.tekst }]
      });
    }

    // Append the current message
    contents.push({
      role: 'user',
      parts: [{ text: userMessage }]
    });

    const config = {
      systemInstruction: SYSTEM_INSTRUCTION,
      tools: [{ functionDeclarations: [søkOppdragDecl, søkHjelpereDecl, opprettOppdragDecl] }]
    };

    // Tool Execution Loop
    let loopCount = 0;
    let currentResponse: any = null;

    while (loopCount < 5) {
      currentResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: contents,
        config: config
      });

      const functionCalls = currentResponse.functionCalls;
      
      if (!functionCalls || functionCalls.length === 0) {
        break;
      }

      console.log(`Gemini requested ${functionCalls.length} function call(s) during turn:`, functionCalls.map((f: any) => f.name));

      const toolResponses: any[] = [];
      
      for (const call of functionCalls) {
        let result: any = null;
        
        try {
          if (call.name === 'sok_oppdrag') {
            result = await db.listOppdrag(call.args);
          } else if (call.name === 'sok_hjelpere') {
            result = await db.listHjelpere();
          } else if (call.name === 'opprett_oppdrag') {
            result = await db.createOppdrag(call.args as any, userId);
            result = { success: true, createdOppdrag: result };
          } else {
            result = { error: `Uskjent verktøy: ${call.name}` };
          }
        } catch (dbErr: any) {
          console.error(`Database error executing tool ${call.name}:`, dbErr);
          result = { error: `Kunne ikke utføre handlingen i databasen: ${dbErr.message}` };
        }

        toolResponses.push({
          name: call.name,
          response: { result },
          id: call.id
        });
      }

      // Add model's intermediate tool call suggestion to history
      contents.push(currentResponse.candidates[0].content);

      // Add our execution result to history
      contents.push({
        role: 'tool',
        parts: toolResponses
      });

      loopCount++;
    }

    return currentResponse.text || 'Beklager, jeg klarte ikke å generere et svar.';

  } catch (err) {
    console.error('Gemini chat helper error:', err);
    return 'Beklager, det oppstod en intern feil under kommunikasjon med AI-tjenesten. Vennligst prøv igjen senere.';
  }
}
