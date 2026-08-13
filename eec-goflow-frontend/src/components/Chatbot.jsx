import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Loader2, Sparkles, Mic, Volume2, VolumeX } from 'lucide-react';
import { toast } from 'sonner';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'สวัสดีครับ! ผมคือ EEC GoFlow AI มีอะไรให้ผมช่วยแนะนำที่เที่ยว หรือแพลนการเดินทางไหมครับ?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = 'th-TH'; // Set to Thai
      recognition.continuous = false;
      recognition.interimResults = false;
      
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(prev => prev + transcript);
        setIsListening(false);
      };
      
      recognition.onerror = () => {
        setIsListening(false);
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
      
      recognitionRef.current = recognition;
    }
  }, []);

  const toggleListen = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const speakText = (text) => {
    if (isMuted || !window.speechSynthesis) return;
    window.speechSynthesis.cancel(); // Stop any ongoing speech
    
    // Remove markdown symbols for cleaner speech
    const cleanText = text.replace(/[*#_]/g, '');
    
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'th-TH';
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    window.speechSynthesis.speak(utterance);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage })
      });
      const data = await response.json();
      
      const aiReply = data.reply;
      setMessages(prev => [...prev, { role: 'ai', text: aiReply }]);
      
      // AI Speaks the reply
      speakText(aiReply);
      
    } catch (err) {
      console.error(err);
      toast.error("การเชื่อมต่อแชทขัดข้อง", { description: err.message });
      setMessages(prev => [...prev, { role: 'ai', text: 'ขออภัยครับ ระบบแชทขัดข้องชั่วคราว ('+err.message+') ลองใหม่อีกครั้งนะครับ' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        .soundwave { display: flex; align-items: center; gap: 2px; height: 16px; }
        .bar { width: 3px; height: 100%; background: #3b82f6; animation: grow 1s ease-in-out infinite; }
        .bar:nth-child(2) { animation-delay: 0.2s; }
        .bar:nth-child(3) { animation-delay: 0.4s; }
        .bar:nth-child(4) { animation-delay: 0.6s; }
        .bar:nth-child(5) { animation-delay: 0.8s; }
        @keyframes grow { 0%, 100% { height: 4px; } 50% { height: 16px; } }
      `}</style>

      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform duration-300 z-50 ${isOpen ? 'hidden' : 'flex'}`}
      >
        <MessageSquare className="w-6 h-6" />
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500"></span>
        </span>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 md:w-96 bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl shadow-2xl shadow-indigo-500/20 overflow-hidden z-50 flex flex-col animate-in slide-in-from-bottom-8 duration-300 h-[500px]">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 flex justify-between items-center text-white shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm">EEC GoFlow AI</h3>
                <p className="text-[10px] text-blue-100 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Online
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => {
                  setIsMuted(!isMuted);
                  if (!isMuted) window.speechSynthesis?.cancel();
                }} 
                className="text-white/70 hover:text-white transition"
                title={isMuted ? "เปิดเสียง AI" : "ปิดเสียง AI"}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <button onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white transition">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto bg-slate-50/50 space-y-4">
            {messages.map((msg, i) => {
              const formatText = (text) => {
                const parts = text.split(/(\*\*.*?\*\*)/g);
                return parts.map((part, index) => {
                  if (part.startsWith('**') && part.endsWith('**')) {
                    return <strong key={index} className="font-bold text-slate-900">{part.slice(2, -2)}</strong>;
                  }
                  return part;
                });
              };

              return (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl p-3 text-sm shadow-sm whitespace-pre-wrap ${
                    msg.role === 'user' 
                      ? 'bg-blue-600 text-white rounded-tr-none' 
                      : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none leading-relaxed'
                  }`}>
                    {msg.role === 'ai' ? formatText(msg.text) : msg.text}
                  </div>
                </div>
              );
            })}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none p-3 shadow-sm flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                  <span className="text-xs text-slate-500">กำลังคิด...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white border-t border-slate-100 flex flex-col gap-2 shrink-0">
            {/* Visualizer Row */}
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2 h-6">
                {(isListening || isSpeaking) && (
                  <>
                    <div className="soundwave text-blue-500">
                      <div className="bar"></div>
                      <div className="bar"></div>
                      <div className="bar"></div>
                      <div className="bar"></div>
                      <div className="bar"></div>
                    </div>
                    <span className="text-[10px] font-bold text-blue-500 animate-pulse">
                      {isListening ? "กำลังฟังเสียงคุณ..." : "AI กำลังพูด..."}
                    </span>
                  </>
                )}
              </div>
            </div>

            <form onSubmit={handleSend} className="flex gap-2 w-full">
              <button
                type="button"
                onClick={toggleListen}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition shrink-0 ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                title="พิมพ์ด้วยเสียง"
              >
                <Mic className="w-4 h-4" />
              </button>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="พิมพ์ถาม AI ได้เลย..."
                className="flex-1 bg-slate-100 border-none rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <button 
                type="submit" 
                disabled={!input.trim() || loading}
                className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition disabled:opacity-50 shrink-0"
              >
                <Send className="w-4 h-4 ml-0.5" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
