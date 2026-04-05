import { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Send, 
  CheckCheck, 
  Check,
  Archive,
  MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Chat {
  id: string;
  userName: string;
  userEmail: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  status: 'active' | 'closed' | 'pending';
  messages: Message[];
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'support';
  timestamp: Date;
  senderName?: string;
  read: boolean;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Mock data for demo
const mockChats: Chat[] = [
  {
    id: 'chat-1',
    userName: 'John Smith',
    userEmail: 'john@example.com',
    lastMessage: 'Hi, I need help with my shipment tracking',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    unreadCount: 2,
    status: 'active',
    messages: [
      {
        id: '1',
        text: 'Hi, I need help with my shipment tracking',
        sender: 'user',
        timestamp: new Date(Date.now() - 1000 * 60 * 10),
        read: false,
      },
      {
        id: '2',
        text: 'My tracking number is CSS123456789',
        sender: 'user',
        timestamp: new Date(Date.now() - 1000 * 60 * 5),
        read: false,
      },
    ],
  },
  {
    id: 'chat-2',
    userName: 'Sarah Johnson',
    userEmail: 'sarah@company.com',
    lastMessage: 'Thank you for your help!',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    unreadCount: 0,
    status: 'active',
    messages: [
      {
        id: '1',
        text: 'Hello, I have a question about pricing',
        sender: 'user',
        timestamp: new Date(Date.now() - 1000 * 60 * 45),
        read: true,
      },
      {
        id: '2',
        text: 'Hi Sarah! I\'d be happy to help. What would you like to know?',
        sender: 'support',
        timestamp: new Date(Date.now() - 1000 * 60 * 40),
        senderName: 'Support Agent',
        read: true,
      },
      {
        id: '3',
        text: 'Thank you for your help!',
        sender: 'user',
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        read: true,
      },
    ],
  },
  {
    id: 'chat-3',
    userName: 'Mike Wilson',
    userEmail: 'mike@business.com',
    lastMessage: 'When will my package arrive?',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    unreadCount: 1,
    status: 'pending',
    messages: [
      {
        id: '1',
        text: 'When will my package arrive?',
        sender: 'user',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
        read: false,
      },
    ],
  },
];

export default function AdminChat() {
  const [chats, setChats] = useState<Chat[]>(mockChats);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [inputMessage, setInputMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'pending' | 'closed'>('all');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedChat?.messages]);

  // Poll for new chats
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`${API_URL}/chat/admin/chats`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          if (data.chats) {
            setChats(data.chats.map((c: any) => ({
              ...c,
              lastMessageTime: new Date(c.lastMessageTime),
              messages: c.messages?.map((m: any) => ({
                ...m,
                timestamp: new Date(m.timestamp),
              })) || [],
            })));
          }
        }
      } catch (error) {
        // Silent fail - use mock data
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const filteredChats = chats.filter(chat => {
    const matchesSearch = 
      chat.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.userEmail.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'all' || chat.status === filter;
    return matchesSearch && matchesFilter;
  });

  const handleSelectChat = (chat: Chat) => {
    setSelectedChat(chat);
    // Mark messages as read
    setChats(prev => prev.map(c => {
      if (c.id === chat.id) {
        return { ...c, unreadCount: 0 };
      }
      return c;
    }));
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputMessage.trim() || !selectedChat) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'support',
      timestamp: new Date(),
      senderName: 'Support Agent',
      read: true,
    };

    // Update local state
    const updatedChat = {
      ...selectedChat,
      messages: [...selectedChat.messages, newMessage],
      lastMessage: inputMessage,
      lastMessageTime: new Date(),
    };

    setSelectedChat(updatedChat);
    setChats(prev => prev.map(c => c.id === selectedChat.id ? updatedChat : c));
    setInputMessage('');

    // Send to backend
    try {
      await fetch(`${API_URL}/chat/${selectedChat.id}/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          text: inputMessage,
          sender: 'support',
          senderName: 'Support Agent',
        }),
      });
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleCloseChat = async (chatId: string) => {
    try {
      await fetch(`${API_URL}/chat/${chatId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ status: 'closed' }),
      });
    } catch (error) {
      console.error('Error closing chat:', error);
    }

    setChats(prev => prev.map(c => c.id === chatId ? { ...c, status: 'closed' } : c));
    if (selectedChat?.id === chatId) {
      setSelectedChat(null);
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const totalUnread = chats.reduce((sum, chat) => sum + chat.unreadCount, 0);

  return (
    <div className="h-[calc(100vh-8rem)] bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="h-full flex">
        {/* Chat List Sidebar */}
        <div className="w-80 border-r border-gray-200 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-semibold text-navy-950 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-purple-600" />
                Live Chat
                {totalUnread > 0 && (
                  <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                    {totalUnread}
                  </span>
                )}
              </h2>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search chats..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-2 mt-3">
              {(['all', 'active', 'pending', 'closed'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1 text-xs font-medium rounded-full capitalize transition-colors ${
                    filter === f
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Chat List */}
          <div className="flex-1 overflow-y-auto">
            {filteredChats.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No chats found</p>
              </div>
            ) : (
              filteredChats.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => handleSelectChat(chat)}
                  className={`w-full p-4 text-left border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                    selectedChat?.id === chat.id ? 'bg-purple-50 border-l-4 border-l-purple-600' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-brand flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-medium text-sm">
                        {chat.userName.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-navy-950 truncate">{chat.userName}</p>
                        <span className="text-xs text-gray-400">
                          {formatTime(chat.lastMessageTime)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 truncate">{chat.lastMessage}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          chat.status === 'active' ? 'bg-green-100 text-green-700' :
                          chat.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {chat.status}
                        </span>
                        {chat.unreadCount > 0 && (
                          <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                            {chat.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        {selectedChat ? (
          <div className="flex-1 flex flex-col">
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-brand flex items-center justify-center">
                  <span className="text-white font-medium text-sm">
                    {selectedChat.userName.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-navy-950">{selectedChat.userName}</p>
                  <p className="text-xs text-gray-500">{selectedChat.userEmail}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handleCloseChat(selectedChat.id)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Close chat"
                >
                  <Archive className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {selectedChat.messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'support' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] ${
                      message.sender === 'support'
                        ? 'bg-purple-600 text-white rounded-2xl rounded-br-md'
                        : 'bg-gray-100 text-gray-800 rounded-2xl rounded-bl-md'
                    } px-4 py-3`}
                  >
                    {message.sender === 'support' && (
                      <p className="text-xs font-medium opacity-70 mb-1">
                        {message.senderName || 'Support Agent'}
                      </p>
                    )}
                    <p className="text-sm">{message.text}</p>
                    <div className={`flex items-center gap-1 mt-1 ${message.sender === 'support' ? 'text-white/60' : 'text-gray-500'}`}>
                      <span className="text-xs">
                        {message.timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {message.sender === 'support' && (
                        message.read ? <CheckCheck className="w-3 h-3" /> : <Check className="w-3 h-3" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
              <div className="flex gap-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1"
                />
                <Button
                  type="submit"
                  className="bg-gradient-brand text-white hover:opacity-90"
                  disabled={!inputMessage.trim()}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </form>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="font-display font-semibold text-navy-950 mb-2">
                Select a chat to start
              </h3>
              <p className="text-gray-500">
                Choose a conversation from the list to view messages
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
