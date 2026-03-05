# users/serializers.py
from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import authenticate

User = get_user_model()

# users/serializers.py - RegisterSerializer
# users/serializers.py
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    password2 = serializers.CharField(write_only=True, required=True)  # ✅ Add confirm field

    class Meta:
        model = User
        fields = ["id", "username", "email", "phone", "password", "password2", "role"]
        extra_kwargs = {
            "role": {"required": False, "allow_blank": True},
            "phone": {"required": False, "allow_blank": True},
        }

    def validate(self, attrs):
        # ✅ Server-side password match check
        if attrs["password"] != attrs["password2"]:
            raise serializers.ValidationError({"password2": "Passwords do not match"})
        return attrs

    def create(self, validated_data):
        # ✅ Remove password2 before creating user
        validated_data.pop("password2")
        
        # ✅ Default to empty role if not provided
        if "role" not in validated_data or not validated_data["role"]:
            validated_data["role"] = ""
            
        return User.objects.create_user(**validated_data)


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "phone", "role"]

class CustomTokenSerializer(TokenObtainPairSerializer):
    username_field = "username"

    def validate(self, attrs):
        username = attrs.get("username")
        password = attrs.get("password")

        user = authenticate(
            request=self.context.get("request"),
            username=username,
            password=password
        )

        if not user:
            raise serializers.ValidationError("Invalid credentials")

        refresh = self.get_token(user)

        return {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "phone": user.phone,
                "role": user.role,
            }
        }