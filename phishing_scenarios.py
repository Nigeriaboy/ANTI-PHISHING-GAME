import sqlite3
import csv

# Connect to the database
def connect_to_db():
    return sqlite3.connect('phishing_scenarios.db')

# Create the table if it doesn't exist
def create_table():
    with connect_to_db() as conn:
        cursor = conn.cursor()
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS scenarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            from_email TEXT NOT NULL,
            to_email TEXT NOT NULL,
            subject TEXT NOT NULL,
            body TEXT NOT NULL,
            answer TEXT NOT NULL,
            feedback TEXT NOT NULL
        )
        ''')
        conn.commit()

# Insert data into the table
def insert_scenarios(scenarios):
    with connect_to_db() as conn:
        cursor = conn.cursor()
        cursor.executemany('''
        INSERT INTO scenarios (from_email, to_email, subject, body, answer, feedback)
        VALUES (?, ?, ?, ?, ?, ?)
        ''', scenarios)
        conn.commit()

# Query all scenarios
def get_all_scenarios():
    with connect_to_db() as conn:
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM scenarios')
        results = cursor.fetchall()
    return results

# Query phishing emails (e.g., where `answer` is 'Phish')
def get_phishing_scenarios():
    with connect_to_db() as conn:
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM scenarios WHERE answer = "Phish"')
        results = cursor.fetchall()
    return results

# Update a scenario based on its ID
def update_scenario(scenario_id, feedback):
    with connect_to_db() as conn:
        cursor = conn.cursor()
        cursor.execute('''
        UPDATE scenarios
        SET feedback = ?
        WHERE id = ?
        ''', (feedback, scenario_id))
        conn.commit()

# Delete a scenario based on its ID
def delete_scenario(scenario_id):
    with connect_to_db() as conn:
        cursor = conn.cursor()
        cursor.execute('''
        DELETE FROM scenarios WHERE id = ?
        ''', (scenario_id,))
        conn.commit()

# Export data to CSV
def export_to_csv(file_name='phishing_scenarios.csv'):
    with connect_to_db() as conn:
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM scenarios')
        rows = cursor.fetchall()
        with open(file_name, 'w', newline='') as file:
            writer = csv.writer(file)
            writer.writerow([desc[0] for desc in cursor.description])  # Write headers
            writer.writerows(rows)
    print(f"Data exported to {file_name}")

# Example usage:
if __name__ == '__main__':
    # Create the table (if not already created)
    create_table()

    # Insert initial data
scenarios = [
        (   "no_reply@acesssbankplc.com", 
            "lawal123@gmail.com", 
            "Your account security is at risk Immediate action required", 
            "Dear valued customer, we have detected unusual activity in your online banking account and have temporarily limited your account access to protect you. To restore full access and avoid service disruption, please verify your account information. Click here to verify: http://acessbankplc/confirm-banking-account.com If you do not verify within 24 hours, your account may be permanently suspended. For your convenience, our team is ready to assist you. Please respond to this email if you encounter any issues.", 
            "Phish", 
            "The email uses urgency and a fake domain, which is a common phishing tactic."
        ),
        (
           "support@netfllix-update.com",
           "alihay@gmail.com",
           "Important Notice: Update your Netflix payment details",
           "Dear Ali, we encountered an issue with your latest payment for your Netflix subscription, and your account has been temporarily suspended. To continue enjoying uninterrupted streaming, please update your payment details. Visit:http://netflix-billing-update.com Please note that if you do not update within 48 hours, your subscription will be canceled. Our goal is to ensure seamless service for you.",
           "Phish",
           "The domain does not belong to Netflix, and legitimate companies avoid threats in emails."
        ),
        (
            "security@appleaccount.com",
            "Somny23@gmail.com",
            "Apple ID security issue detected",
            "Dear Sone, we detected an unauthorized login attempt to your Apple ID from a device not associated with your account. Your account has been locked to prevent further access. To regain access, please confirm your details using the link: http://apple-login-confirmation.comIf you do not act within 24 hours, you may permanently lose access to your account.",
            "Phish",
            "Apple does not send emails with external domains for security purposes."
        ),
        (
            "renewal@microsoft365.com",
            "ghrhfuf@gmail.com",
            "Your Microsoft Office subscription has expired",
            "Hello, we noticed your subscription has expired, and your account will lose access to Office 365 features. To renew your subscription, please click the link: http://renew-office-subscription.com If you have already made payment, disregard this email. Your account will be disabled in 7 days without payment.",
            "Phish",
            "Official Microsoft domains are always structured as .microsoft.com."
        ),
        (
            "shipment@dhlnotices.com",
            "musa23@gmail.com",
            "Your DHL package cannot be delivered",
            "Dear Customer, your recent shipment with tracking number #874534 has been delayed due to incorrect address details. To ensure prompt delivery, please update your shipping information: http://dhl-delivery-update.com Please note that unverified packages will be returned to the sender within 3 days.",
            "Phish",
            "DHL does not use external links for tracking updates."
        ),
        (
            "notifications@whatsapp.com",
            "dealer@yahoo.com",
            "Confirm your WhatsApp data backup",
            "Dear Dee, WhatsApp will soon require all users to verify their data backup to ensure security compliance. Without verification, your chats and files may be deleted permanently. Click here to verify: http://whatsapp-backup-verification.comThis is a mandatory update to continue using WhatsApp services without disruptions.",
            "Phish",
            "WhatsApp typically handles such notices within the app, not via external links."
        ),
        (
           "payments@adsense-support.com",
           "mike233@outlook.com",
           "Your Google AdSense payment has failed",
           "Dear AdSense Publisher, we attempted to process your monthly AdSense payment, but the transaction failed due to incorrect bank account information. To avoid delays in receiving your earnings, please update your payment details: http://adsense-payment-update.com Failure to update your account within 7 days will result in a forfeiture of your payment.",
           "Phish",
           "WhatsApp typically handles such notices within the app, not via external links." 
        ),
        (
            "payments@adsense-support.com",
            "mike233@outlook.com",
            "Your Google AdSense payment has failed",
            "Dear AdSense Publisher, we attempted to process your monthly AdSense payment, but the transaction failed due to incorrect bank account information. To avoid delays in receiving your earnings, please update your payment details: http://adsense-payment-update.com Failure to update your account within 7 days will result in a forfeiture of your payment.",
            "Phish",
            "Google AdSense uses its official domain and never threatens forfeiture."
        ),
        (
            "security@facebook.com",
            "Victor@gmail.com",
            "Confirm your Facebook two-factor authentication",
            "Dear Victor, your two-factor authentication settings were updated recently. If this wasn't you, confirm your identity to secure your account:http://facebook-account-security.com",
            "Phish",
            "Facebook uses secure links that include 'facebook.com.'"
        ),
        (
            "alerts@paypal-security.com",
            "amos23@outlook.com",
            "Your PayPal account has been flagged for suspicious activity",
            "We have noticed unusual activity in your account. Please confirm your recent transactions to prevent your account from being suspended: http://paypal-transaction-review.com",
            "Phish",
            "The domain does not match PayPal’s official domain."
        ),
        (
            "refunds@amazon.com",
            "theo@gmail.com",
            "Amazon Refund Notification",
            "Dear Customer, Your refund request for order #655621 has been processed. To confirm your payment details and receive the refund, click the link: http://amazon-refund-confirmation.com",
            "Phish",
            "Amazon processes refunds through its app or website, not external links."
        ),
        (
            "no-reply@microsoft.com",
            "luke@gmail.com",
            "Microsoft Teams meeting invite",
            "You’ve been invited to join a Microsoft Teams meeting. Details: ● Date: Nov 28, 2024 ● Time: 3:00 PM WAT Join here: https://teams.microsoft.com/meeting/abc123",
            "Legit",
            "The link uses Microsoft’s secure domain."
        ),
        (
            "no-reply@amazon.com",
            "dre@gmail.com",
            "Your recent order has shipped",
            "Dear Customer, your order #23479 has been shipped and is on its way! You can track your package here: https://amazon.com/track-order/123456",
            "Legit",
            "The email uses Amazon's official domain."
        ),
        (
            "noreply@github.com",
            "jamesbond@gmail.com",
            "GitHub: New login to your account",
            "Hi James, A new sign-in to your GitHub account was detected: ● Location: Abuja, Nigeria ● ●Browser: Chrome Time: November 27, 2024, 09:45 AM If this was you, no action is needed. If not, please secure your account immediately by changing your password: https://github.com/settings/security",
            "Legit",
            "GitHub uses its official domain for notifications and security alerts."
        ),
        (
            "receipt@spotify.com",
            "raymond@gmail.com",
            "Spotify: Your Premium account has been renewed",
            "Hi Raymond, Thank you for renewing your Spotify Premium subscription. Here are the details of your transaction: ● Plan: Individual ● Amount: £10.99 ● Renewal Date: November 27, 2024 No further action is required. View your account details here: https://www.spotify.com/account",
            "Legit",
            "Spotify’s official domain is used, and no sensitive information is requested."
        ),
        (
            "notifications@google.com",
            "lunarae@gmail.com",
            "Google Photos: Your storage is almost full",
            "Hi Luna, you’re running out of storage. Google Photos requires additional space for new uploads. Current usage: 14.8 GB of 15 GB Upgrade now to ensure your photos and files remain safe:https://one.google.com/storage",
            "Legit",
            "The link belongs to Google’s official domain and provides storage options."
        ),
        (
            "notifications@slack.com",
            "tobisilt@outlook.com",
            "Slack: You’ve been invited to a new workspace",
            "Hi Tobi, you’ve been invited to join the CS50X Team workspace on Slack. To join, click the link below: https://slack.com/invite/xyz123 If you didn’t request this, please ignore this email.",
            "Legit",
            "Slack notifications use secure links and require user action to join."
        ),
        (
            "billing-noreply@amazon.com",
            "bello@gmail.com",
            "AWS: Your monthly bill is now available",
            "Dear Bello, Your AWS usage for the month of November has been calculated. Total Usage: $45.67 View your detailed invoice: https://aws.amazon.com/billing",
            "Legit",
            "AWS emails always include links to their official .amazon.com domains."
        ),
        (
            "noreply@zoom.us",
            "belloj@yahoo.com",
            "Your webinar recording is ready to download",
            "Hi Bello, Your recent webinar It Okay Not to Okay recording is now available. Access it here: https://zoom.us/recording/download/abc123 This link will remain valid for 7 days.",
            "Legit",
            "Zoom emails come from their official domain and provide time-limited download links."
        ),
        (
            "notifications@linkedin.com",
            "bolaiji@yahoo.com",
            "LinkedIn: New connection request",
            "Hi Bola, Christian Waters has sent you a connection request on LinkedIn. View their profile and accept the invitation here: https://linkedin.com/connections/request123",
            "Legit",
            "LinkedIn notifications come from their secure domain and do not request sensitive information."
        ),
        (
            "notifications@dropbox.com",
            "stellarunny@yahoo.com",
            "Dropbox: Your shared folder is ready",
            "Hi Stella, Enisa has shared the folder Implementation with you. You can access it here: https://www.dropbox.com/shared/abc123",
            "Legit",
            "Dropbox emails always use their official domain and provide direct access to shared content."
        )
    ]
insert_scenarios(scenarios)

    # Retrieve all scenarios
scenarios = get_all_scenarios()
for scenario in scenarios:
    print(f"ID: {scenario[0]}, From: {scenario[1]}, To: {scenario[2]}, Subject: {scenario[3]}")

    # Query phishing scenarios
    phishing_scenarios = get_phishing_scenarios()
    for scenario in phishing_scenarios:
        print(f"Phishing Email - ID: {scenario[0]}, From: {scenario[1]}, To: {scenario[2]}, Subject: {scenario[3]}")

    # Update a scenario
    update_scenario(1, "Urgent update: This email uses urgency and a fake domain.")

    # Delete a scenario
    delete_scenario(2)

    # Export data to CSV
    export_to_csv()

