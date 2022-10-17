import { useState } from 'react';
import axios from 'axios';

import {
  Button,
  Grid,
  TextField,
} from '@mui/material';

import './App.css';
import Chat from './Chat';

const SERVERLOCATION = 'https://r4k674.sse.codesandbox.io';

function App() {
  const [chatToken, setChatToken] = useState();
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(false);

  const getChatToken = async () => {
    setLoading(true);

    const memberId = userName.replace(/[^a-z0-9]+/g, '_');

    const reply = await axios.post(SERVERLOCATION + "/get_chat_token", {
      member_id: memberId,
      channels: ['main', 'service'],
    });
    const token = reply.data.token;
    setChatToken(token);
    setLoading(false);
  }

  const reset = () => {
    setChatToken(null);
  }

  return (
    <div className="App">
      <h1>Non-Persistent Chat</h1>
      {!chatToken ?
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              id="username"
              label="User Name"
              variant="outlined"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant='contained'
              disabled={!userName || loading}
              onClick={getChatToken}
            >
              {loading ? 'Joining...' : 'Join'}
            </Button>
          </Grid>
        </Grid>
        :
        <Chat
          chatToken={chatToken}
          reset={reset}
          userName={userName}
        />
      }
    </div>
  )
}

export default App
