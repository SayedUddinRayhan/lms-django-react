from django.db.models.signals import post_migrate, post_save
from django.dispatch import receiver
from django.contrib.auth.models import Group, Permission
from django.contrib.contenttypes.models import ContentType
from django.conf import settings
from apps.courses.models import Course


# 1. Create default groups & assign permissions
@receiver(post_migrate)
def create_default_groups(sender, **kwargs):
    """
    Creates default groups (Admin, Instructor, Student) and assigns permissions
    after migrations.
    """
    # Define group names
    GROUPS = ["Admin", "Instructor", "Student"]

    # Create groups if not exists
    for group_name in GROUPS:
        Group.objects.get_or_create(name=group_name)

    # Assign permissions to Course model
    content_type = ContentType.objects.get_for_model(Course)
    course_perms = Permission.objects.filter(content_type=content_type)

    # Admin: all permissions
    admin_group = Group.objects.get(name="Admin")
    admin_group.permissions.set(course_perms)

    # Instructor: add/change/view
    instructor_group = Group.objects.get(name="Instructor")
    instructor_perms = course_perms.filter(
        codename__in=["add_course", "change_course", "view_course"]
    )
    instructor_group.permissions.set(instructor_perms)

    # Student: view only
    student_group = Group.objects.get(name="Student")
    student_perms = course_perms.filter(codename__in=["view_course"])
    student_group.permissions.set(student_perms)


# 2. Assign user to group automatically on creation
@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def assign_user_group(sender, instance, created, **kwargs):
    """
    Automatically assign a user to a group based on their role.
    Safe: skips if role is empty or group doesn't exist.
    """
    if created and instance.role:
        group = Group.objects.filter(name=instance.role.capitalize()).first()
        if group:
            instance.groups.add(group)