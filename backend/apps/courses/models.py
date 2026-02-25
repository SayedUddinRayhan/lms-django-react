from django.db import models
from django.utils.text import slugify
from django.conf import settings
from django.core.exceptions import ValidationError
from django.db.models import Avg
from django.utils import timezone
import uuid
from django.core.validators import MinValueValidator, MaxValueValidator


class Category(models.Model):
    name = models.CharField(max_length=150, unique=True)
    slug = models.SlugField(unique=True, blank=True)
    is_active = models.BooleanField(default=True, db_index=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["name"]

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.name)
            slug = base_slug
            counter = 1
            while Category.objects.filter(slug=slug).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug

        self.full_clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name



class Course(models.Model):

    STATUS_CHOICES = (
        ("draft", "Draft"),
        ("published", "Published"),
        ("archived", "Archived"),
    )

    title = models.CharField(max_length=255)
    slug = models.SlugField(unique=True, blank=True)
    description = models.TextField()

    thumbnail = models.ImageField(upload_to="courses/thumbnails/", blank=True, null=True)

    category = models.ForeignKey(
        Category,
        on_delete=models.SET_NULL,
        null=True,
        related_name="courses"
    )

    instructor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="instructed_courses",
        limit_choices_to={"role": "instructor"}
    )

    price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    is_free = models.BooleanField(default=False)

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="draft", db_index=True)
    is_active = models.BooleanField(default=True, db_index=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["slug"]),
            models.Index(fields=["status"]),
        ]

    def clean(self):
        if self.status == "published":
            if not self.thumbnail:
                raise ValidationError("Thumbnail required to publish.")

            if not self.modules.filter(is_active=True).exists():
                raise ValidationError("At least one module required.")

            if not Lesson.objects.filter(
                module__course=self,
                is_active=True
            ).exists():
                raise ValidationError("At least one lesson required.")

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.title)
            slug = base_slug
            counter = 1
            while Course.objects.filter(slug=slug).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug

        self.full_clean()
        super().save(*args, **kwargs)

    @property
    def total_lessons(self):
        return Lesson.objects.filter(
            module__course=self,
            is_active=True
        ).count()

    @property
    def total_students(self):
        return self.enrollments.filter(
            payment_status="paid"
        ).count()

    @property
    def average_rating(self):
        return self.reviews.aggregate(avg=Avg("rating"))["avg"] or 0

    def __str__(self):
        return self.title



class Module(models.Model):

    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name="modules"
    )

    title = models.CharField(max_length=255)
    order = models.PositiveIntegerField(default=0, db_index=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["order"]
        unique_together = ["course", "order"]

    def __str__(self):
        return f"{self.course.title} - {self.title}"


class Lesson(models.Model):

    CONTENT_TYPES = (
        ("video", "Video"),
        ("article", "Article"),
        ("file", "File"),
    )

    module = models.ForeignKey(
        Module,
        on_delete=models.CASCADE,
        related_name="lessons"
    )

    title = models.CharField(max_length=255)
    content_type = models.CharField(max_length=20, choices=CONTENT_TYPES)

    video_url = models.URLField(blank=True, null=True)
    content = models.TextField(blank=True, null=True)
    file = models.FileField(upload_to="lessons/files/", blank=True, null=True)

    duration_minutes = models.PositiveIntegerField(default=0)
    order = models.PositiveIntegerField(default=0, db_index=True)

    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["order"]
        unique_together = ["module", "order"]

    def is_unlocked_for(self, student):
        lessons = Lesson.objects.filter(
            module__course=self.module.course,
            is_active=True
        ).order_by("module__order", "order")

        previous = lessons.filter(
            module__order__lt=self.module.order
        ) | lessons.filter(
            module=self.module,
            order__lt=self.order
        )

        if not previous.exists():
            return True

        completed = LessonProgress.objects.filter(
            student=student,
            lesson__in=previous,
            is_completed=True
        ).count()

        return completed == previous.count()

    def __str__(self):
        return f"{self.module.title} - {self.title}"

    def clean(self):
        if self.content_type == "video" and not self.video_url:
            raise ValidationError("Video URL required.")
        if self.content_type == "article" and not self.content:
            raise ValidationError("Article content required.")
        if self.content_type == "file" and not self.file:
            raise ValidationError("File required.")


class Enrollment(models.Model):

    PAYMENT_STATUS = (
        ("pending", "Pending"),
        ("paid", "Paid"),
        ("failed", "Failed"),
        ("refunded", "Refunded"),
    )

    student = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="enrollments",
        limit_choices_to={"role": "student"}
    )

    course = models.ForeignKey(
        Course,
        on_delete=models.PROTECT,
        related_name="enrollments"
    )

    price_paid = models.DecimalField(max_digits=10, decimal_places=2)
    payment_status = models.CharField(
        max_length=20,
        choices=PAYMENT_STATUS,
        default="pending",
        db_index=True
    )

    completed = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    enrolled_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ["student", "course"]
        ordering = ["-enrolled_at"]

    def __str__(self):
        return f"{self.student} - {self.course}"
    
    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

    def clean(self):
        if self.course.is_free and self.price_paid != 0:
            raise ValidationError("Free course cannot have payment.")

        if not self.course.is_free and self.price_paid <= 0:
            raise ValidationError("Paid course must have price.")


class LessonProgress(models.Model):

    student = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="lesson_progress"
    )

    lesson = models.ForeignKey(
        Lesson,
        on_delete=models.CASCADE,
        related_name="progress_records"
    )

    is_completed = models.BooleanField(default=False, db_index=True)
    watched_seconds = models.PositiveIntegerField(default=0)

    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        unique_together = ["student", "lesson"]

    def mark_completed(self):
        if hasattr(self.lesson, "quiz"):
            attempt = self.lesson.quiz.attempts.filter(
                student=self.student,
                passed=True
            ).exists()
            if not attempt:
                raise ValidationError("Quiz must be passed first.")

        self.is_completed = True
        self.completed_at = timezone.now()
        self.save()

    def __str__(self):
        return f"{self.student} - {self.lesson}"


    

class Review(models.Model):

    student = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )

    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name="reviews"
    )

    rating = models.PositiveSmallIntegerField(
        validators=[
        MinValueValidator(1),
        MaxValueValidator(5)
    ]
    )
    comment = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ["student", "course"]

    def __str__(self):
        return f"{self.student} - {self.course} ({self.rating})"
    