import { useState, useEffect, useCallback } from 'react';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  timestamp: Date;
  read: boolean;
}

export interface Alert {
  id: string;
  symbol: string;
  strike: string;
  optionType: 'CE' | 'PE';
  alertType: 'OI_INCREASE' | 'OI_DECREASE' | 'PRICE_ABOVE' | 'PRICE_BELOW';
  threshold: number;
  percentage: number;
  isActive: boolean;
  createdAt: Date;
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);

  // Load notifications and alerts from localStorage
  useEffect(() => {
    const savedNotifications = localStorage.getItem('chakramarkets-notifications');
    const savedAlerts = localStorage.getItem('chakramarkets-alerts');
    
    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications));
    }
    if (savedAlerts) {
      setAlerts(JSON.parse(savedAlerts));
    }
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('chakramarkets-notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('chakramarkets-alerts', JSON.stringify(alerts));
  }, [alerts]);

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    
    // Show browser notification if supported
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/chakra-logo.svg'
      });
    }
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const addAlert = useCallback((alert: Omit<Alert, 'id' | 'createdAt'>) => {
    const newAlert: Alert = {
      ...alert,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    
    setAlerts(prev => [...prev, newAlert]);
  }, []);

  const updateAlert = useCallback((id: string, updates: Partial<Alert>) => {
    setAlerts(prev => 
      prev.map(alert => 
        alert.id === id 
          ? { ...alert, ...updates }
          : alert
      )
    );
  }, []);

  const removeAlert = useCallback((id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  }, []);

  const toggleAlert = useCallback((id: string) => {
    setAlerts(prev => 
      prev.map(alert => 
        alert.id === id 
          ? { ...alert, isActive: !alert.isActive }
          : alert
      )
    );
  }, []);

  const getUnreadCount = useCallback(() => {
    return notifications.filter(notification => !notification.read).length;
  }, [notifications]);

  const getActiveAlertsCount = useCallback(() => {
    return alerts.filter(alert => alert.isActive).length;
  }, [alerts]);

  return {
    notifications,
    alerts,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAllNotifications,
    addAlert,
    updateAlert,
    removeAlert,
    toggleAlert,
    getUnreadCount,
    getActiveAlertsCount
  };
};
