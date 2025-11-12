"use client"

import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface InventoryTableProps {
  searchTerm: string
}

export default function InventoryTable({ searchTerm }: InventoryTableProps) {
  const inventoryData = [
    {
      sku: "FER-001",
      product: "Martillo de Acero",
      category: "Herramientas",
      currentStock: 150,
      minStock: 50,
    },
    {
      sku: "FER-002",
      product: "Destornillador Phillips",
      category: "Herramientas",
      currentStock: 45,
      minStock: 100,
    },
    {
      sku: "FER-003",
      product: 'Tubo PVC 2"',
      category: "Tuberías",
      currentStock: 320,
      minStock: 100,
    },
    {
      sku: "FER-004",
      product: "Cemento Portland",
      category: "Materiales",
      currentStock: 85,
      minStock: 200,
    },
    {
      sku: "FER-005",
      product: "Pintura Látex Blanca",
      category: "Pinturas",
      currentStock: 200,
      minStock: 50,
    },
    {
      sku: "FER-006",
      product: 'Clavo 3"',
      category: "Herrajes",
      currentStock: 1200,
      minStock: 500,
    },
    {
      sku: "FER-007",
      product: 'Tornillo Madera 2"',
      category: "Herrajes",
      currentStock: 800,
      minStock: 300,
    },
    {
      sku: "FER-008",
      product: "Bisagra Acero",
      category: "Herrajes",
      currentStock: 120,
      minStock: 100,
    },
  ]

  const filteredData = inventoryData.filter(
    (item) =>
      item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="bg-white rounded-lg border border-border shadow-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-slate-50 border-b border-border">
          <TableRow>
            <TableHead className="font-semibold text-foreground">SKU</TableHead>
            <TableHead className="font-semibold text-foreground">Producto</TableHead>
            <TableHead className="font-semibold text-foreground">Categoría</TableHead>
            <TableHead className="font-semibold text-foreground text-right">Stock Actual</TableHead>
            <TableHead className="font-semibold text-foreground text-right">Stock Mínimo</TableHead>
            <TableHead className="font-semibold text-foreground text-center">Estado</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredData.map((item, index) => {
            const isLowStock = item.currentStock <= item.minStock
            return (
              <TableRow key={index} className="hover:bg-slate-50 transition">
                <TableCell className="font-mono text-sm text-primary font-semibold">{item.sku}</TableCell>
                <TableCell className="font-medium text-foreground">{item.product}</TableCell>
                <TableCell className="text-muted-foreground">{item.category}</TableCell>
                <TableCell className="text-right font-semibold text-foreground">
                  {item.currentStock.toLocaleString()}
                </TableCell>
                <TableCell className="text-right text-muted-foreground">{item.minStock.toLocaleString()}</TableCell>
                <TableCell className="text-center">
                  <Badge
                    className={
                      isLowStock
                        ? "bg-red-100 text-red-700 hover:bg-red-100"
                        : "bg-green-100 text-green-700 hover:bg-green-100"
                    }
                  >
                    {isLowStock ? "Bajo Stock" : "En Stock"}
                  </Badge>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
      {filteredData.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">No se encontraron productos</div>
      )}
    </div>
  )
}
