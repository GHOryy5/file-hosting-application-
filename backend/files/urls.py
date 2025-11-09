from django.urls import path, include
from rest_framework.routers import DefaultRouter
# Import your new view
from .views import FileUploadView, FileViewSet, SavingsView, FileDownloadView 

router = DefaultRouter()
router.register(r"files", FileViewSet, basename="files")

urlpatterns = [
    path("", include(router.urls)),
    path("upload/", FileUploadView.as_view(), name="upload"),
    path("stats/savings/", SavingsView.as_view(), name="savings"),
    
    # --- THIS IS THE NEW URL FOR YOUR FEATURE ---
    path("download/<int:file_id>/", FileDownloadView.as_view(), name="download"),
]