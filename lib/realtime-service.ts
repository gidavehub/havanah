import {
  ref,
  set,
  push,
  onValue,
  off,
  update,
  get,
  query as dbQuery,
  orderByChild,
  limitToLast,
  Unsubscribe,
} from 'firebase/database';
import { getRealtimeDatabaseInstance } from '@/lib/firebase';

// ==================== MESSAGING ====================

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  conversationId: string;
  text: string;
  timestamp: number;
  read: boolean;
  type: 'text' | 'system'; // 'system' for notifications
}

export interface Conversation {
  id: string;
  participants: string[]; // [userId, agentId]
  participantNames: { [key: string]: string };
  lastMessage: string;
  lastMessageTime: number;
  unreadCount: { [key: string]: number };
}

/**
 * Send a message
 */
export const sendMessage = async (
  conversationId: string,
  senderId: string,
  senderName: string,
  receiverId: string,
  text: string
): Promise<string> => {
  try {
    const db = getRealtimeDatabaseInstance();
    const messagesRef = ref(db, `conversations/${conversationId}/messages`);
    
    const newMessageRef = push(messagesRef);
    const messageId = newMessageRef.key || '';
    
    const message: Omit<Message, 'id'> = {
      senderId,
      senderName,
      receiverId,
      conversationId,
      text,
      timestamp: Date.now(),
      read: false,
      type: 'text',
    };
    
    await set(newMessageRef, message);
    
    // Update conversation last message
    await update(ref(db, `conversations/${conversationId}`), {
      lastMessage: text,
      lastMessageTime: Date.now(),
      [`unreadCount/${receiverId}`]: 1,
    });
    
    return messageId;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

/**
 * Listen to messages in a conversation
 */
export const listenToMessages = (
  conversationId: string,
  callback: (messages: Message[]) => void
): Unsubscribe => {
  const db = getRealtimeDatabaseInstance();
  const messagesRef = ref(db, `conversations/${conversationId}/messages`);
  
  const unsubscribe = onValue(messagesRef, (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val();
      const messages: Message[] = Object.keys(data).map(key => ({
        id: key,
        ...data[key],
      }));
      
      // Sort by timestamp
      messages.sort((a, b) => a.timestamp - b.timestamp);
      callback(messages);
    } else {
      callback([]);
    }
  });
  
  return unsubscribe;
};

/**
 * Get conversations for a user
 */
export const getConversations = async (userId: string): Promise<Conversation[]> => {
  try {
    const db = getRealtimeDatabaseInstance();
    const conversationsRef = ref(db, 'conversations');
    
    const snapshot = await get(conversationsRef);
    if (!snapshot.exists()) return [];
    
    const allConversations = snapshot.val();
    const userConversations: Conversation[] = [];
    
    Object.keys(allConversations).forEach(convId => {
      const conversation = allConversations[convId];
      if (conversation.participants.includes(userId)) {
        userConversations.push({
          id: convId,
          ...conversation,
        });
      }
    });
    
    // Sort by last message time
    userConversations.sort((a, b) => b.lastMessageTime - a.lastMessageTime);
    
    return userConversations;
  } catch (error) {
    console.error('Error fetching conversations:', error);
    throw error;
  }
};

/**
 * Create or get conversation
 */
export const getOrCreateConversation = async (
  userId: string,
  agentId: string,
  userName: string,
  agentName: string
): Promise<string> => {
  try {
    const db = getRealtimeDatabaseInstance();
    const conversationsRef = ref(db, 'conversations');
    
    // Check if conversation exists
    const snapshot = await get(conversationsRef);
    if (snapshot.exists()) {
      const conversations = snapshot.val();
      
      for (const [convId, conv] of Object.entries(conversations)) {
        const conversation = conv as any;
        if (
          conversation.participants.includes(userId) &&
          conversation.participants.includes(agentId)
        ) {
          return convId;
        }
      }
    }
    
    // Create new conversation
    const convId = `${userId}_${agentId}_${Date.now()}`;
    const newConversation: Conversation = {
      id: convId,
      participants: [userId, agentId],
      participantNames: {
        [userId]: userName,
        [agentId]: agentName,
      },
      lastMessage: '',
      lastMessageTime: Date.now(),
      unreadCount: {
        [userId]: 0,
        [agentId]: 0,
      },
    };
    
    await set(ref(db, `conversations/${convId}`), newConversation);
    
    return convId;
  } catch (error) {
    console.error('Error creating conversation:', error);
    throw error;
  }
};

/**
 * Mark messages as read
 */
export const markMessagesAsRead = async (conversationId: string, userId: string): Promise<void> => {
  try {
    const db = getRealtimeDatabaseInstance();
    
    await update(ref(db, `conversations/${conversationId}`), {
      [`unreadCount/${userId}`]: 0,
    });
  } catch (error) {
    console.error('Error marking messages as read:', error);
  }
};

/**
 * Listen to unread messages
 */
export const listenToUnreadMessages = (
  userId: string,
  callback: (count: number) => void
): Unsubscribe => {
  const db = getRealtimeDatabaseInstance();
  const conversationsRef = ref(db, 'conversations');
  
  const unsubscribe = onValue(conversationsRef, (snapshot) => {
    if (snapshot.exists()) {
      const conversations = snapshot.val();
      let totalUnread = 0;
      
      Object.values(conversations).forEach((conv: any) => {
        if (conv.participants.includes(userId)) {
          totalUnread += conv.unreadCount?.[userId] || 0;
        }
      });
      
      callback(totalUnread);
    }
  });
  
  return unsubscribe;
};

// ==================== NOTIFICATIONS ====================

export interface Notification {
  id: string;
  userId: string;
  type: 'inquiry' | 'message' | 'application' | 'system';
  title: string;
  message: string;
  data?: Record<string, any>; // Additional data like inquiryId, listingId, etc.
  read: boolean;
  timestamp: number;
}

/**
 * Send notification (creates toast + stores in database)
 */
export const sendNotification = async (
  userId: string,
  notification: Omit<Notification, 'id' | 'timestamp'>
): Promise<string> => {
  try {
    const db = getRealtimeDatabaseInstance();
    const notificationsRef = ref(db, `notifications/${userId}`);
    
    const newNotifRef = push(notificationsRef);
    const notifId = newNotifRef.key || '';
    
    const notif: Omit<Notification, 'id'> = {
      ...notification,
      timestamp: Date.now(),
    };
    
    await set(newNotifRef, notif);
    
    return notifId;
  } catch (error) {
    console.error('Error sending notification:', error);
    throw error;
  }
};

/**
 * Listen to notifications for a user
 */
export const listenToNotifications = (
  userId: string,
  callback: (notifications: Notification[]) => void
): Unsubscribe => {
  const db = getRealtimeDatabaseInstance();
  const notificationsRef = ref(db, `notifications/${userId}`);
  
  const unsubscribe = onValue(notificationsRef, (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val();
      const notifications: Notification[] = Object.keys(data).map(key => ({
        id: key,
        ...data[key],
      }));
      
      // Sort by timestamp (newest first)
      notifications.sort((a, b) => b.timestamp - a.timestamp);
      callback(notifications);
    } else {
      callback([]);
    }
  });
  
  return unsubscribe;
};

/**
 * Mark notification as read
 */
export const markNotificationAsRead = async (userId: string, notificationId: string): Promise<void> => {
  try {
    const db = getRealtimeDatabaseInstance();
    
    await update(ref(db, `notifications/${userId}/${notificationId}`), {
      read: true,
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
  }
};

/**
 * Delete notification
 */
export const deleteNotification = async (userId: string, notificationId: string): Promise<void> => {
  try {
    const db = getRealtimeDatabaseInstance();
    
    await set(ref(db, `notifications/${userId}/${notificationId}`), null);
  } catch (error) {
    console.error('Error deleting notification:', error);
  }
};

export default {
  // Messaging
  sendMessage,
  listenToMessages,
  getConversations,
  getOrCreateConversation,
  markMessagesAsRead,
  listenToUnreadMessages,
  
  // Notifications
  sendNotification,
  listenToNotifications,
  markNotificationAsRead,
  deleteNotification,
};
