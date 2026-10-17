import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, RotateCcw, Check, AlertCircle, Smartphone } from 'lucide-react';

export default function AudioRecorder({ onRecordingComplete }) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordTime, setRecordTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);
  const canvasRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    return () => {
      clearInterval(timerRef.current);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  const drawVisualizer = () => {
    if (!canvasRef.current || !analyserRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const analyser = analyserRef.current;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animationFrameRef.current = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / bufferLength) * 2.2;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * canvas.height;
        
        // Gradient color for recording
        const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0);
        gradient.addColorStop(0, '#0284c7');
        gradient.addColorStop(1, '#ef4444');

        ctx.fillStyle = gradient;
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

        x += barWidth + 1;
        if (x > canvas.width) break;
      }
    };

    draw();
  };

  const startRecording = async () => {
    setErrorMsg(null);
    audioChunksRef.current = [];
    setAudioBlob(null);
    setAudioUrl(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Setup Web Audio Analyser
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const audioCtx = new AudioContext();
      audioContextRef.current = audioCtx;
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      source.connect(analyser);
      analyserRef.current = analyser;

      drawVisualizer();

      // Setup MediaRecorder
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const mimeType = mediaRecorder.mimeType || 'audio/wav';
        const blob = new Blob(audioChunksRef.current, { type: mimeType });
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);

        // Stop tracks
        stream.getTracks().forEach((track) => track.stop());
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };

      mediaRecorder.start(100);
      setIsRecording(true);
      setRecordTime(0);

      timerRef.current = setInterval(() => {
        setRecordTime((prev) => prev + 1);
      }, 1000);

    } catch (err) {
      console.error("Microphone access error:", err);
      setErrorMsg("Microphone permission denied or no audio input device found.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(timerRef.current);
    }
  };

  const handleMobileCapture = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAudioBlob(file);
      const url = URL.createObjectURL(file);
      setAudioUrl(url);
      onRecordingComplete(file, url);
    }
  };

  const resetRecording = () => {
    setAudioBlob(null);
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
    setRecordTime(0);
  };

  const submitRecording = () => {
    if (audioBlob) {
      const mime = (audioBlob.type || '').toLowerCase();
      let ext = '.wav';
      if (mime.includes('webm')) ext = '.webm';
      else if (mime.includes('ogg')) ext = '.ogg';
      else if (mime.includes('mp4') || mime.includes('m4a')) ext = '.mp4';

      const file = new File([audioBlob], `mic_recording_${Date.now()}${ext}`, {
        type: audioBlob.type || (ext === '.webm' ? 'audio/webm' : 'audio/wav'),
      });
      onRecordingComplete(file, audioUrl);
    }
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div style={{
      background: 'rgba(10, 15, 29, 0.7)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-md)',
      padding: '1.25rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      alignItems: 'center'
    }}>
      {errorMsg && (
        <div style={{
          width: '100%',
          padding: '0.65rem 0.9rem',
          borderRadius: '8px',
          background: 'rgba(239, 68, 68, 0.12)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          color: '#f87171',
          fontSize: '0.78rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <AlertCircle size={15} />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Visualizer Canvas & Timer */}
      <div style={{
        width: '100%',
        height: '75px',
        background: '#060913',
        borderRadius: '10px',
        border: '1px solid rgba(255, 255, 255, 0.06)',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
      }}>
        <canvas
          ref={canvasRef}
          width={400}
          height={75}
          style={{ width: '100%', height: '100%', opacity: isRecording ? 1 : 0.2 }}
        />

        {/* Timer Overlay */}
        <div style={{
          position: 'absolute',
          top: '8px',
          right: '12px',
          fontSize: '0.82rem',
          fontFamily: 'var(--font-mono)',
          fontWeight: 600,
          color: isRecording ? '#ef4444' : 'var(--text-muted)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.35rem'
        }}>
          {isRecording && (
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#ef4444',
              boxShadow: '0 0 8px #ef4444',
              animation: 'pulse-ring 1.5s infinite'
            }} />
          )}
          <span>{formatTimer(recordTime)}</span>
        </div>

        {!isRecording && !audioBlob && (
          <div style={{
            position: 'absolute',
            fontSize: '0.78rem',
            color: 'var(--text-dim)',
            pointerEvents: 'none'
          }}>
            Click "Start Recording" to capture real-time microphone stream
          </div>
        )}
      </div>

      {/* Control Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        {!isRecording && !audioBlob && (
          <>
            <button
              onClick={startRecording}
              style={{
                padding: '0.65rem 1.4rem',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                color: '#ffffff',
                fontSize: '0.84rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: '0 4px 15px rgba(239, 68, 68, 0.35)'
              }}
            >
              <Mic size={16} />
              <span>Start Recording</span>
            </button>

            {/* Android / Mobile Native Voice Recorder */}
            <input
              id="mobileVoiceInput"
              type="file"
              accept="audio/*"
              capture="microphone"
              style={{ display: 'none' }}
              onChange={handleMobileCapture}
            />
            <button
              type="button"
              onClick={() => document.getElementById('mobileVoiceInput').click()}
              style={{
                padding: '0.65rem 1.2rem',
                borderRadius: '10px',
                background: 'rgba(56, 189, 248, 0.12)',
                border: '1px solid rgba(56, 189, 248, 0.35)',
                color: '#38bdf8',
                fontSize: '0.84rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
              title="Launch Android device's native voice recorder"
            >
              <Smartphone size={16} />
              <span>Mobile Voice App</span>
            </button>
          </>
        )}

        {isRecording && (
          <button
            onClick={stopRecording}
            style={{
              padding: '0.65rem 1.4rem',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #dc2626, #991b1b)',
              color: '#ffffff',
              fontSize: '0.84rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 15px rgba(220, 38, 38, 0.45)'
            }}
          >
            <Square size={16} fill="#ffffff" />
            <span>Stop & Finish</span>
          </button>
        )}

        {audioBlob && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <button
              onClick={submitRecording}
              style={{
                padding: '0.65rem 1.35rem',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #0284c7, #2563eb)',
                color: '#ffffff',
                fontSize: '0.84rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                boxShadow: '0 4px 15px rgba(2, 132, 199, 0.4)'
              }}
            >
              <Check size={16} />
              <span>Use This Recording</span>
            </button>

            <button
              onClick={resetRecording}
              style={{
                padding: '0.65rem 1rem',
                borderRadius: '10px',
                background: 'rgba(30, 41, 59, 0.8)',
                color: 'var(--text-muted)',
                fontSize: '0.84rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                border: '1px solid var(--border-subtle)'
              }}
            >
              <RotateCcw size={15} />
              <span>Retake</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
