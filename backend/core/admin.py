from django.contrib import admin
from .models import Food

@admin.register(Food)
class FoodAdmin(admin.ModelAdmin):
    list_display = ('name', 'potassium_mg', 'sodium_mg', 'category')
    search_fields = ('name', 'category')
    list_filter = ('category',)
from .models import UserActivity

admin.site.register(UserActivity)