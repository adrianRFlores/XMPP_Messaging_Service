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
    UPDATE_USER_DETAILS,
    SEND_FILE
} from './actions';

let clientObj;

let pendingFile;

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

                const selfAvatar = xml('iq', { type: 'get', id: `avatar-${clientObj.jid._local}`, to: `${clientObj.jid._local}@alumchat.lol`},
                            xml('pubsub', { xmlns: 'http://jabber.org/protocol/pubsub' },
                                xml('items', { node: 'urn:xmpp:avatar:data' })
                            )
                        );

                clientObj.send(selfAvatar);

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
                    if (stanza.getChild('event').getChild('items').getChild('item').getChildText('data')) {
                        store.dispatch(updateUserImage(stanza.attrs.from.split('/')[0], stanza.getChild('event').getChild('items').getChild('item').getChildText('data')));
                    }
                }

                else if (stanza.is('message')) {
                    const forwarded = stanza.getChild('result')?.getChild('forwarded');
                    const messageStanza = forwarded ? forwarded.getChild('message') : stanza;
                    let image = '';
                    if (forwarded && messageStanza.getChild('x')) {
                        image = messageStanza.getChild('x').getChildText('url');
                    }
                    const body = messageStanza?.getChild('body')?.getText();
                    console.log(body)
                    if (body) {
                        let message = {
                            to: messageStanza.attrs.to,
                            from: messageStanza.attrs.from.split('/')[0],
                            timestamp: forwarded ? forwarded.getChild('delay').attrs.stamp : new Date().toISOString(),
                            content: body,
                            image: image
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

                    store.dispatch(setRoster(contacts));

                    contacts.forEach((contact, index) => {
                        const avatarFetchIq = xml('iq', { type: 'get', id: `avatar-${contact.jid}`, to: contact.jid},
                            xml('pubsub', { xmlns: 'http://jabber.org/protocol/pubsub' },
                                xml('items', { node: 'urn:xmpp:avatar:data' })
                            )
                        );
                        clientObj.send(avatarFetchIq);
                    });

                }

                if (stanza.is('iq') && stanza.attrs.type === 'result' && stanza.attrs.id.includes('avatar-')) {
                    if (stanza.getChild('pubsub').getChild('items').getChild('item').getChildText('data')) {
                        store.dispatch(updateUserImage(stanza.attrs.from, stanza.getChild('pubsub').getChild('items').getChild('item').getChildText('data')));
                    }
                }

                if (stanza.is('iq') && stanza.attrs.id === 'uploadSlot1' && stanza.attrs.type === 'result') {
                    const slotElement = stanza.getChild('slot', 'urn:xmpp:http:upload:0');
                    if (slotElement) {
                        const putUrl = slotElement.getChild('put').attrs.url;
                        const getUrl = slotElement.getChild('get').attrs.url;
        
                        try {
                            const response = await fetch(putUrl, {
                                method: 'PUT',
                                headers: {
                                    'Content-Type': pendingFile.file.type,
                                    'Content-Length': pendingFile.file.size,
                                },
                                body: pendingFile.file,
                            });
        
                            if (response.ok) {
                                const message = xml('message', {
                                    to: pendingFile.recipient,
                                    from: `${clientObj.jid._local}@alumchat.lol`,
                                    type: pendingFile.type
                                },
                                    xml('body', {}, `File sent: ${pendingFile.file.name}`),
                                    xml('x', { xmlns: 'jabber:x:oob' },
                                        xml('url', {}, getUrl),
                                        xml('desc', {}, pendingFile.file.name)
                                    )
                                );
        
                                clientObj.send(message);
        
                                const localMessage = {
                                    to: pendingFile.recipient,
                                    from: `${clientObj.jid._local}@alumchat.lol`,
                                    timestamp: new Date().toISOString(),
                                    content: `${getUrl}`, 
                                    image: `${getUrl}`
                                };
        
                                store.dispatch(addMsg(localMessage));
                            } else {
                                console.error('File upload failed:', response.statusText);
                            }
                        } catch (error) {
                            console.error('File upload error:', error);
                        }
                    }
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
                    content: action.payload[1],
                    image: ''
            };

            console.log(message)

            store.dispatch(addMsg(message));

        case UPDATE_USER_DETAILS:
            clientObj.send(xml('presence', {},
                xml('show', {}, action.payload[0] === 'chat' ? '' : action.payload[0]),
                xml('status', {}, action.payload[1])
            ));
            break;

        case SEND_FILE:

            const recipient = action.payload[0];
            const file = action.meta;

            console.log(file)
        
            const requestUploadSlotIq = xml('iq', { type: 'get', id: 'uploadSlot1', to: 'httpfileupload.alumchat.lol', xmlns: 'jabber:client' },
                xml('request', { xmlns: 'urn:xmpp:http:upload:0', filename: file.file.name, size: file.file.size, 'content-type': file.file.type})
            );

            clientObj.send(requestUploadSlotIq);

            pendingFile = {
                file: file.file,
                recipient: recipient,
                type: action.payload[1]
            };

            break;
            
        default:
            break;
    }

    return next(action);
};

export default xmppMiddleware;
