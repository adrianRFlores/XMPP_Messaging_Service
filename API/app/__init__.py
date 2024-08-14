from flask import Flask
from flask_session import Session
from flask_socketio import SocketIO

def create_app():
    app = Flask(__name__)

    # Initialize extensions
    Session(app)
    socketio = SocketIO(app, async_mode='threading')

    # Register Blueprints
    from app.routes import main_bp
    app.register_blueprint(main_bp)

    return app, socketio
