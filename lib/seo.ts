export const seo = {
  title: 'SIKFilm | 潜行瞬鲨动画工作室',
  description:
    '白日造梦剧组，正在做些好玩又有影响力的作品。',
  url: new URL(
    process.env.NODE_ENV === 'production'
      ? 'https://sikfilm.com'
      : 'http://localhost:3000'
  ),
} as const
