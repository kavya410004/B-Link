from flask import Flask, request, jsonify
from ai_model import handle_new_data  # Import the AI model function

app = Flask(__name__)

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()  # Get JSON data from the request
        result = handle_new_data(data)  # Use AI model function for predictions
        return jsonify(result)  # Send the result as JSON response
    except Exception as e:
        print(f"Error processing request: {e}")  # Log the error
        return jsonify({'error': 'Internal Server Error', 'message': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=False)
