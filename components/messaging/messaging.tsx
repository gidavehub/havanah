'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/components/toast/toast';
import styles from './messaging.module.css';

interface Message {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  timestamp: Date;
  read: boolean;
}

interface Conversation {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: Date;
  unread: number;
  online: boolean;
}

const mockConversations: Conversation[] = [
  {
    id: '1',
    name: 'John Dealer',
    avatar: '👤',
    lastMessage: 'The car is ready for pickup!',
    timestamp: new Date(Date.now() - 5 * 60000),
    unread: 2,
    online: true,
  },
  {
    id: '2',
    name: 'Sarah Properties',
    avatar: '👤',
    lastMessage: 'Would you like to schedule a viewing?',
    timestamp: new Date(Date.now() - 2 * 3600000),
    unread: 0,
    online: false,
  },
  {
    id: '3',
    name: 'Mike Rentals',
    avatar: '👤',
    lastMessage: 'Payment confirmed. Documents sent.',
    timestamp: new Date(Date.now() - 1 * 86400000),
    unread: 0,
    online: true,
  },
];

const mockMessages: Message[] = [
  {
    id: '1',
    sender: 'agent',
    text: 'Hi! Thanks for your interest in the BMW M5. Its available next week!',
    timestamp: new Date(Date.now() - 15 * 60000),
    read: true,
  },
  {
    id: '2',
    sender: 'user',
    text: 'Great! What are the rental terms?',
    timestamp: new Date(Date.now() - 12 * 60000),
    read: true,
  },
  {
    id: '3',
    sender: 'agent',
    text: 'We offer daily, weekly, and monthly rates. The car is $150/day with full insurance included.',
    timestamp: new Date(Date.now() - 10 * 60000),
    read: true,
  },
  {
    id: '4',
    sender: 'user',
    text: 'Perfect! Can I book it for next weekend?',
    timestamp: new Date(Date.now() - 8 * 60000),
    read: true,
  },
  {
    id: '5',
    sender: 'agent',
    text: 'The car is ready for pickup!',
    timestamp: new Date(Date.now() - 5 * 60000),
    read: false,
  },
];

export default function MessagingPage() {
  const toast = useToast();
  const [conversations, setConversations] = useState(mockConversations);
  const [selectedConversation, setSelectedConversation] = useState(mockConversations[0]);
  const [messages, setMessages] = useState(mockMessages);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: newMessage,
      timestamp: new Date(),
      read: true,
    };

    setMessages([...messages, message]);
    setNewMessage('');
    toast.success('Message Sent', 'Your message has been delivered.');

    // Simulate agent response
    setTimeout(() => {
      const response: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'agent',
        text: 'Thanks for your message! I will get back to you shortly.',
        timestamp: new Date(),
        read: false,
      };
      setMessages((prev) => [...prev, response]);
      toast.info('New Message', `${selectedConversation.name} sent you a message.`);
    }, 1500);
  };

  const filteredConversations = conversations.filter(
    (conv) =>
      conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={styles.container}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h1 className={styles.sidebarTitle}>Messages</h1>
          <button className={styles.btnNew} title="New conversation">
            ✏️
          </button>
        </div>

        <div className={styles.searchBox}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.conversationsList}>
          <AnimatePresence>
            {filteredConversations.map((conversation) => (
              <motion.button
                key={conversation.id}
                className={`${styles.conversation} ${
                  selectedConversation.id === conversation.id ? styles.active : ''
                }`}
                onClick={() => setSelectedConversation(conversation)}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                whileHover={{ backgroundColor: 'rgba(16, 185, 129, 0.05)' }}
              >
                <div className={styles.conversationAvatar}>
                  <span className={styles.avatarEmoji}>{conversation.avatar}</span>
                  {conversation.online && <div className={styles.onlineIndicator}></div>}
                </div>

                <div className={styles.conversationContent}>
                  <div className={styles.conversationHeader}>
                    <h3 className={styles.conversationName}>{conversation.name}</h3>
                    <span className={styles.conversationTime}>
                      {conversation.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <p className={styles.conversationPreview}>{conversation.lastMessage}</p>
                </div>

                {conversation.unread > 0 && (
                  <div className={styles.unreadBadge}>{conversation.unread}</div>
                )}
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
      </aside>

      {/* Chat Area */}
      <main className={styles.chatArea}>
        {selectedConversation && (
          <>
            {/* Chat Header */}
            <div className={styles.chatHeader}>
              <div className={styles.chatHeaderLeft}>
                <div className={styles.chatAvatar}>
                  <span>{selectedConversation.avatar}</span>
                  {selectedConversation.online && (
                    <div className={styles.onlineIndicator}></div>
                  )}
                </div>
                <div>
                  <h2 className={styles.chatName}>{selectedConversation.name}</h2>
                  <span className={styles.chatStatus}>
                    {selectedConversation.online ? '🟢 Online' : '🔴 Offline'}
                  </span>
                </div>
              </div>
              <button className={styles.btnOptions}>⋮</button>
            </div>

            {/* Messages */}
            <div className={styles.messagesContainer}>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className={styles.messagesList}
              >
                <AnimatePresence>
                  {messages.map((message, index) => (
                    <motion.div
                      key={message.id}
                      className={`${styles.messageWrapper} ${
                        message.sender === 'user' ? styles.userMessage : styles.agentMessage
                      }`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <div className={styles.messageBubble}>
                        <p className={styles.messageText}>{message.text}</p>
                        <span className={styles.messageTime}>
                          {message.timestamp.toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                          {message.sender === 'user' && message.read && ' ✓✓'}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                <div ref={messagesEndRef} />
              </motion.div>
            </div>

            {/* Input Area */}
            <div className={styles.inputArea}>
              <form onSubmit={handleSendMessage} className={styles.inputForm}>
                <button type="button" className={styles.btnAttach} title="Attach file">
                  📎
                </button>
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className={styles.messageInput}
                />
                <button
                  type="submit"
                  className={styles.btnSend}
                  disabled={!newMessage.trim()}
                  title="Send message"
                >
                  ➤
                </button>
              </form>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
