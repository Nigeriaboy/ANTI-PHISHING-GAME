from flask import Flask, render_template, request, jsonify
from database import get_next_scenario, mark_scenario_completed, add_completed_column, restart_scenarios  # Import functions

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/game')
def game():
    try:
        return render_template('game.html')
    except Exception as e:
        return f"Error loading game.html: {e}", 500


@app.route('/next_scenario', methods=['GET'])
def next_scenario():
    scenario = get_next_scenario()
    if scenario:
        # Include the From email along with the subject and body
        return jsonify({
            "id": scenario[0],
            "subject": scenario[2],
            "body": scenario[3],
            "from_email": scenario[1],  # Assuming the 'from_email' is stored in the second column
        })
    else:
        return jsonify({"message": "All scenarios completed."})

    
@app.route('/restart', methods=['POST'])
def restart():
    # Call the function to reset all scenarios
    restart_scenarios()
    return jsonify({"message": "All scenarios have been restarted."})



@app.route('/mark_completed', methods=['POST'])
def mark_completed():
    data = request.json
    scenario_id = data.get('id')
    if scenario_id:
        mark_scenario_completed(scenario_id)
        return jsonify({"message": "Scenario marked as completed."})
    return jsonify({"error": "Invalid scenario ID."}), 400

if __name__ == '__main__':
    add_completed_column()  # Ensure the completed column exists
    app.run(debug=True)
