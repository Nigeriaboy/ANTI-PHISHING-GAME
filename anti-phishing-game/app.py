from flask import Flask # Import the Flask class

app = Flask(__name__) # Create a Flask app instance

@app.route('/') # Define the homepage route
def home():
    return "Hello, Anti-Phishing Game!" # What the user sees

if __name__ == '__main__':
    app.run(debug=True) # Run the app