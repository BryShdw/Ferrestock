"use client"

import { useState, useEffect } from "react"
import LoginPage from "@/components/login-page"
import DashboardPage from "@/components/dashboard-page"

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for active session in localStorage on mount
    const session = localStorage.getItem("ferrestock_session")
    if (session === "active") {
      setIsLoggedIn(true)
    }
    setIsLoading(false)
  }, [])

  const handleLogin = () => {
    localStorage.setItem("ferrestock_session", "active")
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    localStorage.removeItem("ferrestock_session")
    setIsLoggedIn(false)
  }

  // Show nothing or a loader while checking session to prevent flash of login screen
  if (isLoading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">Cargando...</div>
  }

  return (
    <main className="min-h-screen bg-background">
      {!isLoggedIn ? <LoginPage onLogin={handleLogin} /> : <DashboardPage onLogout={handleLogout} />}
    </main>
  )
}
