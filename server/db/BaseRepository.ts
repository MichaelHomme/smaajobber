import { Oppdrag, Hjelper, Bruker } from '../../src/types';

export default abstract class BaseRepository {
  /**
   * List jobs based on filters
   */
  abstract listOppdrag(filters?: {
    kategori?: string;
    søk?: string;
    minPris?: number | string;
    maxPris?: number | string;
  }): Promise<Oppdrag[]>;

  /**
   * Get a job by ID
   */
  abstract getOppdrag(id: string): Promise<Oppdrag | null>;

  /**
   * Create a new job listing
   */
  abstract createOppdrag(
    oppdrag: Omit<Oppdrag, 'id' | 'opprettetDato' | 'status'>,
    userId: string
  ): Promise<Oppdrag>;

  /**
   * List all helpers
   */
  abstract listHjelpere(): Promise<Hjelper[]>;

  /**
   * Get user profile by unique ID
   */
  abstract getUser(userId: string): Promise<Bruker | null>;

  /**
   * Find a user by their unique identity provider identifier (sub)
   */
  abstract getUserByOidcSub(oidcSub: string): Promise<Bruker | null>;

  /**
   * Create a new user or update an existing one
   */
  abstract createUserOrUpdate(profile: Omit<Bruker, 'id'> & { sub: string }): Promise<Bruker>;
}
