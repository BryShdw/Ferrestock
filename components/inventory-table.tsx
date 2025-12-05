"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit, Trash2 } from "lucide-react"
import { useInventory } from "@/src/context/InventoryContext"

interface InventoryTableProps {
  searchTerm: string
}

export default function InventoryTable({ searchTerm }: InventoryTableProps) {
  const { products } = useInventory()

  const filteredData = products.filter(
    (item) =>
      item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.categoria.toLowerCase().includes(searchTerm.toLowerCase()),
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
            <TableHead className="font-semibold text-foreground text-center">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredData.map((item) => {
            const isLowStock = item.stockActual <= item.stockMinimo
            return (
              <TableRow key={item.id} className="hover:bg-slate-50 transition">
                <TableCell className="font-mono text-sm text-primary font-semibold">{item.sku}</TableCell>
                <TableCell className="font-medium text-foreground">{item.nombre}</TableCell>
                <TableCell className="text-muted-foreground">{item.categoria}</TableCell>
                <TableCell className="text-right font-semibold text-foreground">
                  {item.stockActual.toLocaleString()}
                </TableCell>
                <TableCell className="text-right text-muted-foreground">{item.stockMinimo.toLocaleString()}</TableCell>
                <TableCell className="text-center">
                  <Badge
                    className={
                      isLowStock
                        ? "bg-red-100 text-red-700 hover:bg-red-100 border-red-200"
                        : "bg-green-100 text-green-700 hover:bg-green-100 border-green-200"
                    }
                  >
                    {isLowStock ? "Bajo Stock" : "En Stock"}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Editar</span>
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50">
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Eliminar</span>
                    </Button>
                  </div>
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
