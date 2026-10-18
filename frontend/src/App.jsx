import React, { useState, useEffect } from 'react';
import { 
  Upload, Mic, Play, RefreshCw, FileAudio, CheckCircle2, 
  AlertTriangle, ShieldAlert, ShieldCheck, Download, Zap, 
  Sliders, Info, Sparkles, ChevronRight, Activity, ArrowRight,
  Server, ExternalLink
} from 'lucide-react';

import Navbar from './components/Navbar';
import AudioPlayer from './components/AudioPlayer';
import SpectrogramHeatmap from './components/SpectrogramHeatmap';
import MetricsRadar from './components/MetricsRadar';
import AudioRecorder from './components/AudioRecorder';
import PresentationDeck from './components/PresentationDeck';
import AuditHistory from './components/AuditHistory';
import BackendConfigModal from './components/BackendConfigModal';

const DEFAULT_API_BASE = import.meta.env.VITE_API_URL 
  ? import.meta.env.VITE_API_URL.replace(/\/$/, '') 
  : (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1'
      ? 'https://deepfake-voice-detection-me9u.onrender.com'
      : '');

export default function App() {
  const [activeTab, setActiveTab] = useState('studio'); // 'studio', 'samples', 'presentation', 'history'
  const [inputMode, setInputMode] = useState('upload'); // 'upload', 'mic', 'samples'
  
  // Backend URL management (persists across reloads)
  const [apiUrl, setApiUrl] = useState(() => {
    return localStorage.getItem('deepfake_backend_url') || DEFAULT_API_BASE;
  });
  const [backendStatus, setBackendStatus] = useState('checking'); // 'online', 'waking_up', 'offline', 'checking'
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);

  const [selectedFile, setSelectedFile] = useState(null);
  const [audioPreviewUrl, setAudioPreviewUrl] = useState(null);
  const [audioTitle, setAudioTitle] = useState('No Audio Selected');
  const [sensitivity, setSensitivity] = useState('balanced'); // 'balanced', 'strict', 'relaxed'

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisStatusText, setAnalysisStatusText] = useState('');

  const [currentResult, setCurrentResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const [sampleList, setSampleList] = useState([]);
  const [historyList, setHistoryList] = useState([]);

  // Check backend health & fetch sample list on mount or when apiUrl changes
  useEffect(() => {
    checkBackendHealth(apiUrl);
  }, [apiUrl]);

  const checkBackendHealth = async (targetUrl = apiUrl) => {
    setBackendStatus('checking');
    const cleanUrl = targetUrl ? targetUrl.replace(/\/$/, '') : '';
    const pingUrl = cleanUrl ? `${cleanUrl}/api/health/` : '/api/health/';

    const wakeTimer = setTimeout(() => {
      setBackendStatus('waking_up');
    }, 3500);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 20000);

      const res = await fetch(pingUrl, { signal: controller.signal });
      clearTimeout(timeoutId);
      clearTimeout(wakeTimer);

      if (res.ok) {
        setBackendStatus('online');
        fetchSamples(cleanUrl);
        fetchHistory(cleanUrl);
      } else {
        // Try fallback to samples
        await fetchSamples(cleanUrl);
        await fetchHistory(cleanUrl);
      }
    } catch (err) {
      clearTimeout(wakeTimer);
      // Fallback check to samples
      try {
        const res2 = await fetch(`${cleanUrl}/api/samples/`);
        if (res2.ok) {
          const data = await res2.json();
          if (Array.isArray(data.samples)) {
            setSampleList(data.samples);
            setBackendStatus('online');
            fetchHistory(cleanUrl);
            return;
          }
        }
      } catch (e) {
        // Both failed
      }
      setBackendStatus('offline');
    }
  };

  const fetchSamples = async (base = apiUrl) => {
    try {
      const res = await fetch(`${base}/api/samples/`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.samples)) {
          setSampleList(data.samples);
          setBackendStatus('online');
        }
      }
    } catch (err) {
      console.warn("Could not connect to Django sample list API yet:", err);
    }
  };

  const fetchHistory = async (base = apiUrl) => {
    try {
      const res = await fetch(`${base}/api/history/`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.history)) {
          setHistoryList(data.history);
        }
      }
    } catch (err) {
      console.warn("Could not fetch history:", err);
    }
  };

  const handleSaveApiUrl = (newUrl) => {
    const clean = newUrl ? newUrl.replace(/\/$/, '') : '';
    setApiUrl(clean);
    if (clean) {
      localStorage.setItem('deepfake_backend_url', clean);
    } else {
      localStorage.removeItem('deepfake_backend_url');
    }
    checkBackendHealth(clean);
  };


  // Handle file drop/select
  const handleFileChange = (file) => {
    if (!file) return;
    setSelectedFile(file);
    setAudioTitle(file.name);
    setErrorMsg(null);
    setCurrentResult(null);

    const url = URL.createObjectURL(file);
    setAudioPreviewUrl(url);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  // Handle analysis
  const runDetection = async () => {
    if (!selectedFile) {
      setErrorMsg("Please select an audio file, record your voice, or choose a benchmark sample first.");
      return;
    }

    setIsAnalyzing(true);
    setErrorMsg(null);
    setAnalysisProgress(15);
    setAnalysisStatusText("1/4 Loading signal & peak normalization...");

    const pTimer1 = setTimeout(() => {
      setAnalysisProgress(45);
      setAnalysisStatusText("2/4 Computing 13 MFCCs & Mel-Spectrogram matrix...");
    }, 280);

    const pTimer2 = setTimeout(() => {
      setAnalysisProgress(75);
      setAnalysisStatusText("3/4 Estimating pitch F0 jitter & vocoder residue cutoff...");
    }, 550);

    const pTimer3 = setTimeout(() => {
      setAnalysisProgress(90);
      setAnalysisStatusText("4/4 Calibrating classification & generating XAI findings...");
    }, 800);

    try {
      const formData = new FormData();
      formData.append('audio', selectedFile);
      formData.append('sensitivity', sensitivity);

      const response = await fetch(`${apiUrl}/api/detect/`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errJson = await response.json();
        throw new Error(errJson.error || 'Server processing error');
      }

      const resultData = await response.json();
      setAnalysisProgress(100);
      setCurrentResult(resultData);
      fetchHistory(apiUrl); // refresh audit history
    } catch (err) {
      console.error("Detection error:", err);
      const isFetchErr = err.name === 'TypeError' || (err.message && err.message.toLowerCase().includes('fetch'));
      if (isFetchErr) {
        setBackendStatus('offline');
        setErrorMsg(`Failed to connect to backend (${apiUrl || 'relative /api'}). Render's free tier spins down when idle — wait ~60s for it to wake up or configure your Render URL.`);
      } else {
        setErrorMsg(err.message || "Failed to analyze audio. Please check Django server status.");
      }
    } finally {
      clearTimeout(pTimer1);
      clearTimeout(pTimer2);
      clearTimeout(pTimer3);
      setIsAnalyzing(false);
    }
  };

  // Handle 1-click sample analysis
  const runSampleAnalysis = async (sample) => {
    setIsAnalyzing(true);
    setErrorMsg(null);
    setSelectedFile(null);
    setAudioTitle(`${sample.title} (${sample.filename})`);
    const previewUrl = sample.audio_url?.startsWith('http') ? sample.audio_url : `${apiUrl}${sample.audio_url}`;
    setAudioPreviewUrl(previewUrl);
    setAnalysisProgress(30);
    setAnalysisStatusText(`Analyzing benchmark sample: ${sample.title}...`);

    try {
      const response = await fetch(`${apiUrl}/api/samples/analyze/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sample_id: sample.id, sensitivity })
      });

      if (!response.ok) {
        const errJson = await response.json();
        throw new Error(errJson.error || 'Sample analysis failed');
      }

      const resultData = await response.json();
      setAnalysisProgress(100);
      setCurrentResult(resultData);
      setActiveTab('studio');
      fetchHistory(apiUrl);
    } catch (err) {
      const isFetchErr = err.name === 'TypeError' || (err.message && err.message.toLowerCase().includes('fetch'));
      if (isFetchErr) {
        setBackendStatus('offline');
        setErrorMsg(`Could not connect to backend to analyze sample. Render free tier may be sleeping.`);
      } else {
        setErrorMsg(err.message || "Failed to analyze sample.");
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleClearHistory = async () => {
    try {
      await fetch(`${apiUrl}/api/history/`, { method: 'DELETE' });
      setHistoryList([]);
    } catch (err) {
      console.error("Failed to clear history:", err);
    }
  };

  const handleExportReport = () => {
    if (!currentResult) return;
    const reportStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(currentResult, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", reportStr);
    downloadAnchor.setAttribute("download", `forensic_report_${currentResult.verdict.toLowerCase()}_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        backendStatus={backendStatus}
        onOpenConfig={() => setIsConfigModalOpen(true)}
      />


      {/* Main Container */}
      <main style={{ flex: 1, padding: '2rem 1.5rem', maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
        
        {/* TAB 1: FORENSIC STUDIO */}
        {activeTab === 'studio' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* Hero Banner */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.4rem',
              borderBottom: '1px solid var(--border-subtle)',
              paddingBottom: '1.25rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: '#38bdf8'
                }}>
                  Acoustic Forensics Workbench
                </span>
                <span style={{
                  padding: '0.15rem 0.5rem',
                  borderRadius: '6px',
                  background: 'rgba(16, 185, 129, 0.1)',
                  color: '#10b981',
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  border: '1px solid rgba(16, 185, 129, 0.25)'
                }}>
                  Offline Capable & Fast (&lt;2s)
                </span>
              </div>
              <h1 className="hero-title" style={{
                fontSize: '2.1rem',
                fontWeight: 800,
                color: '#f8fafc',
                letterSpacing: '-0.02em'
              }}>
                Deepfake & AI Voice Verification Engine
              </h1>
              <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', maxWidth: '780px', lineHeight: 1.5 }}>
                Identify synthetic speech, cloned voices, and telephony audio impersonation. Extracts acoustic feature vectors (MFCC, Mel-Spectrogram, Pitch Jitter, Vocoder anomalies) to predict authenticity with calibrated confidence.
              </p>
            </div>

            {/* Backend Wake-up / Offline Notification Banner */}
            {backendStatus !== 'online' && (
              <div style={{
                padding: '0.9rem 1.25rem',
                borderRadius: '12px',
                background: backendStatus === 'waking_up' 
                  ? 'rgba(245, 158, 11, 0.12)' 
                  : backendStatus === 'checking'
                    ? 'rgba(56, 189, 248, 0.1)'
                    : 'rgba(239, 68, 68, 0.12)',
                border: `1px solid ${
                  backendStatus === 'waking_up' 
                    ? 'rgba(245, 158, 11, 0.35)' 
                    : backendStatus === 'checking'
                      ? 'rgba(56, 189, 248, 0.3)'
                      : 'rgba(239, 68, 68, 0.35)'
                }`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '0.8rem',
                fontSize: '0.84rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  {backendStatus === 'waking_up' ? (
                    <RefreshCw size={18} className="spin" style={{ color: '#fbbf24', flexShrink: 0 }} />
                  ) : backendStatus === 'checking' ? (
                    <RefreshCw size={18} className="spin" style={{ color: '#38bdf8', flexShrink: 0 }} />
                  ) : (
                    <AlertTriangle size={18} style={{ color: '#f87171', flexShrink: 0 }} />
                  )}
                  <div style={{ color: backendStatus === 'waking_up' ? '#fef3c7' : backendStatus === 'checking' ? '#e0f2fe' : '#fecaca' }}>
                    <strong>
                      {backendStatus === 'waking_up' 
                        ? 'Render Backend is Spinning Up...' 
                        : backendStatus === 'checking'
                          ? 'Checking Backend Connectivity...'
                          : 'Backend Disconnected / Failed to Fetch'}
                    </strong>
                    <div style={{ fontSize: '0.76rem', opacity: 0.9, marginTop: '0.15rem' }}>
                      {backendStatus === 'waking_up'
                        ? "Render free instances sleep after 15m idle. Initial wake-up takes ~50–90 seconds."
                        : backendStatus === 'checking'
                          ? `Attempting to reach backend at ${apiUrl || 'relative /api'}...`
                          : `Cannot reach backend (${apiUrl || 'relative /api'}). If hosted on Render, check if service is running or asleep.`}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {apiUrl && (
                    <a
                      href={apiUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        padding: '0.4rem 0.75rem',
                        borderRadius: '7px',
                        background: 'rgba(255, 255, 255, 0.08)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        color: '#f8fafc',
                        fontSize: '0.76rem',
                        fontWeight: 600,
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem'
                      }}
                    >
                      <span>Open Backend Tab</span>
                      <ExternalLink size={12} />
                    </a>
                  )}
                  <button
                    onClick={() => checkBackendHealth(apiUrl)}
                    style={{
                      padding: '0.4rem 0.75rem',
                      borderRadius: '7px',
                      background: 'rgba(56, 189, 248, 0.15)',
                      border: '1px solid rgba(56, 189, 248, 0.35)',
                      color: '#38bdf8',
                      fontSize: '0.76rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem'
                    }}
                  >
                    <RefreshCw size={12} className={backendStatus === 'checking' || backendStatus === 'waking_up' ? 'spin' : ''} />
                    <span>Retry Ping</span>
                  </button>
                  <button
                    onClick={() => setIsConfigModalOpen(true)}
                    style={{
                      padding: '0.4rem 0.75rem',
                      borderRadius: '7px',
                      background: 'linear-gradient(135deg, #0284c7, #2563eb)',
                      border: 'none',
                      color: '#ffffff',
                      fontSize: '0.76rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Configure URL
                  </button>
                </div>
              </div>
            )}

            {/* Error Notification */}
            {errorMsg && (
              <div style={{
                padding: '0.9rem 1.2rem',
                borderRadius: '12px',
                background: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.35)',
                color: '#f87171',
                fontSize: '0.86rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem'
              }}>
                <AlertTriangle size={18} />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Input & Control Panel */}
            <div
              className="studio-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: currentResult ? 'repeat(auto-fit, minmax(min(100%, 360px), 1fr))' : '1fr',
                gap: '1.5rem',
                alignItems: 'start'
              }}
            >
              {/* Left Column: Input Selection */}
              <div style={{
                background: 'rgba(15, 23, 42, 0.75)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.25rem'
              }}>
                {/* Input Mode Selector */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.6rem' }}>
                  <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#e2e8f0' }}>Select Audio Source</span>
                  <div style={{
                    display: 'flex',
                    background: 'rgba(10, 16, 30, 0.8)',
                    padding: '0.2rem',
                    borderRadius: '8px',
                    border: '1px solid var(--border-subtle)',
                    gap: '0.2rem'
                  }}>
                    <button
                      onClick={() => setInputMode('upload')}
                      style={{
                        padding: '0.35rem 0.85rem',
                        borderRadius: '6px',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        background: inputMode === 'upload' ? 'rgba(56, 189, 248, 0.2)' : 'transparent',
                        color: inputMode === 'upload' ? '#38bdf8' : 'var(--text-muted)'
                      }}
                    >
                      Upload File
                    </button>
                    <button
                      onClick={() => setInputMode('mic')}
                      style={{
                        padding: '0.35rem 0.85rem',
                        borderRadius: '6px',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        background: inputMode === 'mic' ? 'rgba(239, 68, 68, 0.2)' : 'transparent',
                        color: inputMode === 'mic' ? '#f87171' : 'var(--text-muted)'
                      }}
                    >
                      Record Mic
                    </button>
                    <button
                      onClick={() => setInputMode('samples')}
                      style={{
                        padding: '0.35rem 0.85rem',
                        borderRadius: '6px',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        background: inputMode === 'samples' ? 'rgba(139, 92, 246, 0.2)' : 'transparent',
                        color: inputMode === 'samples' ? '#c084fc' : 'var(--text-muted)'
                      }}
                    >
                      Presets
                    </button>
                  </div>
                </div>

                {/* Sub-Panel: Upload */}
                {inputMode === 'upload' && (
                  <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                    style={{
                      border: '2px dashed rgba(56, 189, 248, 0.3)',
                      borderRadius: 'var(--radius-md)',
                      padding: '2.5rem 1.5rem',
                      textAlign: 'center',
                      background: 'rgba(10, 16, 30, 0.5)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.8rem',
                      cursor: 'pointer',
                      transition: 'border-color 0.2s ease'
                    }}
                    onClick={() => document.getElementById('audioFileInput').click()}
                  >
                    <input
                      id="audioFileInput"
                      type="file"
                      accept="audio/*,video/*,.wav,.mp3,.mpeg,.mpg,.mp4,.ogg,.flac,.m4a,.3gp,.amr,.aac,.opus"
                      style={{ display: 'none' }}
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleFileChange(e.target.files[0]);
                        }
                      }}
                    />
                    <div style={{
                      width: '54px',
                      height: '54px',
                      borderRadius: '50%',
                      background: 'rgba(56, 189, 248, 0.1)',
                      color: '#38bdf8',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Upload size={24} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.96rem', color: '#f8fafc' }}>
                        Drag & Drop or Click to Browse Audio
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                        Supports WAV, MP3, MPEG, MP4, M4A, OGG, FLAC (Max 50MB)
                      </div>
                    </div>
                  </div>
                )}

                {/* Sub-Panel: Microphone Live Recording */}
                {inputMode === 'mic' && (
                  <AudioRecorder
                    onRecordingComplete={(file, blobUrl) => {
                      setSelectedFile(file);
                      setAudioTitle(file.name);
                      setAudioPreviewUrl(blobUrl);
                      setCurrentResult(null);
                    }}
                  />
                )}

                {/* Sub-Panel: Preset Benchmark Samples */}
                {inputMode === 'samples' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
                    <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                      Click any preset sample to load and analyze instantly:
                    </span>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.6rem' }}>
                      {sampleList.map((s) => (
                        <div
                          key={s.id}
                          onClick={() => runSampleAnalysis(s)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '0.75rem 1rem',
                            background: 'rgba(10, 16, 30, 0.6)',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: '10px',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.4)'}
                          onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
                        >
                          <div>
                            <div style={{ fontSize: '0.86rem', fontWeight: 600, color: '#f8fafc' }}>
                              {s.title}
                            </div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                              {s.description}
                            </div>
                          </div>
                          <span style={{
                            padding: '0.2rem 0.55rem',
                            borderRadius: '6px',
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            background: s.badge_type === 'authentic' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                            color: s.badge_type === 'authentic' ? '#34d399' : '#f87171'
                          }}>
                            {s.badge}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Audio Player Component (when file selected) */}
                {audioPreviewUrl && (
                  <AudioPlayer
                    audioUrl={audioPreviewUrl}
                    waveformPoints={currentResult ? currentResult.waveform_points : []}
                    title={audioTitle}
                  />
                )}

                {/* Sensitivity Mode Selector */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.65rem 0.95rem',
                  background: 'rgba(10, 16, 30, 0.65)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '10px',
                  gap: '0.6rem',
                  flexWrap: 'wrap'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <Sliders size={15} color="#38bdf8" />
                    <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#e2e8f0' }}>
                      Detection Sensitivity:
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.3rem' }}>
                    {[
                      { key: 'balanced', label: 'Balanced' },
                      { key: 'strict', label: 'Strict (Anti-Scam)' },
                      { key: 'relaxed', label: 'Relaxed' }
                    ].map(mode => (
                      <button
                        key={mode.key}
                        onClick={() => setSensitivity(mode.key)}
                        style={{
                          padding: '0.3rem 0.75rem',
                          borderRadius: '6px',
                          fontSize: '0.72rem',
                          fontWeight: 600,
                          background: sensitivity === mode.key ? 'rgba(56, 189, 248, 0.22)' : 'transparent',
                          color: sensitivity === mode.key ? '#38bdf8' : 'var(--text-muted)',
                          border: sensitivity === mode.key ? '1px solid rgba(56, 189, 248, 0.45)' : '1px solid transparent'
                        }}
                      >
                        {mode.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Analyze Action Button */}
                <button
                  onClick={runDetection}
                  disabled={isAnalyzing || (!selectedFile && !audioPreviewUrl)}
                  style={{
                    padding: '0.95rem 1.5rem',
                    borderRadius: '12px',
                    background: (!selectedFile && !audioPreviewUrl)
                      ? 'rgba(30, 41, 59, 0.5)'
                      : 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
                    color: (!selectedFile && !audioPreviewUrl) ? 'var(--text-dim)' : '#ffffff',
                    fontSize: '0.96rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.6rem',
                    boxShadow: (!selectedFile && !audioPreviewUrl)
                      ? 'none'
                      : '0 8px 25px -5px rgba(2, 132, 199, 0.5)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    cursor: (!selectedFile && !audioPreviewUrl || isAnalyzing) ? 'not-allowed' : 'pointer'
                  }}
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCw size={18} className="animate-spin" />
                      <span>Extracting Acoustic Features...</span>
                    </>
                  ) : (
                    <>
                      <Zap size={18} />
                      <span>Execute Deepfake Voice Detection</span>
                    </>
                  )}
                </button>

                {/* Progress Bar during analysis */}
                {isAnalyzing && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#38bdf8' }}>
                      <span>{analysisStatusText}</span>
                      <span>{analysisProgress}%</span>
                    </div>
                    <div style={{
                      height: '6px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '3px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${analysisProgress}%`,
                        height: '100%',
                        background: 'linear-gradient(90deg, #38bdf8, #8b5cf6)',
                        transition: 'width 0.2s ease'
                      }} />
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Active Verdict Hero Card (if result available) */}
              {currentResult && (
                <div style={{
                  background: currentResult.verdict === 'AUTHENTIC'
                    ? 'linear-gradient(145deg, rgba(6, 78, 59, 0.4) 0%, rgba(15, 23, 42, 0.85) 100%)'
                    : 'linear-gradient(145deg, rgba(127, 29, 29, 0.4) 0%, rgba(15, 23, 42, 0.85) 100%)',
                  border: currentResult.verdict === 'AUTHENTIC'
                    ? '1px solid rgba(16, 185, 129, 0.4)'
                    : '1px solid rgba(239, 68, 68, 0.4)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.8rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.25rem',
                  boxShadow: currentResult.verdict === 'AUTHENTIC'
                    ? '0 15px 35px -10px rgba(16, 185, 129, 0.25)'
                    : '0 15px 35px -10px rgba(239, 68, 68, 0.25)'
                }}>
                  {/* Verdict Badge & Header */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.45rem 1rem',
                      borderRadius: '30px',
                      background: currentResult.verdict === 'AUTHENTIC' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                      border: currentResult.verdict === 'AUTHENTIC' ? '1px solid rgba(16, 185, 129, 0.5)' : '1px solid rgba(239, 68, 68, 0.5)',
                      color: currentResult.verdict === 'AUTHENTIC' ? '#34d399' : '#f87171',
                      fontSize: '0.86rem',
                      fontWeight: 800,
                      letterSpacing: '0.04em'
                    }}>
                      {currentResult.verdict === 'AUTHENTIC' ? <ShieldCheck size={18} /> : <ShieldAlert size={18} />}
                      <span>{currentResult.verdict === 'AUTHENTIC' ? 'AUTHENTIC HUMAN SPEECH' : 'DEEPFAKE DETECTED'}</span>
                    </div>

                    <div style={{
                      fontSize: '0.76rem',
                      color: 'var(--text-dim)',
                      fontFamily: 'var(--font-mono)'
                    }}>
                      Latency: <strong style={{ color: '#38bdf8' }}>{currentResult.processing_time_ms} ms</strong>
                    </div>
                  </div>

                  {/* Confidence Gauge */}
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem' }}>
                    <div style={{
                      fontSize: '3.2rem',
                      fontWeight: 800,
                      fontFamily: 'var(--font-mono)',
                      lineHeight: 1,
                      color: currentResult.verdict === 'AUTHENTIC' ? '#10b981' : '#ef4444'
                    }}>
                      {currentResult.confidence}%
                    </div>
                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#f8fafc' }}>
                        Confidence Score
                      </div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                        Risk Index: <strong style={{ color: currentResult.risk_level === 'LOW' ? '#10b981' : '#f87171' }}>{currentResult.risk_level}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Summary Diagnosis */}
                  <p style={{
                    fontSize: '0.88rem',
                    color: '#e2e8f0',
                    lineHeight: 1.5,
                    background: 'rgba(0, 0, 0, 0.25)',
                    padding: '0.9rem',
                    borderRadius: '10px',
                    borderLeft: `3px solid ${currentResult.verdict === 'AUTHENTIC' ? '#10b981' : '#ef4444'}`
                  }}>
                    {currentResult.summary_statement}
                  </p>

                  {/* Explainable AI (XAI) Findings */}
                  <div>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Acoustic Forensic Evidence:
                    </span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', marginTop: '0.5rem' }}>
                      {currentResult.findings && currentResult.findings.map((f, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.8rem', color: '#cbd5e1' }}>
                          <div style={{
                            width: '5px',
                            height: '5px',
                            borderRadius: '50%',
                            background: currentResult.verdict === 'AUTHENTIC' ? '#10b981' : '#ef4444',
                            marginTop: '6px'
                          }} />
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Export Report Action */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginTop: 'auto', paddingTop: '0.6rem' }}>
                    <button
                      onClick={handleExportReport}
                      style={{
                        padding: '0.6rem 1.1rem',
                        borderRadius: '8px',
                        background: 'rgba(56, 189, 248, 0.15)',
                        border: '1px solid rgba(56, 189, 248, 0.35)',
                        color: '#38bdf8',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem'
                      }}
                    >
                      <Download size={14} />
                      <span>Download JSON Forensic Audit</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Visualizer & Forensic Metrics Section (Rendered below when scan is available) */}
            {currentResult && (
              <div
                className="analytics-grid"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 460px), 1fr))',
                  gap: '1.5rem'
                }}
              >
                <SpectrogramHeatmap
                  spectrogramMatrix={currentResult.spectrogram_matrix}
                  rawMfcc={currentResult.raw_mfcc_coefficients}
                />
                <MetricsRadar
                  metrics={currentResult.metrics}
                  vocoderArtifactIndex={currentResult.vocoder_artifact_index}
                />
              </div>
            )}
          </div>
        )}

        {/* TAB 2: TEST SAMPLES */}
        {activeTab === 'samples' && (
          <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#f8fafc' }}>
                Pre-Configured Audio Benchmark Suite
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                Quickly test real vs. synthetic speech samples without needing to prepare audio files.
              </p>
            </div>

            <div
              className="samples-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
                gap: '1.2rem'
              }}
            >
              {sampleList.map((sample) => (
                <div
                  key={sample.id}
                  style={{
                    background: 'rgba(15, 23, 42, 0.75)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '1.4rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{
                      padding: '0.2rem 0.6rem',
                      borderRadius: '6px',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      background: sample.badge_type === 'authentic' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                      color: sample.badge_type === 'authentic' ? '#34d399' : '#f87171',
                      border: sample.badge_type === 'authentic' ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)'
                    }}>
                      {sample.badge}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                      16kHz WAV
                    </span>
                  </div>

                  <div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc' }}>
                      {sample.title}
                    </h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.35rem', lineHeight: 1.4 }}>
                      {sample.description}
                    </p>
                  </div>

                  {/* Embedded Player */}
                  <audio controls src={sample.audio_url} style={{ width: '100%', height: '36px', marginTop: 'auto' }} />

                  <button
                    onClick={() => runSampleAnalysis(sample)}
                    style={{
                      padding: '0.75rem',
                      borderRadius: '10px',
                      background: 'linear-gradient(135deg, #0284c7, #2563eb)',
                      color: '#ffffff',
                      fontSize: '0.86rem',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      boxShadow: '0 4px 15px rgba(2, 132, 199, 0.35)'
                    }}
                  >
                    <Zap size={16} />
                    <span>Run Full Forensic Analysis</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: PPT SLIDES & ARCHITECTURE */}
        {activeTab === 'presentation' && (
          <PresentationDeck />
        )}

        {/* TAB 4: AUDIT LOG */}
        {activeTab === 'history' && (
          <AuditHistory
            history={historyList}
            onSelectRecord={(rec) => {
              setCurrentResult(rec);
              setAudioTitle(rec.filename);
              setAudioPreviewUrl(rec.file_url);
              setActiveTab('studio');
            }}
            onClearHistory={handleClearHistory}
          />
        )}
      </main>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border-subtle)',
        background: 'rgba(7, 9, 14, 0.9)',
        padding: '1.5rem',
        marginTop: '3rem'
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          fontSize: '0.8rem',
          color: 'var(--text-dim)'
        }}>
          <div>
            <strong>Deepfake Voice Detection System</strong> • Mini Project Review – I
            <div style={{ marginTop: '0.15rem' }}>
              Team: Mohamed Yuhan, Akramullah, Mohammed Afeef, Abdul Rahman Basha, G Ameer Hasan | Department of Computer Science & Engineering, CAHCET
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <span>Backend: Django 3.2 + Librosa 0.10</span>
            <span>•</span>
            <span>Frontend: React + Vite</span>
            <span>•</span>
            <span>Benchmark: ASVspoof 2019</span>
          </div>
        </div>
      </footer>

      {/* Backend Configuration & Ping Modal */}
      <BackendConfigModal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        currentUrl={apiUrl}
        onSaveUrl={handleSaveApiUrl}
        backendStatus={backendStatus}
      />
    </div>
  );
}

