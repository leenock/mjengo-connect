interface AdminUser {
  id: string
  fullName: string
  email: string
  role: string
  isActive: boolean
}

class AdminAuthService {
  private static TOKEN_KEY = "admin_token"
  private static USER_KEY = "admin_user"

  static setToken(token: string): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(this.TOKEN_KEY, token)
    }
  }

  static getToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem(this.TOKEN_KEY)
    }
    return null
  }

  static setUser(user: AdminUser): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(this.USER_KEY, JSON.stringify(user))
    }
  }

  static getUser(): AdminUser | null {
    if (typeof window !== "undefined") {
      const user = localStorage.getItem(this.USER_KEY)
      return user ? JSON.parse(user) : null
    }
    return null
  }

  static isAuthenticated(): boolean {
    return !!this.getToken()
  }

  static hasRole(role: string): boolean {
    const user = this.getUser()
    if (!user) return false

    // Check if user has the required role or is a super admin
    return user.role === role || user.role === "SUPER_ADMIN" || user.role === "ADMIN"
  }

  static getAuthHeaders(): Record<string, string> {
    const token = this.getToken()
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    }

    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    }

    return headers
  }

  static logout(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem(this.TOKEN_KEY)
      localStorage.removeItem(this.USER_KEY)
      window.location.href = "/administrator/auth/login"
    }
  }
}

export default AdminAuthService
