from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.forms import UserCreationForm, UserChangeForm
from django import forms
from .models import User

# 1. Custom UserCreationForm
class CustomUserCreationForm(UserCreationForm):
    class Meta:
        model = User
        fields = ("username", "email", "phone", "role")

# 2. Custom UserChangeForm
class CustomUserChangeForm(UserChangeForm):
    class Meta:
        model = User
        fields = ("username", "email", "phone", "role")

# 3. Custom UserAdmin
class UserAdmin(BaseUserAdmin):
    add_form = CustomUserCreationForm
    form = CustomUserChangeForm
    model = User

    list_display = ("username", "email", "phone", "role", "is_staff", "is_superuser")
    list_filter = ("role", "is_staff", "is_superuser")
    fieldsets = (
        (None, {"fields": ("username", "email", "phone", "password")}),
        ("Permissions", {"fields": ("role", "is_active", "is_staff", "is_superuser", "groups", "user_permissions")}),
    )
    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": ("username", "email", "phone", "role", "password1", "password2", "is_staff", "is_superuser")}
        ),
    )
    search_fields = ("username", "email", "phone")
    ordering = ("username",)

admin.site.register(User, UserAdmin)