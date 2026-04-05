import { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Minimize2, Maximize2, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'support';
  timestamp: Date;
  senderName?: string;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [showUserForm, setShowUserForm] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [chatId, setChatId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load chat history from localStorage
  useEffect(() => {
    const savedChat = localStorage.getItem('chatSession');
    if (savedChat) {
      const parsed = JSON.parse(savedChat);
      setMessages(parsed.messages || []);
      setChatId(parsed.chatId);
      setUserName(parsed.userName || '');
      setUserEmail(parsed.userEmail || '');
      setShowUserForm(!parsed.userName);
    }
  }, []);

  // Save chat to localStorage
  useEffect(() => {
    if (messages.length > 0 || chatId) {
      localStorage.setItem('chatSession', JSON.stringify({
        messages,
        chatId,
        userName,
        userEmail,
      }));
    }
  }, [messages, chatId, userName, userEmail]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Poll for new messages
  useEffect(() => {
    if (!chatId || !isOpen) return;

    const interval = setInterval(async () => {
      try {
        const response = await fetch(`${API_URL}/chat/${chatId}/messages`);
        if (response.ok) {
          const data = await response.json();
          if (data.messages) {
            setMessages(data.messages.map((m: any) => ({
              ...m,
              timestamp: new Date(m.timestamp),
            })));
          }
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [chatId, isOpen]);

  const handleStartChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || !userEmail.trim()) return;

    try {
      const response = await fetch(`${API_URL}/chat/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userName, userEmail }),
      });

      if (response.ok) {
        const data = await response.json();
        setChatId(data.chatId);
        setShowUserForm(false);
        
        // Add welcome message
        const welcomeMessage: Message = {
          id: Date.now().toString(),
          text: `Hello ${userName}! Welcome to CashSupportShipment support. How can we help you today?`,
          sender: 'support',
          timestamp: new Date(),
          senderName: 'Support Team',
        };
        setMessages([welcomeMessage]);
      }
    } catch (error) {
      console.error('Error starting chat:', error);
      // Fallback: start chat without backend
      setChatId('local-' + Date.now());
      setShowUserForm(false);
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        text: `Hello ${userName}! Welcome to CashSupportShipment support. How can we help you today?`,
        sender: 'support',
        timestamp: new Date(),
        senderName: 'Support Team',
      };
      setMessages([welcomeMessage]);
    }
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputMessage.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');

    // Send to backend
    if (chatId) {
      try {
        await fetch(`${API_URL}/chat/${chatId}/message`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: inputMessage,
            sender: 'user',
            userName,
          }),
        });
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }

    // Simulate support typing
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      // Auto-reply for demo (in production, this would come from admin)
      if (chatId?.startsWith('local-')) {
        const autoReply: Message = {
          id: (Date.now() + 1).toString(),
          text: 'Thank you for your message. Our support team will get back to you shortly. For immediate assistance, please call +1 (800) 555-SHIP.',
          sender: 'support',
          timestamp: new Date(),
          senderName: 'Support Team',
        };
        setMessages(prev => [...prev, autoReply]);
      }
    }, 2000);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-brand rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center z-50 group"
        aria-label="Open chat"
      >
        <MessageSquare className="w-6 h-6 text-white" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse" />
        <span className="absolute right-full mr-3 px-3 py-1 bg-navy-950 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Live Support
        </span>
      </button>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl z-50 transition-all duration-300 ${
      isMinimized ? 'h-14' : 'h-[500px]'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-brand rounded-t-2xl">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-purple-600" />
          </div>
          <div>
            <p className="font-semibold text-white">Live Support</p>
            <p className="text-xs text-white/70">We typically reply in minutes</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
          >
            {isMinimized ? (
              <Maximize2 className="w-4 h-4 text-white" />
            ) : (
              <Minimize2 className="w-4 h-4 text-white" />
            )}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="flex-1 h-[340px] overflow-y-auto p-4 space-y-4">
            {showUserForm ? (
              <form onSubmit={handleStartChat} className="space-y-4">
                <p className="text-center text-gray-600 text-sm">
                  Please provide your details to start chatting with our support team
                </p>
                <div>
                  <label className="text-sm font-medium text-gray-700">Your Name</label>
                  <Input
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="John Doe"
                    className="mt-1"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <Input
                    type="email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    placeholder="john@example.com"
                    className="mt-1"
                    required
                  />
                </div>
                <Button type="submit" className="w-full bg-gradient-brand text-white">
                  Start Chat
                </Button>
              </form>
            ) : (
              <>
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] ${
                        message.sender === 'user'
                          ? 'bg-purple-600 text-white rounded-2xl rounded-br-md'
                          : 'bg-gray-100 text-gray-800 rounded-2xl rounded-bl-md'
                      } px-4 py-2`}
                    >
                      {message.sender === 'support' && (
                        <p className="text-xs font-medium opacity-70 mb-1">
                          {message.senderName || 'Support Team'}
                        </p>
                      )}
                      <p className="text-sm">{message.text}</p>
                      <p className={`text-xs mt-1 ${message.sender === 'user' ? 'text-white/60' : 'text-gray-500'}`}>
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-2xl rounded-bl-md px-4 py-3">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input */}
          {!showUserForm && (
            <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-100">
              <div className="flex gap-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1"
                />
                <Button
                  type="submit"
                  size="icon"
                  className="bg-gradient-brand text-white hover:opacity-90"
                  disabled={!inputMessage.trim()}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-gray-400 mt-2 text-center">
                Powered by CashSupportShipment Support
              </p>
            </form>
          )}
        </>
      )}
    </div>
  );
}
