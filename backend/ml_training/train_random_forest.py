import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
from sklearn.preprocessing import LabelEncoder
import joblib
import os

# 1. Dataset file ka bilkul sahi path (ab 500 rows wali file)
file_path = r'C:\Users\DELL\kidney-django-backend\ml_training\ckd_prediction_dataset_500_rows.xlsx'

# File load karo (error handling ke saath)
print("Trying to load dataset from:", file_path)
try:
    df = pd.read_excel(file_path)
    print("\nDataset successfully loaded!")
    print(f"Total rows: {len(df)}")
    print(f"Total columns: {len(df.columns)}")
    print("Columns:", list(df.columns))
    print("\nPehle 5 rows:")
    print(df.head().to_string(index=False))
except FileNotFoundError:
    print(f"\nError: File nahi mili is path pe → {file_path}")
    print("Check kar:")
    print("1. File ka naam exact 'ckd_prediction_dataset_500_rows.xlsx' hai?")
    print("2. File isi ml_training folder mein hai?")
    exit()
except Exception as e:
    print(f"\nKuch aur error: {str(e)}")
    exit()

# 2. Gender column ko numeric banao (male=0, female=1)
if 'gender' in df.columns:
    le = LabelEncoder()
    df['gender'] = le.fit_transform(df['gender'].astype(str))
    print("\nGender column encoded (male=0, female=1)")
else:
    print("\nWarning: 'gender' column nahi mila dataset mein!")

# 3. Features (X) aur Target (y) alag karo
if 'has_ckd' not in df.columns:
    print("\nError: Target column 'has_ckd' nahi mila dataset mein!")
    exit()

feature_columns = [col for col in df.columns if col != 'has_ckd']
X = df[feature_columns]
y = df['has_ckd']

print(f"\nFeatures used ({len(feature_columns)}): {feature_columns}")
print(f"Target: has_ckd (unique values: {y.unique()})")

# 4. Train-test split
X_train, X_test, y_train, y_test = train_test_split(
    X, y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

# 5. Random Forest model train
print("\nTraining Random Forest model... (thoda time lagega)")
rf_model = RandomForestClassifier(
    n_estimators=200,
    max_depth=8,
    random_state=42,
    class_weight='balanced'
)

rf_model.fit(X_train, y_train)

# 6. Accuracy aur report
preds = rf_model.predict(X_test)
accuracy = accuracy_score(y_test, preds)
print(f"\nModel Accuracy: {accuracy:.4f} ({accuracy*100:.2f}%)")
print("\nFull Classification Report:")
print(classification_report(y_test, preds))

# 7. Model save karo (Django ke liye)
models_folder = r'C:\Users\DELL\kidney-django-backend\models'
os.makedirs(models_folder, exist_ok=True)
model_save_path = os.path.join(models_folder, 'ckd_random_forest_500.pkl')  # naya naam daal diya taaki purana overwrite na ho

joblib.dump(rf_model, model_save_path)
print(f"\nModel successfully saved at: {model_save_path}")
print("Ab yeh file Django views.py mein load kar sakti hai!")
print("Next step: Django mein model integrate karna. Ready?")
