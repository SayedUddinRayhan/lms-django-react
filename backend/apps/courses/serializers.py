from rest_framework import serializers
from .models import (Category, Course, Module, Lesson, Enrollment, LessonProgress)



class CategorySerializer(serializers.ModelSerializer):
    total_courses = serializers.IntegerField(read_only=True)
    class Meta:
        model = Category
        fields = ["id", "name", "total_courses", "slug", "is_active", "created_at", "updated_at"]
        read_only_fields = ["slug", "created_at", "updated_at"]



class ModuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Module
        fields = ["id", "title", "order", "is_active"]



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
        content_type = data.get("content_type") or getattr(self.instance, "content_type", None)

        if content_type == "video" and not data.get("video_url"):
            raise serializers.ValidationError({"video_url": "Video URL required."})

        if content_type == "article" and not data.get("content"):
            raise serializers.ValidationError({"content": "Article content required."})

        if content_type == "file" and not data.get("file"):
            raise serializers.ValidationError({"file": "File required."})

        return data



class LessonProgressSerializer(serializers.ModelSerializer):
    student = serializers.PrimaryKeyRelatedField(read_only=True)
    lesson_title = serializers.CharField(source="lesson.title", read_only=True)

    class Meta:
        model = LessonProgress
        fields = ["id", "student", "lesson", "lesson_title", "is_completed", "watched_seconds", "completed_at"]
        read_only_fields = ["student","completed_at"]

    def update(self, instance, validated_data):
        # mark completed automatically if passed validation
        if validated_data.get("is_completed") and not instance.is_completed:
            instance.mark_completed()
        return super().update(instance, validated_data)
    
    def create(self, validated_data):
        request = self.context.get("request")
        validated_data["student"] = request.user
        return super().create(validated_data)



class EnrollmentSerializer(serializers.ModelSerializer):
    student = serializers.PrimaryKeyRelatedField(read_only=True)
    student_name = serializers.SerializerMethodField()

    course_title = serializers.CharField(
        source="course.title",
        read_only=True
    )

    class Meta:
        model = Enrollment
        fields = [
            "id",
            "student",
            "student_name",
            "course",
            "course_title",
            "enrolled_at"
        ]

        read_only_fields = ["enrolled_at"]


    def create(self, validated_data):
        request = self.context.get("request")
        if request:
            validated_data["student"] = request.user
        return super().create(validated_data)

    def get_student_name(self, obj):
        name = obj.student.get_full_name()
        return name if name else obj.student.username


class CourseSerializer(serializers.ModelSerializer):
    total_lessons = serializers.IntegerField(read_only=True)
    total_students = serializers.IntegerField(read_only=True)

    instructor = serializers.PrimaryKeyRelatedField(read_only=True)
    instructor_name = serializers.SerializerMethodField()

    category_name = serializers.CharField(source="category.name", read_only=True)

    modules = ModuleSerializer(many=True, read_only=True)

    class Meta:
        model = Course
        fields = [
            "id", "title", "slug", "description", "thumbnail",
            "category", "category_name",
            "instructor", "instructor_name",
            "price", "is_free",
            "status", "is_active",
            "created_at", "updated_at",
            "total_lessons", "total_students",
            "modules"
        ]

        read_only_fields = [
            "slug", "created_at", "updated_at",
            "total_lessons", "total_students"
        ]

    def get_instructor_name(self, obj):
        if not obj.instructor:
            return None
        return obj.instructor.get_full_name() or obj.instructor.username