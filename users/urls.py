from django.urls import path
from .views import RegisterView, ProfileView, UpdateProfileView, SearchUserView

urlpatterns = [
    path('register/', RegisterView.as_view()),
    path('profile/', ProfileView.as_view()),
    path("update-profile/", UpdateProfileView.as_view()),
    path("search/", SearchUserView.as_view()),
]