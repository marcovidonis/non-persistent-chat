import { useEffect, useState } from 'react';
import axios from 'axios';

import './App.css';
import Chat from './Chat';

const SERVERLOCATION = 'https://r4k674.sse.codesandbox.io';

function App() {
  const [chatToken, setChatToken] = useState();

  useEffect(() => {
    const getChatToken = async () => {

      //TODO generate this
      const memberId = 'user1';
      const channels = ['mychannel1'];

      const reply = await axios.post(SERVERLOCATION + "/get_chat_token", {
        member_id: 'member_id',
        channels: ['mychannel1'],
      });
      const token = reply.data.token;
      setChatToken(token);
    }
    getChatToken();
  }, []);

  return (
    <div className="App">
      <h1>Non-Persistent Chat</h1>
      <Chat chatToken={chatToken}  />
    </div>
  )
}

export default App
