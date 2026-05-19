import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier, plot_tree
from sklearn.metrics import accuracy_score, classification_report
import joblib
import matplotlib.pyplot as plt
import os

# 1. Dataset load karo
file_path = r'C:\Users\DELL\kidney-django-backend\ml_training\food_risk_dataset_500.xlsx'

print("Loading dataset from:", file_path)
df = pd.read_excel(file_path)

print(f"Total rows: {len(df)}")
print("Columns:", list(df.columns))
print("\nRisk level distribution:")
print(df['risk_level'].value_counts().sort_index())

# 2. Features aur target
X = df[['sodium_mg', 'potassium_mg', 'phosphorus_mg', 'protein_g']]
y = df['risk_level']

# 3. Train-test split (80% train, 20% test)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, 
    test_size=0.2, 
    random_state=42, 
    stratify=y
)

# 4. Decision Tree model train karo (simple aur easy)
model = DecisionTreeClassifier(
    max_depth=6,              # zyada deep mat karna, overfitting avoid
    min_samples_split=10,
    random_state=42
)

model.fit(X_train, y_train)

# 5. Accuracy aur report
preds = model.predict(X_test)
accuracy = accuracy_score(y_test, preds)
print(f"\nDecision Tree Accuracy: {accuracy:.4f} ({accuracy*100:.2f}%)")
print("\nFull Classification Report:")
print(classification_report(y_test, preds, target_names=['Low Risk', 'Moderate Risk', 'High Risk']))

# 6. Model save karo (RenalRadar ke liye)
models_folder = r'C:\Users\DELL\kidney-django-backend\models'
os.makedirs(models_folder, exist_ok=True)
model_path = os.path.join(models_folder, 'food_risk_decision_tree.pkl')
joblib.dump(model, model_path)
print(f"\nModel saved at: {model_path}")

# 7. Optional: Tree visualize karo (doctor ko dikhane ke liye achha hai)
plt.figure(figsize=(12, 8))
plot_tree(model, 
          feature_names=['sodium_mg', 'potassium_mg', 'phosphorus_mg', 'protein_g'],
          class_names=['Low Risk', 'Moderate Risk', 'High Risk'],
          filled=True, rounded=True, fontsize=10)
plt.title("Decision Tree for Food CKD Risk")
plt.savefig(os.path.join(models_folder, 'food_risk_tree.png'))
print("Tree visualization saved as: food_risk_tree.png (models folder mein)")
plt.show()  # agar Jupyter ya IDE mein hai toh dikhega
