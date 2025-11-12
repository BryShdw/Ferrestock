"use client"

import { useState } from "react"
import LoginPage from "@/components/login-page"
import DashboardPage from "@/components/dashboard-page"

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const handleLogin = () => {
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
  }

  return (
    <main className="min-h-screen bg-background">
      {!isLoggedIn ? <LoginPage onLogin={handleLogin} /> : <DashboardPage onLogout={handleLogout} />}
    </main>
  )
}
