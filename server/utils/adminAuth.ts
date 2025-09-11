export const getAdminToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("adminToken")
  }
  return null
}

export const getAdminUser = () => {
  if (typeof window !== "undefined") {
    const user = localStorage.getItem("adminUser")
    return user ? JSON.parse(user) : null
  }
  return null
}

export const removeAdminAuth = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("adminToken")
    localStorage.removeItem("adminUser")
  }
}

export const isAdminAuthenticated = (): boolean => {
  return !!getAdminToken()
}
