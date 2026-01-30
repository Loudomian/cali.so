import { proxy } from 'valtio'

type PostID = string
export const blogPostState = proxy<{
  postId: PostID
  currentBlockId: string | null
}>({
  postId: '',
  currentBlockId: null,
})

export function focusBlock(blockId: string | null) {
  blogPostState.currentBlockId = blockId
}

export function clearBlockFocus() {
  blogPostState.currentBlockId = null
}
