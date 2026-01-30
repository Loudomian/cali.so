
import { NextResponse } from 'next/server'

export const revalidate = 3600 // Cache for 1 hour

export async function GET() {
    try {
        const res = await fetch('https://api.bilibili.com/x/relation/stat?vmid=775788', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            },
            next: { revalidate: 3600 }
        })

        if (!res.ok) {
            throw new Error(`Bilibili API error: ${res.status}`)
        }

        const data = await res.json()
        return NextResponse.json(data)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch Bilibili stats' }, { status: 500 })
    }
}
