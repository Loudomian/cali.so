import RSS from 'rss'

import { getAllPosts } from '~/lib/posts'
import { seo } from '~/lib/seo'

export const revalidate = 60 * 60 // 1 hour

export function GET() {
  const feed = new RSS({
    title: seo.title,
    description: seo.description,
    site_url: seo.url.href,
    feed_url: `${seo.url.href}feed.xml`,
    language: 'zh-CN',
    image_url: `${seo.url.href}opengraph-image.png`,
    generator: 'PHP 9.0',
  })

  const data = getAllPosts()

  data.forEach((post) => {
    feed.item({
      title: post.title,
      guid: post._id,
      url: `${seo.url.href}blog/${post.slug}`,
      description: post.description,
      date: new Date(post.publishedAt),
      enclosure: {
        url: post.mainImage.url,
      },
    })
  })

  return new Response(feed.xml(), {
    headers: {
      'content-type': 'application/xml',
    },
  })
}

