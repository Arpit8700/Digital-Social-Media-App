from django.urls import path
from .views import PostListCreateView, FeedView, PostDetailView, PostUpdateView, PostDeleteView

urlpatterns = [
    path('', PostListCreateView.as_view()),
    path('feed/', FeedView.as_view()),
    path('<int:pk>/', PostDetailView.as_view()),
    path('<int:pk>/update/', PostUpdateView.as_view()),
    path('<int:pk>/delete/', PostDeleteView.as_view()),
]