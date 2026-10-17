import React, { useState } from 'react';
import { Eye, Info, BarChart2 } from 'lucide-react';

export default function SpectrogramHeatmap({ spectrogramMatrix = [], rawMfcc = [] }) {
  const [hoveredCell, setHoveredCell] = useState(null);

  // If spectrogramMatrix is empty, generate an aesthetic demo matrix
  const matrix = (spectrogramMatrix && spectrogramMatrix.length > 0)
    ? spectrogramMatrix
    : Array.from({ length: 24 }, (_, row) =>
        Array.from({ length: 50 }, (_, col) => {
          const freqFactor = Math.exp(-row / 8);
          const timeFactor = 0.5 + 0.5 * Math.sin(col * 0.2);
          return Math.max(0, Math.min(1, freqFactor * timeFactor + Math.random() * 0.15));
        })
      );

  const numBands = matrix.length;
  const numTimeFrames = matrix[0] ? matrix[0].length : 0;

  // Thermal plasma colormap function
  const getPlasmaColor = (val) => {
    const v = Math.max(0, Math.min(1, val));
    if (v < 0.2) {
      // Dark navy to deep purple
      const t = v / 0.2;
      return `rgb(${Math.round(10 + t * 40)}, ${Math.round(15 + t * 10)}, ${Math.round(35 + t * 70)})`;
    } else if (v < 0.45) {
      // Purple to cyan/electric blue
      const t = (v - 0.2) / 0.25;
      return `rgb(${Math.round(50 - t * 40)}, ${Math.round(25 + t * 140)}, ${Math.round(105 + t * 110)})`;
    } else if (v < 0.75) {
      // Cyan to bright amber
      const t = (v - 0.45) / 0.3;
      return `rgb(${Math.round(10 + t * 230)}, ${Math.round(165 + t * 25)}, ${Math.round(215 - t * 180)})`;
    } else {
      // Amber to radiant yellow/white
      const t = (v - 0.75) / 0.25;
      return `rgb(${Math.round(240 + t * 15)}, ${Math.round(190 + t * 65)}, ${Math.round(35 + t * 200)})`;
    }
  };

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
      {/* Title & Legend Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.8rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Eye size={18} color="#38bdf8" />
            <h4 style={{ fontSize: '0.96rem', fontWeight: 700, color: '#f8fafc' }}>
              Acoustic Mel-Spectrogram & Energy Distribution
            </h4>
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            Time vs. Mel Frequency Energy Bins (0 Hz to 8000 Hz)
          </p>
        </div>

        {/* Color Scale Legend */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
          <span>-80 dB (Low)</span>
          <div style={{
            width: '90px',
            height: '10px',
            borderRadius: '4px',
            background: 'linear-gradient(90deg, #0a0f23, #2b1055, #0284c7, #f59e0b, #ffffcc)',
            border: '1px solid rgba(255, 255, 255, 0.15)'
          }} />
          <span>0 dB (Peak)</span>
        </div>
      </div>

      {/* Heatmap Grid Container */}
      <div style={{ position: 'relative' }}>
        {/* Vocoder Cutoff Alert Badge */}
        <div style={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          padding: '0.25rem 0.6rem',
          borderRadius: '6px',
          background: 'rgba(239, 68, 68, 0.15)',
          border: '1px solid rgba(239, 68, 68, 0.35)',
          color: '#f87171',
          fontSize: '0.7rem',
          fontWeight: 600,
          zIndex: 4,
          display: 'flex',
          alignItems: 'center',
          gap: '0.35rem'
        }}>
          <Info size={12} />
          <span>Vocoder Critical Boundary (&gt;7.2 kHz)</span>
        </div>

        <div style={{
          display: 'flex',
          gap: '0.6rem',
          background: '#070a12',
          padding: '0.8rem',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.06)'
        }}>
          {/* Frequency Axis Labels */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            fontSize: '0.66rem',
            fontFamily: 'var(--font-mono)',
            color: 'var(--text-dim)',
            paddingBottom: '1.2rem',
            textAlign: 'right',
            userSelect: 'none',
            minWidth: '45px'
          }}>
            <span>8000 Hz</span>
            <span>5500 Hz</span>
            <span>3200 Hz</span>
            <span>1500 Hz</span>
            <span>500 Hz</span>
            <span>80 Hz</span>
          </div>

          {/* Matrix canvas/CSS display */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1px', position: 'relative' }}>
            {/* Upper band boundary line overlay */}
            <div style={{
              position: 'absolute',
              top: '18%',
              left: 0,
              right: 0,
              borderTop: '1px dashed rgba(239, 68, 68, 0.45)',
              pointerEvents: 'none',
              zIndex: 3
            }} />

            {/* Invert rows so highest frequency band is at the top */}
            {[...matrix].reverse().map((row, rowIdx) => (
              <div key={rowIdx} style={{ display: 'flex', gap: '1px', height: '6px' }}>
                {row.map((val, colIdx) => {
                  const origRowIdx = matrix.length - 1 - rowIdx;
                  return (
                    <div
                      key={colIdx}
                      onMouseEnter={() => setHoveredCell({ row: origRowIdx, col: colIdx, val })}
                      onMouseLeave={() => setHoveredCell(null)}
                      style={{
                        flex: 1,
                        background: getPlasmaColor(val),
                        cursor: 'crosshair',
                        transition: 'transform 0.08s ease'
                      }}
                    />
                  );
                })}
              </div>
            ))}

            {/* Time Axis Label */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '0.66rem',
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-dim)',
              marginTop: '0.4rem',
              userSelect: 'none'
            }}>
              <span>0.00s</span>
              <span>Time Progression →</span>
              <span>Duration End</span>
            </div>
          </div>
        </div>

        {/* Hovered cell info readout */}
        <div style={{
          marginTop: '0.5rem',
          fontSize: '0.72rem',
          color: 'var(--text-muted)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontFamily: 'var(--font-mono)'
        }}>
          {hoveredCell ? (
            <span>
              Band: {hoveredCell.row} | Frame: {hoveredCell.col} | Normalized Spectral Density: <strong style={{ color: '#38bdf8' }}>{(hoveredCell.val * 100).toFixed(1)}%</strong>
            </span>
          ) : (
            <span>Hover cursor over frequency tiles for real-time acoustic coordinate readout</span>
          )}
          <span style={{ color: '#94a3b8' }}>STFT n_fft=1024 / Hop=512</span>
        </div>
      </div>

      {/* MFCC 13-Cepstral Coefficients Breakdown */}
      {rawMfcc && rawMfcc.length > 0 && (
        <div style={{
          marginTop: '0.4rem',
          background: 'rgba(10, 16, 30, 0.6)',
          borderRadius: '10px',
          padding: '0.85rem',
          border: '1px solid rgba(255, 255, 255, 0.05)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <BarChart2 size={14} color="#a855f7" />
              <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#e2e8f0' }}>
                MFCC Acoustic Vector (13 Mel-Frequency Cepstral Coefficients)
              </span>
            </div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
              C0 to C12
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '52px' }}>
            {rawMfcc.slice(0, 13).map((val, idx) => {
              // Normalize for bar chart height
              const absVal = Math.abs(val);
              const heightPct = Math.min(100, Math.max(12, (absVal / 80) * 100));
              const isPositive = val >= 0;
              return (
                <div
                  key={idx}
                  title={`C${idx}: ${val}`}
                  style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '2px',
                    height: '100%',
                    justifyContent: 'flex-end'
                  }}
                >
                  <div style={{
                    width: '100%',
                    height: `${heightPct}%`,
                    borderRadius: '2px',
                    background: isPositive
                      ? 'linear-gradient(180deg, #a855f7, #6366f1)'
                      : 'linear-gradient(180deg, #ec4899, #be185d)'
                  }} />
                  <span style={{ fontSize: '0.62rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                    C{idx}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
