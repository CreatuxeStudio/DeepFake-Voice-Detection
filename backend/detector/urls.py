from django.urls import path
from .views import DetectAudioView, SampleListView, AnalyzeSampleView, HistoryView, ProjectMetaView

urlpatterns = [
    path('detect/', DetectAudioView.as_view(), name='detect_audio'),
    path('samples/', SampleListView.as_view(), name='sample_list'),
    path('samples/analyze/', AnalyzeSampleView.as_view(), name='analyze_sample'),
    path('history/', HistoryView.as_view(), name='detection_history'),
    path('project-meta/', ProjectMetaView.as_view(), name='project_meta'),
]
