
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const postsDir = path.join(__dirname, '../content/posts')
const force = process.argv.includes('--force')

function getContrastColor(r, g, b) {
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000
    return (yiq >= 128) ? '#000000' : '#ffffff'
}

function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

/**
 * 将 RGB 转换为 HSL
 */
function rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0;
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return [h, s, l];
}

/**
 * 给颜色打分，越高表示越适合作为主题色
 * 目标：寻找有色彩倾向但不刺眼的颜色
 */
function scoreColor(r, g, b) {
    const [h, s, l] = rgbToHsl(r, g, b);

    // 过滤掉极度黑暗或极度明亮的颜色
    if (l < 0.2 || l > 0.8) return -1;

    // 过滤掉饱和度过低（灰色）的颜色
    if (s < 0.15) return -1;

    // 分数计算优化：
    // 1. 我们不再一味追求高饱和度，s 在 0.3 - 0.6 之间是比较理想的
    // 2. 如果饱和度过高 (> 0.7)，我们要扣分，避免颜色太刺眼
    let sScore = s;
    if (s > 0.7) sScore = 0.7 - (s - 0.7);

    // 3. 亮度倾向于中等偏亮 (0.4 - 0.6)
    const lScore = 1 - Math.abs(l - 0.5) * 2;

    return sScore * 0.6 + lScore * 0.4;
}

/**
 * 后处理：如果提取的颜色还是太深或太亮，进行微调
 */
function normalizeColor(r, g, b) {
    let [h, s, l] = rgbToHsl(r, g, b);

    // 强制限制饱和度上限，避免“过于刺眼”
    if (s > 0.6) s = 0.6;
    // 提升最低饱和度，确保有颜色
    if (s < 0.2) s = 0.2;

    // 调整亮度到舒适区间
    if (l < 0.3) l = 0.3;
    if (l > 0.7) l = 0.7;

    return hslToRgb(h, s, l);
}

/**
 * HSL 转 RGB 辅助函数
 */
function hslToRgb(h, s, l) {
    let r, g, b;
    if (s === 0) {
        r = g = b = l;
    } else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
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
    const hasColor = content.includes('dominantBg:')
    if (hasColor && !force) return

    console.log(`Processing ${file} - ${imageUrl} ${force ? '(FORCE)' : ''}`)

    let buffer
    try {
        if (imageUrl.startsWith('http')) {
            const res = await fetch(imageUrl)
            const arrayBuffer = await res.arrayBuffer()
            buffer = Buffer.from(arrayBuffer)
        } else {
            const localPath = path.join(__dirname, '../public', imageUrl)
            if (fs.existsSync(localPath)) {
                buffer = fs.readFileSync(localPath)
            } else {
                console.log(`Could not find local image: ${localPath}`)
                return
            }
        }

        // 我们不再寻找“最强”的单个像素，而是统计“占比最高”的色系
        const pixels = await sharp(buffer)
            .resize(50, 50, { fit: 'inside' }) // 增加采样点到 2500 个，更细致地覆盖整张图
            .raw()
            .toBuffer()

        const colorMap = new Map(); // 用于聚合相似颜色
        const bucketSize = 32; // 将 256 色阶划分为桶，手动聚类

        for (let i = 0; i < pixels.length; i += 3) {
            const r = pixels[i];
            const g = pixels[i + 1];
            const b = pixels[i + 2];

            // 基础打分，初筛掉不合格的背景/杂色
            const baseScore = scoreColor(r, g, b);
            if (baseScore <= 0) continue;

            // 将颜色量化到桶，以便聚合相似色块
            const rB = Math.floor(r / bucketSize) * bucketSize + bucketSize / 2;
            const gB = Math.floor(g / bucketSize) * bucketSize + bucketSize / 2;
            const bB = Math.floor(b / bucketSize) * bucketSize + bucketSize / 2;
            const key = `${rB},${gB},${bB}`;

            if (!colorMap.has(key)) {
                colorMap.set(key, { r: rB, g: gB, b: bB, count: 0, baseScore });
            }
            colorMap.get(key).count += 1;
        }

        let bestColor = null;
        let maxWeightedScore = -1;

        for (const bucket of colorMap.values()) {
            // 加权得分 = 颜色质量权重 * 颜色在画面中出现的频率
            // 这样能确保选出的颜色既好，又是画面中“大块存在”的，具有整体代表性
            const weightedScore = bucket.baseScore * Math.pow(bucket.count, 0.5);

            if (weightedScore > maxWeightedScore) {
                maxWeightedScore = weightedScore;
                bestColor = bucket;
            }
        }

        // 如果没找到满意的充满活力的颜色，回退到主导色
        if (!bestColor) {
            const stats = await sharp(buffer).stats()
            bestColor = { ...stats.dominant }
        }

        const [finalR, finalG, finalB] = normalizeColor(bestColor.r, bestColor.g, bestColor.b)
        const bgHex = rgbToHex(finalR, finalG, finalB)
        const fgHex = getContrastColor(finalR, finalG, finalB)

        // Insert into frontmatter
        if (hasColor) {
            // Replace existing
            content = content.replace(/dominantBg:\s*".*?"/, `dominantBg: "${bgHex}"`)
            content = content.replace(/dominantFg:\s*".*?"/, `dominantFg: "${fgHex}"`)
        } else {
            // Insert before last '---' of frontmatter
            const frontmatterEnd = content.indexOf('---', 4)
            if (frontmatterEnd !== -1) {
                const insertion = `dominantBg: "${bgHex}"\ndominantFg: "${fgHex}"\n`
                content = content.slice(0, frontmatterEnd) + insertion + content.slice(frontmatterEnd)
            }
        }

        fs.writeFileSync(filePath, content)
        console.log(`Updated ${file} with colors: ${bgHex}, ${fgHex}`)

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
