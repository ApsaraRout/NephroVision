import pandas as pd
import numpy as np
import joblib

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.metrics import mean_absolute_error, r2_score

from xgboost import XGBRegressor

# =========================
# LOAD DATA
# =========================
df = pd.read_csv("water_intake_recommendation_700.csv")  # <-- apna dataset

# =========================
# TARGET COLUMN
# =========================
target = "water_intake"   # <-- IMPORTANT (liters)

# =========================
# HANDLE CATEGORICAL DATA
# =========================
le = LabelEncoder()

for col in df.columns:
    if df[col].dtype == 'object':
        df[col] = le.fit_transform(df[col])

# =========================
# SPLIT FEATURES & TARGET
# =========================
X = df.drop(target, axis=1)
y = df[target]

# =========================
# TRAIN TEST SPLIT
# =========================
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# =========================
# SCALING
# =========================
scaler = StandardScaler()
X_train = scaler.fit_transform(X_train)
X_test = scaler.transform(X_test)

# =========================
# MODEL (XGBOOST REGRESSOR)
# =========================
model = XGBRegressor(
    n_estimators=300,
    learning_rate=0.05,
    max_depth=5,
    random_state=42
)

model.fit(X_train, y_train)

# =========================
# EVALUATION
# =========================
y_pred = model.predict(X_test)

print("MAE:", mean_absolute_error(y_test, y_pred))
print("R2 Score:", r2_score(y_test, y_pred))

# =========================
# SAVE MODEL
# =========================
joblib.dump(model, "water_model.pkl")
joblib.dump(scaler, "scaler.pkl")

print("✅ Water Intake Model Saved Successfully!")
