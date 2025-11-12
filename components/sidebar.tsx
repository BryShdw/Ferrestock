"use client"

import { LayoutDashboard, Package, TrendingUp, BarChart3 } from "lucide-react"

interface SidebarProps {
  activeSection: string
  onSectionChange: (section: string) => void
}

export default function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  const menuItems = [
    { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { id: "productos", icon: Package, label: "Productos" },
    { id: "movimientos", icon: TrendingUp, label: "Movimientos" },
    { id: "reportes", icon: BarChart3, label: "Reportes" },
  ]

  return (
    <aside className="w-20 bg-primary text-white flex flex-col items-center py-8 shadow-lg">
      <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mb-8 cursor-pointer hover:bg-slate-100 transition">
        <span className="text-primary font-bold text-xl">Z</span>
      </div>

      <nav className="flex-1 flex flex-col gap-6">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onSectionChange(item.id)}
            className={`w-12 h-12 rounded-lg flex items-center justify-center transition ${
              activeSection === item.id ? "bg-white/20 text-white" : "text-white/70 hover:text-white hover:bg-white/10"
            }`}
            title={item.label}
          >
            <item.icon className="w-6 h-6" />
          </button>
        ))}
      </nav>

      <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition cursor-pointer">
        <span className="text-lg font-semibold">?</span>
      </div>
    </aside>
  )
}
