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
    XMPP_ADD_CONTACT,
    updateUserShow,
    updateUserImage,
    SEND_MESSAGE,
    UPDATE_USER_DETAILS
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

                await clientObj.send(xml('presence', {}, xml('priority', {}, 127)));

                store.dispatch(setUserDetails({username: clientObj.jid._local, profilePic: '', status: "chat", presenceMsg: ""}))

                const subscribeIq = xml('iq', { type: 'set', id: 'sub1' },
                    xml('pubsub', { xmlns: 'http://jabber.org/protocol/pubsub' },
                        xml('subscribe', { node: 'urn:xmpp:avatar:data', jid: clientObj.jid })
                    )
                );
                await clientObj.send(subscribeIq);

                let iq = xml(
                    'iq',
                    { type: 'get', id: 'roster1', from: username},
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

            clientObj.on('stanza', async (stanza) => {
                
                console.log(stanza);

                if (stanza.is('presence')) {

                    if (stanza.attrs.type === 'unavailable') {
                        store.dispatch(updateUserShow(stanza.attrs.from.split('/')[0], 'unavailable'));
                    } else {
                        store.dispatch(updateUserShow(stanza.attrs.from.split('/')[0], stanza.getChildText('show') || 'chat' ));
                    }

                }

                if (stanza.is('message') && stanza.getChild('event')) {
                    //console.log(stanza.getChild('event').getChild('items').getChild('item').getChildText('data'))
                    if (stanza.getChild('event').getChild('items').getChild('item').getChildText('data')) {
                        store.dispatch(updateUserImage(stanza.attrs.from.split('/')[0], stanza.getChild('event').getChild('items').getChild('item').getChildText('data')));
                    }
                }

                else if (stanza.is('message')) {
                    console.log('message', stanza)
                    const forwarded = stanza.getChild('result')?.getChild('forwarded');
                    const messageStanza = forwarded ? forwarded.getChild('message') : stanza;
                    const body = messageStanza?.getChild('body')?.getText();
                    if (body) {
                        let message = {
                            to: messageStanza.attrs.to,
                            from: messageStanza.attrs.from.split('/')[0],
                            timestamp: forwarded ? forwarded.getChild('delay').attrs.stamp : new Date().toISOString(),
                            content: body
                        };
                        store.dispatch(addMsg(message));
                    }
                }

                if (stanza.is('iq') && stanza.getChild('query', 'jabber:iq:roster') && stanza.attrs.id === 'roster1') {
                    const query = stanza.getChild('query');
                    const items = query.getChildren('item');
                    const contacts = items.map(item => ({
                        jid: item.attrs.jid,
                        name: item.attrs.name,
                        subscription: item.attrs.subscription
                    }));

                    store.dispatch(setRoster(contacts))
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
                { type: 'set', id: 'addroster', from: `${clientObj.jid._local}@alumchat.lol`},
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

        case SEND_MESSAGE:
            let message = xml('message', {
                to: action.payload[0],
                from: `${clientObj.jid._local}@alumchat.lol`,
                type: action.payload[2]
            },
                xml('body', {}, action.payload[1])
            )

            clientObj.send(message);

            message = {
                    to: action.payload[0],
                    from: `${clientObj.jid._local}@alumchat.lol`,
                    timestamp: new Date().toISOString(),
                    content: action.payload[1]
            };

            console.log(message)

            store.dispatch(addMsg(message));

        case UPDATE_USER_DETAILS:
            clientObj.send(xml('presence', {},
                xml('show', {}, action.payload[0] === 'chat' ? '' : action.payload[0]),
                xml('status', {}, action.payload[1])
            ));
            break;

        default:
            break;
    }

    return next(action);
};

export default xmppMiddleware;
