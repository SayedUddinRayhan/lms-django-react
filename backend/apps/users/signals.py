from django.db.models.signals import post_migrate, post_save
from django.dispatch import receiver
from django.contrib.auth.models import Group, Permission
from django.contrib.contenttypes.models import ContentType
from django.conf import settings

from apps.courses.models import Course, Module, Lesson, Enrollment, LessonProgress

# Create default groups and assign permissions
@receiver(post_migrate)
def create_default_groups(sender, **kwargs):
    GROUPS = ["Admin", "Instructor", "Student"]

    for group_name in GROUPS:
        Group.objects.get_or_create(name=group_name)

    # Content types
    course_ct = ContentType.objects.get_for_model(Course)
    module_ct = ContentType.objects.get_for_model(Module)
    lesson_ct = ContentType.objects.get_for_model(Lesson)
    enrollment_ct = ContentType.objects.get_for_model(Enrollment)
    progress_ct = ContentType.objects.get_for_model(LessonProgress)

    # Permissions
    course_perms = Permission.objects.filter(content_type=course_ct)
    module_perms = Permission.objects.filter(content_type=module_ct)
    lesson_perms = Permission.objects.filter(content_type=lesson_ct)
    enrollment_perms = Permission.objects.filter(content_type=enrollment_ct)
    progress_perms = Permission.objects.filter(content_type=progress_ct)

    # ADMIN: full access
    admin_group = Group.objects.get(name="Admin")
    admin_group.permissions.set(
        list(course_perms) +
        list(module_perms) +
        list(lesson_perms) +
        list(enrollment_perms) +
        list(progress_perms)
    )

    # INSTRUCTOR: CRUD courses, modules, lessons
    instructor_group = Group.objects.get(name="Instructor")
    instructor_permissions = (
        list(course_perms.filter(codename__in=["add_course","change_course","delete_course","view_course"])) +
        list(module_perms.filter(codename__in=["add_module","change_module","delete_module","view_module"])) +
        list(lesson_perms.filter(codename__in=["add_lesson","change_lesson","delete_lesson","view_lesson"]))
    )
    instructor_group.permissions.set(instructor_permissions)

    # STUDENT: view courses/modules/lessons, enroll, mark progress
    student_group = Group.objects.get(name="Student")
    student_permissions = (
        list(course_perms.filter(codename__in=["view_course"])) +
        list(module_perms.filter(codename__in=["view_module"])) +
        list(lesson_perms.filter(codename__in=["view_lesson"])) +
        list(enrollment_perms.filter(codename__in=["add_enrollment","view_enrollment"])) +
        list(progress_perms.filter(codename__in=["add_lessonprogress","change_lessonprogress","view_lessonprogress"]))
    )
    student_group.permissions.set(student_permissions)


# Assign group to new users automatically
@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def assign_user_group(sender, instance, created, **kwargs):
    if created and instance.role:
        group = Group.objects.filter(name=instance.role.capitalize()).first()
        if group:
            instance.groups.add(group)