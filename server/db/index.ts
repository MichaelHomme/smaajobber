import BaseRepository from './BaseRepository';
import LocalJsonRepository from './LocalJsonRepository';

let dbInstance: BaseRepository;

/**
 * Get the active database repository instance
 */
export async function getDb(): Promise<BaseRepository> {
  if (dbInstance) {
    return dbInstance;
  }

  const useFirestore = process.env.USE_FIRESTORE === 'true';

  if (useFirestore) {
    console.log('Database configuration: Cloud Firestore (GCP)');
    try {
      const { default: FirestoreRepository } = await import('./FirestoreRepository');
      dbInstance = new FirestoreRepository();
    } catch (err) {
      console.error('Failed to initialize Firestore Repository. Falling back to Local JSON database.', err);
      dbInstance = new LocalJsonRepository();
    }
  } else {
    console.log('Database configuration: Local JSON Database (data/db.json)');
    dbInstance = new LocalJsonRepository();
  }

  return dbInstance;
}
