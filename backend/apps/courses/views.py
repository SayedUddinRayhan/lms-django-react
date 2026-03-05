from rest_framework import viewsets, filters
from django.db.models import Prefetch, Count, Sum
from django_filters.rest_framework import DjangoFilterBackend

from apps.users.permissions import RolePermission, IsOwnerOrAdmin
from .models import (
    Category, Course, Module, Lesson,
    Enrollment, LessonProgress
)
from .serializers import (
    CategorySerializer, CourseSerializer, ModuleSerializer,
    LessonSerializer, EnrollmentSerializer,
    LessonProgressSerializer
)
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response


# Category
class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.filter(is_active=True).annotate(total_courses=Count('courses'))
    serializer_class = CategorySerializer
    allowed_roles = [] 

    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["name"]
    ordering_fields = ["name", "created_at"]
    ordering = ["name"]



# Course
class CourseViewSet(viewsets.ModelViewSet):
    serializer_class = CourseSerializer
    lookup_field = "slug"
    permission_classes = [RolePermission, IsOwnerOrAdmin]
    allowed_roles = [] 

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
            ).annotate(total_lessons=Count("modules__lessons"))

       
        if not user.is_authenticated:
            return qs
        if user.is_admin_role:
            return qs
        if user.is_instructor_role:
            return qs.filter(instructor=user)
        return qs 


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
        if user.is_authenticated and user.is_instructor_role:
            return qs.filter(course__instructor=user)
        return qs


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
        if user.is_authenticated and user.is_instructor_role:
            return qs.filter(module__course__instructor=user)
        return qs


# Enrollment
class EnrollmentViewSet(viewsets.ModelViewSet):
    serializer_class = EnrollmentSerializer
    permission_classes = [RolePermission]
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


# LessonProgress
class LessonProgressViewSet(viewsets.ModelViewSet):
    serializer_class = LessonProgressSerializer
    permission_classes = [RolePermission]
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



# Instructor Dashboard
class InstructorDashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        if not user.is_instructor_role:
            return Response({"detail": "Only instructors allowed"}, status=403)

        # All courses for this instructor
        courses = Course.objects.filter(instructor=user)

        # Stats
        total_courses = courses.count()
        total_students = Enrollment.objects.filter(course__instructor=user).count()
        total_lessons = Lesson.objects.filter(module__course__instructor=user).count()

        # Recent courses
        recent_courses = courses.order_by("-created_at")[:5]

        # Serialize recent courses and pass request for absolute URL
        serializer = CourseSerializer(recent_courses, many=True, context={'request': request})

        # Return response
        return Response({
            "total_courses": total_courses,
            "total_students": total_students,
            "total_lessons": total_lessons,
            "recent_courses": serializer.data
        })