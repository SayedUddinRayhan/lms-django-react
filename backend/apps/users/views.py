from rest_framework import generics
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import RegisterSerializer, CustomTokenSerializer

# Register
class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer

# Login
class LoginView(TokenObtainPairView):
    serializer_class = CustomTokenSerializer