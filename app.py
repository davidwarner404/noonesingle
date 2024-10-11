import os
import json
from datetime import datetime
from flask import Flask, render_template, request, jsonify
import requests
import firebase_admin
from firebase_admin import credentials, firestore
from dotenv import load_dotenv

app = Flask(__name__)

# Load environment variables from .env file
load_dotenv()

# Initialize Firebase Admin SDK with credentials from the environment variable
firebase_credentials_path = os.getenv('FIREBASE_CREDENTIALS')
cred = credentials.Certificate(firebase_credentials_path)
firebase_admin.initialize_app(cred)

# Initialize Firestore client
db = firestore.client()

# Helper function to get the user's location based on their IP address
def get_location(ip_address):
    try:
        response = requests.get(f'https://ipinfo.io/{ip_address}/json')
        if response.status_code == 200:
            return response.json()
        return None
    except Exception as e:
        print(f"Error fetching location: {e}")
        return None

# Route for the main page
@app.route('/')
def index():
    return render_template('index.html')

# Helper function to save form submission to Firestore
def save_submission_to_firestore(data):
    db.collection('submissions').add(data)  # Add form data to Firestore collection

# Helper function to save newsletter subscription to Firestore
def save_newsletter_subscription_to_firestore(data):
    db.collection('newsletter_subscriptions').add(data)  # Add newsletter subscription to Firestore collection

# Route for handling form submissions
@app.route('/submit-form', methods=['POST'])
def submit_form():
    # Retrieve form data
    gender = request.form.get('gender')
    name = request.form.get('name')
    dob = request.form.get('dob')
    email = request.form.get('email')

    # Get user's IP address
    response = requests.get('https://api.ipify.org?format=json')
    user_ip = response.json()['ip']  # Use default IP for testing if needed
    print(user_ip)
    # Fetch user's location based on IP address
    location_data = get_location(user_ip)

    # Create a dictionary with the form data and location information
    form_data = {
        'gender': gender,
        'name': name,
        'dob': dob,
        'email': email,
        'ip_address': user_ip,
        'location': location_data
    }

    # Save form submission data to Firestore
    save_submission_to_firestore(form_data)

    # Return a success message with the location data
    return jsonify({'message': 'Form submitted successfully!', 'location': location_data})

# Route for handling newsletter subscriptions
@app.route('/subscribe-newsletter', methods=['POST'])
def subscribe_newsletter():
    # Retrieve the email from the form
    email = request.form.get('email')

    # Query Firestore to check if the email already exists in the newsletter_subscriptions collection
    existing_subscription = db.collection('newsletter_subscriptions').where('email', '==', email).get()

    # If the query returns any documents, the email is already subscribed
    if existing_subscription:
        return jsonify({'message': 'This email is already subscribed!'})

    # If no existing subscription, proceed with saving the new subscription
    response = requests.get('https://api.ipify.org?format=json')
    user_ip = response.json()['ip'] # Use default IP for testing if needed
    user_agent = request.user_agent.string  # Get user agent from the request
    timestamp = datetime.now().isoformat()  # Get the current timestamp
    referrer = request.referrer  # Get referrer URL, if available

    # Fetch user's location based on IP address
    print(user_ip)
    location_data = get_location(user_ip)

    # Create a dictionary with the newsletter subscription data
    subscription_data = {
        'email': email,
        'ip_address': user_ip,
        'location': location_data,
        'user_agent': user_agent,
        'timestamp': timestamp,
        'referrer': referrer,
    }

    # Save newsletter subscription data to Firestore
    save_newsletter_subscription_to_firestore(subscription_data)

    # Return a success message
    return jsonify({'message': 'Thank you for subscribing!'})

# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True)
