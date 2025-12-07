import { NextResponse } from 'next/server';
import { getJSONData, writeJSONData } from '@/lib/db';

export async function GET() {
    try {
        const movements = await getJSONData('movimientos.json');
        // Sort by date descending (newest first)
        // Assuming fechaHora is "DD/MM/YYYY HH:MM AM/PM" or similar, but let's just return as is or let frontend sort.
        // The current frontend sorts by adding new ones to the top.
        return NextResponse.json(movements);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to load movements' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const movements = await getJSONData('movimientos.json');

        const newMovement = {
            ...body,
            id: Date.now(), // Use timestamp as ID
        };

        // Add to beginning or end? Frontend does `[movementToAdd, ...movements]`.
        // Usually JSON is stored chronologically or however. I'll append to end in file, frontend can sort.
        // Actually, if I append to end, I should probably read it back reversed or let frontend handle it.
        // I'll append to end.
        movements.push(newMovement);

        await writeJSONData('movimientos.json', movements);

        return NextResponse.json(newMovement, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to register movement' }, { status: 500 });
    }
}
