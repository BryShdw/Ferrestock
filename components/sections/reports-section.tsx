"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { FileText, AlertCircle, TrendingUp, Eye, Download } from "lucide-react"

interface ReportCard {
  id: string
  title: string
  description: string
  icon: React.ReactNode
}

const REPORT_CARDS: ReportCard[] = [
  {
    id: "stock-general",
    title: "Reporte de Stock General",
    description: "Genera una lista completa de todos los productos en inventario, su stock actual y su valor.",
    icon: <FileText className="w-8 h-8 text-primary" />,
  },
  {
    id: "alertas-stock",
    title: "Reporte de Alertas de Stock",
    description: "Muestra únicamente los productos que se encuentran por debajo de su stock mínimo definido.",
    icon: <AlertCircle className="w-8 h-8 text-destructive" />,
  },
  {
    id: "productos-vendidos",
    title: "Reporte de Productos Más Vendidos",
    description: "Ranking de productos con mayor rotación (salidas) en un rango de fechas.",
    icon: <TrendingUp className="w-8 h-8 text-green-600" />,
  },
]

export default function ReportsSection() {
  return (
    <div className="p-8 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {REPORT_CARDS.map((report) => (
          <div
            key={report.id}
            className="bg-white rounded-lg shadow-sm border border-border p-6 space-y-4 hover:shadow-md transition"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground mb-2">{report.title}</h3>
                <p className="text-sm text-muted-foreground">{report.description}</p>
              </div>
              <div className="ml-4">{report.icon}</div>
            </div>

            {report.id === "productos-vendidos" && (
              <div className="pt-4 border-t border-border">
                <label className="block text-sm font-medium text-foreground mb-2">Rango de Fechas</label>
                <div className="flex gap-2">
                  <input
                    type="date"
                    className="flex-1 px-3 py-2 border border-border rounded-lg bg-white text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <input
                    type="date"
                    className="flex-1 px-3 py-2 border border-border rounded-lg bg-white text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            )}

            <div className="flex gap-2 pt-4">
              <Button variant="outline" className="flex-1 flex items-center justify-center gap-2 bg-transparent">
                <Eye className="w-4 h-4" />
                Ver en Pantalla
              </Button>
              <Button className="flex-1 flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white">
                <Download className="w-4 h-4" />
                Exportar a Excel
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
