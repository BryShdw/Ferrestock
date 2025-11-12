"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Edit2, Trash2 } from "lucide-react"
import ProductModal from "@/components/modals/product-modal"

interface Product {
  id: string
  sku: string
  name: string
  category: string
  stock: number
  minStock: number
}

const SAMPLE_PRODUCTS: Product[] = [
  {
    id: "1",
    sku: "SKU-001",
    name: "Martillo de Carpintero",
    category: "Herramientas Manuales",
    stock: 150,
    minStock: 30,
  },
  {
    id: "2",
    sku: "SKU-002",
    name: "Cable Eléctrico TW #14",
    category: "Materiales Eléctricos",
    stock: 800,
    minStock: 100,
  },
  {
    id: "3",
    sku: "SKU-003",
    name: 'Tornillo Autorroscante 1/2"',
    category: "Tornillería",
    stock: 4500,
    minStock: 500,
  },
]

export default function ProductsSection() {
  const [products, setProducts] = useState<Product[]>(SAMPLE_PRODUCTS)
  const [searchTerm, setSearchTerm] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.sku.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddProduct = () => {
    setEditingProduct(null)
    setIsModalOpen(true)
  }

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
    setIsModalOpen(true)
  }

  const handleDeleteProduct = (id: string) => {
    setProducts(products.filter((p) => p.id !== id))
  }

  const handleSaveProduct = (product: Omit<Product, "id">) => {
    if (editingProduct) {
      setProducts(products.map((p) => (p.id === editingProduct.id ? { ...product, id: p.id } : p)))
    } else {
      setProducts([...products, { ...product, id: Date.now().toString() }])
    }
    setIsModalOpen(false)
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex-1 max-w-md">
          <input
            type="text"
            placeholder="Buscar producto por nombre o SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-border rounded-lg bg-white text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <Button
          onClick={handleAddProduct}
          className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white ml-4"
        >
          <Plus className="w-4 h-4" />
          Añadir Nuevo Producto
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-border overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted border-b border-border">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">SKU</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Producto</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Categoría</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Stock Actual</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Stock Mínimo</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product.id} className="border-b border-border hover:bg-muted/50 transition">
                <td className="px-6 py-4 text-sm text-foreground font-medium">{product.sku}</td>
                <td className="px-6 py-4 text-sm text-foreground">{product.name}</td>
                <td className="px-6 py-4 text-sm text-foreground">{product.category}</td>
                <td className="px-6 py-4 text-sm text-foreground">{product.stock}</td>
                <td className="px-6 py-4 text-sm text-foreground">{product.minStock}</td>
                <td className="px-6 py-4 text-sm flex gap-2">
                  <button
                    onClick={() => handleEditProduct(product)}
                    className="p-2 hover:bg-muted rounded-lg transition text-primary"
                    title="Editar"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="p-2 hover:bg-destructive/10 rounded-lg transition text-destructive"
                    title="Eliminar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProduct}
        product={editingProduct}
      />
    </div>
  )
}
