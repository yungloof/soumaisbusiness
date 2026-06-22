import React, { useState, useEffect, useRef } from 'react';
import { Search, Send, User, MessageSquare, Loader2, Plus } from 'lucide-react';
import { io } from 'socket.io-client';

const WebChat = () => {
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loadingChats, setLoadingChats] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [waStatus, setWaStatus] = useState('DISCONNECTED');
  const [sending, setSending] = useState(false);

  const socketRef = useRef();
  const messagesEndRef = useRef(null);
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const isMaster = user.role === 'MASTER';
  const companyQuery = isMaster ? '?companyId=1' : '';

  useEffect(() => {
    // Check WhatsApp connection status first
    const checkStatus = async () => {
      try {
        const res = await fetch(`/api/whatsapp/status${companyQuery}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        setWaStatus(data.status);
        if (data.status === 'CONNECTED') {
          fetchChats();
        } else {
          setLoadingChats(false);
        }
      } catch (err) {
        console.error('Error checking status:', err);
        setLoadingChats(false);
      }
    };
    checkStatus();

    // Setup Socket.io
    const apiUrl = import.meta.env.VITE_API_URL || '';
    socketRef.current = io(apiUrl);

    socketRef.current.on('whatsapp-message', (data) => {
      const { message } = data;
      // If the incoming message belongs to the active chat, append it
      setActiveChat((currentActive) => {
        if (currentActive && currentActive.id === message.chatId) {
          setMessages((prev) => [...prev, message]);
        }
        return currentActive;
      });
      // Also update the chat list's last message and unread count
      setChats((prevChats) => {
        const updated = [...prevChats];
        const chatIndex = updated.findIndex(c => c.id === message.chatId);
        if (chatIndex >= 0) {
          updated[chatIndex].lastMessage = { body: message.body };
          if (!message.fromMe) {
            updated[chatIndex].unreadCount = (updated[chatIndex].unreadCount || 0) + 1;
          }
          // Move to top
          const chat = updated.splice(chatIndex, 1)[0];
          updated.unshift(chat);
        } else {
          // New chat
          updated.unshift({
            id: message.chatId,
            name: message.chatId.split('@')[0],
            lastMessage: { body: message.body },
            unreadCount: message.fromMe ? 0 : 1
          });
        }
        return updated;
      });
    });

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const fetchChats = async () => {
    setLoadingChats(true);
    try {
      const res = await fetch(`/api/whatsapp/chats${companyQuery}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.chats) {
        setChats(data.chats);
      }
    } catch (err) {
      console.error('Error fetching chats:', err);
    } finally {
      setLoadingChats(false);
    }
  };

  const selectChat = async (chat) => {
    setActiveChat(chat);
    setLoadingMessages(true);
    
    // Reset unread count locally
    setChats(prev => prev.map(c => c.id === chat.id ? { ...c, unreadCount: 0 } : c));

    try {
      const res = await fetch(`/api/whatsapp/chats/${chat.id}/messages${companyQuery}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.messages) {
        // WhatsApp messages usually come in descending order, we might need to reverse them for display
        setMessages(data.messages.reverse());
      }
    } catch (err) {
      console.error('Error fetching messages:', err);
    } finally {
      setLoadingMessages(false);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || !activeChat || sending) return;

    const msgText = inputMessage;
    setInputMessage('');
    setSending(true);

    try {
      const bodyPayload = isMaster ? { companyId: 1, message: msgText } : { message: msgText };
      const res = await fetch(`/api/whatsapp/chats/${activeChat.id}/send`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bodyPayload)
      });
      const data = await res.json();
      if (data.success) {
        // The message will also come back via socket (message_create), but we can append optimistically or just rely on socket.
        // Relying on socket to prevent duplicates.
      } else {
        alert('Erro ao enviar mensagem');
      }
    } catch (err) {
      console.error('Error sending message:', err);
    } finally {
      setSending(false);
    }
  };

  const startNewChat = () => {
    let number = prompt('Digite o número do WhatsApp com DDD (ex: 11999999999):');
    if (!number) return;
    
    // Remove non-numeric characters
    number = number.replace(/\D/g, '');
    
    // If it doesn't have country code for Brazil, add it (55)
    if (number.length === 10 || number.length === 11) {
      number = '55' + number;
    }
    
    const chatId = `${number}@c.us`;
    const newChat = {
      id: chatId,
      name: `+${number}`,
      lastMessage: null,
      unreadCount: 0,
      timestamp: Math.floor(Date.now() / 1000)
    };
    
    // Add to chats if not exists
    setChats(prev => {
      if (!prev.find(c => c.id === chatId)) {
        return [newChat, ...prev];
      }
      return prev;
    });
    
    selectChat(newChat);
  };

  if (waStatus !== 'CONNECTED') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '80vh', textAlign: 'center' }}>
        <MessageSquare size={64} color="var(--text-muted)" style={{ marginBottom: '1rem', opacity: 0.5 }} />
        <h2>WhatsApp não está conectado</h2>
        <p style={{ color: 'var(--text-muted)', maxWidth: 400, marginTop: '0.5rem' }}>
          Para usar a Caixa de Entrada, primeiro você precisa parear o WhatsApp na tela de Conexão.
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 100px)', background: 'white', borderRadius: 16, overflow: 'hidden', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
      {/* Sidebar - Chats List */}
      <div style={{ width: 350, borderRight: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', background: '#f9fafb' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', background: 'white' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>Conversas</h2>
            <button onClick={startNewChat} style={{ background: '#25D366', color: 'white', border: 'none', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} title="Nova Conversa">
              <Plus size={18} />
            </button>
          </div>
          <div style={{ position: 'relative' }}>
            <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: 12, top: 10 }} />
            <input 
              type="text" 
              placeholder="Buscar contato..." 
              style={{ width: '100%', padding: '0.6rem 1rem 0.6rem 2.5rem', borderRadius: 999, border: '1px solid var(--border-color)', background: '#f3f4f6', fontSize: '0.9rem' }}
            />
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {loadingChats ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
              <Loader2 className="animate-spin" size={32} color="var(--primary-red)" />
            </div>
          ) : (
            chats.map(chat => (
              <div 
                key={chat.id} 
                onClick={() => selectChat(chat)}
                style={{ 
                  padding: '1rem 1.5rem', 
                  borderBottom: '1px solid var(--border-color)', 
                  cursor: 'pointer',
                  background: activeChat?.id === chat.id ? '#fef2f2' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  transition: 'background 0.2s'
                }}
              >
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <User size={24} color="#9ca3af" />
                </div>
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <span style={{ fontWeight: 600, color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {chat.name}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {new Date(chat.timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {chat.lastMessage?.body || 'Arquivo/Mídia'}
                    </span>
                    {chat.unreadCount > 0 && (
                      <span style={{ background: '#25D366', color: 'white', fontSize: '0.75rem', fontWeight: 700, padding: '2px 8px', borderRadius: 999 }}>
                        {chat.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Area - Chat History */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#ece5dd' }}>
        {activeChat ? (
          <>
            {/* Chat Header */}
            <div style={{ padding: '1rem 2rem', background: 'white', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '1rem', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', zIndex: 10 }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <User size={20} color="#9ca3af" />
              </div>
              <div>
                <h3 style={{ fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>{activeChat.name}</h3>
                <span style={{ fontSize: '0.8rem', color: '#25D366' }}>Online</span>
              </div>
            </div>

            {/* Messages Area */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {loadingMessages ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                  <Loader2 className="animate-spin" size={40} color="var(--primary-red)" />
                </div>
              ) : (
                messages.map((msg, index) => {
                  const isSent = msg.fromMe;
                  return (
                    <div key={index} style={{ display: 'flex', justifyContent: isSent ? 'flex-end' : 'flex-start' }}>
                      <div style={{
                        background: isSent ? '#dcf8c6' : 'white',
                        padding: '0.75rem 1rem',
                        borderRadius: 12,
                        borderTopRightRadius: isSent ? 0 : 12,
                        borderTopLeftRadius: !isSent ? 0 : 12,
                        maxWidth: '70%',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                        position: 'relative'
                      }}>
                        <p style={{ margin: 0, color: '#303030', fontSize: '0.95rem', lineHeight: 1.5 }}>
                          {msg.body || (msg.type !== 'chat' ? `[Mensagem tipo: ${msg.type}]` : '')}
                        </p>
                        <span style={{ fontSize: '0.65rem', color: '#999', display: 'block', textAlign: 'right', marginTop: '0.25rem' }}>
                          {new Date(msg.timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div style={{ padding: '1rem 2rem', background: '#f0f2f5', borderTop: '1px solid var(--border-color)' }}>
              <form onSubmit={sendMessage} style={{ display: 'flex', gap: '1rem' }}>
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Digite uma mensagem..."
                  style={{ flex: 1, padding: '1rem 1.5rem', borderRadius: 999, border: 'none', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', fontSize: '1rem', outline: 'none' }}
                />
                <button 
                  type="submit" 
                  disabled={!inputMessage.trim() || sending}
                  style={{ width: 50, height: 50, borderRadius: '50%', background: 'var(--primary-red)', border: 'none', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', opacity: (!inputMessage.trim() || sending) ? 0.7 : 1, transition: 'background 0.2s' }}
                >
                  {sending ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} style={{ marginLeft: -2 }} />}
                </button>
              </form>
            </div>
          </>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>
            <MessageSquare size={80} style={{ opacity: 0.2, marginBottom: '1.5rem' }} />
            <h2 style={{ fontSize: '1.5rem', fontWeight: 300 }}>SOU+BLU Web Chat</h2>
            <p>Selecione uma conversa na lateral para começar.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WebChat;
