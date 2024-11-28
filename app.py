from flask import Flask , render_template# Import the Flask class

app = Flask(__name__) # Create a Flask app instance

@app.route('/') # Define the homepage route
def home():
    return render_template("index.html") # What the user sees

if __name__ == '__main__':
    app.run(debug=True) # Run the app
