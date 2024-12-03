import sqlite3

def connect_to_db():
    return sqlite3.connect('phishing_scenarios.db')

def add_completed_column():
    with connect_to_db() as conn:
        cursor = conn.cursor()
        # Check if the 'completed' column exists
        cursor.execute("PRAGMA table_info(scenarios)")
        columns = [column[1] for column in cursor.fetchall()]
        if 'completed' not in columns:
            cursor.execute('ALTER TABLE scenarios ADD COLUMN completed INTEGER DEFAULT 0')
            conn.commit()
        else:
            print("The 'completed' column already exists.")

# Fetch the next uncompleted scenario based on the user's progress
def get_next_scenario():
    with connect_to_db() as conn:
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM scenarios WHERE completed = 0 ORDER BY id ASC LIMIT 1')
        next_scenario = cursor.fetchone()
    return next_scenario

# Mark a scenario as completed
def mark_scenario_completed(scenario_id):
    with connect_to_db() as conn:
        cursor = conn.cursor()
        cursor.execute('UPDATE scenarios SET completed = 1 WHERE id = ?', (scenario_id,))
        conn.commit()

# Restart the scenarios by marking all of them as incomplete
def restart_scenarios():
    with connect_to_db() as conn:
        cursor = conn.cursor()
        cursor.execute('UPDATE scenarios SET completed = 0')
        conn.commit()
        print("All scenarios have been reset to incomplete.")
