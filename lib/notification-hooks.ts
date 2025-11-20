'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useToast } from '@/components/toast/toast';
import { listenToNotifications, listenToUnreadMessages, listenToMessages, Notification, Message } from '@/lib/realtime-service';

/**
 * Hook to listen to notifications and show toast
 */
export const useNotificationListener = (userId?: string) => {
  const toast = useToast();
  const unsubscribeRef = useRef<(() => void) | null>(null);
  const shownNotificationsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!userId) return;

    // Listen to notifications
    unsubscribeRef.current = listenToNotifications(userId, (notifications) => {
      notifications.forEach((notification) => {
        // Only show toast once per notification
        if (!shownNotificationsRef.current.has(notification.id)) {
          shownNotificationsRef.current.add(notification.id);

          const icons = {
            inquiry: '🎯',
            message: '💬',
            application: '📋',
            system: 'ℹ',
          };

          const icon = icons[notification.type] || 'ℹ';

          if (notification.type === 'inquiry') {
            toast.success(
              `${icon} ${notification.title}`,
              notification.message,
              5000
            );
          } else if (notification.type === 'message') {
            toast.info(
              `${icon} ${notification.title}`,
              notification.message,
              5000
            );
          } else if (notification.type === 'application') {
            toast.success(
              `${icon} ${notification.title}`,
              notification.message,
              5000
            );
          } else {
            toast.info(
              `${icon} ${notification.title}`,
              notification.message,
              5000
            );
          }
        }
      });
    });

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, [userId, toast]);
};

/**
 * Hook to listen to unread message count
 */
export const useUnreadMessagesCount = (userId?: string) => {
  const toast = useToast();
  const unsubscribeRef = useRef<(() => void) | null>(null);
  const lastCountRef = useRef(0);

  useEffect(() => {
    if (!userId) return;

    unsubscribeRef.current = listenToUnreadMessages(userId, (count) => {
      if (count > lastCountRef.current && count > 0) {
        // Show notification only when count increases
        if (count === 1) {
          toast.info('💬 New Message', 'You have a new message');
        } else {
          toast.info('💬 New Messages', `You have ${count} new messages`);
        }
      }
      lastCountRef.current = count;
    });

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, [userId, toast]);
};

/**
 * Hook to listen to messages in a conversation and show toast for new messages
 */
export const useConversationMessages = (
  conversationId: string,
  currentUserId?: string,
  onMessage?: (message: Message) => void
) => {
  const toast = useToast();
  const unsubscribeRef = useRef<(() => void) | null>(null);
  const lastMessageIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!conversationId || !currentUserId) return;

    unsubscribeRef.current = listenToMessages(conversationId, (messages) => {
      if (messages.length > 0) {
        const latestMessage = messages[messages.length - 1];

        // Show toast only for new incoming messages from other users
        if (
          latestMessage.id !== lastMessageIdRef.current &&
          latestMessage.senderId !== currentUserId
        ) {
          toast.success(
            `💬 ${latestMessage.senderName}`,
            latestMessage.text,
            4000
          );
        }

        lastMessageIdRef.current = latestMessage.id;

        if (onMessage) {
          onMessage(latestMessage);
        }
      }
    });

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, [conversationId, currentUserId, toast, onMessage]);
};

/**
 * Hook to show inquiry notification
 */
export const useInquiryNotification = () => {
  const toast = useToast();

  const showInquiryNotification = useCallback((inquiryData: any) => {
    toast.success(
      '🎯 New Inquiry!',
      `${inquiryData.userName} is interested in "${inquiryData.listingTitle}"`,
      6000
    );
  }, [toast]);

  return { showInquiryNotification };
};

/**
 * Hook to show message notification
 */
export const useMessageNotification = () => {
  const toast = useToast();

  const showMessageNotification = useCallback((messageData: any) => {
    toast.info(
      '💬 New Message',
      `${messageData.senderName}: ${messageData.text.substring(0, 50)}...`,
      5000
    );
  }, [toast]);

  return { showMessageNotification };
};

export default {
  useNotificationListener,
  useUnreadMessagesCount,
  useConversationMessages,
  useInquiryNotification,
  useMessageNotification,
};
