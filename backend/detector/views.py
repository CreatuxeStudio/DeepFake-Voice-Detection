import os
import json
import uuid
from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.views import View

from .models import DetectionRecord
from .audio_engine import AudioForensicEngine

engine = AudioForensicEngine()

PRECONFIGURED_SAMPLES = [
    {
        'id': 'human_clean',
        'title': 'Natural Human Speech (Male)',
        'filename': 'human_authentic_speech.wav',
        'category': 'Authentic Human',
        'badge': 'Human Speech',
        'badge_type': 'authentic',
        'description': 'Natural vocal cord resonance, organic formant modulations, and healthy glottal pitch micro-jitter.'
    },
    {
        'id': 'ai_neural_clone',
        'title': 'AI Voice Clone (Neural Vocoder)',
        'filename': 'ai_cloned_voice_neural.wav',
        'category': 'Synthetic / Cloned',
        'badge': 'AI Cloned',
        'badge_type': 'fake',
        'description': 'Generated with neural speech synthesis. Demonstrates rigid F0 pitch stability and sharp >7.2kHz vocoder cutoff.'
    },
    {
        'id': 'phone_scam_deepfake',
        'title': 'Impersonation Scam Audio (VoIP Cloned)',
        'filename': 'deepfake_phone_scam.wav',
        'category': 'Synthetic / Scam',
        'badge': 'Voice Spoof',
        'badge_type': 'fake',
        'description': 'Simulated telephony deepfake impersonation call exhibiting unnatural harmonics and vocoder phase anomalies.'
    },
    {
        'id': 'human_female_natural',
        'title': 'Natural Human Conversation (Female)',
        'filename': 'human_authentic_female.wav',
        'category': 'Authentic Human',
        'badge': 'Human Speech',
        'badge_type': 'authentic',
        'description': 'Higher pitch vocal tract sample with organic acoustic breathiness and natural dynamic contour shifts.'
    },
    {
        'id': 'mp4_sample',
        'title': 'MP4 Container Audio Stream',
        'filename': 'test_sample.mp4',
        'category': 'Authentic Media',
        'badge': 'MP4 Audio',
        'badge_type': 'authentic',
        'description': 'Audio stream demuxed from MP4 container with AAC audio encoding.'
    },
    {
        'id': 'mpeg_sample',
        'title': 'MPEG Broadcast Stream',
        'filename': 'test_sample.mpeg',
        'category': 'Synthetic Broadcast',
        'badge': 'MPEG Stream',
        'badge_type': 'fake',
        'description': 'MPEG format audio stream with subband layer compression.'
    }
]

@method_decorator(csrf_exempt, name='dispatch')
class DetectAudioView(View):
    def post(self, request, *args, **kwargs):
        if 'audio' not in request.FILES:
            return JsonResponse({'error': 'No audio file provided. Please upload a WAV, MP3, MPEG, MP4, M4A, or OGG file.'}, status=400)

        audio_file = request.FILES['audio']
        ext = os.path.splitext(audio_file.name)[1]
        if not ext:
            content_type = getattr(audio_file, 'content_type', '')
            if 'webm' in content_type:
                ext = '.webm'
            elif 'ogg' in content_type:
                ext = '.ogg'
            elif 'mp4' in content_type:
                ext = '.mp4'
            else:
                ext = '.wav'

        upload_dir = os.path.join(settings.MEDIA_ROOT, 'uploads')
        os.makedirs(upload_dir, exist_ok=True)

        saved_filename = f"{uuid.uuid4().hex[:10]}_{audio_file.name}"
        if not os.path.splitext(saved_filename)[1]:
            saved_filename += ext
        saved_path = os.path.join(upload_dir, saved_filename)

        with open(saved_path, 'wb+') as dest:
            for chunk in audio_file.chunks():
                dest.write(chunk)

        sensitivity = request.POST.get('sensitivity', 'balanced')

        try:
            analysis = engine.analyze_audio(saved_path, filename=audio_file.name, sensitivity=sensitivity)
            file_url = f"{settings.MEDIA_URL}uploads/{saved_filename}"

            record = DetectionRecord.objects.create(
                filename=analysis['filename'],
                file_url=file_url,
                duration=analysis['duration_seconds'],
                verdict=analysis['verdict'],
                confidence=analysis['confidence'],
                risk_level=analysis['risk_level'],
                summary=analysis['summary_statement'],
                vocoder_artifact_index=analysis['vocoder_artifact_index'],
                processing_time_ms=analysis['processing_time_ms'],
                findings_json=json.dumps(analysis['findings']),
                metrics_json=json.dumps(analysis['metrics']),
                spectrogram_json=json.dumps(analysis['spectrogram_matrix']),
                waveform_json=json.dumps(analysis['waveform_points'])
            )

            result_dict = record.to_dict()
            result_dict['raw_mfcc_coefficients'] = analysis.get('raw_mfcc_coefficients', [])
            result_dict['high_flags_count'] = analysis.get('high_flags_count', 0)
            return JsonResponse(result_dict, status=200)

        except ValueError as e:
            return JsonResponse({'error': str(e)}, status=400)
        except Exception as e:
            return JsonResponse({'error': f'Failed to process audio: {str(e)}'}, status=500)


@method_decorator(csrf_exempt, name='dispatch')
class AnalyzeSampleView(View):
    def post(self, request, *args, **kwargs):
        try:
            data = json.loads(request.body.decode('utf-8')) if request.body else {}
        except Exception:
            data = {}

        sample_id = data.get('sample_id')
        sensitivity = data.get('sensitivity', 'balanced')
        matched = None
        for s in PRECONFIGURED_SAMPLES:
            if s['id'] == sample_id:
                matched = s
                break

        if not matched:
            matched = PRECONFIGURED_SAMPLES[0]

        sample_path = os.path.join(settings.MEDIA_ROOT, 'samples', matched['filename'])
        if not os.path.exists(sample_path):
            from .generate_samples import generate_samples
            generate_samples(os.path.join(settings.MEDIA_ROOT, 'samples'))

        try:
            analysis = engine.analyze_audio(sample_path, filename=matched['filename'], sensitivity=sensitivity)
            file_url = f"{settings.MEDIA_URL}samples/{matched['filename']}"

            record = DetectionRecord.objects.create(
                filename=f"{matched['title']} ({matched['filename']})",
                file_url=file_url,
                duration=analysis['duration_seconds'],
                verdict=analysis['verdict'],
                confidence=analysis['confidence'],
                risk_level=analysis['risk_level'],
                summary=analysis['summary_statement'],
                vocoder_artifact_index=analysis['vocoder_artifact_index'],
                processing_time_ms=analysis['processing_time_ms'],
                findings_json=json.dumps(analysis['findings']),
                metrics_json=json.dumps(analysis['metrics']),
                spectrogram_json=json.dumps(analysis['spectrogram_matrix']),
                waveform_json=json.dumps(analysis['waveform_points'])
            )

            result_dict = record.to_dict()
            result_dict['raw_mfcc_coefficients'] = analysis.get('raw_mfcc_coefficients', [])
            result_dict['sample_metadata'] = matched
            return JsonResponse(result_dict, status=200)

        except Exception as e:
            return JsonResponse({'error': f'Failed to analyze sample: {str(e)}'}, status=500)


class SampleListView(View):
    def get(self, request, *args, **kwargs):
        sample_list = []
        for s in PRECONFIGURED_SAMPLES:
            sample_list.append({
                **s,
                'audio_url': f"{settings.MEDIA_URL}samples/{s['filename']}"
            })
        return JsonResponse({'samples': sample_list})


@method_decorator(csrf_exempt, name='dispatch')
class HistoryView(View):
    def get(self, request, *args, **kwargs):
        records = DetectionRecord.objects.all()[:20]
        data = [r.to_dict() for r in records]
        return JsonResponse({'history': data})

    def delete(self, request, *args, **kwargs):
        DetectionRecord.objects.all().delete()
        return JsonResponse({'status': 'History cleared successfully'})


class ProjectMetaView(View):
    def get(self, request, *args, **kwargs):
        """
        Returns structured project review data aligned with Mini_Project_Review0.1_Deepfake_Voice_Detection.pptx
        """
        meta = {
            'project_title': 'Deepfake Voice Detection System',
            'subtitle': 'Identifying AI-Cloned and Synthetic Audio Using Machine Learning',
            'review_stage': 'Mini Project Review – I',
            'department': 'Department of Computer Science and Engineering',
            'institution': 'C. Abdul Hakeem College of Engineering & Technology (CAHCET)',
            'review_date': '07 September 2026',
            'team_members': [
                {'name': 'Mohamed Yuhan', 'role': 'Audio Signal Processing & Feature Extraction'},
                {'name': 'Akramullah', 'role': 'Machine Learning Classification & Forensic Models'},
                {'name': 'Mohammed Afeef', 'role': 'Full-Stack Architecture & User Experience'},
                {'name': 'Abdul Rahman Basha', 'role': 'Acoustic Biometric Verification & Dataset Modeling'},
                {'name': 'G Ameer Hasan', 'role': 'Neural Vocoder Detection & Forensic Analysis'}
            ],
            'modules': [
                {'id': '01', 'title': 'Audio Input & Preprocessing', 'desc': 'Accepts WAV/MP3/Mic input, normalizes peak amplitude, trims silence, and resamples to 16kHz standard.'},
                {'id': '02', 'title': 'Feature Extraction', 'desc': 'Extracts 13-band MFCC, Mel-spectrogram energy, F0 pitch jitter contour, and spectral centroid/roll-off.'},
                {'id': '03', 'title': 'Model Training & Calibration', 'desc': 'Trained on ASVspoof-calibrated synthetic voice distributions with multi-factor forensic classifiers.'},
                {'id': '04', 'title': 'Detection Engine', 'desc': 'Predicts Real vs. AI-Cloned speech in <2 seconds with fine-grained confidence score.'},
                {'id': '05', 'title': 'Result Dashboard & XAI', 'desc': 'Interactive waveform scrub, Mel-spectrogram heatmap, and Explainable AI acoustic evidence breakdown.'}
            ],
            'future_scope': [
                'Real-Time Live Call & VoIP Stream Detection',
                'Browser Extension for Streaming Podcasts & Social Video Detection',
                'Cross-Lingual & Multi-Accent Forensic Robustness',
                'Integration with Banking Authentication & Voice KYC Gateways',
                'Continuous Automated Retraining Against Emerging TTS Generative Models'
            ]
        }
        return JsonResponse(meta)
