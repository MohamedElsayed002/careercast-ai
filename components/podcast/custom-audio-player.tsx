'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, SkipBack, SkipForward } from 'lucide-react';
import WaveSurfer from 'wavesurfer.js';
import { waveformBarStyle } from '@/lib/wavesurfer-bar-style';
import { cn } from '@/lib/utils';

interface CustomAudioPlayerProps {
    audioUrl: string;
}

export function CustomAudioPlayer({ audioUrl }: CustomAudioPlayerProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const wsRef = useRef<WaveSurfer | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [isReady, setIsReady] = useState(false);
    const [loadError, setLoadError] = useState<string | null>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        setIsReady(false);
        setLoadError(null);
        setCurrentTime(0);
        setDuration(0);
        setIsPlaying(false);

        const ws = WaveSurfer.create({
            container,
            url: audioUrl,
            ...waveformBarStyle,
            barMinHeight: 4,
            height: 96,
            progressColor: 'rgb(147, 51, 234)',
            cursorWidth: 2,
            cursorColor: 'rgb(88, 28, 135)',
            dragToSeek: true,
            interact: true,
        });

        wsRef.current = ws;

        const onReady = (d: number) => {
            setDuration(d);
            setIsReady(true);
        };

        ws.on('ready', onReady);
        ws.on('timeupdate', (t) => setCurrentTime(t));
        ws.on('play', () => setIsPlaying(true));
        ws.on('pause', () => setIsPlaying(false));
        ws.on('finish', () => setIsPlaying(false));
        ws.on('error', (err) => {
            setLoadError(err.message || 'Failed to load audio');
            setIsReady(false);
        });

        return () => {
            ws.destroy();
            wsRef.current = null;
        };
    }, [audioUrl]);

    useEffect(() => {
        const ws = wsRef.current;
        if (!ws || !isReady) return;
        ws.setVolume(isMuted ? 0 : volume);
    }, [isReady, isMuted, volume]);

    const togglePlay = () => {
        wsRef.current?.playPause().catch(() => {});
    };

    const skip = (seconds: number) => {
        wsRef.current?.skip(seconds);
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const vol = parseFloat(e.target.value);
        setVolume(vol);
        wsRef.current?.setVolume(vol);
        if (vol === 0) {
            setIsMuted(true);
        } else if (isMuted) {
            setIsMuted(false);
        }
    };

    const toggleMute = () => {
        const ws = wsRef.current;
        if (!ws || !isReady) return;
        if (isMuted) {
            ws.setVolume(volume);
            setIsMuted(false);
        } else {
            ws.setVolume(0);
            setIsMuted(true);
        }
    };

    const formatTime = (time: number) => {
        if (isNaN(time)) return '0:00';
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <div className='bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 shadow-lg border border-purple-100 dark:border-gray-700'>
            {/* Waveform — same bar style as useAudioRecorder; progress moves while playing */}
            <div
                className={cn(
                    'mb-4 rounded-xl bg-white/60 dark:bg-black/20 overflow-hidden min-h-[96px] transition-opacity',
                    !isReady && 'animate-pulse',
                    isReady && isPlaying && 'ring-1 ring-purple-300/60 dark:ring-purple-600/40',
                )}
            >
                <div ref={containerRef} className='w-full' />
            </div>

            {loadError && (
                <p className='text-sm text-red-600 dark:text-red-400 mb-3' role='alert'>
                    {loadError}
                </p>
            )}

            <div className='flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-4'>
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
            </div>

            {/* Controls */}
            <div className='flex items-center justify-center md:justify-between'>
                <div className='flex justify-center items-center gap-3'>
                    <button
                        type='button'
                        onClick={() => skip(-10)}
                        disabled={!isReady}
                        className='p-2 rounded-full hover:bg-purple-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-40 disabled:pointer-events-none'
                        aria-label='Skip back 10 seconds'
                    >
                        <SkipBack className='w-5 h-5 text-gray-700 dark:text-gray-300' />
                    </button>

                    <button
                        type='button'
                        onClick={togglePlay}
                        disabled={!isReady}
                        className='p-4 rounded-full bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900 transition-colors shadow-lg disabled:opacity-40 disabled:pointer-events-none'
                        aria-label={isPlaying ? 'Pause' : 'Play'}
                    >
                        {isPlaying ? (
                            <Pause className='w-6 h-6 text-white fill-white' />
                        ) : (
                            <Play className='w-6 h-6 text-white fill-white' />
                        )}
                    </button>

                    <button
                        type='button'
                        onClick={() => skip(10)}
                        disabled={!isReady}
                        className='p-2 rounded-full hover:bg-purple-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-40 disabled:pointer-events-none'
                        aria-label='Skip forward 10 seconds'
                    >
                        <SkipForward className='w-5 h-5 text-gray-700 dark:text-gray-300' />
                    </button>
                </div>

                <div className='hidden md:flex items-center gap-2'>
                    <button
                        type='button'
                        onClick={toggleMute}
                        disabled={!isReady}
                        className='p-2 rounded-full hover:bg-purple-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-40 disabled:pointer-events-none'
                        aria-label={isMuted ? 'Unmute' : 'Mute'}
                    >
                        {isMuted ? (
                            <VolumeX className='w-5 h-5 text-gray-700 dark:text-gray-300' />
                        ) : (
                            <Volume2 className='w-5 h-5 text-gray-700 dark:text-gray-300' />
                        )}
                    </button>
                    <input
                        type='range'
                        min='0'
                        max='1'
                        step='0.01'
                        value={isMuted ? 0 : volume}
                        onChange={handleVolumeChange}
                        disabled={!isReady}
                        className='w-24 h-2 bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900 rounded-lg appearance-none cursor-pointer disabled:opacity-40'
                    />
                </div>
            </div>

            <style jsx>{`
                input[type='range']::-webkit-slider-thumb {
                    appearance: none;
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                    background: linear-gradient(to bottom right, #111827, #4c1d95, #db2777);
                    cursor: pointer;
                    border: 2px solid white;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                }

                input[type='range']::-moz-range-thumb {
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                    background: linear-gradient(to bottom right, #111827, #4c1d95, #db2777);
                    cursor: pointer;
                    border: 2px solid white;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                }
            `}</style>
        </div>
    );
}
