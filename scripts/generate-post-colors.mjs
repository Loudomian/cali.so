
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const postsDir = path.join(__dirname, '../content/posts')

function getContrastColor(r, g, b) {
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000
    return (yiq >= 128) ? '#000000' : '#ffffff'
}

function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

async function processFile(file) {
    const filePath = path.join(postsDir, file)
    let content = fs.readFileSync(filePath, 'utf-8')

    // Extract mainImage url
    const match = content.match(/mainImage:\s*"(.*?)"/)
    if (!match) return

    const imageUrl = match[1]
    if (!imageUrl) return

    // Check if color is already there
    if (content.includes('dominantBg:')) return

    console.log(`Processing ${file} - ${imageUrl}`)

    let buffer
    try {
        if (imageUrl.startsWith('http')) {
            const res = await fetch(imageUrl)
            const arrayBuffer = await res.arrayBuffer()
            buffer = Buffer.from(arrayBuffer)
        } else {
            // Local file
            // Assuming image path is relative to public or root? 
            // If it starts with /, it's usually relative to public
            const localPath = path.join(__dirname, '../public', imageUrl)
            if (fs.existsSync(localPath)) {
                buffer = fs.readFileSync(localPath)
            } else {
                console.log(`Could not find local image: ${localPath}`)
                return
            }
        }

        const stats = await sharp(buffer).stats()
        const { r, g, b } = stats.dominant

        const bgHex = rgbToHex(Math.round(r), Math.round(g), Math.round(b))
        const fgHex = getContrastColor(r, g, b)

        // Insert into frontmatter
        // Insert before last '---' of frontmatter
        const frontmatterEnd = content.indexOf('---', 4)
        if (frontmatterEnd !== -1) {
            const insertion = `dominantBg: "${bgHex}"\ndominantFg: "${fgHex}"\n`
            const newContent = content.slice(0, frontmatterEnd) + insertion + content.slice(frontmatterEnd)
            fs.writeFileSync(filePath, newContent)
            console.log(`Updated ${file} with colors: ${bgHex}, ${fgHex}`)
        }

    } catch (e) {
        console.error(`Failed to process ${file}:`, e)
    }
}

async function run() {
    if (!fs.existsSync(postsDir)) return
    const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.mdx'))

    for (const file of files) {
        await processFile(file)
    }
}

run()
