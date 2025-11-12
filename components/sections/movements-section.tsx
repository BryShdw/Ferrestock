"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface Movement {
  id: string
  date: string
  time: string
  product: string
  sku: string
  type: "entrada" | "salida" | "ajuste"
  quantity: number
  user: string
  reference: string
}

const SAMPLE_MOVEMENTS: Movement[] = [
  {
    id: "1",
    date: "21/10/2025",
    time: "10:30 AM",
    product: "Martillo",
    sku: "SKU-001",
    type: "entrada",
    quantity: 50,
    user: "admin",
    reference: "Guía de Compra G-0045",
  },
  {
    id: "2",
    date: "21/10/2025",
    time: "10:32 AM",
    product: "Tornillo",
    sku: "SKU-003",
    type: "salida",
    quantity: 200,
    user: "vendedor_1",
    reference: "Boleta B-0012",
  },
  {
    id: "3",
    date: "21/10/2025",
    time: "10:35 AM",
    product: "Cable",
    sku: "SKU-002",
    type: "ajuste",
    quantity: 5,
    user: "admin",
    reference: "Merma por corte",
  },
]

const getTypeBadgeColor = (type: string) => {
  switch (type) {
    case "entrada":
      return "bg-green-100 text-green-800"
    case "salida":
      return "bg-red-100 text-red-800"
    case "ajuste":
      return "bg-yellow-100 text-yellow-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const getTypeLabel = (type: string) => {
  switch (type) {
    case "entrada":
      return "Entrada"
    case "salida":
      return "Salida"
    case "ajuste":
      return "Ajuste"
    default:
      return type
  }
}

export default function MovementsSection() {
  const [movements] = useState<Movement[]>(SAMPLE_MOVEMENTS)
  const [currentPage, setCurrentPage] = useState(1)
  const [filterType, setFilterType] = useState("todos")
  const [searchTerm, setSearchTerm] = useState("")

  const itemsPerPage = 10
  const filteredMovements = movements.filter((m) => {
    const typeMatch = filterType === "todos" || m.type === filterType
    const searchMatch =
      m.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.sku.toLowerCase().includes(searchTerm.toLowerCase())
    return typeMatch && searchMatch
  })

  const totalPages = Math.ceil(filteredMovements.length / itemsPerPage)
  const paginatedMovements = filteredMovements.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  return (
    <div className="p-8 space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-border p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Filtrar por Tipo</label>
            <select
              value={filterType}
              onChange={(e) => {
                setFilterType(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full px-4 py-2 border border-border rounded-lg bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="todos">Todos</option>
              <option value="entrada">Entrada</option>
              <option value="salida">Salida</option>
              <option value="ajuste">Ajuste</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Buscar por Producto</label>
            <input
              type="text"
              placeholder="Nombre o SKU..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full px-4 py-2 border border-border rounded-lg bg-white text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="flex items-end">
            <Button className="w-full bg-primary hover:bg-primary/90 text-white">Aplicar Filtros</Button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-border overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted border-b border-border">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Fecha y Hora</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Producto (SKU)</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Tipo</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Cantidad</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Usuario</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Referencia</th>
            </tr>
          </thead>
          <tbody>
            {paginatedMovements.map((movement) => (
              <tr key={movement.id} className="border-b border-border hover:bg-muted/50 transition">
                <td className="px-6 py-4 text-sm text-foreground">
                  {movement.date} {movement.time}
                </td>
                <td className="px-6 py-4 text-sm text-foreground">
                  {movement.product} ({movement.sku})
                </td>
                <td className="px-6 py-4 text-sm">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeBadgeColor(movement.type)}`}>
                    {getTypeLabel(movement.type)}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-foreground">
                  {movement.type === "salida" ? "-" : "+"}
                  {movement.quantity}
                </td>
                <td className="px-6 py-4 text-sm text-foreground">{movement.user}</td>
                <td className="px-6 py-4 text-sm text-foreground">{movement.reference}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Mostrando {paginatedMovements.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} a{" "}
          {Math.min(currentPage * itemsPerPage, filteredMovements.length)} de {filteredMovements.length} movimientos
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Anterior
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrentPage(page)}
              className={currentPage === page ? "bg-primary text-white" : ""}
            >
              {page}
            </Button>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="flex items-center gap-2"
          >
            Siguiente
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
