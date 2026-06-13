import { useCallback, useRef, useState, useEffect } from 'react';

interface UseNotificationAudioOptions {
    audioPath?: string;
    volume?: number;
    enabled?: boolean;
}

export function useNotificationAudio(options: UseNotificationAudioOptions = {}) {
    const {
        audioPath = '/audio/notification.mp3',
        volume = 0.5,
        enabled: initialEnabled = true
    } = options;

    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isEnabled, setIsEnabled] = useState(initialEnabled);

    // Load user preference from localStorage on mount
    useEffect(() => {
        const savedPreference = localStorage.getItem('notification-audio-enabled');
        if (savedPreference !== null) {
            setIsEnabled(JSON.parse(savedPreference));
        }
    }, []);

    // Save preference to localStorage when it changes
    useEffect(() => {
        localStorage.setItem('notification-audio-enabled', JSON.stringify(isEnabled));
    }, [isEnabled]);

    const playNotificationSound = useCallback(() => {
        if (!isEnabled) return;

        try {
            // Create audio element if it doesn't exist
            if (!audioRef.current) {
                audioRef.current = new Audio(audioPath);
                audioRef.current.volume = volume;
                audioRef.current.preload = 'auto';
            }

            // Reset audio to beginning and play
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch((error) => {
                console.warn('Could not play notification sound:', error);
            });
        } catch (error) {
            console.warn('Error playing notification sound:', error);
        }
    }, [audioPath, volume, isEnabled]);

    const setVolume = useCallback((newVolume: number) => {
        if (audioRef.current) {
            audioRef.current.volume = Math.max(0, Math.min(1, newVolume));
        }
    }, []);

    const setEnabled = useCallback((newEnabled: boolean) => {
        setIsEnabled(newEnabled);
    }, []);

    return {
        playNotificationSound,
        setVolume,
        setEnabled,
        isEnabled
    };
}
