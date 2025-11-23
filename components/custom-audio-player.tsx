'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, SkipBack, SkipForward } from 'lucide-react';

interface CustomAudioPlayerProps {
    audioUrl: string;
}

export function CustomAudioPlayer({ audioUrl }: CustomAudioPlayerProps) {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const updateTime = () => setCurrentTime(audio.currentTime);
        const updateDuration = () => setDuration(audio.duration);
        const handleEnded = () => setIsPlaying(false);

        audio.addEventListener('timeupdate', updateTime);
        audio.addEventListener('loadedmetadata', updateDuration);
        audio.addEventListener('ended', handleEnded);

        return () => {
            audio.removeEventListener('timeupdate', updateTime);
            audio.removeEventListener('loadedmetadata', updateDuration);
            audio.removeEventListener('ended', handleEnded);
        };
    }, []);

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const time = parseFloat(e.target.value);
        setCurrentTime(time);
        if (audioRef.current) {
            audioRef.current.currentTime = time;
        }
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const vol = parseFloat(e.target.value);
        setVolume(vol);
        if (audioRef.current) {
            audioRef.current.volume = vol;
        }
        if (vol === 0) {
            setIsMuted(true);
        } else if (isMuted) {
            setIsMuted(false);
        }
    };

    const toggleMute = () => {
        if (audioRef.current) {
            if (isMuted) {
                audioRef.current.volume = volume;
                setIsMuted(false);
            } else {
                audioRef.current.volume = 0;
                setIsMuted(true);
            }
        }
    };

    const skip = (seconds: number) => {
        if (audioRef.current) {
            audioRef.current.currentTime += seconds;
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
            <audio ref={audioRef} src={audioUrl} preload='metadata' />
            
            {/* Progress Bar */}
            <div className='mb-4'>
                <input
                    type='range'
                    min='0'
                    max={duration || 0}
                    value={currentTime}
                    onChange={handleTimeChange}
                    className='w-full h-2 bg-gray-300 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer slider'
                    style={{
                        background: `linear-gradient(to right, rgb(147, 51, 234) 0%, rgb(147, 51, 234) ${(currentTime / duration) * 100}%, rgb(209, 213, 219) ${(currentTime / duration) * 100}%, rgb(209, 213, 219) 100%)`
                    }}
                />
                <div className='flex justify-between text-sm text-gray-600 dark:text-gray-400 mt-2'>
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                </div>
            </div>

            {/* Controls */}
            <div className='flex items-center justify-center md:justify-between'>
                {/* Play Controls */}
                <div className='flex justify-center items-center gap-3'>
                    <button
                        onClick={() => skip(-10)}
                        className='p-2 rounded-full hover:bg-purple-100 dark:hover:bg-gray-700 transition-colors'
                        aria-label='Skip back 10 seconds'
                    >
                        <SkipBack className='w-5 h-5 text-gray-700 dark:text-gray-300' />
                    </button>
                    
                    <button
                        onClick={togglePlay}
                        className='p-4 rounded-full bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 transition-colors shadow-lg'
                        aria-label={isPlaying ? 'Pause' : 'Play'}
                    >
                        {isPlaying ? (
                            <Pause className='w-6 h-6 text-white fill-white' />
                        ) : (
                            <Play className='w-6 h-6 text-white fill-white' />
                        )}
                    </button>
                    
                    <button
                        onClick={() => skip(10)}
                        className='p-2 rounded-full hover:bg-purple-100 dark:hover:bg-gray-700 transition-colors'
                        aria-label='Skip forward 10 seconds'
                    >
                        <SkipForward className='w-5 h-5 text-gray-700 dark:text-gray-300' />
                    </button>
                </div>

                {/* Volume Controls */}
                <div className='hidden md:flex items-center gap-2'>
                    <button
                        onClick={toggleMute}
                        className='p-2 rounded-full hover:bg-purple-100 dark:hover:bg-gray-700 transition-colors'
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
                        className='w-24 h-2 bg-gray-300 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer'
                    />
                </div>
            </div>

            <style jsx>{`
                input[type='range']::-webkit-slider-thumb {
                    appearance: none;
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                    background: rgb(147, 51, 234);
                    cursor: pointer;
                    border: 2px solid white;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                }
                
                input[type='range']::-moz-range-thumb {
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                    background: rgb(147, 51, 234);
                    cursor: pointer;
                    border: 2px solid white;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                }
            `}</style>
        </div>
    );
}