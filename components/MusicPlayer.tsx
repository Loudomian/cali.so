import { clsxm as cn } from '@zolplay/utils'
import { AnimatePresence, motion } from 'framer-motion'
import React, { useEffect, useRef, useState } from 'react'

export interface Track {
    title: string
    url: string
    duration?: string
    downloadUrl?: string
}

export interface Episode {
    id: string
    title: string
    cover: string
    tracks: Track[]
}

const PlayIcon = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className={className}
    >
        <path
            fillRule="evenodd"
            d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
            clipRule="evenodd"
        />
    </svg>
)

const PauseIcon = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className={className}
    >
        <path
            fillRule="evenodd"
            d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7.5 0A.75.75 0 0115 4.5h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75V5.25z"
            clipRule="evenodd"
        />
    </svg>
)

const NextIcon = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className={className}
    >
        <path
            fillRule="evenodd"
            d="M13.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L11.69 12 4.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z"
            clipRule="evenodd"
        />
        <path
            fillRule="evenodd"
            d="M19.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 11-1.06-1.06L17.69 12l-6.97-6.97a.75.75 0 011.06-1.06l7.5 7.5z"
            clipRule="evenodd"
        />
    </svg>
)

const PrevIcon = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className={className}
    >
        <path
            fillRule="evenodd"
            d="M10.72 11.47a.75.75 0 000 1.06l7.5 7.5a.75.75 0 101.06-1.06L12.31 12l6.97-6.97a.75.75 0 10-1.06-1.06l-7.5 7.5z"
            clipRule="evenodd"
        />
        <path
            fillRule="evenodd"
            d="M4.72 11.47a.75.75 0 000 1.06l7.5 7.5a.75.75 0 101.06-1.06L6.31 12l6.97-6.97a.75.75 0 10-1.06-1.06l-7.5 7.5z"
            clipRule="evenodd"
        />
    </svg>
)

const LoopIcon = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className={className}
    >
        <path
            fillRule="evenodd"
            d="M4.755 10.059a7.5 7.5 0 0112.548-3.364l1.903 1.903h-3.183a.75.75 0 100 1.5h4.992a.75.75 0 00.75-.75V4.356a.75.75 0 00-1.5 0v3.18l-1.9-1.9A9 9 0 003.306 9.67a.75.75 0 101.45.388zm15.408 3.352a.75.75 0 00-.919.53 7.5 7.5 0 01-12.548 3.364l-1.902-1.903h3.183a.75.75 0 000-1.5H2.984a.75.75 0 00-.75.75v4.992a.75.75 0 001.5 0v-3.18l1.9 1.9a9 9 0 0015.059-4.035.75.75 0 00-.53-.918z"
            clipRule="evenodd"
        />
    </svg>
)

const SpeakerWaveIcon = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className={className}
    >
        <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM18.584 5.106a.75.75 0 011.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 11-1.06-1.06 8.25 8.25 0 000-11.668.75.75 0 010-1.06z" />
        <path d="M15.932 7.757a.75.75 0 011.061 0 6 6 0 010 8.486.75.75 0 01-1.06-1.061 4.5 4.5 0 000-6.364.75.75 0 010-1.06z" />
    </svg>
)

const SpeakerXMarkIcon = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className={className}
    >
        <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM17.78 9.22a.75.75 0 10-1.06 1.06L18.44 12l-1.72 1.72a.75.75 0 101.06 1.06l1.72-1.72 1.72 1.72a.75.75 0 101.06-1.06L20.56 12l1.72-1.72a.75.75 0 10-1.06-1.06l-1.72 1.72-1.72-1.72z" />
    </svg>
)

const DownloadIcon = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className={className}
    >
        <path
            fillRule="evenodd"
            d="M12 2.25a.75.75 0 01.75.75v11.69l3.22-3.22a.75.75 0 111.06 1.06l-4.5 4.5a.75.75 0 01-1.06 0l-4.5-4.5a.75.75 0 111.06-1.06l3.22 3.22V3a.75.75 0 01.75-.75zm-9 13.5a.75.75 0 01.75.75v2.25a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5V16.5a.75.75 0 011.5 0v2.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V16.5a.75.75 0 01.75-.75z"
            clipRule="evenodd"
        />
    </svg>
)

type LoopMode = 'all' | 'one' | 'off'

export function MusicPlayer({ episodes }: { episodes: Episode[] }) {
    const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0)
    const [currentTrackIndex, setCurrentTrackIndex] = useState(0)
    const [isPlaying, setIsPlaying] = useState(false)
    const [duration, setDuration] = useState(0)
    const [currentTime, setCurrentTime] = useState(0)
    const [volume, setVolume] = useState(1)
    const [loopMode, setLoopMode] = useState<LoopMode>('all')

    const audioRef = useRef<HTMLAudioElement>(null)
    const progressBarRef = useRef<HTMLDivElement>(null)

    const currentEpisode = episodes[currentEpisodeIndex]
    const currentTrack = currentEpisode?.tracks[currentTrackIndex]

    useEffect(() => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.play().catch(() => setIsPlaying(false))
            } else {
                audioRef.current.pause()
            }
        }
    }, [isPlaying, currentTrack])

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume
        }
    }, [volume])

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime)
            setDuration(audioRef.current.duration)
        }
    }

    const handleTrackEnd = () => {
        if (loopMode === 'one') {
            audioRef.current?.play().catch(() => setIsPlaying(false))
            return
        }

        if (currentTrackIndex < currentEpisode.tracks.length - 1) {
            // Next track in same episode
            setCurrentTrackIndex((prev) => prev + 1)
        } else {
            // End of episode
            if (currentEpisodeIndex < episodes.length - 1) {
                // Next episode
                setCurrentEpisodeIndex((prev) => prev + 1)
                setCurrentTrackIndex(0)
            } else {
                // End of all episodes
                if (loopMode === 'all') {
                    setCurrentEpisodeIndex(0)
                    setCurrentTrackIndex(0)
                } else {
                    setIsPlaying(false)
                }
            }
        }
    }

    const playTrack = (episodeIdx: number, trackIdx: number) => {
        setCurrentEpisodeIndex(episodeIdx)
        setCurrentTrackIndex(trackIdx)
        setIsPlaying(true)
    }

    const togglePlay = () => setIsPlaying(!isPlaying)

    const handleNext = () => handleTrackEnd()

    const handlePrev = () => {
        if (audioRef.current && audioRef.current.currentTime > 3) {
            audioRef.current.currentTime = 0
        } else {
            if (currentTrackIndex > 0) {
                setCurrentTrackIndex((prev) => prev - 1)
            } else if (currentEpisodeIndex > 0) {
                setCurrentEpisodeIndex((prev) => prev - 1)
                setCurrentTrackIndex(episodes[currentEpisodeIndex - 1].tracks.length - 1)
            }
        }
    }

    const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (progressBarRef.current && audioRef.current) {
            const rect = progressBarRef.current.getBoundingClientRect()
            const x = e.clientX - rect.left
            const percentage = x / rect.width
            const newTime = percentage * duration
            audioRef.current.currentTime = newTime
            setCurrentTime(newTime)
        }
    }

    const formatTime = (time: number) => {
        if (isNaN(time)) return '0:00'
        const minutes = Math.floor(time / 60)
        const seconds = Math.floor(time % 60)
        return `${minutes}:${seconds.toString().padStart(2, '0')}`
    }

    return (
        <div className="mx-auto w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-zinc-900/5 dark:bg-zinc-900 dark:ring-white/10">
            <audio
                ref={audioRef}
                src={currentTrack?.url}
                onTimeUpdate={handleTimeUpdate}
                onEnded={handleTrackEnd}
            />

            {/* Header / Current Track Info */}
            <div className="relative flex flex-col items-center p-6 text-center sm:p-8">
                <div className="absolute inset-0 overflow-hidden opacity-60 dark:opacity-70">
                    <AnimatePresence mode="popLayout">
                        <motion.img
                            key={currentEpisode.cover}
                            src={currentEpisode.cover}
                            alt=""
                            className="absolute inset-0 h-full w-full object-cover blur-sm"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.7 }}
                        />
                    </AnimatePresence>
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/90 dark:to-zinc-900/90" />
                </div>
                <div className="relative w-full max-w-lg">
                    <motion.h2
                        key={currentTrack.title}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="truncate text-xl font-bold text-zinc-900 dark:text-zinc-100 sm:text-2xl"
                    >
                        {currentTrack.title}
                    </motion.h2>
                    <motion.p
                        key={currentEpisode.title}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="mt-1 text-xs font-medium text-zinc-500 dark:text-zinc-400"
                    >
                        {currentEpisode.title}
                    </motion.p>

                    {/* Progress Bar */}
                    <div className="mt-6">
                        <div
                            ref={progressBarRef}
                            className="group relative h-1.5 w-full cursor-pointer rounded-full bg-zinc-200/50 dark:bg-zinc-700/50"
                            onClick={handleProgressClick}
                        >
                            <motion.div
                                className="absolute left-0 top-0 h-full rounded-full bg-zinc-900 dark:bg-zinc-100"
                                style={{ width: `${(currentTime / duration) * 100}%` }}
                                layoutId="progressBar"
                            />
                            {/* Thumb */}
                            <div
                                className="absolute top-1/2 -translate-y-1/2 rounded-full bg-zinc-900 opacity-0 transition group-hover:opacity-100 dark:bg-zinc-100"
                                style={{
                                    left: `${(currentTime / duration) * 100}%`,
                                    width: '10px',
                                    height: '10px',
                                    transform: `translate(-50%, -50%)`,
                                }}
                            />
                        </div>
                        <div className="mt-2 flex justify-between text-[10px] font-medium text-zinc-400">
                            <span>{formatTime(currentTime)}</span>
                            <span>{formatTime(duration)}</span>
                        </div>
                    </div>
                </div>

                {/* Controls */}
                {/* Controls */}
                {/* Controls */}
                <div className="relative z-10 mt-6 grid w-full grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-4">
                    {/* Left: Loop Mode & Download */}
                    <div className="flex justify-start gap-3 sm:gap-4">
                        <button
                            onClick={() => {
                                setLoopMode((prev) =>
                                    prev === 'all' ? 'one' : prev === 'one' ? 'off' : 'all'
                                )
                            }}
                            className={cn(
                                'group relative flex h-9 w-9 flex-none items-center justify-center rounded-full transition hover:bg-zinc-100 dark:hover:bg-zinc-800',
                                loopMode !== 'off'
                                    ? 'text-zinc-900 dark:text-zinc-100'
                                    : 'text-zinc-400 dark:text-zinc-600'
                            )}
                            title={`Loop: ${loopMode}`}
                        >
                            <LoopIcon className="h-5 w-5" />
                            {loopMode === 'one' && (
                                <span className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-zinc-900 text-[8px] font-bold text-white shadow ring-2 ring-white dark:bg-zinc-100 dark:text-zinc-900 dark:ring-zinc-900">
                                    1
                                </span>
                            )}
                        </button>
                    </div>

                    {/* Center: Play Controls */}
                    <div className="flex items-center justify-center gap-2 sm:gap-6">
                        <button
                            onClick={handlePrev}
                            className="rounded-full p-2 text-zinc-900 transition hover:bg-zinc-100 dark:text-zinc-100 dark:hover:bg-zinc-800"
                        >
                            <PrevIcon className="h-6 w-6 sm:h-8 sm:w-8" />
                        </button>

                        <button
                            onClick={togglePlay}
                            className="flex h-12 w-12 flex-none items-center justify-center rounded-full bg-zinc-900 text-white shadow-xl shadow-zinc-900/20 transition hover:scale-105 active:scale-95 dark:bg-zinc-100 dark:text-black dark:shadow-zinc-100/20 sm:h-14 sm:w-14"
                        >
                            {isPlaying ? (
                                <PauseIcon className="h-6 w-6 sm:h-7 sm:w-7" />
                            ) : (
                                <PlayIcon className="h-6 w-6 ml-1 sm:h-7 sm:w-7" />
                            )}
                        </button>

                        <button
                            onClick={handleNext}
                            className="rounded-full p-2 text-zinc-900 transition hover:bg-zinc-100 dark:text-zinc-100 dark:hover:bg-zinc-800"
                        >
                            <NextIcon className="h-6 w-6 sm:h-8 sm:w-8" />
                        </button>
                    </div>

                    {/* Right: Volume */}
                    <div className="flex items-center justify-end gap-2 min-w-0">
                        <div className="group relative flex items-center justify-center">
                            <button
                                className="flex h-9 w-9 flex-none items-center justify-center rounded-full text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-500 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                            >
                                {volume === 0 ? (
                                    <SpeakerXMarkIcon className="h-5 w-5" />
                                ) : (
                                    <SpeakerWaveIcon className="h-5 w-5" />
                                )}
                            </button>

                            {/* Vertical Volume Slider Popup */}
                            <div className="absolute bottom-full left-1/2 mb-3 hidden -translate-x-1/2 flex-col items-center gap-2 rounded-2xl bg-white p-2 shadow-xl ring-1 ring-zinc-900/5 before:absolute before:-bottom-6 before:h-6 before:w-full before:bg-transparent group-hover:flex dark:bg-zinc-800 dark:ring-white/10">
                                <div className="relative h-24 w-1.5 rounded-full bg-zinc-200 dark:bg-zinc-700">
                                    <motion.div
                                        className="absolute bottom-0 w-full rounded-full bg-zinc-900 dark:bg-zinc-100"
                                        style={{ height: `${volume * 100}%` }}
                                        layout
                                    />
                                    {/* Rotated input for better cross-browser vertical support */}
                                    <input
                                        type="range"
                                        min="0"
                                        max="1"
                                        step="0.05"
                                        value={volume}
                                        onChange={(e) => setVolume(parseFloat(e.target.value))}
                                        className="absolute -left-[30px] top-[42px] z-20 h-[10px] w-[64px] -rotate-90 cursor-pointer opacity-0"
                                        style={{ transformOrigin: 'center' }}
                                    />
                                </div>
                                <span className="text-[10px] font-medium text-zinc-400">{Math.round(volume * 100)}%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Playlist Config */}
            <div className="border-t border-zinc-100 bg-zinc-50 p-2 dark:border-zinc-800 dark:bg-zinc-800/50">
                <div className="px-2 py-2">
                    {episodes.map((episode, epIdx) => (
                        <div key={episode.id} className="mb-2 last:mb-0">
                            <h3 className="mb-2 px-3 text-xs font-bold uppercase tracking-wider text-zinc-400">
                                {episode.title}
                            </h3>
                            <div className="space-y-1">
                                {episode.tracks.map((track, trackIdx) => {
                                    const isCurrent =
                                        currentEpisodeIndex === epIdx && currentTrackIndex === trackIdx
                                    return (
                                        <button
                                            key={track.title}
                                            onClick={() => playTrack(epIdx, trackIdx)}
                                            className={cn(
                                                'group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition',
                                                isCurrent
                                                    ? 'bg-white shadow-sm ring-1 ring-zinc-900/5 dark:bg-zinc-800 dark:ring-white/10'
                                                    : 'hover:bg-white/50 dark:hover:bg-zinc-800/50'
                                            )}
                                        >
                                            <div className="relative flex h-8 w-8 flex-none items-center justify-center rounded bg-zinc-100 text-xs font-medium text-zinc-500 dark:bg-zinc-800">
                                                {isCurrent && isPlaying ? (
                                                    <div className="flex gap-[2px]">
                                                        {[1, 2, 3].map((i) => (
                                                            <motion.div
                                                                key={i}
                                                                className="w-[2px] bg-zinc-900 dark:bg-zinc-100"
                                                                animate={{ height: ['8px', '4px', '8px'] }}
                                                                transition={{
                                                                    duration: 0.6,
                                                                    repeat: Infinity,
                                                                    delay: i * 0.2,
                                                                    ease: "easeInOut"
                                                                }}
                                                            />
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <span>{trackIdx + 1}</span>
                                                )}
                                            </div>
                                            <div className="flex min-w-0 flex-1 items-center justify-between">
                                                <div
                                                    className={cn(
                                                        'truncate text-sm font-medium',
                                                        isCurrent
                                                            ? 'text-zinc-900 dark:text-zinc-100'
                                                            : 'text-zinc-600 dark:text-zinc-400'
                                                    )}
                                                >
                                                    {track.title}
                                                </div>
                                                <a
                                                    href={track.downloadUrl || track.url}
                                                    download
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="ml-4 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-zinc-200 bg-white/50 text-zinc-400 shadow-sm backdrop-blur transition hover:border-zinc-300 hover:bg-white hover:text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-500 dark:hover:border-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
                                                    title="下载此曲目"
                                                >
                                                    <DownloadIcon className="h-4 w-4" />
                                                </a>
                                            </div>
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

