"use client"

import { useState, useEffect } from "react"
import { Plus, Search, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Product {
  id: number
  sku: string
  nombre: string
  categoria: string
  stockActual: number
  stockMinimo: number
  precio: number
}

export default function ProductsSection() {
  const [products, setProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [currentId, setCurrentId] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    sku: "",
    nombre: "",
    categoria: "",
    stockActual: "",
    stockMinimo: "",
    precio: ""
  })

  // Fetch products on mount
  useEffect(() => {
    fetchProducts()
  }, [])

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

  const filteredProducts = products.filter(
    (product) =>
      product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, categoria: value }))
  }

  const openAddModal = () => {
    setIsEditing(false)
    setFormData({
      sku: "",
      nombre: "",
      categoria: "",
      stockActual: "",
      stockMinimo: "",
      precio: ""
    })
    setIsModalOpen(true)
  }

  const openEditModal = (product: Product) => {
    setIsEditing(true)
    setCurrentId(product.id)
    setFormData({
      sku: product.sku,
      nombre: product.nombre,
      categoria: product.categoria,
      stockActual: product.stockActual.toString(),
      stockMinimo: product.stockMinimo.toString(),
      precio: product.precio.toString()
    })
    setIsModalOpen(true)
  }

  const handleSaveProduct = async () => {
    // Validation (basic)
    if (!formData.sku || !formData.nombre || !formData.categoria) {
      return
    }

    setIsLoading(true)

    try {
      const productData = {
        sku: formData.sku,
        nombre: formData.nombre,
        categoria: formData.categoria,
        stockActual: Number(formData.stockActual) || 0,
        stockMinimo: Number(formData.stockMinimo) || 0,
        precio: Number(formData.precio) || 0
      }

      if (isEditing && currentId !== null) {
        // Update existing product
        const res = await fetch(`/api/products/${currentId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productData)
        })
        if (res.ok) {
          await fetchProducts()
        }
      } else {
        // Create new product
        const res = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productData)
        })
        if (res.ok) {
          await fetchProducts()
        }
      }

      setIsModalOpen(false)
    } catch (error) {
      console.error("Error saving product:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteProduct = async (id: number) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este producto?")) return

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE'
      })
      if (res.ok) {
        await fetchProducts()
      }
    } catch (error) {
      console.error("Error deleting product:", error)
    }
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Gestión de Productos</h2>
          <p className="text-slate-500 mt-1">Administra el inventario de tu ferretería.</p>
        </div>
        <Button onClick={openAddModal} className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="mr-2 h-4 w-4" /> Añadir Nuevo Producto
        </Button>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{isEditing ? "Editar Producto" : "Añadir Nuevo Producto"}</DialogTitle>
              <DialogDescription>
                {isEditing ? "Modifica los detalles del producto." : "Ingresa los detalles del nuevo producto para el inventario."}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="sku">SKU</Label>
                  <Input
                    id="sku"
                    name="sku"
                    placeholder="FER-XXX"
                    value={formData.sku}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="categoria">Categoría</Label>
                  <Select onValueChange={handleSelectChange} value={formData.categoria}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Herramientas">Herramientas</SelectItem>
                      <SelectItem value="Tuberías">Tuberías</SelectItem>
                      <SelectItem value="Materiales">Materiales</SelectItem>
                      <SelectItem value="Pinturas">Pinturas</SelectItem>
                      <SelectItem value="Herrajes">Herrajes</SelectItem>
                      <SelectItem value="Electricidad">Electricidad</SelectItem>
                      <SelectItem value="Gasfitería">Gasfitería</SelectItem>
                      <SelectItem value="Seguridad">Seguridad</SelectItem>
                      <SelectItem value="Adhesivos">Adhesivos</SelectItem>
                      <SelectItem value="Abrasivos">Abrasivos</SelectItem>
                      <SelectItem value="Medición">Medición</SelectItem>
                      <SelectItem value="Construcción">Construcción</SelectItem>
                      <SelectItem value="Iluminación">Iluminación</SelectItem>
                      <SelectItem value="Herramientas Eléctricas">Herramientas Eléctricas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="nombre">Nombre del Producto</Label>
                <Input
                  id="nombre"
                  name="nombre"
                  placeholder="Ej. Martillo de Acero"
                  value={formData.nombre}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="stockActual">Stock Actual</Label>
                  <Input
                    id="stockActual"
                    name="stockActual"
                    type="number"
                    placeholder="0"
                    value={formData.stockActual}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="stockMinimo">Stock Mínimo</Label>
                  <Input
                    id="stockMinimo"
                    name="stockMinimo"
                    type="number"
                    placeholder="0"
                    value={formData.stockMinimo}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="precio">Precio</Label>
                  <Input
                    id="precio"
                    name="precio"
                    type="number"
                    placeholder="0.00"
                    value={formData.precio}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSaveProduct} disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 text-white">
                {isLoading ? "Guardando..." : (isEditing ? "Actualizar Producto" : "Guardar Producto")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-white flex items-center gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
            <Input
              placeholder="Buscar producto por nombre o SKU..."
              className="pl-9 bg-slate-50 border-slate-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="font-semibold text-slate-700">SKU</TableHead>
              <TableHead className="font-semibold text-slate-700">Producto</TableHead>
              <TableHead className="font-semibold text-slate-700">Categoría</TableHead>
              <TableHead className="font-semibold text-slate-700 text-right">Stock Actual</TableHead>
              <TableHead className="font-semibold text-slate-700 text-right">Stock Mínimo</TableHead>
              <TableHead className="font-semibold text-slate-700 text-center">Estado</TableHead>
              <TableHead className="font-semibold text-slate-700 text-center">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => {
                const isLowStock = product.stockActual <= product.stockMinimo
                return (
                  <TableRow key={product.id} className="hover:bg-slate-50 transition-colors">
                    <TableCell className="font-mono text-sm font-medium text-blue-600">
                      {product.sku}
                    </TableCell>
                    <TableCell className="font-medium text-slate-900">
                      {product.nombre}
                    </TableCell>
                    <TableCell className="text-slate-500">
                      <Badge variant="secondary" className="font-normal bg-slate-100 text-slate-600 hover:bg-slate-200">
                        {product.categoria}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium text-slate-700">
                      {product.stockActual}
                    </TableCell>
                    <TableCell className="text-right text-slate-500">
                      {product.stockMinimo}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        className={
                          isLowStock
                            ? "bg-red-50 text-red-700 hover:bg-red-100 border-red-200"
                            : "bg-green-50 text-green-700 hover:bg-green-100 border-green-200"
                        }
                        variant="outline"
                      >
                        {isLowStock ? "Bajo Stock" : "En Stock"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-slate-500 hover:text-blue-600 hover:bg-blue-50"
                          onClick={() => openEditModal(product)}
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Editar</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-slate-500 hover:text-red-600 hover:bg-red-50"
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Eliminar</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-slate-500">
                  No se encontraron productos.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
