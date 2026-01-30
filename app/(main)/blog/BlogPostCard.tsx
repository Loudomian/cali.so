import Image from 'next/image'
import Link from 'next/link'

import {
  CalendarIcon,
  CursorClickIcon,
  HourglassIcon,
  ScriptIcon,
  SparkleIcon,
} from '~/assets'
import { formatDate } from '~/lib/date'
import { prettifyNumber } from '~/lib/math'
import { type Post } from '~/lib/posts'

export function BlogPostCard({ post, views }: { post: Post; views: number }) {
  const { title, slug, mainImage, publishedAt, categories, readingTime } = post

  return (
    <Link
      href={`/blog/${slug}`}
      prefetch={false}
      className="group relative flex w-full transform-gpu flex-col rounded-3xl bg-transparent ring-2 ring-[--post-image-bg] transition-transform hover:-translate-y-0.5"
      style={
        {
          '--post-image-fg': mainImage.dominant?.foreground ?? '#fff',
          '--post-image-bg': mainImage.dominant?.background ?? '#333',
          '--post-image': `url(${mainImage.url}`,
        } as React.CSSProperties
      }
    >
      <div className="relative aspect-[240/135] w-full">
        {mainImage.url ? (
          <Image
            src={mainImage.url}
            alt=""
            className="rounded-t-3xl object-cover"
            placeholder={mainImage.lqip ? 'blur' : 'empty'}
            blurDataURL={mainImage.lqip}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw"
          />
        ) : (
          <div className="h-full w-full rounded-t-3xl bg-zinc-100 dark:bg-zinc-800" />
        )}
      </div>
      <span className="relative z-10 flex w-full flex-1 shrink-0 flex-col justify-between gap-0.5 rounded-b-[calc(1.5rem+1px)] bg-cover bg-bottom bg-no-repeat p-4 bg-blend-overlay [background-image:var(--post-image)] before:pointer-events-none before:absolute before:inset-0 before:z-10 before:select-none before:rounded-b-[calc(1.5rem-1px)] before:bg-[--post-image-bg] before:opacity-70 before:transition-opacity after:pointer-events-none after:absolute after:inset-0 after:z-10 after:select-none after:rounded-b-[calc(1.5rem-1px)] after:bg-gradient-to-b after:from-transparent after:to-[--post-image-bg] after:backdrop-blur after:transition-opacity group-hover:before:opacity-30 md:p-5">
        <h2 className="z-20 text-base font-bold tracking-tight text-[--post-image-fg] opacity-70 transition-opacity group-hover:opacity-100 md:text-xl">
          <span>{title}</span>
          {post.pin && (
            <span className="ml-2 inline-flex items-center space-x-1 rounded-full bg-lime-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-lime-600 ring-1 ring-inset ring-lime-500/20 dark:text-lime-400 dark:ring-lime-500/30 whitespace-nowrap align-middle">
              <SparkleIcon className="h-3 w-3" />
              <span>置顶</span>
            </span>
          )}
        </h2>

        <span className="relative z-20 flex items-center justify-between opacity-50 transition-opacity group-hover:opacity-80">
          <span className="inline-flex items-center space-x-3">
            <span className="inline-flex items-center space-x-1 text-[12px] font-medium text-[--post-image-fg] md:text-sm whitespace-nowrap">
              <CalendarIcon />
              <span>
                {formatDate(publishedAt, 'YYYY年MM月DD日')}
              </span>
            </span>



            {Array.isArray(categories) && (
              <span className="inline-flex items-center space-x-1 text-[12px] font-medium text-[--post-image-fg] md:text-sm whitespace-nowrap">
                <ScriptIcon />
                <span>{categories.join(', ')}</span>
              </span>
            )}
          </span>
          <span className="inline-flex items-center space-x-3 text-[12px] font-medium text-[--post-image-fg] md:text-xs whitespace-nowrap">
            <span className="inline-flex items-center space-x-1">
              <CursorClickIcon />
              <span>{prettifyNumber(views, true)}</span>
            </span>
          </span>
        </span>
      </span>
    </Link>
  )
}

