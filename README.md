## Non-Persistent SignalWire Chat

Inspired by Christian Stuff's [talk at CommCon21](https://2021.commcon.xyz/talks/your-state-is-my-state-and-my-state-is-your-state-a-tale-of-webrtc-chat-history-and-shared-p2p-state).

#### Features:
- Non-persistent chat for privacy and HIPAA compliance
- New users receive the chat history automatically when they join
- When the session ends, chat history is gone

I'm not at all sure whether this is going to work.

The API provides chat history with `chatClient.getMessages()`, but we're not using that.


### Back-end
Running on codesandbox.io with API credentials. The example back-end on the SignalWire docs doesn't seem to work -- fork the codesandbox project and set the URL as an env variable.


### Usage
Run `vite` to run the app in development, or `vite build` to build it. In the UI, insert a user name and join the chat. If there are other users in the room, the app will poll a random participant, who will broadcast their chat history object to all participants. This way, all participants always see the same history.

The whole chat history exists as a state variable in the participants' front-ends. When the last participant leaves the room, all history is gone.


