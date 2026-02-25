from rest_framework import viewsets, permissions, filters, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
from django.db.models import Q

from .models import (
    Category, Course, Module, Lesson, Enrollment, LessonProgress, Review
)
from .serializers import (
    CategorySerializer, CourseSerializer, ModuleSerializer,
    LessonSerializer, EnrollmentSerializer, LessonProgressSerializer,
    ReviewSerializer
)



class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.filter(is_active=True)
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["name"]
    ordering_fields = ["name", "created_at"]
    ordering = ["name"]



class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.filter(is_active=True)
    serializer_class = CourseSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["title", "description", "category__name"]
    ordering_fields = ["created_at", "price"]
    ordering = ["-created_at"]

    def get_queryset(self):
        user = self.request.user
        qs = Course.objects.filter(is_active=True)
        if user.is_authenticated and user.role == "instructor":
            qs = qs.filter(instructor=user)
        return qs

    @action(detail=True, methods=["get"], url_path="modules")
    def modules(self, request, pk=None):
        course = self.get_object()
        modules = course.modules.filter(is_active=True)
        serializer = ModuleSerializer(modules, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=["get"], url_path="lessons")
    def lessons(self, request, pk=None):
        course = self.get_object()
        lessons = Lesson.objects.filter(module__course=course, is_active=True)
        serializer = LessonSerializer(
            lessons, many=True, context={"student": request.user}
        )
        return Response(serializer.data)



class ModuleViewSet(viewsets.ModelViewSet):
    queryset = Module.objects.filter(is_active=True)
    serializer_class = ModuleSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["title", "course__title"]
    ordering_fields = ["order"]
    ordering = ["order"]

    @action(detail=True, methods=["get"], url_path="lessons")
    def lessons(self, request, pk=None):
        module = self.get_object()
        lessons = module.lessons.filter(is_active=True)
        serializer = LessonSerializer(
            lessons, many=True, context={"student": request.user}
        )
        return Response(serializer.data)



class LessonViewSet(viewsets.ModelViewSet):
    queryset = Lesson.objects.filter(is_active=True)
    serializer_class = LessonSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["title", "module__title", "module__course__title"]
    ordering_fields = ["order", "duration_minutes"]
    ordering = ["order"]

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["student"] = self.request.user
        return context


class EnrollmentViewSet(viewsets.ModelViewSet):
    queryset = Enrollment.objects.filter(is_active=True)
    serializer_class = EnrollmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == "student":
            return self.queryset.filter(student=user)
        if user.role == "instructor":
            return self.queryset.filter(course__instructor=user)
        return self.queryset.none()



class LessonProgressViewSet(viewsets.ModelViewSet):
    queryset = LessonProgress.objects.all()
    serializer_class = LessonProgressSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == "student":
            return self.queryset.filter(student=user)
        return self.queryset.all()

    @action(detail=True, methods=["post"], url_path="mark-complete")
    def mark_complete(self, request, pk=None):
        progress = self.get_object()
        try:
            progress.mark_completed()
            return Response({"status": "completed"}, status=status.HTTP_200_OK)
        except ValidationError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)



class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.filter(is_active=True)
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == "student":
            return self.queryset.filter(student=user)
        if user.role == "instructor":
            return self.queryset.filter(course__instructor=user)
        return self.queryset.none()

    def perform_create(self, serializer):
        serializer.save(student=self.request.user)