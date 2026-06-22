import React, { useState, useEffect, useRef } from 'react';
import { Search, Send, User, MessageSquare, Loader2, Plus, QrCode, LogOut } from 'lucide-react';
import { io } from 'socket.io-client';

const ChatBot = () => {
  // Wa Connection States
  const [waStatus, setWaStatus] = useState('DISCONNECTED');
  const [qrCode, setQrCode] = useState(null);
  const [loadingWa, setLoadingWa] = useState(false);

  // WebChat States
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingChats, setLoadingChats] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [chatError, setChatError] = useState(null);

  const socketRef = useRef();
  const messagesEndRef = useRef(null);
  const token = localStorage.getItem('token');

  // Polling Connection Status
  useEffect(() => {
    pollWaStatus();
    const interval = setInterval(pollWaStatus, 4000);

    // Setup Socket.io
    const apiUrl = import.meta.env.VITE_API_URL || '';
    socketRef.current = io(apiUrl, { path: '/api/socket.io' });

    socketRef.current.on('whatsapp-message', (data) => {
      const { message } = data;
      setActiveChat((currentActive) => {
        if (currentActive && currentActive.id === message.chatId) {
          setMessages((prev) => [...prev, message]);
        }
        return currentActive;
      });
      setChats((prevChats) => {
        const updated = [...prevChats];
        const chatIndex = updated.findIndex(c => c.id === message.chatId);
        if (chatIndex >= 0) {
          updated[chatIndex].lastMessage = { body: message.body };
          if (!message.fromMe) {
            updated[chatIndex].unreadCount = (updated[chatIndex].unreadCount || 0) + 1;
          }
          const chat = updated.splice(chatIndex, 1)[0];
          updated.unshift(chat);
        } else {
          updated.unshift({
            id: message.chatId,
            name: message.chatId.split('@')[0],
            lastMessage: { body: message.body },
            unreadCount: message.fromMe ? 0 : 1,
            timestamp: message.timestamp
          });
        }
        return updated;
      });
    });

    return () => {
      clearInterval(interval);
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, []);

  // Auto-scroll messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Fetch chats only when CONNECTED and empty
  useEffect(() => {
    if (waStatus === 'CONNECTED' && chats.length === 0) {
      fetchChats();
    }
  }, [waStatus]);

  const pollWaStatus = async () => {
    try {
      const res = await fetch('/api/whatsapp/status', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.status) {
        setWaStatus(data.status);
        if (data.status === 'QR_READY') {
          fetchQrCode();
        }
      }
    } catch (err) {
      console.error('Error polling status', err);
    }
  };

  const fetchQrCode = async () => {
    try {
      const res = await fetch('/api/whatsapp/qr', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.qrCodeBase64) {
        setQrCode(data.qrCodeBase64);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const startWaSession = async () => {
    setLoadingWa(true);
    try {
      await fetch('/api/whatsapp/start', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: '{}'
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingWa(false);
    }
  };

  const logoutWaSession = async () => {
    try {
      await fetch('/api/whatsapp/logout', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: '{}'
      });
      setWaStatus('DISCONNECTED');
      setQrCode(null);
      setChats([]);
      setActiveChat(null);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchChats = async () => {
    setLoadingChats(true);
    setChatError(null);
    try {
      const res = await fetch('/api/whatsapp/chats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.chats) {
        setChats(data.chats);
      } else if (data.error) {
        console.error('API Error:', data.error);
        setChatError(data.error);
      }
    } catch (err) {
      console.error('Error fetching chats:', err);
      setChatError('Erro de rede ao carregar conversas.');
    } finally {
      setLoadingChats(false);
    }
  };

  const selectChat = async (chat) => {
    setActiveChat(chat);
    setMessages([]);
    setLoadingMessages(true);
    
    // Reset unread count locally
    setChats(prev => prev.map(c => c.id === chat.id ? { ...c, unreadCount: 0 } : c));

    try {
      const res = await fetch(`/api/whatsapp/chats/${chat.id}/messages`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.messages) {
        setMessages(data.messages.reverse());
      }
    } catch (err) {
      console.error('Error fetching messages:', err);
    } finally {
      setLoadingMessages(false);
    }
  };

  const startNewChat = () => {
    let number = prompt('Digite o número do WhatsApp com DDD (ex: 11999999999):');
    if (!number) return;
    
    number = number.replace(/\D/g, '');
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
    
    setChats(prev => {
      if (!prev.find(c => c.id === chatId)) {
        return [newChat, ...prev];
      }
      return prev;
    });
    
    setSearchTerm('');
    selectChat(newChat);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || !activeChat || sending) return;

    const msgText = inputMessage;
    setInputMessage('');
    setSending(true);

    try {
      const res = await fetch(`/api/whatsapp/chats/${activeChat.id}/send`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msgText })
      });
      const data = await res.json();
      if (!data.success) {
        alert('Erro ao enviar mensagem');
      }
    } catch (err) {
      console.error('Error sending message:', err);
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <header className="topbar">
        <div className="page-title">Caixa de Entrada / WhatsApp</div>
      </header>

      {waStatus !== 'CONNECTED' ? (
        <div className="content-area">
          <div className="section-header">
            <h1 className="section-title">Pareamento do WhatsApp</h1>
            <p className="section-subtitle">Conecte o número de atendimento para ativar a Caixa de Entrada.</p>
          </div>

          <div className="card" style={{ padding: '3rem', maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                <MessageSquare size={32} color="var(--text-muted)" />
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                {waStatus === 'DISCONNECTED' && 'Nenhum WhatsApp Conectado'}
                {waStatus === 'INITIALIZING' && 'Iniciando Sessão...'}
                {waStatus === 'QR_READY' && 'Leia o QR Code'}
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                {waStatus === 'DISCONNECTED' && 'Clique abaixo para gerar um QR Code e parear seu WhatsApp.'}
                {waStatus === 'INITIALIZING' && 'Aguarde enquanto geramos o código de pareamento exclusivo.'}
                {waStatus === 'QR_READY' && 'Abra o WhatsApp no seu celular, vá em "Aparelhos Conectados" e aponte a câmera para o QR Code abaixo.'}
              </p>
            </div>

            {waStatus === 'DISCONNECTED' && (
              <button
                onClick={startWaSession}
                disabled={loadingWa}
                className="btn-primary"
                style={{ padding: '0.875rem 2rem', fontSize: '1rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
              >
                {loadingWa ? <Loader2 className="animate-spin" size={20} /> : <QrCode size={20} />}
                {loadingWa ? 'Iniciando...' : 'Gerar QR Code'}
              </button>
            )}

            {(waStatus === 'INITIALIZING' || (waStatus === 'QR_READY' && !qrCode)) && (
              <div style={{ padding: '2rem', display: 'flex', justifyContent: 'center' }}>
                <Loader2 className="animate-spin" size={48} color="var(--primary-red)" />
              </div>
            )}

            {waStatus === 'QR_READY' && qrCode && (
              <div style={{ display: 'inline-block', padding: '1rem', background: 'white', border: '1px solid var(--border-color)', borderRadius: 12, boxShadow: 'var(--shadow-sm)' }}>
                <img src={qrCode} alt="WhatsApp QR Code" style={{ width: 256, height: 256 }} />
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="content-area" style={{ padding: '1rem' }}>
          <div style={{ display: 'flex', height: 'calc(100vh - 120px)', background: 'white', borderRadius: 16, overflow: 'hidden', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
            
            {/* Sidebar - Chats List */}
            <div style={{ width: 350, borderRight: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', background: '#f9fafb' }}>
              <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', background: 'white' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>Conversas</h2>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={startNewChat} style={{ background: '#25D366', color: 'white', border: 'none', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} title="Nova Conversa">
                      <Plus size={18} />
                    </button>
                    <button onClick={logoutWaSession} style={{ background: '#ef4444', color: 'white', border: 'none', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} title="Desconectar WhatsApp">
                      <LogOut size={16} style={{ marginLeft: 2 }} />
                    </button>
                  </div>
                </div>
                <div style={{ position: 'relative' }}>
                  <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: 12, top: 10 }} />
                  <input 
                    type="text" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar contato..." 
                    style={{ width: '100%', padding: '0.6rem 1rem 0.6rem 2.5rem', borderRadius: 999, border: '1px solid var(--border-color)', background: '#f3f4f6', fontSize: '0.9rem', outline: 'none' }}
                  />
                </div>
              </div>

              <div style={{ flex: 1, overflowY: 'auto' }}>
                {loadingChats ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem', gap: '0.5rem' }}>
                    <Loader2 className="animate-spin" size={32} color="var(--primary-red)" />
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Carregando conversas...</span>
                  </div>
                ) : chatError ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem', gap: '1rem', textAlign: 'center' }}>
                    <p style={{ fontSize: '0.9rem', color: '#ef4444' }}>Erro ao carregar conversas.</p>
                    <button onClick={fetchChats} style={{ padding: '0.5rem 1.5rem', background: 'var(--primary-red)', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>
                      Tentar Novamente
                    </button>
                  </div>
                ) : (
                  chats.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.id.includes(searchTerm)).map(chat => (
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
                  <div style={{ padding: '1rem 2rem', background: 'white', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '1rem', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', zIndex: 10 }}>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <User size={20} color="#9ca3af" />
                    </div>
                    <div>
                      <h3 style={{ fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>{activeChat.name}</h3>
                      <span style={{ fontSize: '0.8rem', color: '#25D366' }}>Online</span>
                    </div>
                  </div>

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
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 300 }}>SOU+BLU Caixa de Entrada</h2>
                  <p>Selecione uma conversa na lateral para começar.</p>
                </div>
              )}
            </div>
            
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;
