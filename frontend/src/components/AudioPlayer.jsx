import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, RotateCcw, Volume2, Music } from 'lucide-react';

export default function AudioPlayer({ audioUrl, waveformPoints = [], title = "Audio Sample" }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
  }, [audioUrl]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.error("Playback error:", err);
      });
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      if (audioRef.current.duration && !isNaN(audioRef.current.duration)) {
        setDuration(audioRef.current.duration);
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current && audioRef.current.duration) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleScrub = (clientX, target) => {
    if (!audioRef.current || !duration) return;
    const rect = target.getBoundingClientRect();
    const clickX = clientX - rect.left;
    const pct = Math.max(0, Math.min(1, clickX / rect.width));
    const newTime = pct * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleWaveformClick = (e) => {
    handleScrub(e.clientX, e.currentTarget);
  };

  const handleTouch = (e) => {
    if (e.touches && e.touches[0]) {
      handleScrub(e.touches[0].clientX, e.currentTarget);
    }
  };

  const formatTime = (secs) => {
    if (isNaN(secs) || secs === Infinity) return "0:00";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Generate fallback waveform if points are empty
  const points = waveformPoints && waveformPoints.length > 0 
    ? waveformPoints 
    : Array.from({ length: 80 }, (_, i) => 0.15 + 0.7 * Math.abs(Math.sin(i * 0.25) * Math.cos(i * 0.1)));

  const progressPct = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div style={{
      background: 'rgba(15, 23, 42, 0.7)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-md)',
      padding: '1.25rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <audio
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Music size={16} color="#38bdf8" />
          <span style={{ fontSize: '0.86rem', fontWeight: 600, color: '#e2e8f0' }}>{title}</span>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.8rem',
          color: 'var(--text-muted)'
        }}>
          <span style={{ color: '#38bdf8' }}>{formatTime(currentTime)}</span>
          <span>/</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Waveform Visualization & Interactive Scrubber */}
      <div
        onClick={handleWaveformClick}
        onTouchStart={handleTouch}
        onTouchMove={handleTouch}
        style={{
          height: '64px',
          background: 'rgba(10, 15, 29, 0.85)',
          borderRadius: '10px',
          padding: '0.35rem 0.6rem',
          display: 'flex',
          alignItems: 'center',
          gap: '2px',
          cursor: 'pointer',
          position: 'relative',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          overflow: 'hidden'
        }}
        title="Click anywhere to scrub playback"
      >
        {/* Progress highlight fill */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          width: `${progressPct}%`,
          background: 'linear-gradient(90deg, rgba(56, 189, 248, 0.1), rgba(139, 92, 246, 0.25))',
          pointerEvents: 'none',
          transition: 'width 0.1s linear'
        }} />

        {/* Playhead vertical laser line */}
        <div style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: `${progressPct}%`,
          width: '2px',
          background: '#38bdf8',
          boxShadow: '0 0 10px #38bdf8, 0 0 4px #fff',
          zIndex: 3,
          pointerEvents: 'none'
        }} />

        {/* Bars */}
        {points.map((val, idx) => {
          const barPct = (idx / points.length) * 100;
          const isPlayed = barPct <= progressPct;
          const height = Math.max(8, Math.min(56, val * 56));
          return (
            <div
              key={idx}
              style={{
                flex: 1,
                height: `${height}px`,
                borderRadius: '2px',
                background: isPlayed
                  ? 'linear-gradient(180deg, #38bdf8 0%, #2563eb 100%)'
                  : 'rgba(148, 163, 184, 0.25)',
                transition: 'background 0.15s ease',
                zIndex: 2
              }}
            />
          );
        })}
      </div>

      {/* Control Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={togglePlay}
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #0284c7, #2563eb)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 15px rgba(2, 132, 199, 0.4)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} style={{ marginLeft: '2px' }} />}
          </button>

          <button
            onClick={() => {
              if (audioRef.current) {
                audioRef.current.currentTime = 0;
                setCurrentTime(0);
              }
            }}
            title="Restart playback"
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'rgba(30, 41, 59, 0.7)',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid var(--border-subtle)'
            }}
          >
            <RotateCcw size={15} />
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-dim)', fontSize: '0.75rem' }}>
          <Volume2 size={15} />
          <span>Lossless 16kHz Audio Forensic Stream</span>
        </div>
      </div>
    </div>
  );
}
