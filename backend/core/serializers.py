from rest_framework import serializers
from .models import Food, NephroProfile, NephroHistory
from django.contrib.auth.models import User   # ✅ ADD THIS

class FoodSerializer(serializers.ModelSerializer):
    class Meta:
        model = Food
        fields = ['id', 'name', 'sodium_mg', 'potassium_mg', 'phosphorus_mg', 'protein_g', 'category']


class NephroProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = NephroProfile
        fields = '__all__'
        read_only_fields = ['user', 'created_at', 'updated_at']


class NephroHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = NephroHistory
        fields = '__all__'
        read_only_fields = ['profile', 'date']


# ✅ NEW: REGISTER SERIALIZER (ADD THIS ONLY)
class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user