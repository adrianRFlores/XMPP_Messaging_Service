import { client, xml } from '@xmpp/client';
import debug from '@xmpp/debug'
import {
    CONNECT_XMPP,
    DISCONNECT_XMPP,
    xmppConnected,
    xmppDisconnected,
    xmppError,
    receiveMessage,
} from './actions';

const xmppMiddleware = store => next => action => {
    switch (action.type) {
        case CONNECT_XMPP:
            const { username, password, domain, websocketURL } = action.payload;
            const clientObj = client({
                service: websocketURL,
                domain: domain,
                username: username,
                password: password,
            });

            debug(clientObj, true);

            clientObj.on('online', async () => {
                console.log('hello')
                store.dispatch(xmppConnected());
                await clientObj.send(xml("presence"));
            });

            clientObj.on('offline', () => {
                store.dispatch(xmppDisconnected());
            });

            clientObj.on('error', (err) => {
                console.error('Connection Error:', err);
                store.dispatch(xmppError({
                    message: err.message,
                    stack: err.stack,
                    name: err.name,
                }));
            });

            clientObj.on('stanza', (stanza) => {
                if (stanza.is('message')) {
                    store.dispatch(receiveMessage(stanza.toString()));
                }
            });

            clientObj.start().catch(console.error);

            break;
        case DISCONNECT_XMPP:
            if (client) {
                client.stop();
            }
            break;
        default:
            break;
    }

    return next(action);
};

export default xmppMiddleware;
