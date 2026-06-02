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
  planStartDate?: string
  planEndDate?: string
  trialEndsAt?: string
  createdAt?: string
  updatedAt?: string
}

class FundiAuthService {
  private static readonly DATA_KEY = "fundiData";

  /** True when running in the browser (not during SSR). */
  private static isClient(): boolean {
    return typeof window !== "undefined";
  }

  static setAuth(data: FundiUserData): void {
    if (!this.isClient()) return;
    localStorage.setItem(this.DATA_KEY, JSON.stringify(data));
  }
  static saveUserData(data: Partial<FundiUserData>): void {
    if (!this.isClient()) return;
    const existingData = this.getUserData();
    const updatedData = { ...existingData, ...data };
    localStorage.setItem(this.DATA_KEY, JSON.stringify(updatedData));
  }

  static clearAuth(): void {
    if (!this.isClient()) return;
    localStorage.removeItem(this.DATA_KEY);
  }

  // Backward-compatible no-op for older pages still checking token.
  static getToken(): string | null {
    return null;
  }

  static getUserData(): FundiUserData | null {
    if (!this.isClient()) return null;
    const data = localStorage.getItem(this.DATA_KEY);
    return data ? JSON.parse(data) : null;
  }

  static isAuthenticated(): boolean {
    return !!this.getUserData();
  }

  static async logout(): Promise<void> {
    if (!this.isClient()) return;
    try {
      await fetch("/api/fundi/logoutFundi", {
        method: "POST",
      });
    } catch (err) {
      console.error("Fundi logout error:", err);
    } finally {
      this.clearAuth();
      window.location.href = "/auth/job-listing";
    }
  }

}
export default FundiAuthService;
