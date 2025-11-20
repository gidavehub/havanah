'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/lib/auth-store';
import { useToast } from '@/components/toast/toast';
import {
  sendMessage,
  listenToMessages,
  getOrCreateConversation,
  getConversations,
  markMessagesAsRead,
  Message,
  Conversation,
} from '@/lib/realtime-service';
import styles from './messaging.module.css';

export default function MessagingPage() {
  const { user } = useAuth();
  const toast = useToast();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [notificationShown, setNotificationShown] = useState<Set<string>>(new Set());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const unsubscribeRef = useRef<(() => void) | null>(null);
  const lastMessageCountRef = useRef(0);

  // Load conversations on mount
  useEffect(() => {
    if (!user?.id) return;

    const loadConversations = async () => {
      try {
        const convs = await getConversations(user.id);
        setConversations(convs);
        if (convs.length > 0 && !selectedConversationId) {
          setSelectedConversationId(convs[0].id);
        }
      } catch (error) {
        console.error('Error loading conversations:', error);
      }
    };

    loadConversations();
  }, [user?.id]);

  // Listen to messages in selected conversation
  useEffect(() => {
    if (!selectedConversationId || !user?.id) return;

    // Mark as read
    markMessagesAsRead(selectedConversationId, user.id);

    // Listen to messages
    unsubscribeRef.current = listenToMessages(selectedConversationId, (msgs) => {
      setMessages(msgs);

      // Show toast for new messages from other users
      msgs.forEach((msg) => {
        if (
          msg.senderId !== user.id &&
          !notificationShown.has(msg.id)
        ) {
          setNotificationShown(prev => new Set(prev).add(msg.id));
          toast.success(
            `💬 ${msg.senderName}`,
            msg.text.substring(0, 50) + (msg.text.length > 50 ? '...' : ''),
            4000
          );
        }
      });
    });

    // Scroll to bottom
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, [selectedConversationId, user?.id, toast]);

  // Auto-scroll when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMessage.trim() || !selectedConversationId || !user?.id) return;

    setLoading(true);

    try {
      const conversation = conversations.find(c => c.id === selectedConversationId);
      if (!conversation) return;

      const otherParticipantId = conversation.participants.find(p => p !== user.id);
      if (!otherParticipantId) return;

      await sendMessage(
        selectedConversationId,
        user.id,
        user.displayName || user.email || 'Unknown',
        otherParticipantId,
        newMessage
      );

      setNewMessage('');
      toast.success('Message sent', '', 2000);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed', 'Could not send message');
    } finally {
      setLoading(false);
    }
  };

  const startNewConversation = async (agentId: string, agentName: string) => {
    try {
      const conversationId = await getOrCreateConversation(
        user?.id || '',
        agentId,
        user?.displayName || user?.email || 'User',
        agentName
      );

      setSelectedConversationId(conversationId);
      setNewMessage('');
      toast.success('Conversation started', '', 2000);
    } catch (error) {
      console.error('Error starting conversation:', error);
      toast.error('Failed', 'Could not start conversation');
    }
  };

  const filteredConversations = conversations.filter(conv =>
    Object.values(conv.participantNames).some(name =>
      (name as string).toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const selectedConversation = conversations.find(c => c.id === selectedConversationId);

  return (
    <div className={styles.container}>
      {/* Sidebar */}
      <div className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h2 className={styles.sidebarTitle}>Messages</h2>
          <button className={styles.btnNew}>+</button>
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
          {filteredConversations.length === 0 ? (
            <div style={{ padding: '2rem 1rem', textAlign: 'center', color: '#9ca3af' }}>
              <p>No conversations yet</p>
            </div>
          ) : (
            filteredConversations.map((conversation) => {
              const otherParticipant = Object.entries(conversation.participantNames).find(
                ([id]) => id !== user?.id
              );
              const otherName = otherParticipant?.[1] || 'Unknown';

              return (
                <motion.button
                  key={conversation.id}
                  className={`${styles.conversation} ${
                    selectedConversationId === conversation.id ? styles.active : ''
                  }`}
                  onClick={() => setSelectedConversationId(conversation.id)}
                  whileHover={{ backgroundColor: 'rgba(16, 185, 129, 0.05)' }}
                >
                  <div className={styles.conversationAvatar}>
                    <div className={styles.avatarEmoji}>👤</div>
                  </div>

                  <div className={styles.conversationContent}>
                    <div className={styles.conversationHeader}>
                      <h3 className={styles.conversationName}>{otherName}</h3>
                      <span className={styles.conversationTime}>
                        {new Date(conversation.lastMessageTime).toLocaleDateString()}
                      </span>
                    </div>
                    <p className={styles.conversationPreview}>
                      {conversation.lastMessage.substring(0, 40)}...
                    </p>
                  </div>

                  {conversation.unreadCount?.[user?.id || ''] ? (
                    <div className={styles.unreadBadge}>
                      {conversation.unreadCount[user.id]}
                    </div>
                  ) : null}
                </motion.button>
              );
            })
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className={styles.chatArea}>
        {selectedConversation ? (
          <>
            {/* Header */}
            <div className={styles.chatHeader}>
              <div className={styles.chatHeaderLeft}>
                <div className={styles.chatAvatar}>👤</div>
                <div>
                  <h2 className={styles.chatName}>
                    {Object.entries(selectedConversation.participantNames)
                      .find(([id]) => id !== user?.id)?.[1] || 'Unknown'}
                  </h2>
                  <p className={styles.chatStatus}>Active now</p>
                </div>
              </div>
              <button className={styles.btnOptions}>⋮</button>
            </div>

            {/* Messages */}
            <div className={styles.messagesContainer}>
              <div className={styles.messagesList}>
                <AnimatePresence>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      className={`${styles.messageWrapper} ${
                        message.senderId === user?.id
                          ? styles.userMessage
                          : styles.agentMessage
                      }`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <div className={styles.messageBubble}>
                        <p className={styles.messageText}>{message.text}</p>
                        <span className={styles.messageTime}>
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input Area */}
            <div className={styles.inputArea}>
              <form className={styles.inputForm} onSubmit={handleSendMessage}>
                <button type="button" className={styles.btnAttach}>📎</button>
                <input
                  type="text"
                  className={styles.messageInput}
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  disabled={loading}
                />
                <motion.button
                  type="submit"
                  className={styles.btnSend}
                  disabled={!newMessage.trim() || loading}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  ✈️
                </motion.button>
              </form>
            </div>
          </>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#9ca3af' }}>
            <p>Select a conversation to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
}
