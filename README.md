# Deepfake Voice Detection System
### Identifying AI-Cloned and Synthetic Audio Using Machine Learning
**Mini Project Review – I | Department of Computer Science & Engineering | CAHCET**

**Team Members:**
- Mohamed Yuhan (Audio Signal Processing & Feature Extraction)
- Akramullah (Machine Learning Classification & Forensic Models)
- Mohammed Afeef (Full-Stack Architecture & User Experience)
- Abdul Rahman Basha (Acoustic Biometric Verification & Dataset Modeling)
- G Ameer Hasan (Neural Vocoder Detection & Forensic Analysis)

---

## 🚀 Features & Architecture

1. **Acoustic Feature Extraction (`Librosa 0.10` + `FFmpeg`)**:
   - Multi-format support: **WAV, MP3, MPEG, MP4, M4A, OGG, FLAC**.
   - **13 MFCC Coefficients (Mel-Frequency Cepstral Coefficients)** with temporal delta dynamics.
   - **Mel-Spectrogram Matrix (28 bands × 60 time frames)** rendered into interactive thermal plasma heatmaps.
   - **Fundamental Pitch ($F_0$) & Micro-Jitter Perturbation** detection to differentiate biological glottal pulses from synthetic pitch flattening.
   - **Spectral Centroid & 85% Spectral Roll-off** tracking vocal tract brightness and vocoder cutoff frequencies.
   - **Neural Vocoder Artifact Probability Index** detecting high-frequency (>7.2 kHz) energy anomalies.

2. **Backend Engine (`Django 3.2`)**:
   - Audio forensic pipeline executing in **< 1.0 second** (well under the project's < 2.0s target).
   - REST endpoints:
     - `POST /api/detect/` — Upload WAV/MP3/MPEG/MP4/M4A/OGG file for deepfake forensic verification.
     - `GET /api/samples/` — Retrieve pre-configured human & AI voice benchmark audio clips.
     - `POST /api/samples/analyze/` — 1-click execution of benchmark speech audio tests.
     - `GET & DELETE /api/history/` — View and clear forensic verification audit records.
     - `GET /api/project-meta/` — PPT metadata, team information, and system modules.

3. **Frontend Workbench (`React + Vite`)**:
   - **Forensic Studio**: Upload audio file, record microphone live with dynamic waveform canvas visualizer, or choose presets.
   - **Hero Verdict Card**: Glowing Authentic (Real Human) vs Deepfake (AI-Generated / Cloned) badge with calibrated confidence meter.
   - **Interactive Audio Scrubber**: Visual waveform player with real-time audio playback and click-to-scrub.
   - **Mel-Spectrogram Heatmap**: Interactive tile matrix with real-time frequency band coordinate readouts and vocoder cutoff alert.
   - **Metrics Radar**: 6 acoustic forensic indicator cards with normal human ranges.
   - **Presentation Deck**: Complete 11-slide deck interactive viewer derived from `Mini_Project_Review0.1_Deepfake_Voice_Detection.pptx`.
   - **Audit Log**: Chronological scan history with instant "Inspect" reload capability.

---

## 🛠️ How to Run

### Option 1: Run with `start.bat`
Double-click `start.bat` in the root folder.

### Option 2: Run Manually

#### 1. Backend (Django):
```bash
cd backend
py -3.7 manage.py runserver 127.0.0.1:8000
```

#### 2. Frontend (React + Vite):
```bash
cd frontend
npm run dev -- --host 127.0.0.1 --port 5173
```
Open **http://127.0.0.1:5173** in your web browser.
