from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser

from .models import Post
from .serializers import PostSerializer
from follows.models import Follow
from .permissions import IsOwner


# List all posts & Create a new post
class PostListCreateView(generics.ListCreateAPIView):

    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get_queryset(self):
        return Post.objects.all().order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


# Feed (Posts of followed users)
class FeedView(generics.ListAPIView):

    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):

        following = Follow.objects.filter(
            follower=self.request.user
        ).values_list('following', flat=True)

        return Post.objects.filter(
            user__in=following
        ).order_by('-created_at')


# Single Post Detail
class PostDetailView(generics.RetrieveAPIView):

    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated] 

class PostUpdateView(generics.UpdateAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated, IsOwner]

    def get_object(self):
     obj = super().get_object()
     self.check_object_permissions(self.request, obj)
     return obj

    def perform_update(self, serializer):
        serializer.save(user=self.request.user)

class PostDeleteView(generics.DestroyAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated, IsOwner] 

    def get_object(self):
     obj = super().get_object()
     self.check_object_permissions(self.request, obj)
     return obj
