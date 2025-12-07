"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Search, Plus } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

interface Movement {
  id: number
  fechaHora: string
  productoSku: string
  productoNombre: string
  tipo: string
  cantidad: number
  usuario: string
  referencia: string
}

interface Product {
  id: number
  sku: string
  nombre: string
}

const getTypeBadgeColor = (type: string) => {
  switch (type) {
    case "Entrada":
      return "bg-green-100 text-green-800 border-green-200 hover:bg-green-100"
    case "Salida":
      return "bg-red-100 text-red-800 border-red-200 hover:bg-red-100"
    case "Ajuste":
      return "bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-100"
  }
}

export default function MovementsSection() {
  const [movements, setMovements] = useState<Movement[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [filteredMovements, setFilteredMovements] = useState<Movement[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)

  // Filter states
  const [filterType, setFilterType] = useState("Todos")
  const [searchTerm, setSearchTerm] = useState("")

  // Modal & Form states
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newMovement, setNewMovement] = useState({
    productoSku: "",
    tipo: "Entrada",
    cantidad: "",
    referencia: ""
  })

  const itemsPerPage = 10

  useEffect(() => {
    fetchMovements()
    fetchProducts()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [movements, filterType, searchTerm])

  const fetchMovements = async () => {
    try {
      const res = await fetch('/api/movements')
      if (res.ok) {
        const data = await res.json()
        // Sort by date descending if needed, or just reverse to show newest first
        // Assuming the API returns them in order of creation (append), reversing shows newest first
        setMovements(data.reverse())
      }
    } catch (error) {
      console.error("Error fetching movements:", error)
    }
  }

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products')
      if (res.ok) {
        const data = await res.json()
        setProducts(data)
      }
    } catch (error) {
      console.error("Error fetching products:", error)
    }
  }

  const applyFilters = () => {
    const filtered = movements.filter((m) => {
      const typeMatch = filterType === "Todos" || m.tipo === filterType
      const searchMatch =
        m.productoNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.productoSku.toLowerCase().includes(searchTerm.toLowerCase())
      return typeMatch && searchMatch
    })
    setFilteredMovements(filtered)
    setCurrentPage(1)
  }

  const handleRegisterMovement = async () => {
    if (!newMovement.productoSku || !newMovement.cantidad || !newMovement.referencia) {
      return // Basic validation
    }

    const selectedProduct = products.find(p => p.sku === newMovement.productoSku)
    if (!selectedProduct) return

    setIsLoading(true)

    const now = new Date()
    const formattedDate = now.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })
    const formattedTime = now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: true })

    let quantity = Number(newMovement.cantidad)
    if (newMovement.tipo === "Salida") {
      quantity = quantity * -1
    }

    const movementData = {
      fechaHora: `${formattedDate} ${formattedTime}`,
      productoSku: selectedProduct.sku,
      productoNombre: selectedProduct.nombre,
      tipo: newMovement.tipo,
      cantidad: quantity,
      usuario: "admin", // Hardcoded for demo
      referencia: newMovement.referencia
    }

    try {
      const res = await fetch('/api/movements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(movementData)
      })

      if (res.ok) {
        await fetchMovements()
        setIsModalOpen(false)
        setNewMovement({
          productoSku: "",
          tipo: "Entrada",
          cantidad: "",
          referencia: ""
        })
      }
    } catch (error) {
      console.error("Error registering movement:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const totalPages = Math.ceil(filteredMovements.length / itemsPerPage)
  const paginatedMovements = filteredMovements.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  return (
    <div className="p-8 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Historial de Movimientos</h2>
          <p className="text-slate-500 mt-1">Registro detallado de entradas y salidas de inventario.</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-border p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Filtrar por Tipo</label>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Seleccionar tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Todos">Todos</SelectItem>
                <SelectItem value="Entrada">Entrada</SelectItem>
                <SelectItem value="Salida">Salida</SelectItem>
                <SelectItem value="Ajuste">Ajuste</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Buscar por Producto</label>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Nombre o SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 bg-white"
              />
            </div>
          </div>
          <div className="flex items-end gap-2">
            <Button
              onClick={applyFilters}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              Aplicar Filtros
            </Button>
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white">
                  <Plus className="mr-2 h-4 w-4" /> Registrar Movimiento
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Registrar Movimiento de Inventario</DialogTitle>
                  <DialogDescription>
                    Ingresa los detalles del movimiento para actualizar el stock.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="producto">Producto</Label>
                    <Select
                      value={newMovement.productoSku}
                      onValueChange={(val) => setNewMovement({ ...newMovement, productoSku: val })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar producto" />
                      </SelectTrigger>
                      <SelectContent>
                        {products.map((prod) => (
                          <SelectItem key={prod.id} value={prod.sku}>
                            {prod.nombre} ({prod.sku})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="tipo">Tipo de Movimiento</Label>
                    <Select
                      value={newMovement.tipo}
                      onValueChange={(val) => setNewMovement({ ...newMovement, tipo: val })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Entrada">Entrada</SelectItem>
                        <SelectItem value="Salida">Salida</SelectItem>
                        <SelectItem value="Ajuste">Ajuste</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="cantidad">Cantidad</Label>
                    <Input
                      id="cantidad"
                      type="number"
                      min="1"
                      placeholder="Ej. 10"
                      value={newMovement.cantidad}
                      onChange={(e) => setNewMovement({ ...newMovement, cantidad: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="referencia">Referencia</Label>
                    <Input
                      id="referencia"
                      placeholder="Ej. Factura F-001"
                      value={newMovement.referencia}
                      onChange={(e) => setNewMovement({ ...newMovement, referencia: e.target.value })}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
                  <Button onClick={handleRegisterMovement} disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 text-white">
                    {isLoading ? "Guardando..." : "Guardar"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-border overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-border">
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
            {paginatedMovements.length > 0 ? (
              paginatedMovements.map((movement) => (
                <tr key={movement.id} className="border-b border-border hover:bg-slate-50 transition">
                  <td className="px-6 py-4 text-sm text-foreground font-medium">
                    {movement.fechaHora}
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground">
                    <div className="font-medium">{movement.productoNombre}</div>
                    <div className="text-xs text-muted-foreground">{movement.productoSku}</div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <Badge variant="outline" className={`${getTypeBadgeColor(movement.tipo)} font-medium`}>
                      {movement.tipo}
                    </Badge>
                  </td>
                  <td className={`px-6 py-4 text-sm font-semibold ${movement.cantidad < 0 ? "text-red-600" : "text-green-600"}`}>
                    {movement.cantidad > 0 ? "+" : ""}{movement.cantidad}
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground">{movement.usuario}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{movement.referencia}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                  No se encontraron movimientos con los filtros seleccionados.
                </td>
              </tr>
            )}
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
              className={currentPage === page ? "bg-blue-600 hover:bg-blue-700 text-white" : ""}
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
