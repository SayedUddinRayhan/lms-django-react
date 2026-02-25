from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_nested import routers

from .views import (
    CategoryViewSet, CourseViewSet, ModuleViewSet, LessonViewSet,
    EnrollmentViewSet, LessonProgressViewSet, ReviewViewSet
)

# ----------------------------
# Main Routers
# ----------------------------
router = DefaultRouter()
router.register(r"categories", CategoryViewSet, basename="category")
router.register(r"courses", CourseViewSet, basename="course")
router.register(r"modules", ModuleViewSet, basename="module")
router.register(r"lessons", LessonViewSet, basename="lesson")
router.register(r"enrollments", EnrollmentViewSet, basename="enrollment")
router.register(r"lesson-progress", LessonProgressViewSet, basename="lessonprogress")
router.register(r"reviews", ReviewViewSet, basename="review")

# ----------------------------
# Nested Routers
# ----------------------------
# Modules nested under Courses
course_router = routers.NestedDefaultRouter(router, r"courses", lookup="course")
course_router.register(r"modules", ModuleViewSet, basename="course-modules")
course_router.register(r"lessons", LessonViewSet, basename="course-lessons")
course_router.register(r"reviews", ReviewViewSet, basename="course-reviews")

# Lessons nested under Modules
module_router = routers.NestedDefaultRouter(router, r"modules", lookup="module")
module_router.register(r"lessons", LessonViewSet, basename="module-lessons")

# ----------------------------
# URL Patterns
# ----------------------------
urlpatterns = [
    path("", include(router.urls)),
    path("", include(course_router.urls)),
    path("", include(module_router.urls)),
]