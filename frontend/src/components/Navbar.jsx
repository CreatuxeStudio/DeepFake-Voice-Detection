import React from 'react';
import { ShieldCheck, Activity, Radio, FileText, History, Cpu } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, statusOnline = true }) {
  return (
    <header style={{
      borderBottom: '1px solid var(--border-subtle)',
      background: 'rgba(7, 9, 14, 0.85)',
      backdropFilter: 'blur(20px)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      padding: '0.85rem 1.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '1rem',
      flexWrap: 'wrap'
    }}>
      {/* Brand & Project Info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
        <div style={{
          width: '42px',
          height: '42px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(139, 92, 246, 0.25))',
          border: '1px solid rgba(56, 189, 248, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#38bdf8',
          boxShadow: '0 0 20px rgba(56, 189, 248, 0.25)'
        }}>
          <ShieldCheck size={24} />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.18rem',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              background: 'linear-gradient(90deg, #f8fafc, #38bdf8)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              VOICE FORENSICS AI
            </span>
            <span style={{
              fontSize: '0.68rem',
              fontWeight: 600,
              padding: '0.15rem 0.45rem',
              borderRadius: '6px',
              background: 'rgba(56, 189, 248, 0.1)',
              color: '#38bdf8',
              border: '1px solid rgba(56, 189, 248, 0.25)'
            }}>
              PROTOTYPE v1.0
            </span>
          </div>
          <div className="nav-subtitle" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Deepfake Voice Detection System • CAHCET CSE Mini Project Review – I
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <nav style={{
        display: 'flex',
        alignItems: 'center',
        background: 'rgba(15, 23, 42, 0.8)',
        padding: '0.25rem',
        borderRadius: '12px',
        border: '1px solid var(--border-subtle)',
        gap: '0.25rem'
      }}>
        <button
          onClick={() => setActiveTab('studio')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.5rem 0.95rem',
            borderRadius: '9px',
            fontSize: '0.84rem',
            fontWeight: 600,
            background: activeTab === 'studio' ? 'linear-gradient(135deg, #0284c7, #2563eb)' : 'transparent',
            color: activeTab === 'studio' ? '#ffffff' : 'var(--text-muted)',
            boxShadow: activeTab === 'studio' ? '0 4px 15px rgba(2, 132, 199, 0.35)' : 'none'
          }}
        >
          <Activity size={16} />
          <span>Forensic Studio</span>
        </button>

        <button
          onClick={() => setActiveTab('samples')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.5rem 0.95rem',
            borderRadius: '9px',
            fontSize: '0.84rem',
            fontWeight: 600,
            background: activeTab === 'samples' ? 'linear-gradient(135deg, #0284c7, #2563eb)' : 'transparent',
            color: activeTab === 'samples' ? '#ffffff' : 'var(--text-muted)',
            boxShadow: activeTab === 'samples' ? '0 4px 15px rgba(2, 132, 199, 0.35)' : 'none'
          }}
        >
          <Radio size={16} />
          <span>Test Samples</span>
        </button>

        <button
          onClick={() => setActiveTab('presentation')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.5rem 0.95rem',
            borderRadius: '9px',
            fontSize: '0.84rem',
            fontWeight: 600,
            background: activeTab === 'presentation' ? 'linear-gradient(135deg, #0284c7, #2563eb)' : 'transparent',
            color: activeTab === 'presentation' ? '#ffffff' : 'var(--text-muted)',
            boxShadow: activeTab === 'presentation' ? '0 4px 15px rgba(2, 132, 199, 0.35)' : 'none'
          }}
        >
          <FileText size={16} />
          <span>PPT Slides & Architecture</span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.5rem 0.95rem',
            borderRadius: '9px',
            fontSize: '0.84rem',
            fontWeight: 600,
            background: activeTab === 'history' ? 'linear-gradient(135deg, #0284c7, #2563eb)' : 'transparent',
            color: activeTab === 'history' ? '#ffffff' : 'var(--text-muted)',
            boxShadow: activeTab === 'history' ? '0 4px 15px rgba(2, 132, 199, 0.35)' : 'none'
          }}
        >
          <History size={16} />
          <span>Audit Log</span>
        </button>
      </nav>

      {/* Backend & Model Status Indicator */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.6rem',
        padding: '0.4rem 0.85rem',
        background: 'rgba(16, 185, 129, 0.08)',
        border: '1px solid rgba(16, 185, 129, 0.3)',
        borderRadius: '20px',
        fontSize: '0.75rem',
        color: '#34d399'
      }}>
        <div style={{
          width: '7px',
          height: '7px',
          borderRadius: '50%',
          background: '#10b981',
          boxShadow: '0 0 10px #10b981'
        }} />
        <span style={{ fontWeight: 600 }}>Django + Librosa 0.10: READY</span>
      </div>
    </header>
  );
}
