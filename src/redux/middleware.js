import { client, xml } from '@xmpp/client';
import debug from '@xmpp/debug'
import {
    CONNECT_XMPP,
    DISCONNECT_XMPP,
    xmppConnected,
    xmppDisconnected,
    xmppError,
    setUserDetails,
    setRoster,
    addMsg
} from './actions';

let clientObj;

const xmppMiddleware = store => next => action => {

    switch (action.type) {
        case CONNECT_XMPP:
            const { username, password, domain, websocketURL } = action.payload;
            clientObj = client({
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
                
                await clientObj.send(iq);

                iq = xml('iq', { type: 'set', id: 'mamReq' }, 
                xml('query', { xmlns: 'urn:xmpp:mam:2', queryid: 'f27' }));

                await clientObj.send(iq);

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
                
                console.log('stanza')
                console.log(stanza)

                if (stanza.is('message')) {
                    let message = {
                        to: stanza.getChild('result').getChild('forwarded').getChild('message').getAttr('to'),
                        from: stanza.getChild('result').getChild('forwarded').getChild('message').getAttr('from').split('/')[0],
                        timestamp: stanza.getChild('result').getChild('forwarded').getChild('delay').getAttr('stamp'),
                        content: stanza.getChild('result').getChild('forwarded').getChild('message').getChild('body').getText()
                    }
                    store.dispatch(addMsg(message))
                }

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
            if (clientObj) {
                clientObj.stop();
            }
            break;

        default:
            break;
    }

    return next(action);
};

export default xmppMiddleware;
