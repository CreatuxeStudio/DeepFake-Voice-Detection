import React from 'react';
import { Activity, AlertTriangle, CheckCircle, Zap, Waves, Disc } from 'lucide-react';

export default function MetricsRadar({ metrics = {}, vocoderArtifactIndex = 0 }) {
  const {
    autocorr_voicing_peak = 0.75,
    spectral_flux = 4.8,
    spectral_contrast_db = 21.5,
    pitch_jitter_pct = 1.85,
    f0_fundamental_hz = 155.0,
    spectral_centroid_hz = 2100.0,
    spectral_rolloff_hz = 4600.0,
    zero_crossing_rate = 0.065,
    mfcc_delta_var = 1.85,
    vocoder_hf_ratio = 0.12
  } = metrics;

  const isVoicingNatural = autocorr_voicing_peak >= 0.60;
  const isFluxNatural = spectral_flux >= 0.8 && spectral_flux <= 8.0;
  const isPitchNatural = pitch_jitter_pct >= 0.8 && pitch_jitter_pct <= 4.2;
  const isContrastNatural = spectral_contrast_db >= 19.5;
  const isVocoderClean = vocoderArtifactIndex < 45;

  return (
    <div style={{
      background: 'rgba(15, 23, 42, 0.75)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      padding: '1.4rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.2rem'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Activity size={18} color="#38bdf8" />
          <h4 style={{ fontSize: '0.96rem', fontWeight: 700, color: '#f8fafc' }}>
            Acoustic Biometric & Forensic Metrics
          </h4>
        </div>
        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
          ASVspoof Dual-Domain Forensic Verification
        </span>
      </div>

      {/* Grid of Metric Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
        gap: '0.9rem'
      }}>
        {/* Metric 1: Glottal Voicing Prominence */}
        <div style={{
          background: 'rgba(10, 16, 30, 0.7)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '12px',
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.4rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>Glottal Voicing (R-Peak)</span>
            {isVoicingNatural ? (
              <CheckCircle size={15} color="#10b981" />
            ) : (
              <AlertTriangle size={15} color="#ef4444" />
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem' }}>
            <span style={{
              fontSize: '1.35rem',
              fontWeight: 700,
              fontFamily: 'var(--font-mono)',
              color: isVoicingNatural ? '#10b981' : '#f87171'
            }}>
              {autocorr_voicing_peak}
            </span>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
              (Ref: &gt; 0.60)
            </span>
          </div>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-dim)', lineHeight: 1.3 }}>
            {isVoicingNatural ? 'Strong biological vocal cord periodicity' : 'Degraded glottal resonance or synthesis artifacts'}
          </p>
        </div>

        {/* Metric 2: Spectral Flux Dynamics */}
        <div style={{
          background: 'rgba(10, 16, 30, 0.7)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '12px',
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.4rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>Spectral Flux (Voiced)</span>
            {isFluxNatural ? (
              <CheckCircle size={15} color="#10b981" />
            ) : (
              <AlertTriangle size={15} color="#f59e0b" />
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem' }}>
            <span style={{
              fontSize: '1.35rem',
              fontWeight: 700,
              fontFamily: 'var(--font-mono)',
              color: isFluxNatural ? '#38bdf8' : '#f59e0b'
            }}>
              {spectral_flux}
            </span>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
              (Ref: 1.0 - 8.0)
            </span>
          </div>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-dim)', lineHeight: 1.3 }}>
            {isFluxNatural ? 'Organic articulatory transitions' : 'Rigid static TTS or elevated vocoder noise'}
          </p>
        </div>

        {/* Metric 3: Neural Vocoder Anomaly Index */}
        <div style={{
          background: 'rgba(10, 16, 30, 0.7)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '12px',
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.4rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>Vocoder Artifact Index</span>
            <Zap size={15} color={isVocoderClean ? '#10b981' : '#ef4444'} />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem' }}>
            <span style={{
              fontSize: '1.35rem',
              fontWeight: 700,
              fontFamily: 'var(--font-mono)',
              color: isVocoderClean ? '#10b981' : '#ef4444'
            }}>
              {vocoderArtifactIndex}%
            </span>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Risk Score</span>
          </div>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-dim)', lineHeight: 1.3 }}>
            {isVocoderClean ? 'Low vocoder phase distortion residue' : 'Elevated neural synthesizer artifacts detected'}
          </p>
        </div>

        {/* Metric 4: Spectral Centroid (Timbre Brightness) */}
        <div style={{
          background: 'rgba(10, 16, 30, 0.7)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '12px',
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.4rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>Spectral Centroid</span>
            <Waves size={15} color="#8b5cf6" />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem' }}>
            <span style={{
              fontSize: '1.35rem',
              fontWeight: 700,
              fontFamily: 'var(--font-mono)',
              color: '#c084fc'
            }}>
              {spectral_centroid_hz}
            </span>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Hz</span>
          </div>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-dim)', lineHeight: 1.3 }}>
            Voice brightness & spectral center of mass
          </p>
        </div>

        {/* Metric 5: Fundamental Pitch (F0) */}
        <div style={{
          background: 'rgba(10, 16, 30, 0.7)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '12px',
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.4rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>Fundamental F0 Pitch</span>
            <Disc size={15} color="#38bdf8" />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem' }}>
            <span style={{
              fontSize: '1.35rem',
              fontWeight: 700,
              fontFamily: 'var(--font-mono)',
              color: '#f8fafc'
            }}>
              {f0_fundamental_hz}
            </span>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Hz</span>
          </div>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-dim)', lineHeight: 1.3 }}>
            Mean glottal pulse vibration frequency
          </p>
        </div>

        {/* Metric 6: MFCC Temporal Trajectory Delta */}
        <div style={{
          background: 'rgba(10, 16, 30, 0.7)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '12px',
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.4rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>MFCC Dynamic Variance</span>
            <Activity size={15} color="#06b6d4" />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem' }}>
            <span style={{
              fontSize: '1.35rem',
              fontWeight: 700,
              fontFamily: 'var(--font-mono)',
              color: '#22d3ee'
            }}>
              {mfcc_delta_var}
            </span>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Δ-Var</span>
          </div>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-dim)', lineHeight: 1.3 }}>
            Articulatory transition dynamics across frames
          </p>
        </div>
      </div>
    </div>
  );
}
