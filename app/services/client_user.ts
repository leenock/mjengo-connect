export interface ClientUserData {
  id: string;
  email?: string; // Email address of the client user
  phone?: string; // Phone number of the client user
  firstName?: string; // First name of the client user
  lastName?: string; // Last name of the client user
  company?: string; // Company name associated with the client user
  location?: string; // Location of the client user
  isActive?: boolean; // Indicates if the client user account is active
}

class ClientAuthService {
  private static readonly DATA_KEY = "visitorData";

  static setAuth(data: ClientUserData): void {
    localStorage.setItem(this.DATA_KEY, JSON.stringify(data));
  }

  static saveUserData(data: Partial<ClientUserData>): void {
    const existingData = this.getUserData();
    const updatedData = { ...existingData, ...data };
    localStorage.setItem(this.DATA_KEY, JSON.stringify(updatedData));
  }

  static clearAuth(): void {
    localStorage.removeItem(this.DATA_KEY);
  }

  // Backward-compatible no-op for older pages still checking token.
  static getToken(): string | null {
    return null;
  }

  static getUserData(): ClientUserData | null {
    const data = localStorage.getItem(this.DATA_KEY);
    return data ? JSON.parse(data) : null;
  }

  static isAuthenticated(): boolean {
    return !!this.getUserData();
  }

  static async logout(): Promise<void> {
    try {
      await fetch("/api/client/auth/logout", {
        method: "POST",
      });
    } catch (err) {
      console.error("Visitor logout error:", err);
    } finally {
      this.clearAuth();
      window.location.href = "/auth/job-posting";
    }
  }

}

export default ClientAuthService;
