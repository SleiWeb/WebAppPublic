/**
 * Auth-modul (doc 06 §6.5): identitet er en *provider*-abstraktion, så
 * Unilogin (elever, via STIL-brokeren) og MitID/lokal IdP (lærere) kan
 * kobles på uden at røre resten af appen. Ingen komponent kender andet
 * end den fælles Identity-kontrakt.
 */

export type Identity = {
  /** users.id i databasen */
  userId: string;
  displayName: string;
  role: "student" | "teacher" | "school_admin";
  provider: "demo" | "unilogin" | "mitid" | "local_idp";
};

export interface AuthProvider {
  id: Identity["provider"];
  name: string;
  /**
   * Gennemfør login-flowet og returnér en verificeret identitet.
   * OIDC-providere implementerer redirect/callback; demo slår op i DB.
   */
  authenticate(params: Record<string, string>): Promise<Identity>;
}

/** Unilogin via STIL-brokeren (OIDC). Konfigureres i fase 1–2 (doc 09). */
export const uniloginProvider: AuthProvider = {
  id: "unilogin",
  name: "Unilogin",
  async authenticate() {
    throw new Error(
      "Unilogin er ikke konfigureret endnu. Integrationen kobles på STIL-brokerens OIDC-endpoint (doc 06 §6.5) og mapper 'unilogin_id' til users-tabellen."
    );
  },
};

/** MitID / kommunal IdP til lærere og personale. */
export const mitidProvider: AuthProvider = {
  id: "mitid",
  name: "MitID",
  async authenticate() {
    throw new Error(
      "MitID er ikke konfigureret endnu. Integrationen mapper 'mitid_sub' til users-tabellen (doc 06 §6.5)."
    );
  },
};
