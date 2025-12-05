"use client"

import { useState } from "react"
import { Plus, Search, Edit, Trash2 } from "lucide-react"
import initialProducts from "@/src/data/productos.json"
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

export default function ProductsSection() {
  const [products, setProducts] = useState(initialProducts)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  // Form state
  const [newProduct, setNewProduct] = useState({
    sku: "",
    nombre: "",
    categoria: "",
    stockActual: "",
    stockMinimo: "",
    precio: ""
  })

  const filteredProducts = products.filter(
    (product) =>
      product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewProduct((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value: string) => {
    setNewProduct((prev) => ({ ...prev, categoria: value }))
  }

  const handleSaveProduct = () => {
    // Validation (basic)
    if (!newProduct.sku || !newProduct.nombre || !newProduct.categoria) {
      return
    }

    const productToAdd = {
      id: products.length + 1, // Simple ID generation
      sku: newProduct.sku,
      nombre: newProduct.nombre,
      categoria: newProduct.categoria,
      stockActual: Number(newProduct.stockActual) || 0,
      stockMinimo: Number(newProduct.stockMinimo) || 0,
      precio: Number(newProduct.precio) || 0
    }

    setProducts([...products, productToAdd])
    setIsAddModalOpen(false)
    setNewProduct({
      sku: "",
      nombre: "",
      categoria: "",
      stockActual: "",
      stockMinimo: "",
      precio: ""
    })
  }

  const handleDeleteProduct = (id: number) => {
    setProducts(products.filter(p => p.id !== id))
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Gestión de Productos</h2>
          <p className="text-slate-500 mt-1">Administra el inventario de tu ferretería.</p>
        </div>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="mr-2 h-4 w-4" /> Añadir Nuevo Producto
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Añadir Nuevo Producto</DialogTitle>
              <DialogDescription>
                Ingresa los detalles del nuevo producto para el inventario.
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
                    value={newProduct.sku}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="categoria">Categoría</Label>
                  <Select onValueChange={handleSelectChange} value={newProduct.categoria}>
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
                  value={newProduct.nombre}
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
                    value={newProduct.stockActual}
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
                    value={newProduct.stockMinimo}
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
                    value={newProduct.precio}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSaveProduct} className="bg-blue-600 hover:bg-blue-700 text-white">
                Guardar Producto
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
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-blue-600 hover:bg-blue-50">
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
