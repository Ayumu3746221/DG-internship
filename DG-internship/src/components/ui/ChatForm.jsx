import { useState, useRef, useEffect } from 'react';
import {
  Paper,
  Box,
  Typography,
  TextField,
  IconButton,
  Avatar,
  CircularProgress,
  Divider,
  Button
} from '@mui/material';
import { Send, SmartToy, Person, Psychology, Refresh } from '@mui/icons-material';
import { chatAPI } from '../../services/api';

export const ChatForm = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatStarted, setChatStarted] = useState(false);
  const [chatInitialized, setChatInitialized] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const startChat = async () => {
    try {
      setIsLoading(true);
      setChatInitialized(true);
      const response = await chatAPI.startChat();
      
      if (response.success) {
        setChatStarted(true);
        setMessages([{
          id: crypto.randomUUID(),
          text: response.data.analysis,
          sender: 'ai',
          timestamp: new Date()
        }]);
      }
    } catch (error) {
      console.error('Failed to start chat:', error);
      const errorMessage = error.response?.data?.error || '申し訳ございません。チャットの開始に失敗しました。';
      setMessages([{
        id: crypto.randomUUID(),
        text: errorMessage,
        sender: 'ai',
        timestamp: new Date()
      }]);
      
      // 503エラーの場合は自動リトライ
      if (error.response?.data?.details === 503) {
        setTimeout(() => {
          setMessages(prev => [...prev, {
            id: crypto.randomUUID(),
            text: '再接続を試みています...',
            sender: 'ai',
            timestamp: new Date()
          }]);
          startChat();
        }, 3000);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading || !chatStarted) return;

    const userMessage = {
      id: crypto.randomUUID(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await chatAPI.sendMessage(inputValue);
      
      if (response.success) {
        const aiResponse = {
          id: crypto.randomUUID(),
          text: response.data.response,
          sender: 'ai',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiResponse]);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      const errorText = error.response?.data?.error || 'メッセージの送信に失敗しました。もう一度お試しください。';
      const errorMessage = {
        id: crypto.randomUUID(),
        text: errorText,
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const resetChat = async () => {
    try {
      await chatAPI.resetChat();
      setMessages([]);
      setChatStarted(false);
      setChatInitialized(false);
      setInputValue('');
    } catch (error) {
      console.error('Failed to reset chat:', error);
    }
  };

  return (
    <Paper 
      elevation={3}
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.98) 100%)',
        backdropFilter: 'blur(10px)',
        borderRadius: 3,
        overflow: 'hidden'
      }}
    >
      {/* Header */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          p: 3,
          color: 'white',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              sx={{
                background: 'rgba(255,255,255,0.2)',
                backdropFilter: 'blur(10px)',
                width: 48,
                height: 48,
              }}
            >
              <Psychology />
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                AIマーケティングアシスタント
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                データドリブンなアドバイスを提供
              </Typography>
            </Box>
          </Box>
          {chatStarted && (
            <IconButton
              onClick={resetChat}
              sx={{
                color: 'white',
                background: 'rgba(255,255,255,0.2)',
                '&:hover': {
                  background: 'rgba(255,255,255,0.3)',
                },
              }}
              title="チャットをリセット"
            >
              <Refresh />
            </IconButton>
          )}
        </Box>
      </Box>

      {/* Messages */}
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        {!chatInitialized ? (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100%',
            flexDirection: 'column',
            gap: 3
          }}>
            <SmartToy sx={{ fontSize: 60, color: 'primary.main' }} />
            <Typography variant="h6" align="center" sx={{ fontWeight: 'bold' }}>
              AI分析を開始
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center" sx={{ maxWidth: 300 }}>
              経営データをAIに送信し、分析を開始します。
              AIが初期分析を提供した後、質問できるようになります。
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={startChat}
              disabled={isLoading}
              startIcon={<Psychology />}
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a72e3 0%, #6d4498 100%)',
                },
              }}
            >
              {isLoading ? '初期化中...' : 'チャットを開始'}
            </Button>
          </Box>
        ) : !chatStarted && isLoading ? (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100%',
            flexDirection: 'column',
            gap: 2
          }}>
            <CircularProgress size={40} />
            <Typography variant="body2" color="text.secondary">
              チャットを初期化中...
            </Typography>
          </Box>
        ) : (
          messages.map((message) => (
          <Box
            key={message.id}
            sx={{
              display: 'flex',
              justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
              alignItems: 'flex-start',
              gap: 1,
            }}
          >
            {message.sender === 'ai' && (
              <Avatar
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  width: 32,
                  height: 32,
                }}
              >
                <SmartToy fontSize="small" />
              </Avatar>
            )}
            
            <Box sx={{ maxWidth: '75%' }}>
              <Paper
                elevation={1}
                sx={{
                  p: 2,
                  background: message.sender === 'user' 
                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                    : 'white',
                  color: message.sender === 'user' ? 'white' : 'text.primary',
                  borderRadius: 3,
                  border: message.sender === 'ai' ? '1px solid' : 'none',
                  borderColor: 'divider',
                }}
              >
                <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                  {message.text}
                </Typography>
              </Paper>
              <Typography 
                variant="caption" 
                color="text.secondary" 
                sx={{ 
                  display: 'block', 
                  mt: 0.5, 
                  px: 1,
                  textAlign: message.sender === 'user' ? 'right' : 'left'
                }}
              >
                {message.timestamp.toLocaleTimeString('ja-JP', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </Typography>
            </Box>

            {message.sender === 'user' && (
              <Avatar
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  width: 32,
                  height: 32,
                }}
              >
                <Person fontSize="small" />
              </Avatar>
            )}
          </Box>
          ))
        )}
        
        {isLoading && messages.length > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: 1 }}>
            <Avatar
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                width: 32,
                height: 32,
              }}
            >
              <SmartToy fontSize="small" />
            </Avatar>
            <Paper elevation={1} sx={{ p: 2, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
              <CircularProgress size={20} />
            </Paper>
          </Box>
        )}
        <div ref={messagesEndRef} />
      </Box>

      <Divider />
      
      {/* Input */}
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          p: 2,
          display: 'flex',
          gap: 1,
          alignItems: 'flex-end',
          background: 'rgba(255,255,255,0.8)',
          backdropFilter: 'blur(5px)',
        }}
      >
        <TextField
          fullWidth
          multiline
          maxRows={3}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="データ分析について質問してください..."
          disabled={isLoading || !chatInitialized}
          variant="outlined"
          size="small"
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 3,
              background: 'white',
            },
          }}
        />
        <IconButton
          type="submit"
          disabled={!inputValue.trim() || isLoading || !chatInitialized}
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            '&:hover': {
              background: 'linear-gradient(135deg, #5a72e3 0%, #6d4498 100%)',
            },
            '&.Mui-disabled': {
              background: 'rgba(0,0,0,0.12)',
              color: 'rgba(0,0,0,0.26)',
            },
          }}
        >
          <Send />
        </IconButton>
      </Box>
    </Paper>
  );
};