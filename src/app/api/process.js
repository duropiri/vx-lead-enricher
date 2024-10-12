// /src/app/api/process.js
import { NextResponse } from 'next/server';
import { processData } from '../utils/script'; // Adjust path if necessary

export async function POST(request) {
    const { data } = await request.json();
    
    if (!data || !Array.isArray(data)) {
        return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }

    const result = processData(data);
    return NextResponse.json(result);
}
