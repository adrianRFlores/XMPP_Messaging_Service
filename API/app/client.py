from slixmpp import ClientXMPP
import asyncio

class XMPPClient(ClientXMPP):
    def __init__(self, jid, password):
        super().__init__(jid, password)
        self.add_event_handler("session_start", self.start)
        self.add_event_handler("message", self.message)

    async def start(self, event):
        self.send_presence()
        await self.get_roster()

    async def message(self, msg):
        if msg['type'] in ('chat', 'normal'):
            print(f"Received message: {msg['body']} from {msg['from']}")
            # Forward the message to the Flask API via WebSocket or other means

    async def login(self):
        await self.connect()
        self.process(forever=False)

    async def send_message_to(self, recipient, message):
        self.send_message(mto=recipient, mbody=message, mtype='chat')
