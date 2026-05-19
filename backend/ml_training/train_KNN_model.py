import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.neighbors import KNeighborsRegressor
from sklearn.metrics import mean_absolute_error
import joblib

# Load dataset
df = pd.read_csv("water_intake_dataset.csv")

# Encode categorical data
le_gender = LabelEncoder()
le_activity = LabelEncoder()

df["Gender"] = le_gender.fit_transform(df["Gender"])
df["Activity_Level"] = le_activity.fit_transform(df["Activity_Level"])

# Features and target
X = df[["Age", "Weight", "Gender", "Activity_Level"]]
y = df["Water_Intake_ml"]

# Split dataset
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# KNN Model (Regression because output is ml value)
knn_model = KNeighborsRegressor(n_neighbors=5)

# Train model
knn_model.fit(X_train, y_train)

# Predict
y_pred = knn_model.predict(X_test)

# Evaluate
error = mean_absolute_error(y_test, y_pred)

print("Mean Absolute Error:", error)

# Save model
joblib.dump(knn_model, "water_intake_knn_model.pkl")

print("Model saved as water_intake_knn_model.pkl")
