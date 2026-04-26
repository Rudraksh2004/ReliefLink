import joblib
import sys
import os

def predict_category(text):
    if not text or not text.strip():
        return "Error: Empty text provided"

    try:
        # Load the saved model and vectorizer
        # We use absolute paths or relative to the script location
        script_dir = os.path.dirname(os.path.abspath(__file__))
        model_path = os.path.join(script_dir, 'model.pkl')
        vectorizer_path = os.path.join(script_dir, 'vectorizer.pkl')

        if not os.path.exists(model_path) or not os.path.exists(vectorizer_path):
            return "Error: Model files not found. Please run train_model.py first."

        model = joblib.load(model_path)
        vectorizer = joblib.load(vectorizer_path)

        # Transform input and predict
        text_vectorized = vectorizer.transform([text])
        prediction = model.predict(text_vectorized)

        return prediction[0]
    except Exception as e:
        return f"Error during prediction: {str(e)}"

if __name__ == "__main__":
    if len(sys.argv) > 1:
        input_text = sys.argv[1]
        result = predict_category(input_text)
        print(result)
    else:
        print("Usage: python predict.py \"your text here\"")
