import { type MetadataRoute } from 'next'

import { url } from '~/lib'
import { getAllPostSlugs } from '~/lib/posts'

export default function sitemap() {
  const staticMap = [
    {
      url: url('/').href,
      lastModified: new Date(),
    },
    {
      url: url('/blog').href,
      lastModified: new Date(),
    },
    {
      url: url('/projects').href,
      lastModified: new Date(),
    },
  ] satisfies MetadataRoute.Sitemap

  const slugs = getAllPostSlugs()

  const dynamicMap = slugs.map((slug) => ({
    url: url(`/blog/${slug}`).href,
    lastModified: new Date(),
  })) satisfies MetadataRoute.Sitemap

  return [...staticMap, ...dynamicMap]
}

export const revalidate = 60
