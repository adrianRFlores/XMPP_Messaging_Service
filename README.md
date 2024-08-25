# XMPP_Messaging_Service
This project is an XMPP client designed to facilitate real-time communication through the XMPP protocol suite, employing web technologies such as Node.js, Vite, React, and [xmpp.js](https://github.com/xmppjs/xmpp.js). The primary goal is to provide a robust and user-friendly web client that interacts with an existing XMPP server, specifically [alumchat.lol](alumchat.lol). While this client does not encompass the entire XMPP protocol suite, it includes essential features that are expected from a standard XMPP client.

## Features

- **Account Management**:
    - **Registering a new account:** Create a new user account on the XMPP server.
    - **Unregister an Existing Account:** Delete an existing account from the server.
    - **Login/Logout:** Log in to and out of the XMPP server.

- **Roster Management**:
    - **View Roster:** Display a user's contact list (roster) along with the presence status of each contact.
    - **Add Contacts:** Add new users to the roster.
    - **View Contact Details:** Retrieve and display detailed information about a contact, including their full name and profile picture (if provided).

- **Messaging**:
    - **One-on-One Conversations:** Engage in private chats with users in the roster.

- **Multi-User Chat (MUC)**:
    - **Public Group Chats:** Create, join, and participate in public multi-user chat rooms.

- **Presence Management**:
    - **Presence and Status:** Set and broadcast a presence message and status to other users.

- **Notifications**:
    - **Message Notifications:** Receive notifications for unread messages and pending roster requests.

- **File Sharing**:
    - **Send and Receive Files:** Transfer files between users. Images are displayed directly in the chat, while other file types provide a download link.

## Installation and Setup
To run this XMPP client locally, ensure that you have Node.js and npm installed on your machine. Follow the steps below to set up the project:

1. Download or clone the project directory to your local machine.
2. Navigate to the root of the project directory and run the following command to install the necessary dependencies listed in `package.json`:

```
npm install
```

3. As this project is intended for development purposes, to launch the application, execute the following command:

```
npm run dev
```

4. The development server will start and serve the application at [http://localhost:5173/](http://localhost:5173/) by default.

Since this client is designed to interact with an existing XMPP server, there is no need for additional configuration beyond setting up the client. You can immediately begin using the application to connect with others on the server.
