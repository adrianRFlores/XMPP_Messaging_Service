from flask import Blueprint, request, jsonify, session
from app.xmpp_client import XMPPClient
import asyncio

main_bp = Blueprint('main', __name__)

@main_bp.route('/login', methods=['POST'])
async def login():
    data = request.json
    jid = data['jid']
    password = data['password']
    
    # Initialize XMPP client with provided credentials
    xmpp_client = XMPPClient(jid, password)
    
    try:
        await xmpp_client.login()
        session['user'] = jid
        return jsonify({'status': 'Logged in'}), 200
    except Exception as e:
        return jsonify({'status': 'Login failed', 'error': str(e)}), 401

@main_bp.route('/send_message', methods=['POST'])
async def send_message():
    if 'user' not in session:
        return jsonify({'status': 'Unauthorized'}), 401

    data = request.json
    recipient = data['recipient']
    message = data['message']

    await xmpp_client.send_message_to(recipient, message)
    return jsonify({'status': 'Message sent'}), 200

@main_bp.route('/logout', methods=['POST'])
def logout():
    session.pop('user', None)
    return jsonify({'status': 'Logged out'}), 200
