'use client'

import React from 'react'

import { blogPostState } from '~/app/(main)/blog/blog-post.state'
import { type Post } from '~/lib/posts'

export function BlogPostStateLoader({ post }: { post: Post }) {
  React.useEffect(() => {
    blogPostState.postId = post._id
  }, [post._id])

  return null
}

