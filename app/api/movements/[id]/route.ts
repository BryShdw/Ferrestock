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
        const movements = await getJSONData('movimientos.json');

        const index = movements.findIndex((m: any) => m.id === id);
        if (index === -1) {
            return NextResponse.json({ error: 'Movement not found' }, { status: 404 });
        }

        movements[index] = { ...movements[index], ...body, id };
        await writeJSONData('movimientos.json', movements);

        return NextResponse.json(movements[index]);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update movement' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    props: { params: Promise<{ id: string }> }
) {
    try {
        const params = await props.params;
        const id = Number(params.id);
        const movements = await getJSONData('movimientos.json');

        const filteredMovements = movements.filter((m: any) => m.id !== id);
        if (filteredMovements.length === movements.length) {
            return NextResponse.json({ error: 'Movement not found' }, { status: 404 });
        }

        await writeJSONData('movimientos.json', filteredMovements);

        return NextResponse.json({ message: 'Movement deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete movement' }, { status: 500 });
    }
}
