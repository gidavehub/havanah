'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  MdSearch, 
  MdSend, 
  MdMoreVert, 
  MdArrowBack,
  MdTagFaces,
  MdImage,
  MdAttachFile
} from 'react-icons/md';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  limit 
} from 'firebase/firestore';
import { getFirestoreInstance } from '@/lib/firebase';
import { useAuth } from '@/lib/auth-store';
import { useToast } from '@/components/toast/toast';
import { 
  listenToMessages, 
  sendMessage, 
  getConversations, 
  getOrCreateConversation, 
  markMessagesAsRead,
  Message,
  Conversation
} from '@/lib/realtime-service';
import styles from './messaging.module.css';

// Interface for search results
interface UserSearchResult {
  uid: string;
  displayName: string;
  photoURL?: string;
  email: string;
  role: 'user' | 'agent';
}

export default function MessagingPage() {
  const { user } = useAuth();
  const toast = useToast();
  
  // State
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isMobileView, setIsMobileView] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const unsubscribeMessagesRef = useRef<(() => void) | null>(null);
  const chatAreaRef = useRef<HTMLDivElement>(null);

  // 1. Handle Responsive View
  useEffect(() => {
    const handleResize = () => setIsMobileView(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 2. Load Conversations on Mount
  const loadConversations = useCallback(async () => {
    if (!user?.id) return;
    try {
      const convs = await getConversations(user.id);
      setConversations(convs);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      toast.error('Error', 'Failed to load conversations');
      setIsLoading(false);
    }
  }, [user?.id, toast]);

  useEffect(() => {
    loadConversations();
    // Set up a poller or realtime listener for conversation list updates could go here
    // For now, we reload when sending/receiving messages triggers a state change
    const interval = setInterval(loadConversations, 10000); // Refresh list every 10s
    return () => clearInterval(interval);
  }, [loadConversations]);

  // 3. Listen to Messages when Active Conversation Changes
  useEffect(() => {
    if (!activeConvId || !user?.id) return;

    // Unsubscribe from previous
    if (unsubscribeMessagesRef.current) {
      unsubscribeMessagesRef.current();
    }

    // Subscribe to new
    setIsLoading(true);
    unsubscribeMessagesRef.current = listenToMessages(activeConvId, (newMessages) => {
      setMessages(newMessages);
      setIsLoading(false);
      
      // Mark as read
      markMessagesAsRead(activeConvId, user.id);
      
      // Scroll to bottom
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    });

    return () => {
      if (unsubscribeMessagesRef.current) {
        unsubscribeMessagesRef.current();
      }
    };
  }, [activeConvId, user?.id]);

  // 4. Handle User Search
  useEffect(() => {
    const searchUsers = async () => {
      if (!searchQuery.trim() || searchQuery.length < 3) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      try {
        const db = getFirestoreInstance();
        // Search by name or email
        // Note: Firestore doesn't support native fuzzy search, so we use basic prefix matching here
        // In production, use Algolia or similar
        const usersRef = collection(db, 'users');
        const q = query(
          usersRef, 
          where('displayName', '>=', searchQuery),
          where('displayName', '<=', searchQuery + '\uf8ff'),
          limit(5)
        );

        const snapshot = await getDocs(q);
        const results: UserSearchResult[] = [];
        
        snapshot.forEach((doc) => {
          const data = doc.data();
          if (doc.id !== user?.id) { // Don't show self
            results.push({
              uid: doc.id,
              displayName: data.displayName,
              photoURL: data.profileImage,
              email: data.email,
              role: data.role
            });
          }
        });

        setSearchResults(results);
      } catch (error) {
        console.error(error);
      } finally {
        setIsSearching(false);
      }
    };

    const debounceTimer = setTimeout(searchUsers, 500);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery, user?.id]);

  // 5. Start New Chat from Search
  const handleStartChat = async (targetUser: UserSearchResult) => {
    if (!user?.id) return;
    
    try {
      const convId = await getOrCreateConversation(
        user.id,
        targetUser.uid,
        user.displayName || 'User',
        targetUser.displayName
      );
      
      setSearchQuery(''); // Clear search
      setSearchResults([]);
      await loadConversations(); // Reload list
      setActiveConvId(convId); // Open chat
    } catch (error) {
      toast.error('Error', 'Could not start conversation');
    }
  };

  // 6. Send Message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeConvId || !user) return;

    const textToSend = inputText;
    setInputText(''); // Optimistic clear

    try {
      // Find receiver ID
      const currentConv = conversations.find(c => c.id === activeConvId) || 
                          // Fallback if it's a brand new convo not in list yet
                          { participants: [] }; 
                          
      // If we just created it, we might need to fetch receiver from participants array
      // We know participants are [userId, otherId]
      // This logic works assuming we have loaded the conversation list or created the ID correctly
      const conversationData = conversations.find(c => c.id === activeConvId);
      let receiverId = '';
      
      if (conversationData) {
        receiverId = conversationData.participants.find(p => p !== user.id) || '';
      } else {
        // Fallback: If logic is complex, store receiver in state when clicking search result
        // For now, refresh list
        await loadConversations();
        return; 
      }

      await sendMessage(
        activeConvId,
        user.id,
        user.displayName || 'User',
        receiverId,
        textToSend
      );
      
      // Refresh list to update last message snippet
      loadConversations();
    } catch (error) {
      toast.error('Failed', 'Message could not be sent');
      setInputText(textToSend); // Revert on failure
    }
  };

  // Helpers
  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getOtherParticipantName = (conv: Conversation) => {
    if (!user?.id) return 'Unknown';
    const otherId = conv.participants.find(p => p !== user.id);
    return otherId ? (conv.participantNames[otherId] || 'User') : 'Unknown';
  };

  const getUnreadCount = (conv: Conversation) => {
    if (!user?.id) return 0;
    return conv.unreadCount?.[user.id] || 0;
  };

  if (!user) return null;

  return (
    <div className={styles.container}>
      
      {/* Sidebar List */}
      <aside className={`${styles.sidebar} ${activeConvId && isMobileView ? styles.hiddenMobile : ''}`}>
        <div className={styles.sidebarHeader}>
          <h2>Messages</h2>
          <div className={styles.searchBox}>
            <MdSearch className={styles.searchIcon} />
            <input 
              type="text" 
              placeholder="Search agents or users..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.conversationList}>
          {/* Search Results Mode */}
          {searchQuery.trim() !== '' ? (
            <div className={styles.searchResults}>
              <h3 className={styles.sectionLabel}>Found Users</h3>
              {isSearching ? (
                <div className={styles.loadingState}>Searching...</div>
              ) : searchResults.length > 0 ? (
                searchResults.map(result => (
                  <motion.div
                    key={result.uid}
                    className={styles.conversationItem}
                    onClick={() => handleStartChat(result)}
                    whileHover={{ backgroundColor: 'rgba(16, 185, 129, 0.05)' }}
                  >
                    <div className={styles.avatarContainer}>
                      {result.photoURL ? (
                        <img src={result.photoURL} alt={result.displayName} className={styles.avatar} />
                      ) : (
                        <div className={styles.defaultAvatar}>{result.displayName[0]}</div>
                      )}
                    </div>
                    <div className={styles.conversationInfo}>
                      <h3 className={styles.participantName}>{result.displayName}</h3>
                      <p className={styles.previewText}>{result.role === 'agent' ? 'Agent' : 'User'}</p>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className={styles.emptyStateSmall}>No users found</div>
              )}
            </div>
          ) : (
            /* Active Conversations Mode */
            <>
              {conversations.length === 0 && !isLoading && (
                <div className={styles.emptyStateSmall}>
                  No conversations yet. Search for an agent to start chatting!
                </div>
              )}
              
              {conversations.map((conv) => {
                const unread = getUnreadCount(conv);
                const name = getOtherParticipantName(conv);
                
                return (
                  <motion.div
                    key={conv.id}
                    className={`${styles.conversationItem} ${activeConvId === conv.id ? styles.active : ''}`}
                    onClick={() => setActiveConvId(conv.id)}
                    whileHover={{ backgroundColor: 'rgba(16, 185, 129, 0.05)' }}
                  >
                    <div className={styles.avatarContainer}>
                      <div className={styles.defaultAvatar}>{name.charAt(0)}</div>
                      {/* Online badge could be added here if presence system exists */}
                    </div>
                    
                    <div className={styles.conversationInfo}>
                      <div className={styles.infoTop}>
                        <h3 className={styles.participantName}>{name}</h3>
                        <span className={styles.timestamp}>{formatTime(conv.lastMessageTime)}</span>
                      </div>
                      <div className={styles.infoBottom}>
                        <p className={`${styles.previewText} ${unread > 0 ? styles.boldText : ''}`}>
                          {conv.lastMessage || 'Start a conversation'}
                        </p>
                        {unread > 0 && (
                          <span className={styles.unreadBadge}>{unread}</span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </>
          )}
        </div>
      </aside>

      {/* Chat Area */}
      <main className={`${styles.chatArea} ${!activeConvId && isMobileView ? styles.hiddenMobile : ''}`} ref={chatAreaRef}>
        {activeConvId ? (
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
                  <div className={styles.avatarSmall}>
                    {getOtherParticipantName(conversations.find(c => c.id === activeConvId)!).charAt(0)}
                  </div>
                </div>
                <div className={styles.headerInfo}>
                  <h3>{getOtherParticipantName(conversations.find(c => c.id === activeConvId)!)}</h3>
                  <span>Online</span>
                </div>
              </div>
              <button className={styles.optionsBtn}>
                <MdMoreVert />
              </button>
            </header>

            {/* Messages List */}
            <div className={styles.messagesList}>
              {messages.map((msg) => {
                const isMe = msg.senderId === user.id;
                return (
                  <motion.div 
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`${styles.messageWrapper} ${isMe ? styles.myMessage : styles.theirMessage}`}
                  >
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
                <button className={styles.iconButton} type="button"><MdAttachFile /></button>
                <button className={styles.iconButton} type="button"><MdImage /></button>
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
            <p>Select a conversation or search for a user to start chatting.</p>
          </div>
        )}
      </main>
    </div>
  );
}