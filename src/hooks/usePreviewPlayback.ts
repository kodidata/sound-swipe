import { useCallback, useEffect, useRef, useState } from "react";

export function usePreviewPlayback(
  url: string | null,
  options: { autoPlay?: boolean; durationSeconds?: number } = {},
) {
  const { autoPlay = false, durationSeconds = 9 } = options;
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const stopTimerRef = useRef<number | null>(null);
  const tickRef = useRef<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const clearTimers = useCallback(() => {
    if (stopTimerRef.current) {
      window.clearTimeout(stopTimerRef.current);
      stopTimerRef.current = null;
    }

    if (tickRef.current) {
      window.clearInterval(tickRef.current);
      tickRef.current = null;
    }
  }, []);

  const stopPlayback = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }

    clearTimers();
    setPlaying(false);
    setProgress(0);
  }, [clearTimers]);

  const startPlayback = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio || !url) return;

    try {
      audio.currentTime = 0;
      await audio.play();
      setPlaying(true);

      const startedAt = Date.now();
      clearTimers();

      tickRef.current = window.setInterval(() => {
        const elapsed = (Date.now() - startedAt) / 1000;
        setProgress(Math.min(1, elapsed / durationSeconds));
      }, 80);

      stopTimerRef.current = window.setTimeout(() => {
        audio.pause();
        setPlaying(false);
        setProgress(0);
        clearTimers();
      }, durationSeconds * 1000);
    } catch (error) {
      console.warn("Audio playback blocked", error);
      setPlaying(false);
    }
  }, [clearTimers, durationSeconds, url]);

  useEffect(() => {
    if (!url) {
      stopPlayback();
      return;
    }

    const audio = new Audio(url);
    audio.crossOrigin = "anonymous";
    audio.preload = "auto";
    audioRef.current = audio;

    const handleEnded = () => {
      setPlaying(false);
      setProgress(0);
      clearTimers();
    };

    audio.addEventListener("ended", handleEnded);

    if (autoPlay) {
      void startPlayback();
    }

    return () => {
      audio.pause();
      audio.removeEventListener("ended", handleEnded);
      clearTimers();
      audioRef.current = null;
    };
  }, [autoPlay, clearTimers, startPlayback, stopPlayback, url]);

  useEffect(() => {
    return () => clearTimers();
  }, [clearTimers]);

  return {
    audioRef,
    playing,
    progress,
    startPlayback,
    stopPlayback,
  };
}
