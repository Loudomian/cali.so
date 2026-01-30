
import { NextResponse } from 'next/server'

export const revalidate = 3600

export async function GET() {
    const secUid = 'MS4wLjABAAAAKYHxdjmYnd9-ILSdo8VRHrtGuwSYz4IHiz1XvKblXCk'
    const apiUrl = `https://www.iesdouyin.com/web/api/v2/user/info/?sec_uid=${secUid}`

    try {
        const res = await fetch(apiUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.97 Safari/537.36'
            },
            next: { revalidate: 3600 }
        })

        if (!res.ok) {
            throw new Error(`Douyin API error: ${res.status}`)
        }

        const data = await res.json()

        // The structure typically is data.user_info.follower_count
        // But sometimes it might be mplatform_followers_count
        const userInfo = data?.user_info
        const followerCount = userInfo?.follower_count ?? userInfo?.mplatform_followers_count

        if (typeof followerCount === 'number') {
            return NextResponse.json({ follower: followerCount })
        }
        console.error('Douyin API unexpected structure:', data)
        return NextResponse.json({ error: 'Stats not found in API response' }, { status: 404 })
    } catch (error) {
        console.error('Douyin fetch error:', error)
        return NextResponse.json({ error: 'Failed to fetch Douyin stats' }, { status: 500 })
    }
}
