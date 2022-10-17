## Non-Persistent SignalWire Chat

Inspired by Christian Stuff's [talk at CommCon21](https://2021.commcon.xyz/talks/your-state-is-my-state-and-my-state-is-your-state-a-tale-of-webrtc-chat-history-and-shared-p2p-state).

#### Features:
- Non-persistent chat for privacy and HIPAA compliance
- New users receive the chat history automatically when they join
- When the session ends, chat history is gone

I'm not at all sure whether this is going to work.

The API provides chat history with `chatClient.getMessages()`, but we're not using that.


### Back-end
Running on codesandbox.io with API credentials.


