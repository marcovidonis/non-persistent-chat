import { useState, useEffect } from 'react';
import { Chat as ChatClient } from "@signalwire/js";
import {
  List,
  ListItem,
  ListItemText,
  Grid,
  TextField,
  Button,
  Typography,
} from '@mui/material';

function Chat(props) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [message, setMessage] = useState('');
  const [newMessage, setNewMessage] = useState();
  const [chatClient, setChatClient] = useState();
  const [members, setMembers] = useState([]);
  const [needHistory, setNeedHistory] = useState(false);
  const [histRequest, setHistRequest] = useState(false);

  const { chatToken, userName } = props;

  useEffect(() => {
    if (!chatToken || loading || subscribed) {
      return;
    }
    setLoading(true)

    setChatClient(new ChatClient.Client({
      token: chatToken,
    }));
  }, [chatToken]);

  useEffect(() => {
    if (!chatClient) {
      return;
    }
    subscribe();
  }, [chatClient]);

  useEffect(() => {
    if (!subscribed) {
      return;
    }
    getMembers();
  }, [subscribed]);

  useEffect(() => {
    if (!needHistory || !members?.length) {
      return;
    }
    if (members.length === 1) {
      //it's just you
      return;
    }

    //get history from a random member other than self
    const otherMembers = members.filter((m) => m.id !== userName);
    const randIdx = Math.floor(Math.random() * otherMembers.length);
    sendMessage({ channel: 'service', content: otherMembers[randIdx].id });

    setLoading(false);
  }, [needHistory]);

  useEffect(() => {
    if (newMessage) {
      if (Array.isArray(newMessage)) {
        setHistory(newMessage);
      } else {
        const newHistory = [...history];

        newHistory.push(newMessage);
        setHistory(newHistory);
      }
      setNewMessage(null);
    }
  }, [newMessage]);

  useEffect(() => {
    if (!histRequest) {
      return;
    }

    sendMessage({ channel: 'service', content: JSON.stringify(history) });

    setHistRequest(false);
  }, [histRequest]);

  const getMembers = async () => {
    if (!chatClient) {
      return;
    }

    try {
      const m = await chatClient.getMembers({ channel: 'main' });
      setMembers(m.members);
    } catch (error) {
      if (subscribed) {
        console.error(error);
      }
    }

    if (loading) {
      setNeedHistory(true);
    }
  }

  const sendMessage = async ({ channel, content }) => {
    if (!channel) {
      channel = 'main';
    }

    if (!content) {
      if (!message) {
        return;
      }
      content = message;
    }

    await chatClient.publish({
      channel,
      content,
    });

    setMessage('');
  }

  const subscribe = async () => {
    chatClient.on("message", (message) => {
      if (message.channel === 'main') {
        setNewMessage(message);
      } else if (message.channel === 'service') {
        //if we are polled for history, share it with everyone
        if (message.content === userName) {
          setHistRequest(true);
        } else {
          //if we are sent a history, replace the one we have
          const newHistory = JSON.parse(message.content);
          if (Array.isArray(newHistory)) {
            setNewMessage(newHistory);
          }
        }
      }
    });

    chatClient.on("member.joined", (member) => {
      getMembers();
      // console.log('joined event', member);
    });

    chatClient.on("member.left", (member) => {
      getMembers();
      // console.log('left event', member);
    });

    await chatClient.subscribe(['main', 'service']);
    setSubscribed(true);
    console.log('subscribed');
  }

  const unsubscribe = async () => {
    if (!chatClient) {
      setSubscribed(false);
      return;
    }

    await chatClient.unsubscribe(['main', 'service']);
    setSubscribed(false);
  }

  const exitChat = async () => {
    if (!chatClient) {
      return;
    }

    await unsubscribe();
    chatClient.disconnect();
    setChatClient(null);
    props.reset();
  }

  return (
    <>
      <Typography variant='body1'>{members?.length || '0'} members in the chat</Typography>
      <List>
        {history.map((msg) => {
          if (!msg?.content || msg?.channel !== 'main') {
            return;
          }
          return (
            <ListItem key={msg.id}>
              <ListItemText primary={msg.content} secondary={msg.member.id} />
            </ListItem>
          );
        })}
      </List>

      <Grid container spacing={2}>
        <Grid item xs={10}>
          <TextField
            id="message"
            label="Type your message..."
            variant="outlined"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            sx={{ width: '100%' }}
          />
        </Grid>
        <Grid item xs={2}>
          <Button
            variant='contained'
            disabled={!message}
            onClick={sendMessage}
          >
            Send
          </Button>
        </Grid>
      </Grid>
      <Button
        variant='contained'
        disabled={!chatClient}
        onClick={exitChat}
        sx={{ mt: 10 }}
      >
        Exit Chat
      </Button>
    </>
  )
}

export default Chat
