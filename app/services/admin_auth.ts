
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
  private static readonly DATA_KEY = "adminData";

  static setAuth(data: AdminUserData): void {
    localStorage.setItem(this.DATA_KEY, JSON.stringify(data));
  }

  static saveUserData(data: Partial<AdminUserData>): void {
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

  static getUserData(): AdminUserData | null {
    const data = localStorage.getItem(this.DATA_KEY);
    return data ? JSON.parse(data) : null;
  }

  static isAuthenticated(): boolean {
    return !!this.getUserData();
  }

  static async logout(): Promise<void> {
    try {
      await fetch("/api/admin/auth/logout", {
        method: "POST",
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
    return {};
  }
}

export default AdminAuthService;