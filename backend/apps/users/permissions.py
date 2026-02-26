from rest_framework.permissions import BasePermission, SAFE_METHODS

class RolePermission(BasePermission):

    def has_permission(self, request, view):
        user = request.user
        if not user or not user.is_authenticated:
            return False

        # All roles can GET (safe methods)
        if request.method in SAFE_METHODS:
            return True

        # Admin bypass: full access
        if user.is_admin_role:
            return True

        # Allowed roles defined in view
        allowed_roles = getattr(view, "allowed_roles", [])
        return user.role in allowed_roles
    
class IsOwnerOrAdmin(BasePermission):
    """
    Admin can modify anything.
    Instructor/Student can modify only their own objects.
    """

    def has_object_permission(self, request, view, obj):
        if request.user.is_admin_role:
            return True
        # Instructor modifies only own courses/modules/lessons
        if hasattr(obj, "instructor") and obj.instructor == request.user:
            return True
        # Student modifies only their own enrollment/review
        if hasattr(obj, "student") and obj.student == request.user:
            return True
        return False