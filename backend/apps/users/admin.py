from django.contrib import admin
from .models import User

# Register your models here.
@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'phone', 'role', 'first_name', 'last_name', 'date_joined', 'is_staff', 'is_superuser', 'date_joined')