import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Box,
  Typography,
  Chip,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Card,
  CardContent,
} from '@mui/material';
import {
  ExpandMore,
  TrendingUp,
  TrendingDown,
  Lightbulb,
  Assessment,
  Star,
  Warning,
  CheckCircle,
} from '@mui/icons-material';

const AIMessageRenderer = ({ content, isTyping = false }) => {
  const [displayedContent, setDisplayedContent] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  // 打字机效果
  useEffect(() => {
    if (isTyping && currentIndex < content.length) {
      const timer = setTimeout(() => {
        setDisplayedContent(content.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, 20); // 调整速度
      return () => clearTimeout(timer);
    } else if (!isTyping) {
      setDisplayedContent(content);
    }
  }, [content, currentIndex, isTyping]);

  // 解析内容结构
  const parseContent = (text) => {
    const sections = [];
    const lines = text.split('\n');
    let currentSection = null;
    let currentContent = [];

    for (const line of lines) {
      if (line.match(/^\*\*\d+\./)) {
        // 保存之前的部分
        if (currentSection) {
          sections.push({
            ...currentSection,
            content: currentContent.join('\n')
          });
        }
        
        // 开始新部分
        const title = line.replace(/^\*\*\d+\.\s*/, '').replace(/\*\*$/, '').replace(/:.*$/, '');
        const subtitle = line.match(/:(.*)$/)?.[1]?.trim() || '';
        
        currentSection = {
          title,
          subtitle,
          type: getContentType(title),
          icon: getIcon(title)
        };
        currentContent = [];
      } else if (line.trim()) {
        currentContent.push(line);
      }
    }

    // 添加最后一个部分
    if (currentSection) {
      sections.push({
        ...currentSection,
        content: currentContent.join('\n')
      });
    }

    return sections;
  };

  const getContentType = (title) => {
    if (title.includes('業績') || title.includes('評価')) return 'assessment';
    if (title.includes('ポジティブ') || title.includes('良い')) return 'positive';
    if (title.includes('課題') || title.includes('改善')) return 'warning';
    if (title.includes('提案') || title.includes('戦略')) return 'suggestion';
    return 'default';
  };

  const getIcon = (title) => {
    if (title.includes('業績') || title.includes('評価')) return <Assessment />;
    if (title.includes('ポジティブ') || title.includes('良い')) return <CheckCircle />;
    if (title.includes('課題') || title.includes('改善')) return <Warning />;
    if (title.includes('提案') || title.includes('戦略')) return <Lightbulb />;
    return <Star />;
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'assessment': return 'primary';
      case 'positive': return 'success';
      case 'warning': return 'warning';
      case 'suggestion': return 'info';
      default: return 'default';
    }
  };

  const sections = parseContent(displayedContent);

  // 如果内容结构化失败，使用普通的markdown渲染
  if (sections.length === 0) {
    return (
      <Box sx={{ 
        '& h1, & h2, & h3': { 
          color: 'primary.main',
          fontWeight: 'bold',
          mb: 1,
          mt: 2
        },
        '& h1': { fontSize: '1.2rem' },
        '& h2': { fontSize: '1.1rem' },
        '& h3': { fontSize: '1rem' },
        '& p': { 
          mb: 1.5,
          lineHeight: 1.6
        },
        '& ul, & ol': {
          pl: 2,
          mb: 1.5
        },
        '& li': {
          mb: 0.5
        },
        '& strong': {
          color: 'primary.dark',
          fontWeight: 'bold'
        },
        '& code': {
          backgroundColor: 'grey.100',
          padding: '2px 4px',
          borderRadius: '4px',
          fontSize: '0.9rem'
        }
      }}>
        <ReactMarkdown 
          remarkPlugins={[remarkGfm]}
          children={displayedContent}
        />
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      {sections.map((section, index) => (
        <Card 
          key={index}
          elevation={1}
          sx={{ 
            mb: 2,
            border: `1px solid`,
            borderColor: `${getTypeColor(section.type)}.light`,
            '&:hover': {
              boxShadow: 2
            }
          }}
        >
          <CardContent sx={{ pb: '16px !important' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
              <Box sx={{ 
                color: `${getTypeColor(section.type)}.main`,
                mr: 1,
                display: 'flex',
                alignItems: 'center'
              }}>
                {section.icon}
              </Box>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 'bold',
                  color: `${getTypeColor(section.type)}.main`,
                  flexGrow: 1
                }}
              >
                {section.title}
              </Typography>
              <Chip 
                size="small"
                label={section.type}
                color={getTypeColor(section.type)}
                variant="outlined"
              />
            </Box>
            
            {section.subtitle && (
              <Typography 
                variant="subtitle2" 
                color="text.secondary" 
                sx={{ mb: 1.5, fontStyle: 'italic' }}
              >
                {section.subtitle}
              </Typography>
            )}
            
            <Box sx={{ 
              '& p': { 
                mb: 1,
                lineHeight: 1.6
              },
              '& ul, & ol': {
                pl: 2,
                mb: 1
              },
              '& li': {
                mb: 0.5
              },
              '& strong': {
                color: 'primary.dark',
                fontWeight: 'bold'
              }
            }}>
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                children={section.content}
              />
            </Box>
          </CardContent>
        </Card>
      ))}
      
      {isTyping && currentIndex < content.length && (
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
          <Typography variant="caption" color="text.secondary">
            AI分析中...
          </Typography>
          <Box sx={{ 
            ml: 1,
            '& span': {
              display: 'inline-block',
              animation: 'pulse 1.5s infinite',
              '&:nth-of-type(2)': { animationDelay: '0.3s' },
              '&:nth-of-type(3)': { animationDelay: '0.6s' }
            },
            '@keyframes pulse': {
              '0%, 80%, 100%': { opacity: 0.5 },
              '40%': { opacity: 1 }
            }
          }}>
            <span>•</span>
            <span>•</span>
            <span>•</span>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default AIMessageRenderer;