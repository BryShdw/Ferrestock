import { NextResponse } from 'next/server';
import { getJSONData, writeJSONData } from '@/lib/db';

export async function GET() {
    try {
        const products = await getJSONData('productos.json');
        return NextResponse.json(products);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to load products' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const products = await getJSONData('productos.json');

        // Generate new ID
        const maxId = products.reduce((max: number, p: any) => (p.id > max ? p.id : max), 0);
        const newProduct = {
            ...body,
            id: maxId + 1,
            stockActual: Number(body.stockActual) || 0,
            stockMinimo: Number(body.stockMinimo) || 0,
            precio: Number(body.precio) || 0
        };

        products.push(newProduct);
        await writeJSONData('productos.json', products);

        return NextResponse.json(newProduct, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to add product' }, { status: 500 });
    }
}
