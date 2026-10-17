import React from 'react';
import { History, Trash2, CheckCircle2, AlertTriangle, ArrowUpRight, Clock, Shield } from 'lucide-react';

export default function AuditHistory({ history = [], onSelectRecord, onClearHistory }) {
  return (
    <div style={{
      maxWidth: '1000px',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.25rem'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.8rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <History size={20} color="#38bdf8" />
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc' }}>
            Forensic Audit Log & Verification History
          </h2>
        </div>

        {history && history.length > 0 && (
          <button
            onClick={onClearHistory}
            style={{
              padding: '0.45rem 0.95rem',
              borderRadius: '8px',
              background: 'rgba(239, 68, 68, 0.1)',
              color: '#f87171',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              fontSize: '0.78rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <Trash2 size={14} />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {(!history || history.length === 0) ? (
        <div style={{
          background: 'rgba(15, 23, 42, 0.6)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '3rem 2rem',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.8rem'
        }}>
          <Shield size={36} color="var(--text-dim)" />
          <h4 style={{ color: '#e2e8f0', fontSize: '1.05rem' }}>No Scans Logged Yet</h4>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.84rem', maxWidth: '420px' }}>
            Upload an audio clip or analyze one of the preset benchmark samples to generate forensic reports.
          </p>
        </div>
      ) : (
        <div style={{
          background: 'rgba(15, 23, 42, 0.75)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden'
        }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.84rem' }}>
              <thead>
                <tr style={{
                  background: 'rgba(10, 16, 30, 0.8)',
                  borderBottom: '1px solid var(--border-subtle)',
                  color: 'var(--text-muted)'
                }}>
                  <th style={{ padding: '0.9rem 1.2rem', fontWeight: 600 }}>Audio Source</th>
                  <th style={{ padding: '0.9rem 1.2rem', fontWeight: 600 }}>Verdict</th>
                  <th style={{ padding: '0.9rem 1.2rem', fontWeight: 600 }}>Confidence</th>
                  <th style={{ padding: '0.9rem 1.2rem', fontWeight: 600 }}>Duration</th>
                  <th style={{ padding: '0.9rem 1.2rem', fontWeight: 600 }}>Timestamp</th>
                  <th style={{ padding: '0.9rem 1.2rem', fontWeight: 600, textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {history.map((record) => {
                  const isAuth = record.verdict === 'AUTHENTIC';
                  return (
                    <tr
                      key={record.id}
                      style={{
                        borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                        transition: 'background 0.15s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(30, 41, 59, 0.4)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <td style={{ padding: '0.9rem 1.2rem', color: '#f8fafc', fontWeight: 600 }}>
                        {record.filename}
                      </td>

                      <td style={{ padding: '0.9rem 1.2rem' }}>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          padding: '0.25rem 0.65rem',
                          borderRadius: '20px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          background: isAuth ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                          color: isAuth ? '#10b981' : '#f87171',
                          border: isAuth ? '1px solid rgba(16, 185, 129, 0.35)' : '1px solid rgba(239, 68, 68, 0.35)'
                        }}>
                          {isAuth ? <CheckCircle2 size={13} /> : <AlertTriangle size={13} />}
                          <span>{record.verdict}</span>
                        </span>
                      </td>

                      <td style={{ padding: '0.9rem 1.2rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: isAuth ? '#34d399' : '#f87171' }}>
                        {record.confidence}%
                      </td>

                      <td style={{ padding: '0.9rem 1.2rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                        {record.duration}s
                      </td>

                      <td style={{ padding: '0.9rem 1.2rem', color: 'var(--text-dim)', fontSize: '0.78rem' }}>
                        {record.created_at}
                      </td>

                      <td style={{ padding: '0.9rem 1.2rem', textAlign: 'right' }}>
                        <button
                          onClick={() => onSelectRecord(record)}
                          style={{
                            padding: '0.35rem 0.75rem',
                            borderRadius: '6px',
                            background: 'rgba(56, 189, 248, 0.12)',
                            color: '#38bdf8',
                            border: '1px solid rgba(56, 189, 248, 0.3)',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.25rem'
                          }}
                        >
                          <span>Inspect</span>
                          <ArrowUpRight size={13} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
