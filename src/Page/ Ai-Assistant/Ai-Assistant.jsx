import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Bot, User, Loader2, Mic, Image, Clock, Calendar, BookOpen, Users, GraduationCap, Search } from 'lucide-react';

const AIAssistant = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: 'Welcome to StudyHub AI Assistant! I can help you with study sessions, tutoring, course materials, and educational guidance. How can I assist you today?',
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);

  const quickActions = [
    { icon: BookOpen, label: 'Find Sessions', query: 'Show me available study sessions' },
    { icon: GraduationCap, label: 'Find Tutors', query: 'Help me find qualified tutors' },
    { icon: Users, label: 'Join Sessions', query: 'How can I join a study session?' },
    { icon: Calendar, label: 'Schedule Help', query: 'Help me schedule study sessions' },
    { icon: Search, label: 'Search Help', query: 'How to search for specific subjects?' },
    { icon: Sparkles, label: 'Study Tips', query: 'Give me effective study tips' },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (text = inputValue) => {
    if (!text.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      // const response = await fetch(`http://localhost:5000/api/chatbot`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ message: text }),
      // });

      const response = await fetch("https://study-hub-survar-a12.vercel.app/api/chatbot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text }),
      });


      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: data.response,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('AI Assistant error:', error);
      
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: 'I apologize, but I encountered an issue. Please try asking your question again, and I\'ll do my best to help you with StudyHub!',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickAction = (query) => {
    handleSend(query);
  };

  const handleImageUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageMessage = {
          id: Date.now(),
          type: 'user',
          content: `[Image uploaded: ${file.name}]`,
          image: e.target.result,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, imageMessage]);
        
        handleSend(`I've uploaded an image: ${file.name}. Can you help me with this study material?`);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVoiceRecord = async () => {
    if (!isRecording) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setIsRecording(true);
        
        setTimeout(() => {
          setIsRecording(false);
          stream.getTracks().forEach(track => track.stop());
          
          const voiceMessage = {
            id: Date.now(),
            type: 'user',
            content: '[Voice message recorded]',
            timestamp: new Date(),
          };
          setMessages(prev => [...prev, voiceMessage]);
          handleSend('I just sent a voice message. Can you help me with study sessions?');
        }, 3000);
      } catch (error) {
        console.error('Microphone access denied:', error);
        alert('Microphone access is required for voice messages.');
      }
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-xl border-b border-green-100 shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/30">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                StudyHub AI Assistant
              </h1>
              <p className="text-sm text-gray-600 flex items-center gap-1">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                Online & Ready to Help
              </p>
            </div>
            <button className="p-2 hover:bg-green-50 rounded-full transition-colors">
              <Sparkles className="w-5 h-5 text-green-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-green-100 sticky top-[76px] z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <button
                  key={index}
                  onClick={() => handleQuickAction(action.query)}
                  className="flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 hover:from-green-200 hover:to-emerald-200 rounded-full text-green-700 text-sm font-medium transition-all duration-300 hover:shadow-md whitespace-nowrap group"
                >
                  <Icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  {action.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'} animate-fadeIn`}
            >
              <div className={`flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center shadow-md ${
                message.type === 'user'
                  ? 'bg-gradient-to-br from-green-500 to-green-600'
                  : 'bg-gradient-to-br from-green-500 to-green-600'
              }`}>
                {message.type === 'user' ? (
                  <User className="w-5 h-5 text-white" />
                ) : (
                  <Bot className="w-5 h-5 text-white" />
                )}
              </div>

              <div className={`flex-1 max-w-[85%] sm:max-w-[80%] md:max-w-[70%] ${message.type === 'user' ? 'items-end' : 'items-start'} flex flex-col`}>
                <div
                  className={`px-4 py-3 rounded-2xl shadow-sm ${
                    message.type === 'user'
                      ? 'bg-gradient-to-r from-green-500 to-green-600 text-white rounded-tr-sm'
                      : 'bg-white border border-green-100 text-gray-800 rounded-tl-sm'
                  }`}
                >
                  {message.image && (
                    <img 
                      src={message.image} 
                      alt="Uploaded" 
                      className="max-w-xs rounded-lg mb-2"
                    />
                  )}
                  <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </p>
                </div>
                <div className="flex items-center gap-1 mt-1 px-2">
                  <Clock className="w-3 h-3 text-gray-400" />
                  <span className="text-xs text-gray-500">
                    {message.timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex gap-3 animate-fadeIn">
              <div className="flex-shrink-0 w-10 h-10 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-md">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="bg-white border border-green-100 px-6 py-3 rounded-2xl rounded-tl-sm shadow-sm">
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white/90 backdrop-blur-xl border-t border-green-100 shadow-lg sticky bottom-0">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {/* Suggestions for empty input */}
          {messages.length === 1 && (
            <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-2">
              <button
                onClick={() => handleQuickAction('How do I book a study session?')}
                className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 rounded-xl text-left transition-all duration-300 border border-green-100 hover:shadow-md group"
              >
                <p className="text-sm font-medium text-green-700 group-hover:text-green-800">
                  How do I book a study session?
                </p>
              </button>
              <button
                onClick={() => handleQuickAction('Show me available tutors')}
                className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 rounded-xl text-left transition-all duration-300 border border-green-100 hover:shadow-md group"
              >
                <p className="text-sm font-medium text-green-700 group-hover:text-green-800">
                  Show me available tutors
                </p>
              </button>
            </div>
          )}

          {/* Input Box */}
          <div className="flex items-end gap-2">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Ask me about study sessions, tutors, materials, or anything StudyHub related..."
                rows={1}
                className="w-full px-4 py-3 pr-24 bg-gray-50 border border-green-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none text-gray-800 placeholder-gray-500 max-h-32"
                style={{ minHeight: '48px' }}
              />
              <div className="absolute right-2 bottom-2 flex gap-1">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  accept="image/*"
                  className="hidden"
                />
                <button 
                  onClick={handleImageUpload}
                  className="p-2 text-green-600 hover:bg-green-100 rounded-xl transition-colors"
                  title="Upload image"
                >
                  <Image className="w-5 h-5" />
                </button>
                <button 
                  onClick={handleVoiceRecord}
                  className={`p-2 rounded-xl transition-colors ${
                    isRecording 
                      ? 'text-red-600 bg-red-100 animate-pulse' 
                      : 'text-green-600 hover:bg-green-100'
                  }`}
                  title={isRecording ? 'Recording...' : 'Record voice message'}
                >
                  <Mic className="w-5 h-5" />
                </button>
              </div>
            </div>
            <button
              onClick={() => handleSend()}
              disabled={!inputValue.trim()}
              className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-300 disabled:to-gray-400 text-white rounded-2xl flex items-center justify-center shadow-lg hover:shadow-xl disabled:shadow-none transition-all duration-300 disabled:cursor-not-allowed group"
            >
              {isTyping ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              )}
            </button>
          </div>

          <p className="text-xs text-center text-gray-500 mt-2">
            StudyHub AI Assistant - Here to help with your learning and tutoring needs
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
