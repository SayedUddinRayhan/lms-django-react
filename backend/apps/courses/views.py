from rest_framework import viewsets, filters
from django.shortcuts import get_object_or_404
from django.db.models import Prefetch, Count, Sum
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.exceptions import ValidationError
from apps.users.permissions import RolePermission, IsOwnerOrAdmin
from .models import (
    Category, Course, Module, Lesson,
    Enrollment, LessonProgress
)
from .serializers import (
    CategorySerializer, PublicCourseSerializer, CourseSerializer, ModuleSerializer,
    LessonSerializer, EnrollmentSerializer,
    LessonProgressSerializer
)
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from rest_framework import generics
from rest_framework.permissions import AllowAny

class PublicCategoryList(generics.ListAPIView):
    queryset = Category.objects.filter(is_active=True).annotate(total_courses=Count('courses'))
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]

class PublicCourseList(generics.ListAPIView):
    serializer_class = PublicCourseSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        category_id = self.request.query_params.get("category__id")

        qs = Course.objects.filter(is_active=True) \
            .select_related("category", "instructor") \
            .annotate(
                total_modules=Count("modules", distinct=True),
                total_lessons=Count("modules__lessons", distinct=True)
            )

        if category_id:
            qs = qs.filter(category_id=category_id)

        return qs

class PublicCourseDetailView(generics.RetrieveAPIView):
    serializer_class = PublicCourseSerializer
    permission_classes = [AllowAny]
    lookup_field = "slug"

    def get_queryset(self):
       
        return Course.objects.filter(is_active=True) \
            .select_related("instructor", "category") \
            .prefetch_related(
                Prefetch(
                    "modules",
                    queryset=Module.objects.filter(is_active=True).prefetch_related(
                        Prefetch(
                            "lessons",
                            queryset=Lesson.objects.filter(is_active=True)
                        )
                    )
                )
            )

# Category
class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.filter(is_active=True).annotate(total_courses=Count('courses'))
    serializer_class = CategorySerializer
    permission_classes = [RolePermission]
    allowed_roles = ["admin"]

    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["name"]
    ordering_fields = ["name", "created_at"]
    ordering = ["name"]




# Course
class CourseViewSet(viewsets.ModelViewSet):
    serializer_class = CourseSerializer
    lookup_field = "slug"
    permission_classes = [RolePermission, IsOwnerOrAdmin]
    allowed_roles = ["instructor"]

    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["category__id", "category__slug"]
    search_fields = ["title", "description", "category__name"]
    ordering_fields = ["created_at", "price"]
    ordering = ["-created_at"]


    def get_queryset(self):
        user = self.request.user

        qs = Course.objects.filter(is_active=True) \
        .select_related("category", "instructor") \
        .prefetch_related(
            "modules",
            Prefetch("modules__lessons", queryset=Lesson.objects.filter(is_active=True)),
            "enrollments"
        ).annotate(
            total_modules=Count("modules", distinct=True),
            total_lessons=Count("modules__lessons", distinct=True)
        )

        if not user.is_authenticated:
            return qs

        if user.is_admin_role:
            return qs

        if user.is_instructor_role:
            return qs.filter(instructor=user)

        if user.is_student_role:
            return qs

        return qs
    
    def perform_create(self, serializer):
        serializer.save(
            instructor=self.request.user,
            is_active=True
            )


# Module
class ModuleViewSet(viewsets.ModelViewSet):
    serializer_class = ModuleSerializer
    permission_classes = [RolePermission, IsOwnerOrAdmin]
    allowed_roles = ["instructor"]

    def get_queryset(self):
        user = self.request.user
        qs = Module.objects.filter(is_active=True).select_related("course", "course__instructor") \
            .prefetch_related(
                Prefetch("lessons", queryset=Lesson.objects.filter(is_active=True))
            )
        
        if user.is_admin_role:
            return qs

        if user.is_instructor_role:
            return qs.filter(course__instructor=user)

        if user.is_student_role:
            return qs.filter(course__enrollments__student=user)

        return qs.none()


# Lesson
class LessonViewSet(viewsets.ModelViewSet):
    serializer_class = LessonSerializer
    permission_classes = [RolePermission, IsOwnerOrAdmin]
    allowed_roles = ["instructor"]

    def get_queryset(self):
        user = self.request.user
        qs = Lesson.objects.filter(is_active=True) \
            .select_related("module", "module__course", "module__course__instructor") \
            .prefetch_related("lessonprogress_set")
       
    
        if user.is_admin_role:
            return qs

        if user.is_instructor_role:
            return qs.filter(module__course__instructor=user)

        if user.is_student_role:
            return qs.filter(module__course__enrollments__student=user)

        return qs.none()


# Enrollment
class EnrollmentViewSet(viewsets.ModelViewSet):
    serializer_class = EnrollmentSerializer
    permission_classes = [IsAuthenticated, RolePermission]
    allowed_roles = ["student"]

    def get_queryset(self):
        user = self.request.user
        qs = Enrollment.objects.select_related("student", "course", "course__instructor", "course__category")
        if user.is_admin_role:
            return qs
        if user.is_student_role:
            return qs.filter(student=user)
        if user.is_instructor_role:
            return qs.filter(course__instructor=user)
        return qs.none()

    def perform_create(self, serializer):
        student = self.request.user
        course = serializer.validated_data["course"]
        if Enrollment.objects.filter(student=student, course=course).exists():
            raise ValidationError("You are already enrolled in this course.")
        serializer.save(student=student)


# LessonProgress
class LessonProgressViewSet(viewsets.ModelViewSet):
    serializer_class = LessonProgressSerializer
    permission_classes = [IsAuthenticated, RolePermission]
    allowed_roles = ["student"]

    def get_queryset(self):
        user = self.request.user
        qs = LessonProgress.objects.select_related(
            "student", "lesson", "lesson__module", "lesson__module__course"
        )
        if user.is_admin_role:
            return qs
        if user.is_student_role:
            return qs.filter(student=user)
        return qs.none()

    def perform_create(self, serializer):
        serializer.save(student=self.request.user)



# Instructor Dashboard
class InstructorDashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        if not user.is_instructor_role:
            return Response({"detail": "Only instructors allowed"}, status=403)

        courses = Course.objects.filter(instructor=user).annotate(
            total_modules=Count("modules", distinct=True),
            total_lessons=Count("modules__lessons", distinct=True),
            total_students=Count("enrollments", distinct=True)
        )

        total_courses = courses.count()
        total_students = Enrollment.objects.filter(course__instructor=user).count()
        total_lessons = Lesson.objects.filter(module__course__instructor=user).count()

        recent_courses = courses.order_by("-created_at")[:5]

        serializer = CourseSerializer(
            recent_courses,
            many=True,
            context={"request": request}
        )

        return Response({
            "total_courses": total_courses,
            "total_students": total_students,
            "total_lessons": total_lessons,
            "recent_courses": serializer.data
        })





class StudentDashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        if not user.is_student_role:
            return Response({"detail": "Only students allowed"}, status=403)

        enrollments = Enrollment.objects.filter(student=user).select_related("course")

        total_courses = enrollments.count()
        total_lessons_completed = LessonProgress.objects.filter(
            student=user, is_completed=True
        ).count()
        total_watched_seconds = LessonProgress.objects.filter(
            student=user
        ).aggregate(
            watched_seconds=Sum("watched_seconds")
        )["watched_seconds"] or 0

        courses = Course.objects.filter(
            enrollments__student=user
        ).annotate(
            total_modules=Count("modules", distinct=True),
            total_lessons=Count("modules__lessons", distinct=True),
            total_students=Count("enrollments", distinct=True), 
        ).distinct().select_related("category", "instructor") \
         .prefetch_related("modules")

       
        recent_courses = courses.order_by("-enrollments__enrolled_at")[:5]

        serializer = CourseSerializer(recent_courses, many=True, context={"request": request})

        return Response({
            "total_courses": total_courses,
            "total_lessons_completed": total_lessons_completed,
            "total_watched_seconds": total_watched_seconds,
            "recent_courses": serializer.data
        })




class StudentCourseDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, course_id):
        user = request.user

        if not user.is_student_role:
            return Response({"detail": "Only students allowed"}, status=403)

    
        if not Enrollment.objects.filter(student=user, course_id=course_id).exists():
            return Response({"detail": "You are not enrolled in this course."}, status=403)

      
        lessons_qs = Lesson.objects.filter(is_active=True).prefetch_related(
            Prefetch(
                "progress_records", 
                queryset=LessonProgress.objects.filter(student=user),
                to_attr="student_progress"
            )
        )

    
        modules_qs = Module.objects.filter(course_id=course_id, is_active=True).prefetch_related(
            Prefetch("lessons", queryset=lessons_qs)
        )

      
        course = get_object_or_404(
            Course.objects.filter(id=course_id, is_active=True).prefetch_related(
                Prefetch("modules", queryset=modules_qs)
            )
        )

   
        course_data = {
            "id": course.id,
            "title": course.title,
            "description": course.description,
            "thumbnail": request.build_absolute_uri(course.thumbnail.url) if course.thumbnail else None,
            "modules": []
        }

        for module in course.modules.all():
            module_data = {"id": module.id, "title": module.title, "lessons": []}
            for lesson in module.lessons.all():
                progress = lesson.student_progress[0] if hasattr(lesson, "student_progress") and lesson.student_progress else None
              
                file_url = request.build_absolute_uri(lesson.file.url) if lesson.file else None
                module_data["lessons"].append({
                    "id": lesson.id,
                    "title": lesson.title,
                    "video_url": lesson.video_url,
                    "file": file_url, 
                    "content_type": lesson.content_type,
                    "is_completed": progress.is_completed if progress else False
                })
            course_data["modules"].append(module_data)

        return Response(course_data)