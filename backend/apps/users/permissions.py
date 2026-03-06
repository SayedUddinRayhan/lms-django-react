from rest_framework.permissions import BasePermission, SAFE_METHODS


class RolePermission(BasePermission):
    """
    View-level permission
    """

    def has_permission(self, request, view):
        user = request.user

        if not user or not user.is_authenticated:
            return False

        # Safe methods allowed
        if request.method in SAFE_METHODS:
            return True

        # Admin full access
        if getattr(user, "is_admin_role", False):
            return True

        allowed_roles = getattr(view, "allowed_roles", [])
        return user.role in allowed_roles


class IsOwnerOrAdmin(BasePermission):
    """
    Object-level permission
    """

    def has_object_permission(self, request, view, obj):
        user = request.user

        # Admin full access
        if getattr(user, "is_admin_role", False):
            return True

        # Course ownership
        if hasattr(obj, "instructor") and obj.instructor == user:
            return True

        # Module ownership
        if hasattr(obj, "course") and hasattr(obj.course, "instructor"):
            if obj.course.instructor == user:
                return True

        # Lesson ownership
        if hasattr(obj, "module") and hasattr(obj.module, "course"):
            if obj.module.course.instructor == user:
                return True

        # Student ownership
        if hasattr(obj, "student") and obj.student == user:
            return True

        return False