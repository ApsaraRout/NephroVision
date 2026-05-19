# train_classification_model.py
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.metrics import accuracy_score, classification_report
import joblib
import os

# CONFIG
DATA_PATH = r'C:\Users\DELL\kidney-django-backend\ml_training\nephro_5fields_500.xlsx'
TARGET_COLUMN = 'risk_level'

SAVE_DIR = r'C:\Users\DELL\kidney-django-backend\ml_training'

FEATURES = ['age', 'gender', 'serum_creatinine', 'egfr', 'weight_kg']

# Load Excel
print("Loading Excel dataset...")
df = pd.read_excel(DATA_PATH, engine='openpyxl')

print("Shape:", df.shape)
print("Columns:", df.columns.tolist())

# Missing values
df = df[FEATURES + [TARGET_COLUMN]].copy()
df.fillna(df.median(numeric_only=True), inplace=True)
df['gender'].fillna(df['gender'].mode()[0], inplace=True)

# Debug: Unique values check
print("Unique values in 'risk_level':", df[TARGET_COLUMN].unique())

# Gender encoding
le_gender = LabelEncoder()
df['gender_encoded'] = le_gender.fit_transform(df['gender'])

# Target encoding
le_target = LabelEncoder()
df['target_encoded'] = le_target.fit_transform(df[TARGET_COLUMN])

print("Unique target values after encoding:", np.unique(df['target_encoded']))
print("Number of classes detected:", len(le_target.classes_))

X = df[['age', 'gender_encoded', 'serum_creatinine', 'egfr', 'weight_kg']]
y = df['target_encoded']

# Split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Scale
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

print("\nTraining Random Forest Classifier...")

model = RandomForestClassifier(n_estimators=100, max_depth=10, random_state=42, n_jobs=-1)
model.fit(X_train_scaled, y_train)

# Predict & Evaluate
y_pred = model.predict(X_test_scaled)
accuracy = accuracy_score(y_test, y_pred)

print("\nModel Performance:")
print(f"Accuracy: {accuracy:.2%}")

# Classification Report with safe labels
unique_labels = np.unique(y_test)
target_names = [str(le_target.classes_[i]) for i in unique_labels if i < len(le_target.classes_)]
print("\nClassification Report:\n", classification_report(
    y_test, y_pred,
    labels=unique_labels,
    target_names=target_names
))

# Save
os.makedirs(SAVE_DIR, exist_ok=True)
joblib.dump(model, os.path.join(SAVE_DIR, 'rf_classifier_5fields.pkl'))
joblib.dump(scaler, os.path.join(SAVE_DIR, 'scaler_5fields.pkl'))
joblib.dump(le_gender, os.path.join(SAVE_DIR, 'gender_le_5fields.pkl'))
joblib.dump(le_target, os.path.join(SAVE_DIR, 'target_le_5fields.pkl'))

print("\nClassification model saved!")
print("Files: rf_classifier_5fields.pkl, scaler_5fields.pkl, gender_le_5fields.pkl, target_le_5fields.pkl")
