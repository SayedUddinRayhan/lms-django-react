from rest_framework import serializers
from django.utils import timezone
from .models import (Category, Course, Module, Lesson, Enrollment, LessonProgress, Review)



class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name", "slug", "is_active", "created_at", "updated_at"]
        read_only_fields = ["slug", "created_at", "updated_at"]



class ModuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Module
        fields = ["id", "course", "title", "order", "is_active"]



class LessonSerializer(serializers.ModelSerializer):
    is_unlocked = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Lesson
        fields = [
            "id", "module", "title", "content_type",
            "video_url", "content", "file",
            "duration_minutes", "order", "is_active",
            "created_at", "is_unlocked"
        ]
        read_only_fields = ["created_at", "is_unlocked"]

    def get_is_unlocked(self, obj):
        student = self.context.get("student")
        if student:
            return obj.is_unlocked_for(student)
        return False

    def validate(self, data):
        content_type = data.get("content_type")
        if content_type == "video" and not data.get("video_url"):
            raise serializers.ValidationError({"video_url": "Video URL required."})
        if content_type == "article" and not data.get("content"):
            raise serializers.ValidationError({"content": "Article content required."})
        if content_type == "file" and not data.get("file"):
            raise serializers.ValidationError({"file": "File required."})
        return data



class LessonProgressSerializer(serializers.ModelSerializer):
    lesson_title = serializers.CharField(source="lesson.title", read_only=True)

    class Meta:
        model = LessonProgress
        fields = ["id", "student", "lesson", "lesson_title", "is_completed", "watched_seconds", "completed_at"]
        read_only_fields = ["completed_at"]

    def update(self, instance, validated_data):
        # mark completed automatically if passed validation
        if validated_data.get("is_completed") and not instance.is_completed:
            instance.mark_completed()
        return super().update(instance, validated_data)



class EnrollmentSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source="student.get_full_name", read_only=True)
    course_title = serializers.CharField(source="course.title", read_only=True)

    class Meta:
        model = Enrollment
        fields = [
            "id", "student", "student_name", "course", "course_title",
            "price_paid", "payment_status", "completed", "is_active", "enrolled_at"
        ]
        read_only_fields = ["enrolled_at"]

    def validate(self, data):
        course = data.get("course")
        price_paid = data.get("price_paid")
        if course.is_free and price_paid != 0:
            raise serializers.ValidationError("Free course cannot have payment.")
        if not course.is_free and price_paid <= 0:
            raise serializers.ValidationError("Paid course must have price.")
        return data


class ReviewSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source="student.get_full_name", read_only=True)
    course_title = serializers.CharField(source="course.title", read_only=True)

    class Meta:
        model = Review
        fields = ["id", "student", "student_name", "course", "course_title", "rating", "comment", "is_active", "created_at"]
        read_only_fields = ["created_at"]

    def validate_rating(self, value):
        if value < 1 or value > 5:
            raise serializers.ValidationError("Rating must be between 1 and 5.")
        return value



class CourseSerializer(serializers.ModelSerializer):
    total_lessons = serializers.IntegerField(source="total_lessons", read_only=True)
    total_students = serializers.IntegerField(source="total_students", read_only=True)
    average_rating = serializers.FloatField(source="average_rating", read_only=True)
    modules = ModuleSerializer(many=True, read_only=True)
    reviews = ReviewSerializer(many=True, read_only=True)

    class Meta:
        model = Course
        fields = [
            "id", "title", "slug", "description", "thumbnail",
            "category", "instructor", "price", "is_free",
            "status", "is_active", "created_at", "updated_at",
            "total_lessons", "total_students", "average_rating",
            "modules", "reviews"
        ]
        read_only_fields = ["slug", "created_at", "updated_at", "total_lessons", "total_students", "average_rating"]