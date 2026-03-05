from rest_framework.permissions import BasePermission, SAFE_METHODS

class RolePermission(BasePermission):
    """
    View-level permission:
    - Safe methods (GET, HEAD, OPTIONS) allowed for all.
    - Admin: full access.
    - Other roles: allowed_roles must be defined in the view.
    """
    def has_permission(self, request, view):
        user = request.user
        if not user or not user.is_authenticated:
            return False

        # Safe methods are allowed for everyone
        if request.method in SAFE_METHODS:
            return True

        # Admin: full access
        if hasattr(user, "is_admin_role") and user.is_admin_role:
            return True

        # Allowed roles defined on the view
        allowed_roles = getattr(view, "allowed_roles", [])
        return user.role in allowed_roles


class IsOwnerOrAdmin(BasePermission):
    """
    Object-level permission:
    - Admin can modify any object.
    - Instructor can modify objects where obj.instructor == request.user
    - Student can modify objects where obj.student == request.user
    """
    def has_object_permission(self, request, view, obj):
        user = request.user

        # Admin can do anything
        if hasattr(user, "is_admin_role") and user.is_admin_role:
            return True

        # Instructor modifies own courses/modules/lessons
        if hasattr(obj, "instructor") and obj.instructor == user:
            return True

        # Student modifies own enrollments/progress
        if hasattr(obj, "student") and obj.student == user:
            return True

        return False