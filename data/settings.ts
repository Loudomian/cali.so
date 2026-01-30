/**
 * 网站静态设置配置
 */

export type Project = {
    id: string
    name: string
    url: string
    description: string
    icon: string
}

export type ResumeItem = {
    company: string
    title: string
    logo: string
    start: string
    end?: string
}

export type SiteSettings = {
    heroPhotos: string[]
    projects: Project[]
    resume: ResumeItem[]
}

// 首页轮播图片
export const heroPhotos: string[] = [
    "/images/home/df-01.webp",
    "/images/home/df-02.webp",
    "/images/home/apex-01.webp",
    "/images/home/genshin-01.webp",
    "/images/home/apex-02.webp",
]

// 项目列表（如需添加项目，在此处配置）
export const projects: Project[] = []

// 简历信息（如需添加，在此处配置）
export const resume: ResumeItem[] = []

// 获取设置（兼容原有 API）
export function getSettings(): SiteSettings {
    return {
        heroPhotos,
        projects,
        resume,
    }
}
