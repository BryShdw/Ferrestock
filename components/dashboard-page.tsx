"use client"

import { useState } from "react"
import Sidebar from "@/components/sidebar"
import KPICards from "@/components/kpi-cards"
import InventoryTable from "@/components/inventory-table"
import MovementModal from "@/components/movement-modal"
import ProductsSection from "@/components/sections/products-section"
import MovementsSection from "@/components/sections/movements-section"
import ReportsSection from "@/components/sections/reports-section"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

interface DashboardPageProps {
  onLogout: () => void
}

export default function DashboardPage({ onLogout }: DashboardPageProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeSection, setActiveSection] = useState("dashboard")

  return (
    <div className="flex h-screen bg-background">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-border h-16 flex items-center justify-between px-8 shadow-sm">
          <h1 className="text-2xl font-bold text-foreground">
            {activeSection === "dashboard" && "Inventario en Tiempo Real"}
            {activeSection === "productos" && "Gestión de Productos"}
            {activeSection === "movimientos" && "Historial de Movimientos"}
            {activeSection === "reportes" && "Centro de Reportes"}
          </h1>
          <Button variant="outline" size="sm" onClick={onLogout} className="flex items-center gap-2 bg-transparent">
            <LogOut className="w-4 h-4" />
            Salir
          </Button>
        </header>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          {activeSection === "dashboard" && (
            <div className="p-8 space-y-6">
              <KPICards />
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1 max-w-md">
                    <input
                      type="text"
                      placeholder="Buscar por SKU, producto o categoría..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-4 py-2 border border-border rounded-lg bg-white text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
                <InventoryTable searchTerm={searchTerm} />
              </div>
            </div>
          )}

          {activeSection === "productos" && <ProductsSection />}
          {activeSection === "movimientos" && <MovementsSection />}
          {activeSection === "reportes" && <ReportsSection />}
        </div>
      </div>

      <MovementModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}
