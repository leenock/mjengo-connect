export interface AdminUserData {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  role: "SUPER_ADMIN" | "ADMIN" | "MODERATOR" | "SUPPORT";
  status: "ACTIVE" | "INACTIVE" | "PENDING";
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

class AdminAuthService {
  private static readonly TOKEN_COOKIE = "adminToken";
  private static readonly DATA_KEY = "adminData";
  private static readonly SESSION_EXPIRY = 7200; // 2 hours

  static setAuth(token: string, data: AdminUserData): void {
    document.cookie = `${this.TOKEN_COOKIE}=${token}; path=/; max-age=${this.SESSION_EXPIRY}; secure; samesite=strict`;
    localStorage.setItem(this.DATA_KEY, JSON.stringify(data));
  }

  static saveUserData(data: Partial<AdminUserData>): void {
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

  static getUserData(): AdminUserData | null {
    const data = localStorage.getItem(this.DATA_KEY);
    return data ? JSON.parse(data) : null;
  }

  static isAuthenticated(): boolean {
    return !!this.getToken();
  }

  static async logout(): Promise<void> {
    try {
      const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || ""
      await fetch(`${BASE_URL}/api/admin/auth/logout`, {
        method: "POST",
        headers: { Authorization: `Bearer ${this.getToken()}` },
      });
    } catch (err) {
      console.error("Admin logout error:", err);
    } finally {
      this.clearAuth();
      window.location.href = "/administrator/auth/login";
    }
  }

  static hasRole(requiredRole: string): boolean {
    const user = this.getUserData();
    if (!user || !user.role) return false;

    const roleHierarchy = {
      SUPER_ADMIN: 4,
      ADMIN: 3,
      MODERATOR: 2,
      SUPPORT: 1,
    };

    const userLevel = roleHierarchy[user.role as keyof typeof roleHierarchy] || 0;
    const requiredLevel = roleHierarchy[requiredRole as keyof typeof roleHierarchy] || 0;

    return userLevel >= requiredLevel;
  }

  static getAuthHeaders(): Record<string, string> {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  private static getCookie(name: string): string | null {
    const cookies = document.cookie.split(";");
    const match = cookies.find((c) => c.trim().startsWith(`${name}=`));
    return match ? match.split("=")[1] : null;
  }
}

export default AdminAuthService;