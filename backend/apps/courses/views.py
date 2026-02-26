from rest_framework import viewsets, filters, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import DjangoModelPermissions
from django.shortcuts import get_object_or_404
from django.db.models import Q, Prefetch
from apps.users.permissions import RolePermission
from apps.users.permissions import IsOwnerOrAdmin  

from .models import (
    Category, Course, Module, Lesson,
    Enrollment, LessonProgress, Review
)

from .serializers import (
    CategorySerializer, CourseSerializer, ModuleSerializer,
    LessonSerializer, EnrollmentSerializer,
    LessonProgressSerializer, ReviewSerializer
)



class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.filter(is_active=True)
    serializer_class = CategorySerializer

    permission_classes = [
        RolePermission,
        DjangoModelPermissions,
    ]

    # Only admin can create/update/delete
    allowed_roles = []

    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["name"]
    ordering_fields = ["name", "created_at"]
    ordering = ["name"]






class CourseViewSet(viewsets.ModelViewSet):
    serializer_class = CourseSerializer
    permission_classes = [
        RolePermission,
        DjangoModelPermissions,
        IsOwnerOrAdmin,
    ]

    allowed_roles = ["instructor"]

    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["title", "description", "category__name"]
    ordering_fields = ["created_at", "price"]
    ordering = ["-created_at"]

    def get_queryset(self):
        user = self.request.user

        qs = Course.objects.filter(is_active=True).select_related("category", "instructor") \
            .prefetch_related(
                "modules",
                Prefetch(
                    "modules__lessons",
                    queryset=Lesson.objects.filter(is_active=True)
                ),
                "enrollments",
                "reviews",
            )

        if not user.is_authenticated:
            return qs

        if user.is_admin_role:
            return qs

        if user.is_instructor_role:
            return qs.filter(instructor=user)

        return qs


class ModuleViewSet(viewsets.ModelViewSet):
    serializer_class = ModuleSerializer
    permission_classes = [
        RolePermission,
        DjangoModelPermissions,
        IsOwnerOrAdmin,
    ]
    allowed_roles = ["instructor"]

    def get_queryset(self):
        user = self.request.user

        qs = Module.objects.filter(is_active=True).select_related("course", "course__instructor") \
            .prefetch_related(
                Prefetch(
                    "lessons",
                    queryset=Lesson.objects.filter(is_active=True)
                )
            )

        if user.is_authenticated and user.is_instructor_role:
            return qs.filter(course__instructor=user)

        return qs



class LessonViewSet(viewsets.ModelViewSet):
    serializer_class = LessonSerializer
    permission_classes = [
        RolePermission,
        DjangoModelPermissions,
        IsOwnerOrAdmin,
    ]
    allowed_roles = ["instructor"]

    def get_queryset(self):
        user = self.request.user

        qs = Lesson.objects.filter(is_active=True) \
            .select_related(
                "module",
                "module__course",
                "module__course__instructor"
            ) \
            .prefetch_related(
                "lessonprogress_set"
            )

        if user.is_authenticated and user.is_instructor_role:
            return qs.filter(module__course__instructor=user)

        return qs


class EnrollmentViewSet(viewsets.ModelViewSet):
    serializer_class = EnrollmentSerializer
    permission_classes = [RolePermission, DjangoModelPermissions]
    allowed_roles = ["student"]

    def get_queryset(self):
        user = self.request.user

        qs = Enrollment.objects.filter(is_active=True) \
            .select_related(
                "student",
                "course",
                "course__instructor",
                "course__category"
            )

        if user.is_admin_role:
            return qs

        if user.is_student_role:
            return qs.filter(student=user)

        if user.is_instructor_role:
            return qs.filter(course__instructor=user)

        return qs.none()



class LessonProgressViewSet(viewsets.ModelViewSet):
    serializer_class = LessonProgressSerializer
    permission_classes = [RolePermission, DjangoModelPermissions]
    allowed_roles = ["student"]

    def get_queryset(self):
        user = self.request.user

        qs = LessonProgress.objects.select_related(
            "student",
            "lesson",
            "lesson__module",
            "lesson__module__course"
        )

        if user.is_admin_role:
            return qs

        if user.is_student_role:
            return qs.filter(student=user)

        return qs.none()



class ReviewViewSet(viewsets.ModelViewSet):
    serializer_class = ReviewSerializer
    permission_classes = [RolePermission, DjangoModelPermissions]
    allowed_roles = ["student"]

    def get_queryset(self):
        user = self.request.user

        qs = Review.objects.filter(is_active=True) \
            .select_related(
                "student",
                "course",
                "course__instructor"
            )

        if user.is_admin_role:
            return qs

        if user.is_student_role:
            return qs.filter(student=user)

        if user.is_instructor_role:
            return qs.filter(course__instructor=user)

        return qs.none()