import sqlite3
from flask import Flask , render_template, jsonify # Import the Flask class

app = Flask(__name__) # Create a Flask app instance

@app.route('/') # Define the homepage route
def home():
    return render_template("index.html") # What the user sees

@app.route('/game-page')
def game_page():

    return render_template("game-page.html")

if __name__ == '__main__':
    app.run(debug=True) # Run the app
