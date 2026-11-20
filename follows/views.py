from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import generics
from django.shortcuts import get_object_or_404

from .models import Follow
from .serializers import FollowSerializer
from users.models import User
from notifications.models import Notification


class FollowUserView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request, user_id):

        user = get_object_or_404(User, id=user_id)

        if user == request.user:
            return Response(
                {"message": "You cannot follow yourself."},
                status=400
            )

        follow, created = Follow.objects.get_or_create(
            follower=request.user,
            following=user
        )

        if created:

            Notification.objects.create(
                sender=request.user,
                receiver=user,
                message=f"{request.user.username} started following you."
            )

            return Response({"message": "User followed successfully."})

        return Response({"message": "Already following this user."})


class UnfollowUserView(APIView):

    permission_classes = [IsAuthenticated]

    def delete(self, request, user_id):

        user = get_object_or_404(User, id=user_id)

        follow = Follow.objects.filter(
            follower=request.user,
            following=user
        )

        if follow.exists():
            follow.delete()
            return Response({"message": "User unfollowed successfully."})

        return Response({"message": "You are not following this user."})


class FollowersListView(generics.ListAPIView):

    serializer_class = FollowSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Follow.objects.filter(
            following_id=self.kwargs["user_id"]
        )


class FollowingListView(generics.ListAPIView):

    serializer_class = FollowSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Follow.objects.filter(
            follower_id=self.kwargs["user_id"]
        )