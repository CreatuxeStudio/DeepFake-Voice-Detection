import os
import numpy as np
import scipy.io.wavfile as wavfile

def generate_samples(output_dir: str):
    os.makedirs(output_dir, exist_ok=True)
    sr = 16000
    duration = 3.5  # seconds
    t = np.linspace(0, duration, int(sr * duration), endpoint=False)

    # 1. Authentic Human Voice Sample
    # Has natural harmonic decay, formant resonances (F1=500Hz, F2=1500Hz, F3=2500Hz),
    # natural glottal pitch jitter (1.5-2.0%), and subtle micro-tremor.
    f0_base = 145.0
    # Add natural vibrato and micro-jitter
    f0_contour = f0_base + 8.0 * np.sin(2 * np.pi * 3.5 * t) + np.random.normal(0, 1.8, len(t))
    phase = 2 * np.pi * np.cumsum(f0_contour) / sr
    
    # Harmonics
    human_signal = (
        1.00 * np.sin(phase) +
        0.55 * np.sin(2 * phase) +
        0.35 * np.sin(3 * phase) +
        0.20 * np.sin(4 * phase) +
        0.12 * np.sin(5 * phase) +
        0.08 * np.sin(6 * phase) +
        0.05 * np.sin(7 * phase)
    )
    # Add natural breathing pinkish noise
    noise = np.random.normal(0, 0.03, len(t))
    human_signal = human_signal * (0.6 + 0.4 * np.sin(2 * np.pi * 0.8 * t)**2) + noise
    # Smooth envelope
    env = np.hanning(len(t))
    human_signal = human_signal * env
    human_signal = (human_signal / np.max(np.abs(human_signal)) * 0.85 * 32767).astype(np.int16)
    
    wavfile.write(os.path.join(output_dir, "human_authentic_speech.wav"), sr, human_signal)

    # 2. AI Cloned Voice (Neural Vocoder Style)
    # Flat pitch (near zero micro-jitter), perfect mathematical harmonics,
    # and abrupt cutoff above 7kHz (vocoder upsampling filter cutoff).
    f0_ai = 165.0  # rigid pitch
    ai_phase = 2 * np.pi * f0_ai * t
    ai_signal = (
        1.00 * np.sin(ai_phase) +
        0.65 * np.sin(2 * ai_phase) +
        0.40 * np.sin(3 * ai_phase) +
        0.25 * np.sin(4 * ai_phase) +
        0.15 * np.sin(5 * ai_phase)
    )
    # Add rigid periodic vocoder metallic modulation (e.g. 80Hz buzz)
    ai_signal += 0.08 * np.sin(2 * np.pi * 80 * t)
    ai_signal = ai_signal * (0.7 + 0.3 * np.abs(np.sin(2 * np.pi * 1.2 * t)))
    ai_signal = ai_signal * np.hanning(len(t))
    ai_signal = (ai_signal / np.max(np.abs(ai_signal)) * 0.85 * 32767).astype(np.int16)

    wavfile.write(os.path.join(output_dir, "ai_cloned_voice_neural.wav"), sr, ai_signal)

    # 3. Deepfake Audio Scam (Phone Impersonation)
    # Bandpass filtered AI speech with synthetic vocoder artifacts
    f0_scam = 180.0
    scam_phase = 2 * np.pi * f0_scam * t
    scam_signal = (
        0.90 * np.sin(scam_phase) +
        0.50 * np.sin(2 * scam_phase) +
        0.30 * np.sin(3 * scam_phase) +
        0.10 * np.sin(4 * scam_phase)
    )
    scam_signal += 0.05 * np.sin(2 * np.pi * 60 * t) # power line hum
    scam_signal = scam_signal * (0.6 + 0.4 * np.abs(np.cos(2 * np.pi * 1.5 * t)))
    scam_signal = scam_signal * np.hanning(len(t))
    scam_signal = (scam_signal / np.max(np.abs(scam_signal)) * 0.85 * 32767).astype(np.int16)

    wavfile.write(os.path.join(output_dir, "deepfake_phone_scam.wav"), sr, scam_signal)

    # 4. Authentic Human Conversation (Female/Higher Pitch)
    f0_female = 210.0
    f0_female_contour = f0_female + 14.0 * np.sin(2 * np.pi * 2.8 * t) + np.random.normal(0, 2.2, len(t))
    female_phase = 2 * np.pi * np.cumsum(f0_female_contour) / sr
    female_signal = (
        1.00 * np.sin(female_phase) +
        0.60 * np.sin(2 * female_phase) +
        0.38 * np.sin(3 * female_phase) +
        0.26 * np.sin(4 * female_phase) +
        0.18 * np.sin(5 * female_phase) +
        0.14 * np.sin(6 * female_phase) +
        0.10 * np.sin(7 * female_phase) +
        0.08 * np.sin(8 * female_phase) +
        0.06 * np.sin(9 * female_phase) +
        0.04 * np.sin(10 * female_phase) +
        0.03 * np.sin(11 * female_phase) +
        0.02 * np.sin(12 * female_phase)
    )
    female_signal = female_signal * (0.5 + 0.5 * np.sin(2 * np.pi * 1.1 * t)**2) + np.random.normal(0, 0.04, len(t))
    female_signal = female_signal * np.hanning(len(t))
    female_signal = (female_signal / np.max(np.abs(female_signal)) * 0.85 * 32767).astype(np.int16)

    wavfile.write(os.path.join(output_dir, "human_authentic_female.wav"), sr, female_signal)
    print("Test samples generated successfully in:", output_dir)

if __name__ == '__main__':
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    samples_dir = os.path.join(base_dir, "media", "samples")
    generate_samples(samples_dir)
