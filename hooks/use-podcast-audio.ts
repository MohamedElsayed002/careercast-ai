import { useState, useRef, useCallback, useEffect } from "react"

interface UsePodcastAudioProps {
    audioURL: string
}

export const usePodcastAudio = ({ audioURL }: UsePodcastAudioProps) => {
    const [isPlaying, setIsPlaying] = useState(false)
    const audioElementRef = useRef<HTMLAudioElement | null>(null)

    const togglePlayPause = useCallback(() => {
        if (!audioURL) return

        if (!audioElementRef.current) {
            const audio = new Audio(audioURL)
            audioElementRef.current = audio
            audio.play()
            setIsPlaying(true)
            audio.onended = () => setIsPlaying(false)
        } else {
            if (isPlaying) {
                audioElementRef.current.pause()
                setIsPlaying(false)
            } else {
                audioElementRef.current.play()
                setIsPlaying(true)
            }
        }
    }, [audioURL, isPlaying])

    const handleAudioRef = useCallback((audio: HTMLAudioElement | null) => {
        if (audio && audio !== audioElementRef.current) {
            audioElementRef.current = audio
            audio.addEventListener('play', () => setIsPlaying(true))
            audio.addEventListener('pause', () => setIsPlaying(false))
            audio.addEventListener('ended', () => setIsPlaying(false))
        }
    }, [])

    useEffect(() => {
        return () => {
            if (audioElementRef.current) {
                audioElementRef.current.pause()
                audioElementRef.current = null
            }
        }
    }, [])

    return {
        isPlaying,
        togglePlayPause,
        handleAudioRef,
    }
}
