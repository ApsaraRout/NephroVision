# kidney_backend/urls.py

from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # Ye line ensure karti hai ki /accounts/ se shuru hone wale 
    # saare calls aapke core views tak pahunche
    path('accounts/', include('core.urls')), 
    
    # Agar aapne pehle 'api/' rakha tha toh use bhi rehne de sakte hain
    path('api/', include('core.urls')), 
]