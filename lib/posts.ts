/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/**
 * 本地文章数据读取工具
 * 从 content/posts 目录读取文章数据
 */

import fs from 'fs'
import path from 'path'

import readingTime from 'reading-time'

export type Post = {
    _id: string
    title: string
    slug: string
    description: string
    publishedAt: string
    pin?: boolean
    categories?: string[]
    mood: 'happy' | 'sad' | 'neutral'
    readingTime: number
    mainImage: {
        url: string
        lqip?: string
        dominant?: {
            background: string
            foreground: string
        }
    }
    dominantBg?: string
    dominantFg?: string
    bilibili?: string
    douyin?: string
    kuaishou?: string
}

export type PostDetail = Post & {
    body: string
    headings: any[]
    related?: Post[]
}

const postsDirectory = path.join(process.cwd(), 'content', 'posts')

/**
 * 解析 Frontmatter
 */
function parseFrontmatter(fileContent: string) {
    const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/
    const match = fileContent.match(frontmatterRegex)

    if (!match) {
        return { metadata: {} as any, content: fileContent }
    }

    const metadataRaw = match[1]
    const content = match[2]
    const metadata: any = {}

    let currentKey = ''

    metadataRaw.split(/\r?\n/).forEach(line => {
        const trimmedLine = line.trim()
        if (!trimmedLine) return

        if (trimmedLine.startsWith('- ')) {
            if (currentKey && Array.isArray(metadata[currentKey])) {
                const val = trimmedLine.replace(/^- "/, '').replace(/"$/, '').replace(/^- /, '')
                metadata[currentKey].push(val)
            }
            return
        }

        const parts = line.split(':')
        if (parts.length >= 2) {
            const key = parts[0].trim()
            let value = parts.slice(1).join(':').trim()

            if (key === 'categories') {
                currentKey = key
                metadata[key] = []
                return
            }

            if (value.startsWith('"') && value.endsWith('"')) {
                value = value.slice(1, -1)
            }
            metadata[key] = value
            currentKey = key
        }
    })

    return { metadata, content }
}

/**
 * 获取所有文章
 */
export function getAllPosts(): Post[] {
    if (!fs.existsSync(postsDirectory)) {
        return []
    }

    const files = fs.readdirSync(postsDirectory)
    const posts: Post[] = []

    for (const file of files) {
        if (!file.endsWith('.mdx')) continue
        const filePath = path.join(postsDirectory, file)
        const fileContent = fs.readFileSync(filePath, 'utf-8')
        const { metadata, content } = parseFrontmatter(fileContent)
        // Ensure slug is present
        const slug = file.replace(/\.mdx$/, '')
        metadata.slug = metadata.slug || slug
        const post = transformPost(metadata)
        post.readingTime = Math.ceil(readingTime(content).minutes)
        posts.push(post)
    }

    // 按置顶状态和发布时间排序
    posts.sort((a, b) => {
        if (a.pin && !b.pin) return -1
        if (!a.pin && b.pin) return 1
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    })

    return posts
}

/**
 * 获取最新文章
 */
export function getLatestPosts(limit = 5): Post[] {
    return getAllPosts().slice(0, limit)
}

/**
 * 根据 slug 获取文章详情
 */
export function getPostBySlug(slug: string): PostDetail | undefined {
    const filePath = path.join(postsDirectory, `${slug}.mdx`)

    if (!fs.existsSync(filePath)) {
        return undefined
    }

    const fileContent = fs.readFileSync(filePath, 'utf-8')
    const { metadata, content } = parseFrontmatter(fileContent)

    // Ensure slug is present
    metadata.slug = metadata.slug || slug

    const postDetail = transformPostDetail(metadata, content)
    postDetail.readingTime = Math.ceil(readingTime(content).minutes)
    return postDetail
}

/**
 * 获取所有文章 slug
 */
export function getAllPostSlugs(): string[] {
    if (!fs.existsSync(postsDirectory)) {
        return []
    }

    const files = fs.readdirSync(postsDirectory)
    return files
        .filter(file => file.endsWith('.mdx'))
        .map(file => file.replace(/\.mdx$/, ''))
}

/**
 * 获取相关文章
 */
export function getRelatedPosts(post: PostDetail, limit = 3): Post[] {
    const allPosts = getAllPosts()

    // 找到相同分类的文章
    const related = allPosts.filter(p => {
        if (p.slug === post.slug) return false
        if (!post.categories || post.categories.length === 0) return false
        return post.categories.some(cat => p.categories?.includes(cat))
    })

    return related.slice(0, limit)
}

/**
 * 转换原始数据为 Post 格式
 */
function transformPost(data: any): Post {
    return {
        _id: data.slug, // Use slug as ID since we don't have _id in frontmatter usually, or we can use slug
        title: data.title,
        slug: data.slug,
        description: data.description,
        publishedAt: data.publishedAt,
        pin: data.pin === 'true' || data.pin === true,
        categories: data.categories || [],
        mood: data.mood || 'neutral',
        readingTime: 0, // Placeholder, calculated effectively in PostDetail or passed
        mainImage: {
            url: data.mainImage || '',
            lqip: undefined,
            dominant: {
                background: data.dominantBg || '#000000',
                foreground: data.dominantFg || '#ffffff',
            },
        },
        bilibili: data.bilibili,
        douyin: data.douyin,
        kuaishou: data.kuaishou,
    }
}

/**
 * 转换原始数据为 PostDetail 格式
 */
function transformPostDetail(data: any, content: string): PostDetail {
    const post = transformPost(data)

    // 从 Markdown 中提取标题
    const headings: any[] = []
    const lines = content.split('\n')
    lines.forEach(line => {
        const match = line.match(/^(#{1,6})\s+(.*)$/)
        if (match) {
            headings.push({
                level: match[1].length,
                text: match[2],
                slug: match[2].toLowerCase().replace(/\s+/g, '-') // Simple slugify
            })
        }
    })

    return {
        ...post,
        body: content,
        headings,
        related: undefined, // 将在调用时填充
    }
}
