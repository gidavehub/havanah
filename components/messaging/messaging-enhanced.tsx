'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/lib/auth-store';
import { useToast } from '@/components/toast/toast';
import { 
  sendMessage, 
  listenToMessages, 
  editMessage, 
  deleteMessage,
  getConversations,
  getOrCreateConversation,
  Message as RealtimeMessage 
} from '@/lib/realtime-service';
import styles from './messaging-enhanced.module.css';

interface Message extends RealtimeMessage {
  sender: 'user' | 'agent';
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

export default function EnhancedMessagingPage() {
  const { user } = useAuth();
  const toast = useToast();
  const [conversations, setConversations] = useState(mockConversations);
  const [selectedConversation, setSelectedConversation] = useState(mockConversations[0]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isNearBottom, setIsNearBottom] = useState(true);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isNearBottom) {
      scrollToBottom();
    }
  }, [messages, isNearBottom]);

  // Load messages from Realtime Database
  useEffect(() => {
    if (!selectedConversation) return;

    setLoading(true);
    unsubscribeRef.current = listenToMessages(selectedConversation.id, (realtimeMessages) => {
      // Convert realtime messages to message format (add sender field)
      const messagesWithSender = realtimeMessages.map(msg => ({
        ...msg,
        sender: msg.senderId === user?.id ? 'user' : 'agent',
      } as Message));

      setMessages(messagesWithSender);
      setLoading(false);
    });

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, [selectedConversation?.id, user?.id]);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 100;
      setIsNearBottom(isAtBottom);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user?.id || !selectedConversation) return;

    try {
      const receiverId = selectedConversation.id === user.id ? selectedConversation.id : selectedConversation.id;
      
      await sendMessage(
        selectedConversation.id,
        user.id,
        user.name || 'User',
        receiverId,
        newMessage
      );

      setNewMessage('');
      toast.success('Message sent', undefined, 2000);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Error', 'Could not send message');
    }
  };

  const handleEditMessage = (messageId: string, currentText: string) => {
    setEditingMessageId(messageId);
    setEditingText(currentText);
  };

  const handleSaveEdit = async (messageId: string) => {
    if (!editingText.trim() || !selectedConversation) return;

    try {
      const message = messages.find(m => m.id === messageId);
      if (!message) return;

      await editMessage(
        selectedConversation.id,
        messageId,
        editingText,
        message.text
      );

      setEditingMessageId(null);
      setEditingText('');
      toast.success('Message edited', undefined, 2000);
    } catch (error) {
      console.error('Error editing message:', error);
      toast.error('Error', 'Could not edit message');
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (!selectedConversation) return;

    try {
      await deleteMessage(selectedConversation.id, messageId);
      toast.success('Message deleted', undefined, 2000);
    } catch (error) {
      console.error('Error deleting message:', error);
      toast.error('Error', 'Could not delete message');
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const filteredConversations = conversations.filter((conv) =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={styles.container}>
      {/* Sidebar */}
      <div className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h2 className={styles.sidebarTitle}>Messages</h2>
          <motion.button
            className={styles.btnNew}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            +
          </motion.button>
        </div>

        <div className={styles.searchBox}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className={styles.conversationsList}>
          <AnimatePresence>
            {filteredConversations.map((conv, idx) => (
              <motion.button
                key={conv.id}
                className={`${styles.conversation} ${
                  selectedConversation.id === conv.id ? styles.active : ''
                }`}
                onClick={() => setSelectedConversation(conv)}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ x: 4 }}
              >
                <div className={styles.conversationAvatar}>
                  <div className={styles.avatarEmoji}>{conv.avatar}</div>
                  {conv.online && <div className={styles.onlineIndicator} />}
                </div>
                <div className={styles.conversationContent}>
                  <div className={styles.conversationHeader}>
                    <p className={styles.conversationName}>{conv.name}</p>
                    <span className={styles.conversationTime}>
                      {formatTime(conv.timestamp.getTime())}
                    </span>
                  </div>
                  <p className={styles.conversationPreview}>{conv.lastMessage}</p>
                </div>
                {conv.unread > 0 && (
                  <div className={styles.unreadBadge}>{conv.unread}</div>
                )}
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Chat Area */}
      <div className={styles.chatArea}>
        {selectedConversation && (
          <>
            {/* Header */}
            <div className={styles.chatHeader}>
              <div className={styles.chatHeaderLeft}>
                <div className={styles.chatAvatar}>
                  {selectedConversation.avatar}
                </div>
                <div>
                  <h3 className={styles.chatName}>{selectedConversation.name}</h3>
                  <p className={styles.chatStatus}>
                    {selectedConversation.online ? '🟢 Online' : '⚪ Offline'}
                  </p>
                </div>
              </div>
              <motion.button
                className={styles.btnOptions}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                ⋮
              </motion.button>
            </div>

            {/* Messages */}
            <div
              className={styles.messagesContainer}
              ref={scrollRef}
              onScroll={handleScroll}
            >
              {loading ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#9ca3af' }}>
                  Loading messages...
                </div>
              ) : (
                <motion.div
                  className={styles.messagesList}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <AnimatePresence>
                    {messages.map((msg, idx) => (
                      <motion.div
                        key={msg.id}
                        className={`${styles.messageWrapper} ${styles[msg.sender]}`}
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: idx * 0.02 }}
                      >
                        <div className={styles.messageBubble}>
                          {editingMessageId === msg.id ? (
                            <div className={styles.editBox}>
                              <textarea
                                value={editingText}
                                onChange={(e) => setEditingText(e.target.value)}
                                className={styles.editInput}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' && e.ctrlKey) {
                                    handleSaveEdit(msg.id);
                                  } else if (e.key === 'Escape') {
                                    setEditingMessageId(null);
                                  }
                                }}
                              />
                              <div className={styles.editButtons}>
                                <button
                                  className={styles.editSave}
                                  onClick={() => handleSaveEdit(msg.id)}
                                >
                                  Save
                                </button>
                                <button
                                  className={styles.editCancel}
                                  onClick={() => setEditingMessageId(null)}
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className={styles.messageContent}>
                                <p className={styles.messageText}>{msg.text}</p>
                                {msg.edited && (
                                  <span className={styles.editedBadge}>(edited)</span>
                                )}
                              </div>
                              <div className={styles.messageActions}>
                                {msg.sender === 'user' && (
                                  <>
                                    <button
                                      className={styles.actionBtn}
                                      onClick={() => handleEditMessage(msg.id, msg.text)}
                                      title="Edit"
                                    >
                                      ✏️
                                    </button>
                                    <button
                                      className={styles.actionBtn}
                                      onClick={() => handleDeleteMessage(msg.id)}
                                      title="Delete"
                                    >
                                      🗑️
                                    </button>
                                  </>
                                )}
                              </div>
                            </>
                          )}
                          <div className={styles.messageFooter}>
                            <span className={styles.timestamp}>
                              {formatTime(msg.timestamp)}
                            </span>
                            {msg.read ? (
                              <span className={styles.readReceipt}>✓✓</span>
                            ) : (
                              <span className={styles.sentReceipt}>✓</span>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  <div ref={messagesEndRef} />
                </motion.div>
              )}
            </div>

            {/* Input */}
            <div className={styles.inputArea}>
              <div className={styles.inputBox}>
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  className={styles.messageInput}
                />
                <motion.button
                  className={styles.sendBtn}
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  whileHover={newMessage.trim() ? { scale: 1.05 } : {}}
                  whileTap={newMessage.trim() ? { scale: 0.95 } : {}}
                >
                  📤
                </motion.button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
