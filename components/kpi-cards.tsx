"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Package, DollarSign, AlertCircle } from "lucide-react"

export default function KPICards() {
  const kpiData = [
    {
      title: "Productos Totales",
      value: "1,500",
      icon: Package,
      color: "bg-blue-50",
      iconColor: "text-blue-600",
      borderColor: "border-blue-200",
    },
    {
      title: "Valor del Inventario",
      value: "S/ 120,000",
      icon: DollarSign,
      color: "bg-green-50",
      iconColor: "text-green-600",
      borderColor: "border-green-200",
    },
    {
      title: "Alertas de Stock",
      value: "12",
      icon: AlertCircle,
      color: "bg-red-50",
      iconColor: "text-red-600",
      borderColor: "border-red-200",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {kpiData.map((kpi, index) => (
        <Card key={index} className={`border-2 ${kpi.borderColor} ${kpi.color}`}>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">{kpi.title}</p>
                <p className="text-3xl font-bold text-foreground">{kpi.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${kpi.color}`}>
                <kpi.icon className={`w-6 h-6 ${kpi.iconColor}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
