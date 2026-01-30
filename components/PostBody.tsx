'use client'

import Image from 'next/image'
import { MDXRemote, type MDXRemoteSerializeResult } from 'next-mdx-remote'
import React from 'react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import remarkGfm from 'remark-gfm'

import { ClipboardCheckIcon, ClipboardDataIcon } from '~/assets'
import { ClientOnly } from '~/components/ClientOnly'
import { MusicPlayer } from '~/components/MusicPlayer'
import { PeekabooLink } from '~/components/links/PeekabooLink'
import { ElegantTooltip } from '~/components/ui/Tooltip'

function CodeBlock({
    className,
    children,
}: {
    className?: string
    children: React.ReactNode
}) {
    const [hasCopied, setHasCopied] = React.useState(false)
    const match = /language-(\w+)/.exec(className || '')
    const language = match ? match[1] : ''
    const code = String(children).replace(/\n$/, '')

    const onClickCopy = React.useCallback(() => {
        navigator.clipboard
            .writeText(code)
            .then(() => {
                setHasCopied(true)
                setTimeout(() => {
                    setHasCopied(false)
                }, 3000)
            })
            .catch(() => {
                console.error('Failed to copy code block')
            })
    }, [code])

    if (!language) {
        return <code className={className}>{children}</code>
    }

    return (
        <div className="group relative mr-3 rounded-3xl border border-[--tw-prose-pre-border] dark:bg-zinc-800/80 md:mr-0">
            <ClientOnly>
                <>
                    <div className="relative flex text-xs leading-6 text-slate-400">
                        <div className="absolute right-0 top-2 flex h-8 items-center pr-4">
                            <div className="relative -mr-0.5 flex">
                                <ElegantTooltip content="复制">
                                    <button
                                        type="button"
                                        className="text-zinc-400 hover:text-zinc-500 dark:text-zinc-500 dark:hover:text-zinc-400"
                                        onClick={onClickCopy}
                                    >
                                        {hasCopied ? (
                                            <ClipboardCheckIcon className="h-5 w-5" />
                                        ) : (
                                            <ClipboardDataIcon className="h-5 w-5" />
                                        )}
                                    </button>
                                </ElegantTooltip>
                            </div>
                        </div>
                    </div>

                    <SyntaxHighlighter
                        language={language}
                        showLineNumbers
                        useInlineStyles={false}
                        codeTagProps={{
                            style: {},
                            className: `language-${language}`,
                        }}
                    >
                        {code}
                    </SyntaxHighlighter>
                </>
            </ClientOnly>
        </div>
    )
}

const components = {
    a: ({ href, children }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
        <PeekabooLink href={href || '#'}>{children}</PeekabooLink>
    ),
    code: ({ className, children, inline }: any) => {
        if (inline) {
            return <code className={className}>{children}</code>
        }
        return <CodeBlock className={className}>{children}</CodeBlock>
    },
    img: ({ src, alt }: any) => {
        return (
            <div className="relative my-8 aspect-video w-full overflow-hidden rounded-xl">
                <Image
                    src={src || ''}
                    alt={alt || ''}
                    fill
                    className="object-contain" // Changed from object-cover to contain to avoid cropping if needed, or revert if preferred. Original was object-contain.
                    unoptimized
                />
            </div>
        )
    },
    MusicPlayer,
}

export function PostBody({ children, mdxSource }: { children: string; mdxSource?: MDXRemoteSerializeResult }) {
    if (mdxSource) {
        return <MDXRemote {...mdxSource} components={components} />
    }

    return (
        <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={components as any}
        >
            {children}
        </ReactMarkdown>
    )
}
