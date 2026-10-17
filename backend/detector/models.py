from django.db import models
import json

class DetectionRecord(models.Model):
    VERDICT_CHOICES = [
        ('AUTHENTIC', 'Authentic Voice'),
        ('DEEPFAKE', 'Deepfake Voice'),
    ]
    
    filename = models.CharField(max_length=255)
    file_url = models.CharField(max_length=500, blank=True, null=True)
    duration = models.FloatField(default=0.0)
    verdict = models.CharField(max_length=20, choices=VERDICT_CHOICES)
    confidence = models.FloatField(default=0.0)
    risk_level = models.CharField(max_length=20, default='LOW')
    summary = models.TextField(blank=True)
    vocoder_artifact_index = models.FloatField(default=0.0)
    processing_time_ms = models.FloatField(default=0.0)
    findings_json = models.TextField(default='[]')
    metrics_json = models.TextField(default='{}')
    spectrogram_json = models.TextField(default='[]')
    waveform_json = models.TextField(default='[]')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def to_dict(self):
        return {
            'id': self.id,
            'filename': self.filename,
            'file_url': self.file_url,
            'duration': round(self.duration, 2),
            'verdict': self.verdict,
            'confidence': round(self.confidence, 1),
            'risk_level': self.risk_level,
            'summary_statement': self.summary,
            'vocoder_artifact_index': self.vocoder_artifact_index,
            'processing_time_ms': round(self.processing_time_ms, 1),
            'findings': json.loads(self.findings_json) if self.findings_json else [],
            'metrics': json.loads(self.metrics_json) if self.metrics_json else {},
            'spectrogram_matrix': json.loads(self.spectrogram_json) if self.spectrogram_json else [],
            'waveform_points': json.loads(self.waveform_json) if self.waveform_json else [],
            'created_at': self.created_at.strftime('%Y-%m-%d %H:%M:%S'),
        }
