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
    addMsg,
    XMPP_UNREGISTER,
    XMPP_ADD_CONTACT
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
                resource: 'gajimbo2'
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

                if (stanza.is('message') && stanza.getChild('result')) {
                    console.log('message')
                    console.log(stanza)
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

        case XMPP_UNREGISTER:
            if (clientObj) {
                let unregister_iq = xml('iq', { type: 'set', id: 'unreg1' },
                    xml('query', 'jabber:iq:register', xml('remove'))
                )
                clientObj.send(unregister_iq);
                clientObj.stop();
            }
            break;

        case XMPP_ADD_CONTACT:
            let iq = xml(
                'iq',
                { type: 'set', id: 'addroster1', from: `${clientObj.jid._local}@alumchat.lol`},
                xml('query', { xmlns: 'jabber:iq:roster' },
                    xml('item', { jid: `${action.payload}@alumchat.lol`, subscription: 'both' } )
                )
            );

            clientObj.send(iq);

            iq = xml('presence', { to: `${action.payload}@alumchat.lol`, type:'subscribe' },
                xml('status', {}, `Hola, soy ${clientObj.jid._local}.`),
                xml('nick', "http://jabber.org/protocol/nick", clientObj.jid._local)
            )

            clientObj.send(iq)

            iq = xml(
                'iq',
                { type: 'get', id: 'roster1' },
                xml('query', { xmlns: 'jabber:iq:roster' })
            );

            clientObj.send(iq);

        default:
            break;
    }

    return next(action);
};

export default xmppMiddleware;
