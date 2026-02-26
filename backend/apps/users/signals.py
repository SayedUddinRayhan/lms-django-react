from django.db.models.signals import post_migrate, post_save
from django.dispatch import receiver
from django.contrib.auth.models import Group, Permission
from django.contrib.contenttypes.models import ContentType
from apps.courses.models import Course
from django.conf import settings


@receiver(post_migrate)
def create_default_groups(sender, **kwargs):

    # Create Groups
    admin_group, _ = Group.objects.get_or_create(name="Admin")
    instructor_group, _ = Group.objects.get_or_create(name="Instructor")
    student_group, _ = Group.objects.get_or_create(name="Student")

    # Get course permissions
    content_type = ContentType.objects.get_for_model(Course)
    permissions = Permission.objects.filter(content_type=content_type)

    # Admin gets ALL permissions
    admin_group.permissions.set(permissions)

    # Instructor permissions
    instructor_perms = permissions.filter(
        codename__in=[
            "add_course",
            "change_course",
            "view_course",
        ]
    )
    instructor_group.permissions.set(instructor_perms)

    # Student permissions (view only)
    student_perms = permissions.filter(
        codename__in=["view_course"]
    )
    student_group.permissions.set(student_perms)



@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def assign_user_group(sender, instance, created, **kwargs):
    if created:
        group = Group.objects.get(name=instance.role.capitalize())
        instance.groups.add(group)