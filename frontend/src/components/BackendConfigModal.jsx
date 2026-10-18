import React, { useState } from 'react';
import { Server, Wifi, WifiOff, RefreshCw, ExternalLink, CheckCircle2, AlertTriangle, X, Info } from 'lucide-react';

export default function BackendConfigModal({ isOpen, onClose, currentUrl, onSaveUrl, backendStatus, onTestConnection }) {
  const [inputUrl, setInputUrl] = useState(currentUrl || '');
  const [testState, setTestState] = useState(null); // { status: 'testing' | 'success' | 'error', message: string, ping: number }

  if (!isOpen) return null;

  const handleTest = async () => {
    const trimmed = inputUrl.trim().replace(/\/$/, '');
    setTestState({ status: 'testing', message: 'Testing connection to backend...' });
    const startTime = performance.now();

    try {
      const pingUrl = trimmed ? `${trimmed}/api/health/` : '/api/health/';
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000);

      const res = await fetch(pingUrl, { signal: controller.signal });
      clearTimeout(timeoutId);
      const latency = Math.round(performance.now() - startTime);

      if (res.ok) {
        setTestState({
          status: 'success',
          message: `Connected successfully! Response time: ${latency}ms`,
          ping: latency
        });
      } else {
        setTestState({
          status: 'error',
          message: `Backend returned HTTP ${res.status} (${res.statusText})`
        });
      }
    } catch (err) {
      const latency = Math.round(performance.now() - startTime);
      if (err.name === 'AbortError') {
        setTestState({
          status: 'error',
          message: 'Connection timed out (>12s). If Render free tier is sleeping, wait ~60s and try again.'
        });
      } else {
        setTestState({
          status: 'error',
          message: `Connection failed: ${err.message || 'Failed to fetch'}. (Ensure CORS is enabled & URL is https)`
        });
      }
    }
  };

  const handleSave = () => {
    const cleanUrl = inputUrl.trim().replace(/\/$/, '');
    onSaveUrl(cleanUrl);
    onClose();
  };

  const handleReset = () => {
    const defaultUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/$/, '') : '';
    setInputUrl(defaultUrl);
    onSaveUrl(defaultUrl);
    setTestState(null);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(5, 8, 16, 0.75)',
      backdropFilter: 'blur(8px)',
      padding: '1rem'
    }}>
      <div style={{
        background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.98), rgba(10, 16, 30, 0.98))',
        border: '1px solid var(--border-medium)',
        borderRadius: '16px',
        maxWidth: '560px',
        width: '100%',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 40px rgba(56, 189, 248, 0.1)',
        padding: '1.75rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
        animation: 'fadeIn 0.2s ease-out'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'rgba(56, 189, 248, 0.12)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#38bdf8'
            }}>
              <Server size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc' }}>
                Backend API Connection
              </h3>
              <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Configure connection to your Render / Django backend
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              color: 'var(--text-muted)',
              padding: '0.4rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Input Field */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1' }}>
            Render Backend Service URL:
          </label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="url"
              placeholder="https://your-service-name.onrender.com"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              style={{
                flex: 1,
                padding: '0.65rem 0.9rem',
                borderRadius: '8px',
                background: 'rgba(15, 23, 42, 0.9)',
                border: '1px solid var(--border-medium)',
                color: '#f8fafc',
                fontSize: '0.85rem',
                outline: 'none',
                fontFamily: 'monospace'
              }}
            />
            <button
              onClick={handleTest}
              disabled={testState?.status === 'testing'}
              style={{
                padding: '0.65rem 1rem',
                borderRadius: '8px',
                background: 'rgba(56, 189, 248, 0.15)',
                border: '1px solid rgba(56, 189, 248, 0.4)',
                color: '#38bdf8',
                fontSize: '0.82rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              <RefreshCw size={14} className={testState?.status === 'testing' ? 'spin' : ''} />
              <span>{testState?.status === 'testing' ? 'Testing...' : 'Ping Test'}</span>
            </button>
          </div>
          <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
            Leave blank if running locally on localhost:5173 with Vite proxy.
          </span>
        </div>

        {/* Test Result Feedback */}
        {testState && (
          <div style={{
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            background: testState.status === 'success' 
              ? 'rgba(16, 185, 129, 0.12)' 
              : testState.status === 'error' 
                ? 'rgba(239, 68, 68, 0.12)' 
                : 'rgba(56, 189, 248, 0.12)',
            border: `1px solid ${
              testState.status === 'success' 
                ? 'rgba(16, 185, 129, 0.35)' 
                : testState.status === 'error' 
                  ? 'rgba(239, 68, 68, 0.35)' 
                  : 'rgba(56, 189, 248, 0.35)'
            }`,
            color: testState.status === 'success' 
              ? '#34d399' 
              : testState.status === 'error' 
                ? '#f87171' 
                : '#38bdf8',
            fontSize: '0.82rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem'
          }}>
            {testState.status === 'success' && <CheckCircle2 size={16} />}
            {testState.status === 'error' && <AlertTriangle size={16} />}
            {testState.status === 'testing' && <RefreshCw size={16} className="spin" />}
            <span>{testState.message}</span>
          </div>
        )}

        {/* Render Free Tier Info Box */}
        <div style={{
          padding: '0.9rem',
          borderRadius: '10px',
          background: 'rgba(245, 158, 11, 0.08)',
          border: '1px solid rgba(245, 158, 11, 0.25)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          fontSize: '0.78rem',
          color: '#fbbf24'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
            <Info size={16} />
            <span>Why does Render say "Failed to fetch"?</span>
          </div>
          <ul style={{ margin: 0, paddingLeft: '1.2rem', lineHeight: '1.45', color: '#fef3c7' }}>
            <li><strong>Render Free Tier Idle Sleep:</strong> Free instances spin down after 15 minutes of inactivity. The first visit takes <strong>50 to 90 seconds</strong> to boot up!</li>
            <li><strong>Direct Wake-Up:</strong> You can open your Render URL directly in a browser tab to wake it up.</li>
            <li><strong>Netlify Environment Variable:</strong> In Netlify &gt; Site configuration &gt; Environment variables, set <code>VITE_API_URL</code> and re-deploy.</li>
          </ul>
          {inputUrl && (
            <a
              href={inputUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                alignSelf: 'flex-start',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                marginTop: '0.2rem',
                padding: '0.35rem 0.65rem',
                borderRadius: '6px',
                background: 'rgba(245, 158, 11, 0.2)',
                color: '#fef3c7',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '0.75rem'
              }}
            >
              <span>Open Render Backend URL Directly</span>
              <ExternalLink size={12} />
            </a>
          )}
        </div>

        {/* Footer Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.5rem', borderTop: '1px solid var(--border-subtle)' }}>
          <button
            onClick={handleReset}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              fontSize: '0.8rem',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            Reset to Default
          </button>
          <div style={{ display: 'flex', gap: '0.6rem' }}>
            <button
              onClick={onClose}
              style={{
                padding: '0.55rem 1rem',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-subtle)',
                color: '#cbd5e1',
                fontSize: '0.84rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              style={{
                padding: '0.55rem 1.25rem',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #0284c7, #2563eb)',
                border: 'none',
                color: '#ffffff',
                fontSize: '0.84rem',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(2, 132, 199, 0.35)'
              }}
            >
              Save & Connect
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
