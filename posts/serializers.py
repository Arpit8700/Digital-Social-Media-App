from rest_framework import serializers
from .models import Post


class PostSerializer(serializers.ModelSerializer):

    total_likes = serializers.SerializerMethodField()
    total_comments = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = [
            'id',
            'user',
            'content',
            'image',
            'created_at',
            'total_likes',
            'total_comments'
        ]

        read_only_fields = [
            'user',
            'created_at',
            'total_likes',
            'total_comments'
        ]

    def get_total_likes(self, obj):
        return obj.like_set.count()

    def get_total_comments(self, obj):
        return obj.comment_set.count()