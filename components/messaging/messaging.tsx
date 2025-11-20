'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  MdSearch, MdSend, MdMoreVert, MdArrowBack, MdTagFaces, MdAttachFile, MdImage
} from 'react-icons/md';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { getFirestoreInstance } from '@/lib/firebase';
import { useAuth } from '@/lib/auth-store';
import { useToast } from '@/components/toast/toast';
import { 
  listenToMessages, sendMessage, getConversations, 
  getOrCreateConversation, markMessagesAsRead, Message, Conversation
} from '@/lib/realtime-service';
import styles from './messaging.module.css';

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

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const unsubscribeMessagesRef = useRef<(() => void) | null>(null);

  // Responsive
  useEffect(() => {
    const handleResize = () => setIsMobileView(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Load Conversations
  const loadConversations = useCallback(async () => {
    if (!user?.id) return;
    try {
      const convs = await getConversations(user.id);
      setConversations(convs);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  // Load Messages
  useEffect(() => {
    if (!activeConvId || !user?.id) return;
    if (unsubscribeMessagesRef.current) unsubscribeMessagesRef.current();

    unsubscribeMessagesRef.current = listenToMessages(activeConvId, (newMessages) => {
      setMessages(newMessages);
      markMessagesAsRead(activeConvId, user.id);
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    });

    return () => { if (unsubscribeMessagesRef.current) unsubscribeMessagesRef.current(); };
  }, [activeConvId, user?.id]);

  // IMPROVED SEARCH LOGIC
  useEffect(() => {
    const searchUsers = async () => {
      if (!searchQuery.trim() || searchQuery.length < 3) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      try {
        const db = getFirestoreInstance();
        const usersRef = collection(db, 'users');
        const results: UserSearchResult[] = [];

        // Strategy 1: Name Prefix Search (Case Sensitive in Firestore)
        // Ideally, you'd store a 'lowercaseName' field in Firestore for better search
        const qName = query(
          usersRef, 
          where('displayName', '>=', searchQuery),
          where('displayName', '<=', searchQuery + '\uf8ff'),
          limit(5)
        );
        
        const nameSnap = await getDocs(qName);
        nameSnap.forEach((doc) => {
          if (doc.id !== user?.id) {
            const data = doc.data();
            results.push({ uid: doc.id, displayName: data.displayName, photoURL: data.profileImage, email: data.email, role: data.role });
          }
        });

        // Strategy 2: Exact Email Match (Fallback)
        if (results.length === 0) {
          const qEmail = query(usersRef, where('email', '==', searchQuery));
          const emailSnap = await getDocs(qEmail);
          emailSnap.forEach((doc) => {
            if (doc.id !== user?.id) {
              const data = doc.data();
              // Avoid duplicates
              if (!results.find(r => r.uid === doc.id)) {
                results.push({ uid: doc.id, displayName: data.displayName, photoURL: data.profileImage, email: data.email, role: data.role });
              }
            }
          });
        }

        setSearchResults(results);
      } catch (error) {
        console.error("Search error", error);
      } finally {
        setIsSearching(false);
      }
    };

    const debounceTimer = setTimeout(searchUsers, 500);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery, user?.id]);

  const handleStartChat = async (targetUser: UserSearchResult) => {
    if (!user?.id) return;
    try {
      const convId = await getOrCreateConversation(user.id, targetUser.uid, user.displayName || 'User', targetUser.displayName);
      setSearchQuery('');
      setSearchResults([]);
      await loadConversations();
      setActiveConvId(convId);
    } catch (error) {
      toast.error('Error', 'Could not start chat');
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeConvId || !user) return;
    
    const text = inputText;
    setInputText('');
    
    try {
      const conv = conversations.find(c => c.id === activeConvId);
      // Fallback logic if conversation isn't in list yet (unlikely after create, but safe)
      let receiverId = conv?.participants.find(p => p !== user.id) || '';
      
      await sendMessage(activeConvId, user.id, user.displayName || 'User', receiverId, text);
      loadConversations();
    } catch (error) {
      toast.error('Error', 'Failed to send');
      setInputText(text);
    }
  };

  // Check if we were redirected here with a specific conversation ID (from Profile or Listing)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const preSelectedId = params.get('id');
    if (preSelectedId) {
      setActiveConvId(preSelectedId);
    }
  }, []);

  const getOtherName = (conv: Conversation) => {
    if (!user?.id) return 'User';
    const otherId = conv.participants.find(p => p !== user.id);
    return otherId ? conv.participantNames[otherId] : 'User';
  };

  if (!user) return <div className={styles.container}><div className={styles.emptyState}>Please log in to view messages.</div></div>;

  return (
    <div className={styles.container}>
      <aside className={`${styles.sidebar} ${activeConvId && isMobileView ? styles.hiddenMobile : ''}`}>
        <div className={styles.sidebarHeader}>
          <h2>Messages</h2>
          <div className={styles.searchBox}>
            <MdSearch className={styles.searchIcon} />
            <input 
              type="text" 
              placeholder="Search name or email..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.conversationList}>
          {searchQuery ? (
            <div className={styles.searchResults}>
              <p className={styles.sectionLabel}>Search Results</p>
              {isSearching ? <p className={styles.loadingText}>Searching...</p> : 
               searchResults.length === 0 ? <p className={styles.emptyText}>No users found.</p> :
               searchResults.map(res => (
                 <div key={res.uid} className={styles.conversationItem} onClick={() => handleStartChat(res)}>
                   <div className={styles.avatarContainer}>
                     <div className={styles.defaultAvatar}>{res.displayName[0]}</div>
                   </div>
                   <div className={styles.conversationInfo}>
                     <h3>{res.displayName}</h3>
                     <p>{res.role}</p>
                   </div>
                 </div>
               ))}
            </div>
          ) : (
            conversations.map(conv => (
              <div key={conv.id} className={`${styles.conversationItem} ${activeConvId === conv.id ? styles.active : ''}`} onClick={() => setActiveConvId(conv.id)}>
                <div className={styles.avatarContainer}>
                   <div className={styles.defaultAvatar}>{getOtherName(conv)[0]}</div>
                </div>
                <div className={styles.conversationInfo}>
                  <div className={styles.infoTop}>
                    <h3>{getOtherName(conv)}</h3>
                    <span>{new Date(conv.lastMessageTime).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
                  </div>
                  <p className={styles.previewText}>{conv.lastMessage}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </aside>

      <main className={`${styles.chatArea} ${!activeConvId && isMobileView ? styles.hiddenMobile : ''}`}>
        {activeConvId ? (
          <>
            <header className={styles.chatHeader}>
              {isMobileView && <button className={styles.backBtn} onClick={() => setActiveConvId(null)}><MdArrowBack /></button>}
              <div className={styles.headerInfo}>
                <h3>{getOtherName(conversations.find(c => c.id === activeConvId)!)}</h3>
              </div>
            </header>
            <div className={styles.messagesList}>
              {messages.map(msg => (
                <div key={msg.id} className={`${styles.messageWrapper} ${msg.senderId === user.id ? styles.myMessage : styles.theirMessage}`}>
                  <div className={styles.messageBubble}><p>{msg.text}</p></div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <footer className={styles.inputArea}>
              <form onSubmit={handleSendMessage} className={styles.inputForm}>
                <input type="text" value={inputText} onChange={(e) => setInputText(e.target.value)} placeholder="Type a message..." />
                <button type="submit" className={styles.sendBtn} disabled={!inputText.trim()}><MdSend /></button>
              </form>
            </footer>
          </>
        ) : (
          <div className={styles.emptyState}>Select a chat to start messaging</div>
        )}
      </main>
    </div>
  );
}