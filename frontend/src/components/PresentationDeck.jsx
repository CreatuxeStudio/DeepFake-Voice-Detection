import React, { useState } from 'react';
import { 
  ChevronLeft, ChevronRight, Presentation, CheckCircle2, AlertOctagon, 
  Layers, ArrowRight, Shield, Award, Users, BookOpen, Terminal, Sparkles
} from 'lucide-react';

const SLIDES = [
  {
    number: 1,
    title: "MINI PROJECT REVIEW – I",
    subtitle: "Deepfake Voice Detection System",
    tagline: "Identifying AI-Cloned and Synthetic Audio Using Machine Learning",
    content: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', textAlign: 'center', alignItems: 'center' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.6rem',
          padding: '0.4rem 1rem',
          borderRadius: '20px',
          background: 'rgba(56, 189, 248, 0.1)',
          border: '1px solid rgba(56, 189, 248, 0.3)',
          color: '#38bdf8',
          fontSize: '0.82rem',
          fontWeight: 600
        }}>
          <Sparkles size={16} />
          <span>Department of Computer Science and Engineering</span>
        </div>

        <h1 style={{
          fontSize: '2.4rem',
          fontWeight: 800,
          background: 'linear-gradient(135deg, #ffffff 30%, #38bdf8 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          lineHeight: 1.2
        }}>
          Deepfake Voice Detection System
        </h1>
        <p style={{ fontSize: '1.1rem', color: '#94a3b8', maxWidth: '650px' }}>
          Identifying AI-Cloned and Synthetic Audio Using Acoustic Forensics & Machine Learning
        </p>

        {/* Team Members Card */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1rem',
          width: '100%',
          maxWidth: '680px',
          marginTop: '1rem'
        }}>
          <div style={{
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '12px',
            padding: '1rem',
            textAlign: 'center'
          }}>
            <div style={{ color: '#38bdf8', fontWeight: 700, fontSize: '0.98rem' }}>Mohamed Yuhan</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Audio Signal Forensics</div>
          </div>
          <div style={{
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '12px',
            padding: '1rem',
            textAlign: 'center'
          }}>
            <div style={{ color: '#a855f7', fontWeight: 700, fontSize: '0.98rem' }}>Akramullah</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ML Classifier & Calibration</div>
          </div>
          <div style={{
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '12px',
            padding: '1rem',
            textAlign: 'center'
          }}>
            <div style={{ color: '#34d399', fontWeight: 700, fontSize: '0.98rem' }}>Mohammed Afeef</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Full-Stack & Dashboard</div>
          </div>
          <div style={{
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '12px',
            padding: '1rem',
            textAlign: 'center'
          }}>
            <div style={{ color: '#f59e0b', fontWeight: 700, fontSize: '0.98rem' }}>Abdul Rahman Basha</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Biometrics & Datasets</div>
          </div>
          <div style={{
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '12px',
            padding: '1rem',
            textAlign: 'center'
          }}>
            <div style={{ color: '#06b6d4', fontWeight: 700, fontSize: '0.98rem' }}>G Ameer Hasan</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Vocoder & Artifact Analysis</div>
          </div>
        </div>

        <div style={{
          fontSize: '0.84rem',
          color: 'var(--text-muted)',
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: '0.8rem',
          width: '100%',
          maxWidth: '680px'
        }}>
          C. Abdul Hakeem College of Engineering & Technology (CAHCET) • Review Date: 07 September 2026
        </div>
      </div>
    )
  },
  {
    number: 2,
    title: "OVERVIEW & ABSTRACT",
    subtitle: "Real vs. AI-Cloned Audio Forensics",
    content: (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{
            background: 'rgba(15, 23, 42, 0.6)',
            padding: '1.2rem',
            borderRadius: '12px',
            border: '1px solid var(--border-subtle)'
          }}>
            <h4 style={{ color: '#38bdf8', marginBottom: '0.5rem', fontSize: '1rem' }}>The Abstract</h4>
            <p style={{ fontSize: '0.88rem', color: '#cbd5e1', lineHeight: 1.6 }}>
              Voice-cloning tools can now recreate a person's voice from just a few seconds of audio. This project analyzes an audio clip and classifies it as <strong>Real (human)</strong> or <strong>Fake (AI-generated)</strong>. Acoustic features — MFCC, spectrogram, and pitch patterns — are extracted from the signal. A trained classifier predicts authenticity and returns a confidence score.
            </p>
          </div>
        </div>

        <div style={{
          background: 'rgba(10, 16, 30, 0.8)',
          padding: '1.2rem',
          borderRadius: '12px',
          border: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.8rem'
        }}>
          <h4 style={{ color: '#a855f7', fontSize: '0.98rem' }}>At a Glance</h4>
          <div style={{ fontSize: '0.84rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <div><strong style={{ color: '#e2e8f0' }}>Domain:</strong> Audio Forensics / AI Security</div>
            <div><strong style={{ color: '#e2e8f0' }}>Core Idea:</strong> Real vs. AI-cloned Voice Classification</div>
            <div><strong style={{ color: '#e2e8f0' }}>Output:</strong> Verdict + Calibrated Confidence Score</div>
            <div><strong style={{ color: '#e2e8f0' }}>Core Stack:</strong> Python, Librosa, Django, React, Scikit-learn</div>
          </div>
        </div>
      </div>
    )
  },
  {
    number: 3,
    title: "THE CHALLENGE",
    subtitle: "Problem Statement",
    content: (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        {[
          { num: "01", title: "Voice Cloning Is Easy", text: "Modern generative AI tools can mimic any voice from just 3-5 seconds of sample audio." },
          { num: "02", title: "Used in Real Scams", text: "Cloned voices power CEO fraud, family emergency extortion calls, and banking impersonation." },
          { num: "03", title: "Undetectable by Ear", text: "Human hearing cannot reliably perceive phase inconsistencies or vocoder artifacts." },
          { num: "04", title: "No Content Checks", text: "Traditional telecom verification only checks caller ID, not whether the voice audio itself is synthetic." }
        ].map((item, idx) => (
          <div key={idx} style={{
            background: 'rgba(15, 23, 42, 0.7)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '12px',
            padding: '1.2rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
          }}>
            <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f87171', fontFamily: 'var(--font-mono)' }}>
              {item.num}
            </span>
            <h4 style={{ fontSize: '0.95rem', color: '#f8fafc' }}>{item.title}</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{item.text}</p>
          </div>
        ))}
      </div>
    )
  },
  {
    number: 4,
    title: "GOALS & OBJECTIVES",
    subtitle: "Key Deliverables",
    content: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
        {[
          "Classify an audio clip as Real or Fake (AI-generated) with high accuracy (>90%).",
          "Extract acoustic features that reliably distinguish natural from synthetic speech (MFCC, Spectrogram, Pitch Jitter).",
          "Train and calibrate classifiers on labeled voice datasets (ASVspoof benchmark standards).",
          "Return a fine-grained confidence score alongside every prediction, not just a black-box label.",
          "Provide an ultra-responsive, professional web interface to upload or record audio with sub-second feedback."
        ].map((obj, i) => (
          <div key={i} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.85rem',
            background: 'rgba(15, 23, 42, 0.6)',
            padding: '0.9rem 1.1rem',
            borderRadius: '10px',
            border: '1px solid var(--border-subtle)'
          }}>
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: 'rgba(56, 189, 248, 0.15)',
              color: '#38bdf8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '0.8rem'
            }}>
              {i + 1}
            </div>
            <span style={{ fontSize: '0.88rem', color: '#e2e8f0' }}>{obj}</span>
          </div>
        ))}
      </div>
    )
  },
  {
    number: 5,
    title: "CURRENT PRACTICE VS. LIMITATIONS",
    subtitle: "Existing Systems Analysis",
    content: (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
        {[
          { title: "Manual Judgment", desc: "Listener tries to detect fakes by ear — highly unreliable and vulnerable to emotional bias." },
          { title: "Caller ID Verification", desc: "Confirms only the phone number origin (easily spoofed via SIP trunking), not voice authenticity." },
          { title: "Audio Watermarking", desc: "Only detects synthetic audio if the creator voluntarily embedded an encrypted watermark." },
          { title: "Platform Moderation", desc: "Social platforms flag deepfakes post-upload; completely ineffective during live telephone calls." }
        ].map((sys, idx) => (
          <div key={idx} style={{
            background: 'rgba(15, 23, 42, 0.7)',
            padding: '1.2rem',
            borderRadius: '12px',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.4rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f87171' }}>
              <AlertOctagon size={16} />
              <h4 style={{ fontSize: '0.92rem' }}>{sys.title}</h4>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>{sys.desc}</p>
          </div>
        ))}
      </div>
    )
  },
  {
    number: 6,
    title: "OUR PROPOSED SOLUTION",
    subtitle: "Forensic Content-Based Architecture",
    content: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
        <p style={{ fontSize: '0.92rem', color: '#cbd5e1', lineHeight: 1.6 }}>
          An automated system analyzing the intrinsic biomechanics of speech rather than metadata. Preprocesses audio, extracts multidimensional acoustic features, and executes calibrated classifiers.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.8rem' }}>
          {["Fast (<2s)", "Explainable", "Lightweight", "Offline-Capable", "Content-Based"].map((badge, idx) => (
            <div key={idx} style={{
              background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.15), rgba(59, 130, 246, 0.15))',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              borderRadius: '10px',
              padding: '0.8rem',
              textAlign: 'center',
              fontWeight: 700,
              fontSize: '0.86rem',
              color: '#38bdf8'
            }}>
              {badge}
            </div>
          ))}
        </div>
      </div>
    )
  },
  {
    number: 7,
    title: "SYSTEM BREAKDOWN: 5 CORE MODULES",
    subtitle: "Modular Architecture",
    content: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
        {[
          { id: "01", name: "Audio Input & Preprocessing", desc: "Accepts file upload (WAV/MP3) or live microphone stream; denoises, normalizes amplitude, and frames." },
          { id: "02", name: "Feature Extraction", desc: "Computes 13-band MFCCs, Mel-Spectrogram matrix, F0 pitch jitter contour, and spectral roll-off." },
          { id: "03", name: "Model Training & Calibration", desc: "Trained on ASVspoof-aligned synthetic speech distributions using CNN / SVM classifiers." },
          { id: "04", name: "Detection Engine", desc: "Runs audio through forensic feature pipeline, evaluating vocoder cutoff and harmonic integrity." },
          { id: "05", name: "Result Dashboard & XAI", desc: "Displays instant Real/Fake verdict, confidence percentage, interactive waveform player, and spectrogram." }
        ].map((m, idx) => (
          <div key={idx} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            background: 'rgba(15, 23, 42, 0.7)',
            padding: '0.8rem 1.1rem',
            borderRadius: '10px',
            border: '1px solid var(--border-subtle)'
          }}>
            <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>
              {m.id}
            </span>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#f8fafc' }}>{m.name}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{m.desc}</div>
            </div>
          </div>
        ))}
      </div>
    )
  },
  {
    number: 8,
    title: "SYSTEM DESIGN: ARCHITECTURE FLOW",
    subtitle: "Block Diagram & Audio Data Flow",
    content: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.8rem',
          flexWrap: 'wrap',
          width: '100%'
        }}>
          {[
            { label: "Audio Input", sub: "WAV / MP3 / Mic", color: "#38bdf8" },
            { label: "Preprocessing", sub: "Denoise & Normalize", color: "#06b6d4" },
            { label: "Feature Extraction", sub: "MFCC, F0, Spectrogram", color: "#a855f7" },
            { label: "Trained Classifier", sub: "Acoustic ML Model", color: "#ec4899" },
            { label: "Result Dashboard", sub: "Verdict + XAI Report", color: "#10b981" }
          ].map((step, idx) => (
            <React.Fragment key={idx}>
              <div style={{
                background: 'rgba(15, 23, 42, 0.85)',
                border: `1px solid ${step.color}66`,
                boxShadow: `0 0 15px ${step.color}22`,
                borderRadius: '12px',
                padding: '0.9rem 1.2rem',
                textAlign: 'center',
                minWidth: '130px'
              }}>
                <div style={{ fontWeight: 700, fontSize: '0.88rem', color: step.color }}>{step.label}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{step.sub}</div>
              </div>
              {idx < 4 && (
                <ArrowRight size={18} color="var(--text-dim)" />
              )}
            </React.Fragment>
          ))}
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '1rem',
          width: '100%',
          maxWidth: '560px'
        }}>
          <div style={{
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.35)',
            borderRadius: '10px',
            padding: '0.8rem',
            textAlign: 'center',
            color: '#10b981',
            fontSize: '0.84rem',
            fontWeight: 600
          }}>
            Authentic Voice → Mark as Genuine (Low Risk)
          </div>
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.35)',
            borderRadius: '10px',
            padding: '0.8rem',
            textAlign: 'center',
            color: '#ef4444',
            fontSize: '0.84rem',
            fontWeight: 600
          }}>
            Fake Voice → Flag as AI-Generated (High Risk)
          </div>
        </div>
      </div>
    )
  },
  {
    number: 9,
    title: "WHAT WE EXPECT & RESULTS",
    subtitle: "Project Performance Benchmarks",
    content: (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        {[
          { label: "~90-95%", desc: "Classification Accuracy on test benchmark sets", color: "#10b981" },
          { label: "< 2.0 sec", desc: "Detection turnaround time per speech clip", color: "#38bdf8" },
          { label: "100%", desc: "Predictions accompanied by calibrated confidence score", color: "#a855f7" },
          { label: "Explainable", desc: "Detailed acoustic evidence summary, not a black-box label", color: "#f59e0b" }
        ].map((b, idx) => (
          <div key={idx} style={{
            background: 'rgba(15, 23, 42, 0.75)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '12px',
            padding: '1.3rem',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.4rem'
          }}>
            <div style={{ fontSize: '1.9rem', fontWeight: 800, color: b.color, fontFamily: 'var(--font-mono)' }}>
              {b.label}
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
              {b.desc}
            </p>
          </div>
        ))}
      </div>
    )
  },
  {
    number: 10,
    title: "WHAT'S NEXT & FUTURE SCOPE",
    subtitle: "Commercial & Research Roadmap",
    content: (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
        {[
          { title: "Live Call & VoIP Detection", desc: "Real-time acoustic stream processing for active phone and WhatsApp calls." },
          { title: "Browser Extension", desc: "Auto-scan podcasts, YouTube videos, and news clips directly in the browser." },
          { title: "Cross-Lingual Robustness", desc: "Calibration across regional languages and accents." },
          { title: "Banking API Gateway", desc: "Zero-trust integration into banking call centers and voice biometric authentication." }
        ].map((f, idx) => (
          <div key={idx} style={{
            background: 'rgba(15, 23, 42, 0.65)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '12px',
            padding: '1.1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.35rem'
          }}>
            <h4 style={{ fontSize: '0.9rem', color: '#38bdf8' }}>{f.title}</h4>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>{f.desc}</p>
          </div>
        ))}
      </div>
    )
  },
  {
    number: 11,
    title: "REFERENCES & CITATIONS",
    subtitle: "Scientific Literature & Frameworks",
    content: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
        {[
          "[1] Librosa Documentation — Audio and Music Signal Processing in Python (https://librosa.org)",
          "[2] ASVspoof Challenge: Automatic Speaker Verification Spoofing and Countermeasures (https://www.asvspoof.org)",
          "[3] M. Todisco et al., 'ASVspoof 2019: Future Horizons in Spoofed and Fake Audio Detection', Interspeech 2019.",
          "[4] Scikit-learn: Machine Learning in Python — Pedregosa et al., JMLR 2011.",
          "[5] IEEE Xplore: State-of-the-art in Audio Deepfake Detection and Neural Vocoder Forensics."
        ].map((ref, idx) => (
          <div key={idx} style={{
            background: 'rgba(10, 16, 30, 0.6)',
            padding: '0.8rem 1rem',
            borderRadius: '8px',
            border: '1px solid var(--border-subtle)',
            fontSize: '0.8rem',
            color: '#94a3b8',
            fontFamily: 'var(--font-mono)'
          }}>
            {ref}
          </div>
        ))}
      </div>
    )
  }
];

export default function PresentationDeck() {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const slide = SLIDES[currentSlideIndex];

  const goNext = () => {
    if (currentSlideIndex < SLIDES.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    }
  };

  const goPrev = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
    }
  };

  return (
    <div style={{
      maxWidth: '1000px',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.25rem'
    }}>
      {/* Header bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Presentation size={20} color="#38bdf8" />
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc' }}>
            Project Review I — Presentation Deck
          </h2>
        </div>
        <div style={{ fontSize: '0.82rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
          Slide <strong style={{ color: '#38bdf8' }}>{currentSlideIndex + 1}</strong> of {SLIDES.length}
        </div>
      </div>

      {/* Main Slide Stage */}
      <div style={{
        background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.9) 0%, rgba(10, 15, 29, 0.95) 100%)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-xl)',
        padding: '2.4rem',
        minHeight: '440px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.7)',
        position: 'relative'
      }}>
        {/* Slide Title Banner */}
        <div style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '0.74rem', color: '#38bdf8', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            {slide.subtitle}
          </div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f8fafc', marginTop: '0.2rem' }}>
            {slide.title}
          </h3>
        </div>

        {/* Slide Body */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          {slide.content}
        </div>

        {/* Slide Controls Bar */}
        <div style={{
          marginTop: '2rem',
          paddingTop: '1rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <button
            onClick={goPrev}
            disabled={currentSlideIndex === 0}
            style={{
              padding: '0.55rem 1.1rem',
              borderRadius: '8px',
              background: currentSlideIndex === 0 ? 'rgba(30, 41, 59, 0.3)' : 'rgba(30, 41, 59, 0.8)',
              color: currentSlideIndex === 0 ? 'var(--text-dim)' : 'var(--text-main)',
              fontSize: '0.84rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              border: '1px solid var(--border-subtle)',
              cursor: currentSlideIndex === 0 ? 'not-allowed' : 'pointer'
            }}
          >
            <ChevronLeft size={16} />
            <span>Previous</span>
          </button>

          {/* Quick Dots / Pips */}
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            {SLIDES.map((_, idx) => (
              <div
                key={idx}
                onClick={() => setCurrentSlideIndex(idx)}
                style={{
                  width: idx === currentSlideIndex ? '20px' : '7px',
                  height: '7px',
                  borderRadius: '4px',
                  background: idx === currentSlideIndex ? '#38bdf8' : 'rgba(148, 163, 184, 0.3)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              />
            ))}
          </div>

          <button
            onClick={goNext}
            disabled={currentSlideIndex === SLIDES.length - 1}
            style={{
              padding: '0.55rem 1.1rem',
              borderRadius: '8px',
              background: currentSlideIndex === SLIDES.length - 1 ? 'rgba(30, 41, 59, 0.3)' : 'linear-gradient(135deg, #0284c7, #2563eb)',
              color: '#ffffff',
              fontSize: '0.84rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              cursor: currentSlideIndex === SLIDES.length - 1 ? 'not-allowed' : 'pointer'
            }}
          >
            <span>Next Slide</span>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
