export interface FundiUserData {
  id: string
  email?: string
  phone?: string
  firstName?: string
  lastName?: string
  location?: string
  primary_skill?: string
  experience_level?: string
  biography?: string
  accountStatus?: string
  subscriptionPlan?: string
  subscriptionStatus?: string
  trialEndsAt?: string
  createdAt?: string
  updatedAt?: string
}

class FundiAuthService {
  private static readonly TOKEN_COOKIE = "fundiToken";
  private static readonly DATA_KEY = "fundiData";
  private static readonly SESSION_EXPIRY = 7200;

  static setAuth(token: string, data: FundiUserData): void {
    document.cookie = `${this.TOKEN_COOKIE}=${token}; path=/; max-age=${this.SESSION_EXPIRY}; secure; samesite=strict`;
    localStorage.setItem(this.DATA_KEY, JSON.stringify(data));
  }
  static saveUserData(data: Partial<FundiUserData>): void {
    const existingData = this.getUserData();
    const updatedData = { ...existingData, ...data };
    localStorage.setItem(this.DATA_KEY, JSON.stringify(updatedData));
  }

  static clearAuth(): void {
    document.cookie = `${this.TOKEN_COOKIE}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; secure; samesite=strict`;
    localStorage.removeItem(this.DATA_KEY);
  }

  static getToken(): string | null {
    return this.getCookie(this.TOKEN_COOKIE);
  }

  static getUserData(): FundiUserData | null {
    const data = localStorage.getItem(this.DATA_KEY);
    return data ? JSON.parse(data) : null;
  }

  static isAuthenticated(): boolean {
    return !!this.getToken();
  }

  static async logout(): Promise<void> {
    try {
      await fetch("http://localhost:5000/api/fundi/logoutFundi", {
        method: "POST",
        headers: { Authorization: `Bearer ${this.getToken()}` },
      });
    } catch (err) {
      console.error("Fundi logout error:", err);
    } finally {
      this.clearAuth();
      window.location.href = "/auth/job-listing";
    }
  }

  private static getCookie(name: string): string | null {
    const cookies = document.cookie.split(";");
    const match = cookies.find((c) => c.trim().startsWith(`${name}=`));
    return match ? match.split("=")[1] : null;
  }
}
export default FundiAuthService;
