from flask import Flask, request, jsonify
from ai_model import handle_new_data  

app = Flask(__name__)

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()  
        result = handle_new_data(data) 
        return jsonify(result) 
    except Exception as e:
        print(f"Error processing request: {e}")  
        return jsonify({'error': 'Internal Server Error', 'message': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=False)
