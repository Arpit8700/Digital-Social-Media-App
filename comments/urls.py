from django.urls import path
from .views import CommentListCreateView, CommentUpdateView, CommentDeleteView

urlpatterns = [
    path(
        "post/<int:post_id>/",
        CommentListCreateView.as_view()
    ),

    path(
        "update/<int:pk>/",
        CommentUpdateView.as_view()
    ),

    path(
        "delete/<int:pk>/",
        CommentDeleteView.as_view()
    ),
]