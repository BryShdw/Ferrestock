import { NextResponse } from 'next/server';
import { getJSONData, writeJSONData } from '@/lib/db';

export async function PUT(
    request: Request,
    props: { params: Promise<{ id: string }> }
) {
    try {
        const params = await props.params;
        const id = Number(params.id);
        const body = await request.json();
        const products = await getJSONData('productos.json');

        const index = products.findIndex((p: any) => p.id === id);
        if (index === -1) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        products[index] = { ...products[index], ...body, id }; // Ensure ID doesn't change
        await writeJSONData('productos.json', products);

        return NextResponse.json(products[index]);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    props: { params: Promise<{ id: string }> }
) {
    try {
        const params = await props.params;
        const id = Number(params.id);
        const products = await getJSONData('productos.json');

        const filteredProducts = products.filter((p: any) => p.id !== id);
        if (filteredProducts.length === products.length) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        await writeJSONData('productos.json', filteredProducts);

        return NextResponse.json({ message: 'Product deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
    }
}
