from django.db import models
from django.conf import settings
class Food(models.Model):
    name = models.CharField(max_length=100, unique=True)
    sodium_mg = models.FloatField(default=0)
    potassium_mg = models.FloatField(default=0)
    phosphorus_mg = models.FloatField(default=0)
    protein_g = models.FloatField(default=0)
    category = models.CharField(max_length=150, blank=True)
    def __str__(self):
        return self.name.title()
    class Meta:
        verbose_name_plural = "Foods"
class NephroProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    egfr = models.FloatField(null=True, blank=True)
    serum_creatinine = models.FloatField(null=True, blank=True)
    blood_urea = models.FloatField(null=True, blank=True)
    blood_pressure = models.CharField(max_length=20, blank=True)
    blood_sugar = models.FloatField(null=True, blank=True)
    weight = models.FloatField(null=True, blank=True)
    daily_water = models.FloatField(null=True, blank=True)
    notes = models.TextField(blank=True)

    def __str__(self):
        return f"{self.user.email}'s Nephro Profile"
    class Meta:
        verbose_name_plural = "Nephro Profiles"
# Optional: Past records/history save karne ke liye
class NephroHistory(models.Model):
    profile = models.ForeignKey(NephroProfile, on_delete=models.CASCADE, related_name='history')
    date = models.DateField(auto_now_add=True)
    egfr = models.FloatField(null=True, blank=True)
    risk_score = models.FloatField(null=True, blank=True)  # Prediction se link kar sakte hain
    notes = models.TextField(blank=True)
    def __str__(self):
        return f"History on {self.date}"
    class Meta:
        verbose_name_plural = "Nephro Histories"

class UserActivity(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    action = models.CharField(max_length=100)
    details = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.email} - {self.action}"
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.conf import settings

@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        NephroProfile.objects.create(user=instance)