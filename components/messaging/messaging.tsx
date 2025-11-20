'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MdSearch, 
  MdSend, 
  MdAttachFile, 
  MdMoreVert, 
  MdArrowBack,
  MdImage,
  MdInsertDriveFile,
  MdTagFaces
} from 'react-icons/md';
import { useAuth } from '@/lib/auth-store';
import styles from './messaging.module.css';

// Types
interface User {
  id: string;
  name: string;
  avatar: string;
  online: boolean;
  lastSeen?: string;
}

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: Date;
  read: boolean;
  type: 'text' | 'image' | 'file';
  fileUrl?: string;
}

interface Conversation {
  id: string;
  participant: User;
  lastMessage: string;
  timestamp: Date;
  unreadCount: number;
  typing?: boolean;
}

// Mock Data
const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: '1',
    participant: {
      id: 'agent1',
      name: 'Sarah Properties',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop',
      online: true,
    },
    lastMessage: 'The viewing is confirmed for 2 PM.',
    timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 mins ago
    unreadCount: 2,
  },
  {
    id: '2',
    participant: {
      id: 'agent2',
      name: 'John Dealer',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop',
      online: false,
      lastSeen: '2h ago',
    },
    lastMessage: 'Did you like the BMW M5?',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    unreadCount: 0,
  },
  {
    id: '3',
    participant: {
      id: 'support',
      name: 'Havanah Support',
      avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=150&auto=format&fit=crop',
      online: true,
    },
    lastMessage: 'Your document has been verified.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    unreadCount: 0,
  },
];

const MOCK_MESSAGES: Message[] = [
  {
    id: '1',
    senderId: 'agent1',
    text: 'Hi there! Thanks for your interest in the Downtown Loft.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60),
    read: true,
    type: 'text',
  },
  {
    id: '2',
    senderId: 'me',
    text: 'Hello! Yes, I would love to see it.',
    timestamp: new Date(Date.now() - 1000 * 60 * 55),
    read: true,
    type: 'text',
  },
  {
    id: '3',
    senderId: 'agent1',
    text: 'Great! Are you free this afternoon?',
    timestamp: new Date(Date.now() - 1000 * 60 * 50),
    read: true,
    type: 'text',
  },
  {
    id: '4',
    senderId: 'me',
    text: 'Does 2 PM work for you?',
    timestamp: new Date(Date.now() - 1000 * 60 * 45),
    read: true,
    type: 'text',
  },
  {
    id: '5',
    senderId: 'agent1',
    text: 'The viewing is confirmed for 2 PM.',
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    read: false,
    type: 'text',
  },
];

export default function MessagingPage() {
  const { user } = useAuth();
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isMobileView, setIsMobileView] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Responsive check
  useEffect(() => {
    const handleResize = () => setIsMobileView(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeConvId]);

  const activeConversation = MOCK_CONVERSATIONS.find((c) => c.id === activeConvId);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: 'me',
      text: inputText,
      timestamp: new Date(),
      read: false,
      type: 'text',
    };

    setMessages([...messages, newMessage]);
    setInputText('');
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={styles.container}>
      
      {/* Sidebar List */}
      <aside className={`${styles.sidebar} ${activeConvId && isMobileView ? styles.hiddenMobile : ''}`}>
        <div className={styles.sidebarHeader}>
          <h2>Messages</h2>
          <div className={styles.searchBox}>
            <MdSearch className={styles.searchIcon} />
            <input type="text" placeholder="Search chats..." />
          </div>
        </div>

        <div className={styles.conversationList}>
          {MOCK_CONVERSATIONS.map((conv) => (
            <motion.div
              key={conv.id}
              className={`${styles.conversationItem} ${activeConvId === conv.id ? styles.active : ''}`}
              onClick={() => setActiveConvId(conv.id)}
              whileHover={{ backgroundColor: 'rgba(16, 185, 129, 0.05)' }}
              whileTap={{ scale: 0.98 }}
            >
              <div className={styles.avatarContainer}>
                <img src={conv.participant.avatar} alt={conv.participant.name} className={styles.avatar} />
                {conv.participant.online && <div className={styles.onlineBadge} />}
              </div>
              
              <div className={styles.conversationInfo}>
                <div className={styles.infoTop}>
                  <h3 className={styles.participantName}>{conv.participant.name}</h3>
                  <span className={styles.timestamp}>{formatTime(conv.timestamp)}</span>
                </div>
                <div className={styles.infoBottom}>
                  <p className={styles.previewText}>{conv.lastMessage}</p>
                  {conv.unreadCount > 0 && (
                    <span className={styles.unreadBadge}>{conv.unreadCount}</span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </aside>

      {/* Chat Area */}
      <main className={`${styles.chatArea} ${!activeConvId && isMobileView ? styles.hiddenMobile : ''}`}>
        {activeConversation ? (
          <>
            {/* Chat Header */}
            <header className={styles.chatHeader}>
              {isMobileView && (
                <button className={styles.backBtn} onClick={() => setActiveConvId(null)}>
                  <MdArrowBack />
                </button>
              )}
              <div className={styles.headerProfile}>
                <div className={styles.avatarContainer}>
                  <img 
                    src={activeConversation.participant.avatar} 
                    alt={activeConversation.participant.name} 
                    className={styles.avatarSmall} 
                  />
                  {activeConversation.participant.online && <div className={styles.onlineBadge} />}
                </div>
                <div className={styles.headerInfo}>
                  <h3>{activeConversation.participant.name}</h3>
                  <span>
                    {activeConversation.participant.online 
                      ? 'Online' 
                      : `Last seen ${activeConversation.participant.lastSeen}`}
                  </span>
                </div>
              </div>
              <button className={styles.optionsBtn}>
                <MdMoreVert />
              </button>
            </header>

            {/* Messages List */}
            <div className={styles.messagesList}>
              {messages.map((msg, index) => {
                const isMe = msg.senderId === 'me';
                return (
                  <motion.div 
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`${styles.messageWrapper} ${isMe ? styles.myMessage : styles.theirMessage}`}
                  >
                    {!isMe && (
                      <img 
                        src={activeConversation.participant.avatar} 
                        alt="Sender" 
                        className={styles.messageAvatar} 
                      />
                    )}
                    <div className={styles.messageBubble}>
                      <p>{msg.text}</p>
                      <div className={styles.messageMeta}>
                        <span>{formatTime(msg.timestamp)}</span>
                        {isMe && (
                          <span className={styles.readReceipt}>
                            {msg.read ? '✓✓' : '✓'}
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <footer className={styles.inputArea}>
              <div className={styles.attachmentActions}>
                <button className={styles.iconButton}><MdAdd /></button>
              </div>
              <form className={styles.inputForm} onSubmit={handleSendMessage}>
                <input 
                  type="text" 
                  placeholder="Type a message..." 
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                />
                <button 
                  type="button" 
                  className={styles.emojiBtn}
                >
                  <MdTagFaces />
                </button>
              </form>
              <motion.button 
                className={styles.sendBtn}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleSendMessage}
                disabled={!inputText.trim()}
              >
                <MdSend />
              </motion.button>
            </footer>
          </>
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>💬</div>
            <h2>Your Messages</h2>
            <p>Select a conversation to start chatting.</p>
          </div>
        )}
      </main>
    </div>
  );
}