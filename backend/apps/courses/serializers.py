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

        if content_type == "video" and not (data.get("video_url") or data.get("file")):
            raise serializers.ValidationError({"video_url": "Either video URL or file must be set for a video lesson."})

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


class PublicCourseSerializer(serializers.ModelSerializer):
    instructor = serializers.StringRelatedField()
    category = serializers.StringRelatedField()
    total_modules = serializers.IntegerField(read_only=True)
    total_lessons = serializers.IntegerField(read_only=True)

    class Meta:
        model = Course
        fields = [
            "id",
            "slug",
            "title",
            "thumbnail",
            "price",
            "category",
            "instructor",
            "total_modules",
            "total_lessons",
            "created_at",
        ]

class CourseSerializer(serializers.ModelSerializer):
    total_modules = serializers.IntegerField(read_only=True)
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
            "total_modules", "total_lessons", "total_students",
            "modules"
        ]

        read_only_fields = [
            "slug", "created_at", "updated_at",
            "total_modules", "total_lessons", "total_students"
        ]

    def get_instructor_name(self, obj):
        if not obj.instructor:
            return None
        return obj.instructor.get_full_name() or obj.instructor.username

    def get_thumbnail(self, obj):
        request = self.context.get('request')
        if obj.thumbnail:
            return request.build_absolute_uri(obj.thumbnail.url)
        return None


class PublicLessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = [
            "id",
            "title",
            "content_type",
            "duration_minutes",
        ]

class PublicModuleSerializer(serializers.ModelSerializer):
    lessons = PublicLessonSerializer(many=True, read_only=True)

    class Meta:
        model = Module
        fields = ["id", "title", "lessons"]

class PublicCourseSerializer(serializers.ModelSerializer):
    instructor_name = serializers.CharField(source="instructor.get_full_name", read_only=True)
    modules = PublicModuleSerializer(many=True, read_only=True)
    total_modules = serializers.SerializerMethodField()
    total_lessons = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = [
            "id",
            "title",
            "slug",
            "description",
            "thumbnail",
            "price",
            "is_free",
            "instructor_name",
            "total_modules",
            "total_lessons",
            "modules",
        ]

    def get_total_modules(self, obj):
        return obj.modules.filter(is_active=True).count()

    def get_total_lessons(self, obj):
        return Lesson.objects.filter(module__course=obj, is_active=True).count()