from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLE_CHOICES = (
        ("admin", "Admin"),
        ("student", "Student"),
        ("instructor", "Instructor"),
    )

    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="student")
    phone = models.CharField(max_length=20, unique=True, null=True, blank=True)

    class Meta:
        ordering = ["-date_joined"]

    def __str__(self):
        return f"{self.username} ({self.role})"

    # Convenience properties
    @property
    def is_admin_role(self):
        return self.role == "admin"

    @property
    def is_student_role(self):
        return self.role == "student"

    @property
    def is_instructor_role(self):
        return self.role == "instructor"