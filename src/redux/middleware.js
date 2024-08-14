import { client, xml } from '@xmpp/client';
import debug from '@xmpp/debug'
import {
    CONNECT_XMPP,
    DISCONNECT_XMPP,
    xmppConnected,
    xmppDisconnected,
    xmppError,
    setUserDetails,
    setRoster
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
                resource: 'gajimbo'
            });

            clientObj.on('online', async (address) => {
                store.dispatch(xmppConnected());

                await clientObj.send(xml("presence"));

                let iq = xml('iq', { type: 'get', id: 'v1', to: 'a2645173@alumchat.lol'}, xml('vCard', 'vcard-temp'));

                await clientObj.send(iq);

                iq = xml(
                    'iq',
                    { type: 'get', id: 'roster1' },
                    xml('query', { xmlns: 'jabber:iq:roster' })
                );
                
                clientObj.send(iq);

                console.log(test)

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
                console.log('on stanza')
                console.log(stanza)
                if (stanza.is('iq') && stanza.getChild('query', 'jabber:iq:roster')) {
                    const query = stanza.getChild('query');
                    const items = query.getChildren('item');
                    const contacts = items.map(item => ({
                        jid: item.attrs.jid,
                        name: item.attrs.name,
                        subscription: item.attrs.subscription
                    }));

                    store.dispatch(setRoster(contacts))
                }

                if (stanza.is('iq') && stanza.getChild('vCard')) {
                    const vCard = stanza.getChild('vCard');
                    const profilePicture = vCard.getChildText('PHOTO') 
                        ? vCard.getChild('PHOTO').getChildText('BINVAL') 
                        : null;

                    store.dispatch(setUserDetails({username: clientObj.jid._local, profilePic: profilePicture, status: "", presenceMsg: "hola"}))
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
