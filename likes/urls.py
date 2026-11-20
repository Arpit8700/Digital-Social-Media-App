
from django.urls import path
from .views import LikePostView, UnlikePostView

urlpatterns = [
    path("post/<int:post_id>/", LikePostView.as_view()),
    path("unlike/<int:post_id>/", UnlikePostView.as_view()),
]