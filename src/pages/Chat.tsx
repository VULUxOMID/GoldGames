import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { supabase } from '../lib/supabase';
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Avatar,
  CircularProgress,
  Alert,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { gradientText } from '../theme/styles';
import { RealtimeChannel } from '@supabase/supabase-js';

interface Message {
  id: number;
  user_id: string;
  user_email: string;
  content: string;
  created_at: string;
  profiles?: {
    username: string;
  };
}

interface RootState {
  auth: {
    user: {
      id: string;
      email: string;
    } | null;
  };
}

export default function Chat() {
  const { user } = useSelector((state: RootState) => state.auth);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    let mounted = true;
    let channel: RealtimeChannel | null = null;

    const initializeChat = async () => {
      try {
        await fetchMessages();
        if (!mounted) return;

        channel = supabase
          .channel('chat_messages')
          .on('postgres_changes', {
            event: 'INSERT',
            schema: 'public',
            table: 'chat_messages',
          }, (payload) => {
            if (!mounted) return;
            const newMessage = payload.new as Message;
            setMessages((prev) => [...prev, newMessage]);
            scrollToBottom();
          })
          .subscribe((status, err) => {
            if (!mounted) return;
            if (status === 'SUBSCRIBED') {
              setError(null);
            } else if (err) {
              setError('Failed to connect to chat. Please try again.');
            }
          });
      } catch (error) {
        if (!mounted) return;
        const errorMessage = error instanceof Error ? error.message : 'Failed to initialize chat';
        setError(errorMessage);
      }
    };

    initializeChat();

    return () => {
      mounted = false;
      if (channel) {
        channel.unsubscribe();
      }
    };
  }, []);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*, profiles:user_id(username)')
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred while fetching messages';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    const messageContent = newMessage.trim();
    setNewMessage('');

    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .insert({
          user_id: user.id,
          user_email: user.email,
          content: messageContent,
        })
        .select()
        .single();

      if (error) throw error;

      // Optimistically update the messages list
      if (data) {
        setMessages(prev => [...prev, data as Message]);
        scrollToBottom();
      }
    } catch (error: unknown) {
      setNewMessage(messageContent); // Restore the message if sending fails
      const errorMessage = error instanceof Error ? error.message : 'An error occurred while sending message';
      setError(errorMessage);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: { xs: 4, sm: 5, md: 6 } }}>
        <Typography 
          variant="h2" 
          sx={{ 
            ...gradientText, 
            mb: 2,
            fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
          }}
        >
          Global Chat
        </Typography>
        <Typography 
          variant="h6" 
          color="text.secondary"
          sx={{ fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' } }}
        >
          Chat with fellow gamers
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper 
        elevation={3} 
        sx={{ 
          height: '60vh', 
          display: 'flex', 
          flexDirection: 'column',
          bgcolor: 'background.paper',
          borderRadius: 2,
        }}
      >
        <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
          <List>
            {messages.map((message) => (
              <ListItem 
                key={message.id}
                sx={{
                  flexDirection: user && message.user_id === user.id ? 'row-reverse' : 'row',
                  gap: 1,
                  mb: 1,
                }}
              >
                <Avatar sx={{ bgcolor: user && message.user_id === user.id ? 'primary.main' : 'secondary.main' }}>
                  {(message.profiles?.username || message.user_email)[0].toUpperCase()}
                </Avatar>
                <Paper 
                  sx={{
                    p: 2,
                    maxWidth: '70%',
                    bgcolor: user && message.user_id === user.id ? 'primary.main' : 'action.hover',
                    color: user && message.user_id === user.id ? 'primary.contrastText' : 'text.primary',
                    borderRadius: 2,
                  }}
                >
                  <ListItemText
                    primary={message.profiles?.username || message.user_email}
                    secondary={message.content}
                    secondaryTypographyProps={{
                      color: message.user_id === user.id ? 'inherit' : 'text.secondary',
                    }}
                  />
                </Paper>
              </ListItem>
            ))}
            <div ref={messagesEndRef} />
          </List>
        </Box>

        <Box 
          component="form" 
          onSubmit={handleSendMessage}
          sx={{ 
            p: 2, 
            borderTop: 1, 
            borderColor: 'divider',
            display: 'flex',
            gap: 1,
          }}
        >
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            size="small"
          />
          <IconButton 
            type="submit" 
            color="primary"
            disabled={!newMessage.trim()}
          >
            <SendIcon />
          </IconButton>
        </Box>
      </Paper>
    </Container>
  );
}