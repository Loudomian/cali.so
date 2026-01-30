import { type Metadata } from 'next'
import { notFound } from 'next/navigation'
import { serialize } from 'next-mdx-remote/serialize'
import remarkGfm from 'remark-gfm'

import { BlogPostPage } from '~/app/(main)/blog/BlogPostPage'
import { kvKeys } from '~/config/kv'
import { env } from '~/env.mjs'
import { url } from '~/lib'
import { getAllPostSlugs, getPostBySlug, getRelatedPosts } from '~/lib/posts'
import { redis } from '~/lib/redis'

export const generateMetadata = ({
  params,
}: {
  params: { slug: string }
}) => {
  const post = getPostBySlug(params.slug)
  if (!post) {
    notFound()
  }

  const { title, description, mainImage } = post

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: mainImage.url,
        },
      ],
      type: 'article',
    },
    twitter: {
      images: [
        {
          url: mainImage.url,
        },
      ],
      title,
      description,
      card: 'summary_large_image',
      site: '@thecalicastle',
      creator: '@thecalicastle',
    },
  } satisfies Metadata
}

export default async function BlogPage({
  params,
}: {
  params: { slug: string }
}) {
  const post = getPostBySlug(params.slug)
  if (!post) {
    notFound()
  }

  // 获取相关文章
  const related = getRelatedPosts(post, 3)
  const postWithRelated = { ...post, related }

  let views: number
  if (env.VERCEL_ENV === 'production') {
    views = await redis.incr(kvKeys.postViews(post._id))
  } else {
    views = 30578
  }

  let reactions: number[] = []
  try {
    if (env.VERCEL_ENV === 'production') {
      const res = await fetch(url(`/api/reactions?id=${post._id}`), {
        next: {
          tags: [`reactions:${post._id}`],
        },
      })
      const data = await res.json()
      if (Array.isArray(data)) {
        reactions = data
      }
    } else {
      reactions = Array.from({ length: 4 }, () =>
        Math.floor(Math.random() * 50000)
      )
    }
  } catch (error) {
    console.error(error)
  }

  let relatedViews: number[] = []
  if (related.length > 0) {
    if (env.VERCEL_ENV === 'development') {
      relatedViews = related.map(() => Math.floor(Math.random() * 1000))
    } else {
      const postIdKeys = related.map(({ _id }) => kvKeys.postViews(_id))
      relatedViews = await redis.mget<number[]>(...postIdKeys)
    }
  }

  const mdxSource = await serialize(post.body, {
    mdxOptions: {
      // @ts-expect-error remark-gfm version mismatch
      remarkPlugins: post.slug === 'df-bgm' ? [remarkGfm] : [],
    },
  })

  return (
    <BlogPostPage
      post={postWithRelated}
      views={views}
      relatedViews={relatedViews}
      reactions={reactions.length > 0 ? reactions : undefined}
      mdxSource={mdxSource}
    />
  )
}

export const revalidate = 60

export function generateStaticParams() {
  const slugs = getAllPostSlugs()
  return slugs.map((slug) => ({ slug }))
}

