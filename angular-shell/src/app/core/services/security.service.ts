import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import {
  GamificationStoreService,
  SalesPerson,
  GameDetails,
} from './gamification-store.service';

// ── JWT Payload Interface ───────────────────────────────────────

export interface JWTPayload {
  'sales person': SalesPerson;
  gamedetails: GameDetails;
  exp?: number;
  iat?: number;
  [key: string]: any;
}

// ── Service ─────────────────────────────────────────────────────

@Injectable({
  providedIn: 'root',
})
export class SecurityService {
  private token: string | null = null;
  private payload: JWTPayload | null = null;

  constructor(
    private router: Router,
    private store: GamificationStoreService,
  ) {}

  /**
   * Decode JWT, validate expiration, extract sales person + game details,
   * and push into the centralized store.
   *
   * @param token  Raw JWT string from query parameter
   * @returns      gameId if valid, null if invalid/expired
   */
  authenticateWithToken(token: string): string | null {
    try {
      this.token = token;
      this.payload = jwtDecode<JWTPayload>(token);

      console.log('[SecurityService] JWT decoded:', {
        salesPerson: this.payload['sales person'],
        gameDetails: this.payload.gamedetails,
      });

      // ── Validate expiration ──
      if (this.payload.exp) {
        const nowSec = Math.floor(Date.now() / 1000);
        if (this.payload.exp < nowSec) {
          console.error('[SecurityService] JWT expired');
          this.clearAuthentication();
          return null;
        }
      }

      // ── Extract required claims ──
      const salesPerson = this.payload['sales person'];
      const gameDetails = this.payload.gamedetails;

      if (!salesPerson?.id) {
        console.error('[SecurityService] Missing "sales person.id" claim');
        this.clearAuthentication();
        return null;
      }

      if (!gameDetails?.id) {
        console.error('[SecurityService] Missing "gamedetails.id" claim');
        this.clearAuthentication();
        return null;
      }

      // ── Push to centralized store ──
      this.store.setState(salesPerson, gameDetails, token);

      return gameDetails.id;
    } catch (error) {
      console.error('[SecurityService] JWT decode failed:', error);
      this.clearAuthentication();
      return null;
    }
  }

  /**
   * Navigate to /play/:gameId and scrub the token from browser history/URL
   */
  secureNavigateToGame(gameId: string): void {
    this.router.navigate(['/play', gameId], {
      replaceUrl: true, // removes token URL from browser history
    });
  }

  /**
   * Get the game ID from the current session
   */
  getCurrentGameId(): string | null {
    return this.payload?.gamedetails?.id ?? null;
  }

  /**
   * Check if user has an active authenticated session
   */
  isAuthenticated(): boolean {
    return this.token !== null && this.store.hasValidState();
  }

  /**
   * Clear token + payload + store
   */
  clearAuthentication(): void {
    this.token = null;
    this.payload = null;
    this.store.clearState();
  }
}
