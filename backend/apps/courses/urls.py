from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_nested import routers

from .views import (
    PublicCategoryList,
    PublicCourseList,
    CategoryViewSet,
    CourseViewSet,
    ModuleViewSet,
    LessonViewSet,
    EnrollmentViewSet,
    LessonProgressViewSet,
    InstructorDashboardView,
    StudentDashboardView,
    StudentCourseDetailView,
    PublicCourseDetailView,
)

router = DefaultRouter()
router.register(r"categories", CategoryViewSet, basename="category")
router.register(r"courses", CourseViewSet, basename="course")
router.register(r"modules", ModuleViewSet, basename="module") 
router.register(r"enrollments", EnrollmentViewSet, basename="enrollment")
router.register(r"lesson-progress", LessonProgressViewSet, basename="lessonprogress")


# Modules under courses
course_router = routers.NestedDefaultRouter(router, r"courses", lookup="course")
course_router.register(r"modules", ModuleViewSet, basename="course-modules")


# Lessons under modules
module_router = routers.NestedDefaultRouter(router, r"modules", lookup="module")
module_router.register(r"lessons", LessonViewSet, basename="module-lessons")

# Flat endpoints for all modules and lessons
router.register(r"all-modules", ModuleViewSet, basename="all-modules")
router.register(r"all-lessons", LessonViewSet, basename="all-lessons")


urlpatterns = [
    path("", include(router.urls)),
    path("", include(course_router.urls)),
    path("", include(module_router.urls)),
    path("public/categories/", PublicCategoryList.as_view(), name="public-categories"),
    path("public/courses/", PublicCourseList.as_view(), name="public-courses"),
    path("instructor/dashboard/", InstructorDashboardView.as_view(), name="instructor-dashboard"),
    path("student/dashboard/", StudentDashboardView.as_view(), name="student-dashboard"),
    path("student/courses/<int:course_id>/lessons/", StudentCourseDetailView.as_view(), name="student-course-detail"),
    path("public/courses/<slug:slug>/", PublicCourseDetailView.as_view(), name="public-course-detail"),
]