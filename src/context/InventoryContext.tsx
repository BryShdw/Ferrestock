"use client"

import React, { createContext, useContext, useState, ReactNode } from 'react'
import initialProducts from '@/src/data/productos.json'
import initialMovements from '@/src/data/movimientos.json'

// Define types
export interface Product {
    id: number
    sku: string
    nombre: string
    categoria: string
    stockActual: number
    stockMinimo: number
    precio: number
}

export interface Movement {
    id: number
    fechaHora: string
    productoSku: string
    productoNombre: string
    tipo: string
    cantidad: number
    usuario: string
    referencia: string
}

interface InventoryContextType {
    products: Product[]
    movements: Movement[]
    registrarMovimiento: (nuevoMovimiento: Movement) => void
    addProduct: (product: Product) => void
    updateProduct: (product: Product) => void
    deleteProduct: (id: number) => void
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined)

export function InventoryProvider({ children }: { children: ReactNode }) {
    const [products, setProducts] = useState<Product[]>(initialProducts)
    const [movements, setMovements] = useState<Movement[]>(initialMovements)

    const registrarMovimiento = (nuevoMovimiento: Movement) => {
        // 1. Agregar al historial
        setMovements(prev => [nuevoMovimiento, ...prev])

        // 2. Actualizar stock del producto
        setProducts(prevProducts => {
            return prevProducts.map(prod => {
                if (prod.sku === nuevoMovimiento.productoSku) {
                    // La cantidad ya viene con signo negativo si es salida, así que siempre sumamos
                    const nuevoStock = prod.stockActual + nuevoMovimiento.cantidad
                    return { ...prod, stockActual: nuevoStock }
                }
                return prod
            })
        })
    }

    const addProduct = (product: Product) => {
        setProducts(prev => [...prev, product])
    }

    const updateProduct = (updatedProduct: Product) => {
        setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p))
    }

    const deleteProduct = (id: number) => {
        setProducts(prev => prev.filter(p => p.id !== id))
    }

    return (
        <InventoryContext.Provider value={{
            products,
            movements,
            registrarMovimiento,
            addProduct,
            updateProduct,
            deleteProduct
        }}>
            {children}
        </InventoryContext.Provider>
    )
}

export function useInventory() {
    const context = useContext(InventoryContext)
    if (context === undefined) {
        throw new Error('useInventory must be used within an InventoryProvider')
    }
    return context
}
