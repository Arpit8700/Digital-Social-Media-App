from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from .models import User
from .serializers import RegisterSerializer

from posts.models import Post
from follows.models import Follow


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer


class ProfileView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        followers = Follow.objects.filter(
            following=request.user
        ).count()

        following = Follow.objects.filter(
            follower=request.user
        ).count()

        total_posts = Post.objects.filter(
            user=request.user
        ).count()

        return Response({
            "id": request.user.id,
            "username": request.user.username,
            "email": request.user.email,
            "bio": request.user.bio,
            "profile_pic": request.user.profile_pic.url if request.user.profile_pic else "",
            "followers": followers,
            "following": following,
            "posts": total_posts
        })


class UpdateProfileView(APIView):

    permission_classes = [IsAuthenticated]

    def put(self, request):

        user = request.user

        # Update Bio
        user.bio = request.data.get("bio", user.bio)

        # Update Profile Picture
        if "profile_pic" in request.FILES:
            user.profile_pic = request.FILES["profile_pic"]

        user.save()

        return Response({
            "message": "Profile Updated Successfully"
        })


class SearchUserView(generics.ListAPIView):

    serializer_class = RegisterSerializer

    def get_queryset(self):

        search = self.request.GET.get("search", "")

        return User.objects.filter(
            username__icontains=search
        )                  