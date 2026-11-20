from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from django.shortcuts import get_object_or_404

from .models import Like
from posts.models import Post
from notifications.models import Notification

class LikePostView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request, post_id):

        post = Post.objects.get(id=post_id)

        like, created = Like.objects.get_or_create(
            user=request.user,
            post=post
        )

        if created:

            if post.user != request.user:

                Notification.objects.create(
                    sender=request.user,
                    receiver=post.user,
                    message=f"{request.user.username} liked your post."
                )

            return Response({"message": "Post liked"})

        return Response({"message": "Already liked this post."})

class UnlikePostView(APIView):

    permission_classes = [IsAuthenticated]

    def delete(self, request, post_id):

        post = get_object_or_404(Post, id=post_id)

        like = Like.objects.filter(
            user=request.user,
            post=post
        )

        if like.exists():
            like.delete()
            return Response({"message": "Post unliked"})

        return Response({"message": "You have not liked this post"})