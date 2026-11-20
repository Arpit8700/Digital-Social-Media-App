from rest_framework import serializers
from .models import User

class RegisterSerializer(serializers.ModelSerializer):

    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'email',
            'password',
            'bio',
            'profile_pic'
        ]

    def create(self, validated_data):

        profile_pic = validated_data.pop('profile_pic', None)

        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            bio=validated_data.get('bio', '')
        )

        if profile_pic:
            user.profile_pic = profile_pic
            user.save()

        return user        