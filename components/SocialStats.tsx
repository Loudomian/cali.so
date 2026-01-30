'use client'

// eslint-disable-next-line simple-import-sort/imports
import React from 'react'
import { BilibiliIcon, MailIcon, TikTokIcon } from '~/assets'
import { prettifyNumber } from '~/lib/math'

export function SocialStats() {
    const [bilibiliFollower, setBilibiliFollower] = React.useState<number | null>(
        null
    )
    const [douyinFollower, setDouyinFollower] = React.useState<number | null>(
        null
    )

    React.useEffect(() => {
        fetch('/api/bilibili')
            .then((res) => res.json())
            .then((data: { data?: { follower?: number } }) => {
                if (typeof data?.data?.follower === 'number') {
                    setBilibiliFollower(data.data.follower)
                }
            })
            .catch((err) => console.error(err))

        fetch('/api/douyin')
            .then((res) => res.json())
            .then((data: { follower?: number }) => {
                if (typeof data?.follower === 'number') {
                    setDouyinFollower(data.follower)
                }
            })
            .catch((err) => console.error(err))
    }, [])

    const formatFollower = (count: number) => {
        if (count >= 100000000) {
            return (count / 100000000).toFixed(1) + '亿'
        } else if (count >= 10000) {
            return (count / 10000).toFixed(1) + '万'
        } else {
            return count.toString()
        }
    }

    return (
        <div className="rounded-2xl border border-zinc-100 p-6 dark:border-zinc-700/40">
            <h2 className="flex text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                <MailIcon className="h-6 w-6 flex-none" />
                <span className="ml-3">关注我们</span>
            </h2>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                关注我们的社交媒体账号，获取最新动态。
            </p>
            <div className="mt-6 flex flex-col gap-3">
                <div className="flex w-full items-center gap-3 rounded-xl border border-zinc-900/10 p-3 transition-colors duration-300 hover:bg-zinc-50 hover:shadow-sm dark:border-zinc-100/10 dark:hover:bg-zinc-800/50">
                    <BilibiliIcon className="h-8 w-8 text-[#00AEEC]" />
                    <div className="flex-1">
                        <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                            Bilibili
                        </div>
                        <div className="text-xs text-zinc-500 dark:text-zinc-400">
                            {bilibiliFollower
                                ? `${prettifyNumber(bilibiliFollower, true)} 粉丝`
                                : '加载中...'}
                        </div>
                    </div>
                    <a
                        href="/bilibili"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-full bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-zinc-100 hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
                    >
                        关注
                    </a>
                </div>

                <div className="flex w-full items-center gap-3 rounded-xl border border-zinc-900/10 p-3 transition-colors duration-300 hover:bg-zinc-50 hover:shadow-sm dark:border-zinc-100/10 dark:hover:bg-zinc-800/50">
                    <TikTokIcon className="h-8 w-8 text-black dark:text-white" />
                    <div className="flex-1">
                        <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                            抖音
                        </div>
                        <div className="text-xs text-zinc-500 dark:text-zinc-400">
                            {douyinFollower
                                ? `${formatFollower(douyinFollower)} 粉丝`
                                : '加载中...'}
                        </div>
                    </div>
                    <a
                        href="/douyin"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-full bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-zinc-100 hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
                    >
                        关注
                    </a>
                </div>
            </div>
        </div>
    )
}
