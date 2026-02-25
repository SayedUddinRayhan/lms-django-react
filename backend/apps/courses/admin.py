from django.contrib import admin
from .models import Category, Course, Module, Lesson, Enrollment, LessonProgress, Review


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "is_active", "created_at", "updated_at")
    search_fields = ("name",)
    list_filter = ("is_active",)
    readonly_fields = ("created_at", "updated_at")
    prepopulated_fields = {"slug": ("name",)}


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ("title", "slug", "instructor", "category", "price", "is_free", "status", "is_active", "created_at")
    list_filter = ("status", "is_active", "is_free", "category")
    search_fields = ("title", "description", "instructor__username")
    readonly_fields = ("created_at", "updated_at")
    prepopulated_fields = {"slug": ("title",)}
    actions = ["publish_courses", "archive_courses", "soft_delete_courses"]

    def publish_courses(self, request, queryset):
        updated = queryset.update(status="published")
        self.message_user(request, f"{updated} course(s) marked as Published.")
    publish_courses.short_description = "Publish selected courses"

    def archive_courses(self, request, queryset):
        updated = queryset.update(status="archived")
        self.message_user(request, f"{updated} course(s) archived.")
    archive_courses.short_description = "Archive selected courses"

    def soft_delete_courses(self, request, queryset):
        updated = queryset.update(is_active=False)
        self.message_user(request, f"{updated} course(s) deactivated.")
    soft_delete_courses.short_description = "Deactivate selected courses"


@admin.register(Module)
class ModuleAdmin(admin.ModelAdmin):
    list_display = ("title", "course", "order", "is_active")
    list_filter = ("is_active", "course")
    search_fields = ("title", "course__title")


@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display = ("title", "module", "content_type", "order", "is_active")
    list_filter = ("content_type", "is_active", "module__course")
    search_fields = ("title", "module__title")
    actions = ["soft_delete_lessons"]

    def soft_delete_lessons(self, request, queryset):
        updated = queryset.update(is_active=False)
        self.message_user(request, f"{updated} lesson(s) deactivated.")
    soft_delete_lessons.short_description = "Deactivate selected lessons"


@admin.register(Enrollment)
class EnrollmentAdmin(admin.ModelAdmin):
    list_display = ("student", "course", "price_paid", "payment_status", "completed", "is_active", "enrolled_at")
    list_filter = ("payment_status", "completed", "is_active", "course")
    search_fields = ("student__username", "course__title")

@admin.register(LessonProgress)
class LessonProgressAdmin(admin.ModelAdmin):
    list_display = ("student", "lesson", "is_completed", "watched_seconds", "completed_at")
    list_filter = ("is_completed",)
    search_fields = ("student__username", "lesson__title")


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ("student", "course", "rating", "is_active", "created_at")
    list_filter = ("rating", "is_active")
    search_fields = ("student__username", "course__title", "comment")