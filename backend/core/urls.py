from django.urls import path
from .views import (
    predict_risk, food_list, food_detail, NephroProfileView, 
    NephroHistoryListCreateView, calculate_egfr, download_kidney_report, 
    health_chatbot, water_predict, login_view, logout_view, 
    register_view
)

urlpatterns = [
    # Authentication
    path('register/', register_view),
    path('login/', login_view),
    path('logout/', logout_view),

    # === FOOD URLS - Yeh sabse important hai ===
    path('food/', food_list, name='food_list'),                    # Changed
    path('food/<str:name>/', food_detail, name='food_detail'),     # Changed (no -detail)

    # Baaki sab
    path('predict-risk/', predict_risk),
    path('nephro-profile/', NephroProfileView.as_view()),
    path('nephro-history/', NephroHistoryListCreateView.as_view()),
    path('calculate-egfr/', calculate_egfr),
    path('download-kidney-report/', download_kidney_report),
    path('health-chat/', health_chatbot),
    path('water-predict/', water_predict),
]