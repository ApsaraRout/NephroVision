from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import generics
from .models import Food, NephroProfile, NephroHistory
from .serializers import FoodSerializer, NephroProfileSerializer, NephroHistorySerializer
import joblib
import numpy as np
import os
from dotenv import load_dotenv
from openai import OpenAI
from django.http import JsonResponse
import json
from sklearn.feature_extraction.text import HashingVectorizer
import joblib
from django.conf import settings
# PDF Report Generator
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer,  Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.pagesizes import A4
from django.http import HttpResponse
import io
from reportlab.lib import colors
from datetime import datetime
import uuid
import matplotlib
matplotlib.use('Agg')   # GUI disable karega
import matplotlib.pyplot as plt
from reportlab.platypus import Image
from reportlab.lib.units import inch
from django.contrib.auth import get_user_model

User = get_user_model()
from rest_framework.authtoken.models import Token
import random
import string
from .models import NephroHistory
from .models import UserActivity
def save_activity(user, action, details=""):
    UserActivity.objects.create(
        user=user,
        action=action,
        details=details
    )
BASE_DIR = settings.BASE_DIR

MODEL_PATH = os.path.join(BASE_DIR, "ml_training", "water_model.pkl")
SCALER_PATH = os.path.join(BASE_DIR, "ml_training", "scaler.pkl")

water_model = joblib.load(MODEL_PATH)
water_scaler = joblib.load(SCALER_PATH)

chatbot_model = joblib.load(os.path.join(BASE_DIR,"ml_training","chatbot_model.pkl"))

vectorizer = joblib.load(os.path.join(BASE_DIR,"ml_training","chatbot_vectorizer.pkl"))

# Create vectorizer (same as training)
vectorizer = joblib.load(os.path.join(BASE_DIR,"ml_training","chatbot_vectorizer.pkl"))

load_dotenv()




client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Random Forest model for predict_risk
MODEL_PATH = r'C:\Users\DELL\kidney-django-backend\models\ckd_random_forest.pkl'

try:
    rf_model = joblib.load(MODEL_PATH)
    print("ML model loaded successfully! (72% accuracy from 500 samples)")
except FileNotFoundError:
    print(f"Model file nahi mili → {MODEL_PATH}")
    rf_model = None

# RenalRadar Decision Tree model
FOOD_MODEL_PATH = r'C:\Users\DELL\kidney-django-backend\models\food_risk_decision_tree.pkl'

try:
    food_model = joblib.load(FOOD_MODEL_PATH)
    print("RenalRadar Decision Tree model loaded! (95% accuracy)")
except FileNotFoundError:
    print(f"Food model nahi mila → {FOOD_MODEL_PATH}")
    food_model = None
except Exception as e:
    print(f"Food model load error: {str(e)}")
    food_model = None


class NephroProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = NephroProfileSerializer
    permission_classes = [AllowAny]

    def get_object(self):
        profile = NephroProfile.objects.first()

        if not profile:
            profile = NephroProfile.objects.create()

        return profile
class NephroHistoryListCreateView(generics.ListCreateAPIView):
    serializer_class = NephroHistorySerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return NephroHistory.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
# RenalRadar endpoints
@api_view(['GET'])
def food_list(request):
    foods = Food.objects.all()
    serializer = FoodSerializer(foods, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def food_detail(request, name):

    import re

    # 🔧 helper: clean name (remove numbers, lowercase)
    def clean_name(n):
        return re.sub(r'\d+', '', str(n)).strip().lower()

    if not name or not str(name).strip():
        return Response({"error": "Food name is required"}, status=400)

    search_name = str(name).strip()

    # ===== 1. EXACT MATCH (BEST CASE) =====
    food = Food.objects.filter(name__iexact=search_name).first()

    # ===== 2. CLEAN MATCH (ignore numbers like sushi 20) =====
    if not food:
        foods = Food.objects.filter(name__icontains=search_name)

        for f in foods:
            if clean_name(f.name) == clean_name(search_name):
                food = f
                break

    # ===== 3. FALLBACK → SHORTEST NAME =====
    if not food:
        foods = Food.objects.filter(name__icontains=search_name)
        food = sorted(foods, key=lambda x: len(x.name))[0] if foods else None

    # ===== 4. NOT FOUND =====
    if not food:
        return Response({
            "error": f"Food '{search_name}' not found"
        }, status=404)

    serializer = FoodSerializer(food)

    # ===== 5. ML PREDICTION =====
    if food_model is not None:
        try:
            features = [[
                float(food.sodium_mg or 0),
                float(food.potassium_mg or 0),
                float(food.phosphorus_mg or 0),
                float(food.protein_g or 0)
            ]]

            risk_pred = food_model.predict(features)[0]
            risk_prob = food_model.predict_proba(features)[0].max() * 100

            risk_levels = {
                0: "Low Risk",
                1: "Moderate Risk",
                2: "High Risk"
            }

            risk_colors = {
                0: "green",
                1: "orange",
                2: "red"
            }

            response_data = serializer.data.copy()
            response_data['ml_risk_level'] = risk_levels.get(risk_pred, "Unknown")
            response_data['ml_risk_prob'] = round(risk_prob, 2)
            response_data['ml_risk_color'] = risk_colors.get(risk_pred, "gray")
            response_data['model_used'] = "Decision Tree"

            return Response(response_data)

        except Exception as e:
            print("ML error:", e)
            return Response(serializer.data)

    return Response(serializer.data)
@api_view(['POST'])
def predict_risk(request):
    try:
        data = request.data

        features_list = [
            float(data.get('age', 0)),
            1 if data.get('gender', '').lower() == 'male' else 0,
            1 if data.get('swelling', False) else 0,
            1 if data.get('puffyFace', False) else 0,
            1 if data.get('foamyUrine', False) else 0,
            1 if data.get('darkUrine', False) else 0,
            1 if data.get('lessUrine', False) else 0,
            1 if data.get('nocturia', False) else 0,
            1 if data.get('burningUrination', False) else 0,
            1 if data.get('bloodInUrine', False) else 0,
            1 if data.get('fatigue', False) else 0,
            1 if data.get('lowEnergy', False) else 0,
            1 if data.get('lossOfAppetite', False) else 0,
            1 if data.get('nausea', False) else 0,
            1 if data.get('metallicTaste', False) else 0,
            1 if data.get('shortnessOfBreath', False) else 0,
            1 if data.get('itchySkin', False) else 0,
            1 if data.get('muscleCramps', False) else 0,
            1 if data.get('brainFog', False) else 0,
            1 if data.get('highBP', False) else 0,
            1 if data.get('chestPain', False) else 0,
            1 if data.get('veryLittleUrine', False) else 0,
            1 if data.get('severeSymptoms', False) else 0,
            1 if data.get('diabetes', False) else 0,
            1 if data.get('hypertension', False) else 0,
            1 if data.get('overweight', False) else 0,
            1 if data.get('familyHistory', False) else 0,
            1 if data.get('frequentPainkillers', False) else 0,
            1 if data.get('smokingAlcohol', False) else 0,
            1 if data.get('lowWaterIntake', False) else 0,
            1 if data.get('frequentUTIs', False) else 0,
        ]

        features = np.array([features_list])

        if rf_model is None:
            return Response({"error": "ML model load nahi hua."}, status=500)

        prob = rf_model.predict_proba(features)[0][1]
        risk_score = round(prob * 100, 2)

        if risk_score >= 70:
            risk_level = "High Risk"
            color = "red"
            advice = "High probability of chronic kidney disease. Consult a nephrologist urgently."
        elif risk_score >= 30:
            risk_level = "Moderate Risk"
            color = "orange"
            advice = "Moderate risk identified. Lifestyle changes and doctor visit recommended."
        else:
            risk_level = "Low Risk"
            color = "green"
            advice = "Low risk based on inputs. Maintain healthy habits."

        if request.user.is_authenticated:
            print("AUTH TRUE")   # optional debug
            profile = NephroProfile.objects.get(user=request.user)
            print("SAVING ACTIVITY...")   # 🔥 YEH YAHI ADD KARNA HAI
             
            NephroHistory.objects.create(
                profile=profile,
                risk_score=risk_score,
                notes=f"Risk: {risk_level}"
            )
            save_activity(
                request.user,
                "PREDICT",
                f"Score: {risk_score}, Level: {risk_level}"
            )
        return Response({
            "score": risk_score,
            "risk_level": risk_level,
            "color": color,
            "advice": advice,
            "probability": risk_score,
            "model_used": "Random Forest (72% accuracy on 500 samples)"
        })

    except Exception as e:
        return Response({"error": f"Prediction error: {str(e)}"}, status=500)
 

@api_view(['POST'])
def health_chatbot(request):

    message = request.data.get("message", "").lower().strip()

    disclaimer = "⚠️ This AI provides general health information only. If symptoms are serious, please consult a doctor.\n\n"

    # ===== ML CHATBOT PREDICTION =====
    try:
        vector = vectorizer.transform([message])
        probs = chatbot_model.predict_proba(vector)
        confidence = probs.max()

        ml_reply = chatbot_model.predict(vector)[0]

        if confidence > 0.55:
            return Response({
                "reply": ml_reply,
                "show_disclaimer": True
            })

    except Exception as e:
        print("ML CHATBOT ERROR:", e)

    # Greeting
    if any(word in message for word in ["hi","hello","hey"]):
        reply = "Hello! I am Dr. BOT. How can I help you with your health today?"
        return Response({
    "reply": reply,
    "show_disclaimer": False
})

    
    # Kidney related
    elif any(word in message for word in ["kidney","renal","ckd","urine","swelling","foamy","creatinine"]):
        reply = (
            "Kidney problems may show symptoms like swelling in legs, foamy urine, fatigue, or reduced urine output.\n\n"
            "Prevention tips:\n"
            "• Drink 2.5–3L water daily\n"
            "• Reduce salt intake\n"
            "• Control blood pressure & diabetes\n"
            "• Avoid excessive painkillers\n"
        )

    # Blood pressure
    elif any(word in message for word in ["bp","blood pressure","hypertension"]):
        reply = (
            "High blood pressure can damage kidneys over time.\n\n"
            "Tips:\n"
            "• Reduce salt\n"
            "• Exercise regularly\n"
            "• Maintain healthy weight\n"
            "• Monitor BP regularly"
        )

    # Creatinine
    elif "creatinine" in message:
        reply = (
            "Creatinine is a waste product filtered by the kidneys.\n"
            "High creatinine may indicate reduced kidney function.\n"
            "A doctor may recommend blood tests and eGFR evaluation."
        )

    # eGFR
    elif "egfr" in message:
        reply = (
            "eGFR indicates kidney filtering ability.\n\n"
            "Normal: 90+\n"
            "Mild reduction: 60–89\n"
            "Moderate CKD: 30–59\n"
            "Severe CKD: below 30"
        )

    # Water
    elif any(word in message for word in ["water","hydration","drink water"]):
        reply =  "Most adults should drink around 2.5–3.5 liters of water daily depending on activity level."

    # Diet
    elif any(word in message for word in ["diet","food","eat","nutrition"]):
        reply =(
            "Kidney friendly diet:\n"
            "• Low salt foods\n"
            "• Fresh fruits & vegetables\n"
            "• Avoid processed foods\n"
            "• Moderate protein intake"
        )

    else:
        try:
            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {
                        "role": "system",
                        "content": "You are a helpful medical assistant. Answer only health related questions in simple English."
                    },
                    {
                        "role": "user",
                        "content": message
                    }
                ]
            )

            ai_reply = response.choices[0].message.content
            reply = disclaimer + ai_reply
            
        except Exception as e:
            print("OPENAI ERROR:", e)
            reply = "AI service temporarily unavailable."
    return Response({"reply": reply})
@api_view(['POST'])
def calculate_egfr(request):
    try:
        # Har request pe model load kar lo (simple aur safe)
        egfr_model = joblib.load(r'C:\Users\DELL\kidney-django-backend\ml_training\svm_ckd_kdigo_model.pkl')
        egfr_scaler = joblib.load(r'C:\Users\DELL\kidney-django-backend\ml_training\scaler.pkl')
        le_sex = joblib.load(r'C:\Users\DELL\kidney-django-backend\ml_training\le_sex.pkl')
        le_race = joblib.load(r'C:\Users\DELL\kidney-django-backend\ml_training\le_race.pkl')

        data = request.data
        print("FRONTEND DATA:", data)
        age = float(data.get('age', 40))
        gender = data.get('gender', 'female').capitalize()
        serum_creatinine = float(data.get('serum_creatinine', 0.9))
        race = data.get('race', 'non-black')  # agar frontend se race bhej rahi ho

        # Encoding
        sex_encoded = le_sex.transform([gender])[0]
        if race not in le_race.classes_:
            race = le_race.classes_[0]   # default safe value

        race_encoded = le_race.transform([race])[0]
        # Features (training ke hisaab se adjust kar — agar weight bhi tha toh add kar)
        features = np.array([[
            serum_creatinine,
            sex_encoded,
            race_encoded,
            age
        ]])

        
        pred_encoded = egfr_model.predict(features)[0]

        # Stage label (agar label encoder tha)
        egfr_stage = f"{pred_encoded}"  # agar inverse nahi hai toh direct number
        # Agar inverse_transform chahiye toh alag label encoder tha toh bata

        return Response({
            "egfr_stage": egfr_stage,
            "model_accuracy": "90.4%",
            "message": "Yeh SVM model se predicted KDIGO stage hai. Doctor se confirm karwao."
        })

    except Exception as e:
        return Response({"error": str(e)}, status=400)
    
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.http import HttpResponse
import io
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import inch
from datetime import datetime
import matplotlib.pyplot as plt

# ====== eGFR chart generator ======
def generate_egfr_chart(egfr_value):
    try:
        egfr_value = float(egfr_value)
    except (ValueError, TypeError):
        egfr_value = 0

    fig, ax = plt.subplots(figsize=(4,2))
    ax.barh(0.5, min(egfr_value,120), height=0.3, color='green')
    ax.set_xlim(0, 120)
    ax.set_yticks([])
    ax.set_xlabel('eGFR (mL/min/1.73m²)')
    ax.set_title('eGFR Indicator', fontsize=10)

    buffer = io.BytesIO()
    plt.savefig(buffer, format='png', bbox_inches='tight')
    plt.close(fig)
    buffer.seek(0)
    return buffer

# ====== PDF Download Function ======
from rest_framework.decorators import api_view
from django.http import HttpResponse
import io
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import inch
from datetime import datetime
import matplotlib.pyplot as plt

# ===== Helper: Generate eGFR Graph =====
def generate_egfr_chart(egfr_value):
    try:
        egfr_value = float(egfr_value)
    except (ValueError, TypeError):
        egfr_value = 0

    fig, ax = plt.subplots(figsize=(5,1.5))

    # Risk zones: Red <30, Yellow 30-60, Green >60
    ax.barh(0, 30, color='red', height=0.4)
    ax.barh(0, 60, left=30, color='yellow', height=0.4)
    ax.barh(0, 120-60, left=60, color='green', height=0.4)

    # eGFR actual value bar
    ax.barh(0, min(egfr_value, 120), color='grey', height=0.2)

    # Value label
    ax.text(egfr_value + 2, 0, f"{egfr_value:.1f}", va='center', fontweight='bold')

    ax.set_xlim(0, 120)
    ax.set_yticks([])
    ax.set_xlabel('eGFR (mL/min/1.73m²)')
    ax.set_frame_on(False)

    buffer = io.BytesIO()
    plt.savefig(buffer, format='png', bbox_inches='tight', dpi=120)
    plt.close(fig)
    buffer.seek(0)
    return buffer

# ===== PDF Download API =====
from rest_framework.decorators import api_view
from django.http import HttpResponse
import io
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image, Frame
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from datetime import datetime
import matplotlib.pyplot as plt

def generate_egfr_chart(egfr_value):
    """Generate color-coded eGFR bar chart with risk indication"""
    try:
        egfr_value = float(egfr_value)
    except (ValueError, TypeError):
        egfr_value = 0

    fig, ax = plt.subplots(figsize=(5,1.5))
    ax.set_xlim(0, 120)
    ax.set_ylim(0,1)
    ax.axis('off')

    # Color zones
    zones = [(0, 30, 'red'), (30, 60, 'orange'), (60, 90, 'yellow'), (90, 120, 'green')]
    for start, end, color in zones:
        ax.barh(0.5, end-start, left=start, height=0.5, color=color, alpha=0.6)

    # Indicator for actual eGFR
    ax.plot([egfr_value, egfr_value], [0,1], color='blue', linewidth=3, label=f'eGFR: {egfr_value:.1f}')
    ax.text(egfr_value + 1, 0.75, f'{egfr_value:.1f}', color='blue', fontsize=10)

    buffer = io.BytesIO()
    plt.savefig(buffer, format='png', bbox_inches='tight')
    plt.close(fig)
    buffer.seek(0)
    return buffer

@api_view(['GET','POST'])
def download_kidney_report(request):
    data = request.data
    age = data.get('age', 'N/A')
    gender = data.get('gender', 'N/A').capitalize()
    serum_creatinine = data.get('serum_creatinine', 'N/A')
    race = data.get('race', 'N/A').capitalize()
    egfr = data.get('egfr', 0)

    # ====== PDF Setup ======
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4, rightMargin=40, leftMargin=40, topMargin=40, bottomMargin=40)

    styles = getSampleStyleSheet()
    styles.add(ParagraphStyle(name='HeadingBlue', fontName='Times-Roman', fontSize=14, leading=16, textColor=colors.white, backColor=colors.HexColor('#003366'), spaceAfter=6, leftIndent=4, rightIndent=4))
    styles.add(ParagraphStyle(name='NormalGray', fontName='Times-Roman', fontSize=11, leading=14, textColor=colors.HexColor('#333333')))
    styles.add(ParagraphStyle(name='NormalBlue', fontName='Times-Roman', fontSize=11, leading=14, textColor=colors.HexColor('#003366')))

    elements = []

    # ====== Title ======
    elements.append(Paragraph("RENAL HEALTH ASSESSMENT REPORT", styles['HeadingBlue']))
    elements.append(Spacer(1, 12))

    # ====== Patient Info Table ======
    patient_data = [
        ['Patient Details', ''],
        ['Age', age],
        ['Gender', gender],
        ['Serum Creatinine (mg/dL)', serum_creatinine],
        ['Race', race],
        ['Report Date', datetime.now().strftime("%d-%b-%Y %H:%M")]
    ]
    table = Table(patient_data, colWidths=[200, 250])
    table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#003366')),
        ('TEXTCOLOR', (0,0), (-1,0), colors.white),
        ('BACKGROUND', (0,1), (-1,-1), colors.HexColor('#f2f2f2')),
        ('GRID', (0,0), (-1,-1), 0.5, colors.grey),
        ('FONTNAME', (0,0), (-1,-1), 'Times-Roman'),
        ('FONTSIZE', (0,0), (-1,-1), 11),
        ('VALIGN',(0,0),(-1,-1),'MIDDLE')
    ]))
    elements.append(table)
    elements.append(Spacer(1, 12))

    # ====== eGFR Graph ======
    elements.append(Paragraph("Kidney Function Graph (eGFR):", styles['NormalBlue']))
    chart_buffer = generate_egfr_chart(egfr)
    img = Image(chart_buffer, width=5*inch, height=1.5*inch)
    elements.append(img)
    elements.append(Spacer(1, 12))

    # ====== Symptoms & Risk ======
    elements.append(Paragraph("Symptoms & Risk Prediction:", styles['HeadingBlue']))
    symptoms = [
        "Fatigue or weakness",
        "Swelling in feet, ankles, or hands",
        "Urination changes",
        "High blood pressure"
    ]
    for s in symptoms:
        elements.append(Paragraph(f"- {s}", styles['NormalGray']))
    elements.append(Spacer(1, 12))

    # ====== Advice Section ======
    elements.append(Paragraph("Dietary & Lifestyle Advice:", styles['HeadingBlue']))
    advice = [
        "Maintain adequate hydration.",
        "Limit salt and processed foods.",
        "Engage in regular physical activity.",
        "Monitor kidney function periodically.",
        "Consult a nephrologist if symptoms persist."
    ]
    for a in advice:
        elements.append(Paragraph(f"- {a}", styles['NormalGray']))
    elements.append(Spacer(1, 12))

    # ====== Tools Reference ======
    elements.append(Paragraph("Tools Reference:", styles['HeadingBlue']))
    tools = [
        "Risk Prediction with Symptoms",
        "Food Analyzer for Kidney",
        "Water Intake Tracker",
        "Chatbot",
        "eGFR Calculator"
    ]
    for t in tools:
        elements.append(Paragraph(f"- {t}", styles['NormalGray']))

    # ====== Build PDF ======
    doc.build(elements)
    buffer.seek(0)
    return HttpResponse(buffer, content_type='application/pdf')

@api_view(['POST'])
@permission_classes([AllowAny])
def water_predict(request):
    try:
        model = joblib.load(MODEL_PATH)
        scaler = joblib.load(SCALER_PATH)

        input_data = [[
            float(request.data.get('eGFR')),
            float(request.data.get('gender')),
            float(request.data.get('weight_kg')),
            float(request.data.get('age')),
            float(request.data.get('height_cm')),
            float(request.data.get('activity_level')),
            float(request.data.get('climate_temp_c')),
            float(request.data.get('has_edema')),
            float(request.data.get('has_heart_failure')),
            float(request.data.get('urine_output_ml'))
        ]]

        scaled_data = scaler.transform(input_data)
        prediction = water_model.predict(scaled_data)

        water = round(float(prediction[0]), 2)

# 🔥 Smart advice logic
        if water < 2:
            advice = "Increase water intake"
        elif water > 3.5:
            advice = "Avoid overhydration"
        else:
            advice = "Optimal hydration"

        return Response({
            "recommended_water_liters": water,
            "advice": advice
            })

    except Exception as e:
        return Response({"error": str(e)})
# accounts/views.py
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate, login
from django.core.mail import send_mail
from django.conf import settings # Settings se EMAIL_HOST_USER lene ke liye
from django.contrib.auth import authenticate, login, logout

@api_view(['POST'])
def login_view(request):
    email = request.data.get('email')
    password = request.data.get('password')

    try:
        user = User.objects.get(email=email)

        if user.check_password(password):
            token, _ = Token.objects.get_or_create(user=user)

            return Response({
                'token': token.key,   # 🔥 IMPORTANT
                'user': {
                    'email': user.email,
                    'full_name': user.full_name
                }
            })

        else:
            return Response({'error': 'Invalid credentials'}, status=401)

    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=404)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    logout(request)
    return Response({'message': 'Logged out successfully!'})
@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    email = request.data.get('email')
    full_name = request.data.get('full_name')

    # ✅ validation
    if not email or not full_name:
        return Response({'error': 'Email and name required'}, status=400)

    # ✅ check user
    if User.objects.filter(email=email).exists():
        return Response({'error': 'User already exists'}, status=400)

    # 🔥 STEP 1: PASSWORD GENERATE (YEH MISS HAI TUMSE)
    import random
    import string

    generated_password = ''.join(random.choices(
        string.ascii_letters + string.digits, k=8
    ))

    # 🔥 STEP 2: USER CREATE
    user = User.objects.create_user(
        email=email,
        password=generated_password,
        full_name=full_name
    )

    # 🔥 STEP 3: RESPONSE
    return Response({
        "message": "User registered successfully",
        "generated_password": generated_password
    })