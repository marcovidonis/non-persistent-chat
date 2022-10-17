import { useState, useEffect } from 'react';
import { Chat as ChatClient } from "@signalwire/js";
import { List, ListItem, ListItemText } from '@mui/material';




function Chat(props) {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(false)
  const [subscribed, setSubscribed] = useState(false)

  const { chatToken } = props;

  let chatClient;
  useEffect(() => {
    if (!chatToken || loading || subscribed) {
      return;
    }
    setLoading(true)

    const subscribe = async () => {
      chatClient = new ChatClient.Client({
        token: chatToken,
      });

      chatClient.on("message", (message) => {
        console.log("Received", message);

        setHistory([...history, message]);
      });

      chatClient.on("member.joined", (member) => {
        //TODO
      });


      await chatClient.subscribe("mychannel1");
      setSubscribed(true);
      setLoading(false);
    }

    subscribe();



    //TODO move following to separate functions
    // await chatClient.publish({
    //   channel: "mychannel1",
    //   content: "hello world",
    // });
  }, [chatToken]);

  useEffect(() => {
    //TODO when we join, get list of members and poll a random one for history
    if (!chatClient) {
      return;
    }

  }, [chatClient]);

  return (
    <List>
      {history.map((msg) => {
        if (!msg?.content) {
          return;
        }
        return (
          <ListItem>
            <ListItemText primary={msg.content} />
          </ListItem>
        );
      })}
    </List>
  )
}

export default Chat
