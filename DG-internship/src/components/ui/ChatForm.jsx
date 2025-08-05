import { useState, useRef, useEffect } from 'react';
import {
  Paper,
  Box,
  Typography,
  TextField,
  IconButton,
  Avatar,
  Chip,
  CircularProgress,
  Divider
} from '@mui/material';
import { Send, SmartToy, Person, Psychology } from '@mui/icons-material';

export const ChatForm = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: 'こんにちは！マーケティングデータ分析についてお気軽にご質問ください。LTV推移、売上分析、顧客属性など、データに基づいたアドバイスをお手伝いします。',
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    setTimeout(() => {
      const responses = [
        'データを分析すると、課金開始から7日以内のユーザーのLTVが特に高い傾向があります。この期間の体験向上に注力することをお勧めします。',
        '曜日別の売上データを見ると、土日の課金額が平日より30%高くなっています。週末限定のキャンペーンを検討してみてはいかがでしょうか。',
        '顧客属性分析では、20-30代男性の課金率が最も高いことが分かります。このセグメントに特化したコンテンツ展開が効果的でしょう。',
        'ヘビー課金者の行動パターンを分析すると、特定の機能の利用率が高いことが判明しています。この機能の改善とプロモーションをお勧めします。'
      ];
      
      const aiResponse = {
        id: Date.now() + 1,
        text: responses[Math.floor(Math.random() * responses.length)],
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
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
        {messages.map((message) => (
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
        ))}
        
        {isLoading && (
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
          disabled={isLoading}
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
          disabled={!inputValue.trim() || isLoading}
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