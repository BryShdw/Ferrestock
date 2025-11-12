"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

interface MovementModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function MovementModal({ isOpen, onClose }: MovementModalProps) {
  const [movementType, setMovementType] = useState("entrada")
  const [selectedProduct, setSelectedProduct] = useState("")
  const [quantity, setQuantity] = useState("")
  const [guideNumber, setGuideNumber] = useState("")
  const [notes, setNotes] = useState("")

  const products = [
    { id: "FER-001", name: "Martillo de Acero" },
    { id: "FER-002", name: "Destornillador Phillips" },
    { id: "FER-003", name: 'Tubo PVC 2"' },
    { id: "FER-004", name: "Cemento Portland" },
    { id: "FER-005", name: "Pintura Látex Blanca" },
  ]

  const handleSave = () => {
    console.log({
      movementType,
      selectedProduct,
      quantity,
      guideNumber,
      notes,
    })
    // Reset form
    setSelectedProduct("")
    setQuantity("")
    setGuideNumber("")
    setNotes("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Registrar Movimiento de Inventario</DialogTitle>
          <DialogDescription>Registre una entrada o salida de productos</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Movement Type Tabs */}
          <Tabs value={movementType} onValueChange={setMovementType}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="entrada">Entrada (Compra)</TabsTrigger>
              <TabsTrigger value="salida">Salida (Venta/Ajuste)</TabsTrigger>
            </TabsList>
            <TabsContent value="entrada" className="space-y-4 mt-4">
              <p className="text-sm text-muted-foreground">Registre nuevas compras o devoluciones</p>
            </TabsContent>
            <TabsContent value="salida" className="space-y-4 mt-4">
              <p className="text-sm text-muted-foreground">Registre ventas, ajustes o mermas</p>
            </TabsContent>
          </Tabs>

          {/* Product Select */}
          <div className="space-y-2">
            <Label htmlFor="product" className="text-sm font-medium">
              Buscar y seleccionar producto
            </Label>
            <Select value={selectedProduct} onValueChange={setSelectedProduct}>
              <SelectTrigger id="product">
                <SelectValue placeholder="Seleccione un producto" />
              </SelectTrigger>
              <SelectContent>
                {products.map((product) => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.id} - {product.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Quantity Input */}
          <div className="space-y-2">
            <Label htmlFor="quantity" className="text-sm font-medium">
              Cantidad
            </Label>
            <Input
              id="quantity"
              type="number"
              placeholder="Ingrese la cantidad"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              min="1"
            />
          </div>

          {/* Guide Number Input */}
          <div className="space-y-2">
            <Label htmlFor="guide" className="text-sm font-medium">
              Nro. de Guía o Factura <span className="text-muted-foreground">(Opcional)</span>
            </Label>
            <Input
              id="guide"
              type="text"
              placeholder="Ej: F-001234 o GR-005678"
              value={guideNumber}
              onChange={(e) => setGuideNumber(e.target.value)}
            />
          </div>

          {/* Notes Textarea */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-sm font-medium">
              Notas o Razón
            </Label>
            <Textarea
              id="notes"
              placeholder="Registre mermas, ajustes o motivo del movimiento"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="resize-none"
              rows={3}
            />
          </div>
        </div>

        <DialogFooter className="flex gap-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave} className="bg-primary hover:bg-primary/90 text-white">
            Guardar Movimiento
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
