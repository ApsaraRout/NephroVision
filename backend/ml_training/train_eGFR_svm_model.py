# ────────────────────────────────────────────────
#  SVM model for predicting KDIGO eGFR Stages
#  Uses: Serum Creatinine, Age, Sex at birth, Race
# ────────────────────────────────────────────────

import pandas as pd
import numpy as np

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.svm import SVC
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import seaborn as sns
import matplotlib.pyplot as plt

# 1. Load your dataset
# Change the filename if you named it differently
df = pd.read_csv('ckd_egfr_dataset_500.csv')

print("Dataset shape:", df.shape)
print(df['eGFR Stage (KDIGO)'].value_counts())
print()

# 2. Prepare features and target
features = ['Serum Creatinine (mg/dL)', 'Age (years)', 'Sex at birth', 'Race (optional)']
target = 'eGFR Stage (KDIGO)'

X = df[features].copy()
y = df[target]

# 3. Encode categorical variables
le_sex = LabelEncoder()
le_race = LabelEncoder()

X['Sex at birth'] = le_sex.fit_transform(X['Sex at birth'])          # Female → 0, Male → 1 (usually)
X['Race (optional)'] = le_race.fit_transform(X['Race (optional)'])  # Non-Black → 0, Black → 1 (usually)

# 4. Scale numerical features (very important for SVM)
scaler = StandardScaler()
num_cols = ['Serum Creatinine (mg/dL)', 'Age (years)']

X[num_cols] = scaler.fit_transform(X[num_cols])

# 5. Train-test split
X_train, X_test, y_train, y_test = train_test_split(
    X, y,
    test_size=0.25,
    random_state=42,
    stratify=y   # important because classes are imbalanced
)

print(f"Train size: {X_train.shape[0]} | Test size: {X_test.shape[0]}\n")

# 6. Train SVM model
# You can experiment with these kernels & parameters
model = SVC(
    kernel='rbf',          # 'rbf' usually best for this kind of data
    C=1.0,                 # regularization (smaller = more regularization)
    gamma='scale',         # 'scale' or 'auto' or float (e.g. 0.1)
    class_weight='balanced',  # helps with imbalanced classes
    random_state=42,
    probability=True       # if you want predict_proba later
)

model.fit(X_train, y_train)

# 7. Predict & evaluate
y_pred = model.predict(X_test)

acc = accuracy_score(y_test, y_pred)
print(f"Accuracy: {acc:.3f}  ({acc*100:.1f}%)\n")

print("Classification Report:")
print(classification_report(y_test, y_pred))

# 8. Confusion Matrix (visual)
cm = confusion_matrix(y_test, y_pred, labels=model.classes_)

plt.figure(figsize=(9,7))
sns.heatmap(cm, annot=True, fmt='d', cmap='Blues',
            xticklabels=model.classes_,
            yticklabels=model.classes_)
plt.xlabel('Predicted')
plt.ylabel('True')
plt.title('SVM Confusion Matrix - KDIGO Stages')
plt.xticks(rotation=45, ha='right')
plt.tight_layout()
plt.show()

# Optional: save the model
import joblib
joblib.dump(model, 'svm_ckd_kdigo_model.pkl')
joblib.dump(scaler, 'scaler.pkl')
joblib.dump(le_sex, 'le_sex.pkl')
joblib.dump(le_race, 'le_race.pkl')

print("Model & preprocessors saved.")
