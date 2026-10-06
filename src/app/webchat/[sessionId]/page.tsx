"use client";

import { useState, useEffect, useRef, use } from "react";
import { Send, Bot, User, CheckCheck, Loader2 } from "lucide-react";

interface Message {
    id: string;
    sender: "visitor" | "attendant";
    text: string;
    timestamp: string;
}

export default function WebchatVisitorPage({ params }: { params: Promise<{ sessionId: string }> }) {
    const { sessionId } = use(params);
    const [config, setConfig] = useState<any>(null);
    const [visitorId, setVisitorId] = useState("");
    const [visitorName, setVisitorName] = useState("");
    const [visitorEmail, setVisitorEmail] = useState("");
    const [isRegistered, setIsRegistered] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState("");
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Initialize or restore visitor ID
    useEffect(() => {
        let id = localStorage.getItem(`webchat_visitor_${sessionId}`);
        if (!id) {
            id = "v_" + Math.random().toString(36).substring(2, 10);
            localStorage.setItem(`webchat_visitor_${sessionId}`, id);
        }
        setVisitorId(id);

        const savedName = localStorage.getItem(`webchat_name_${sessionId}`);
        if (savedName) {
            setVisitorName(savedName);
            setIsRegistered(true);
        }

        // Fetch config
        fetch(`/api/webchat/${sessionId}/config`)
            .then((r) => r.json())
            .then((d) => {
                if (d.status && d.data) {
                    setConfig(d.data);
                    if (!d.data.requireName && !savedName) {
                        setIsRegistered(true);
                    }
                }
            })
            .catch(console.error);
    }, [sessionId]);

    // Fetch message history
    useEffect(() => {
        if (!visitorId || !isRegistered) return;
        const fetchHistory = () => {
            fetch(`/api/webchat/${sessionId}/message?visitorId=${visitorId}`)
                .then((r) => r.json())
                .then((d) => {
                    if (d.status && d.data) {
                        setMessages(d.data);
                    }
                })
                .catch(console.error);
        };

        fetchHistory();
        const interval = setInterval(fetchHistory, 4000); // Polling for replies
        return () => clearInterval(interval);
    }, [sessionId, visitorId, isRegistered]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();
        if (!visitorName.trim()) return;
        localStorage.setItem(`webchat_name_${sessionId}`, visitorName.trim());
        setIsRegistered(true);
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputText.trim() || sending) return;

        const text = inputText.trim();
        setInputText("");
        setSending(true);

        const optimisticMsg: Message = {
            id: "temp_" + Date.now(),
            sender: "visitor",
            text,
            timestamp: new Date().toISOString()
        };
        setMessages((prev) => [...prev, optimisticMsg]);

        try {
            const res = await fetch(`/api/webchat/${sessionId}/message`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    visitorId,
                    visitorName: visitorName || "Visitante",
                    visitorEmail,
                    message: text
                })
            });
            const data = await res.json();
            if (data.status && data.data?.aiReply) {
                // Add AI reply immediately
                setMessages((prev) => [
                    ...prev,
                    {
                        id: "ai_" + Date.now(),
                        sender: "attendant",
                        text: data.data.aiReply,
                        timestamp: new Date().toISOString()
                    }
                ]);
            }
        } catch (err) {
            console.error("Erro ao enviar mensagem:", err);
        } finally {
            setSending(false);
        }
    };

    const primaryColor = config?.primaryColor || "#2563eb";

    return (
        <div className="flex flex-col h-screen w-full bg-slate-950 text-slate-100 font-sans select-none overflow-hidden">
            {/* Header */}
            <div
                className="px-4 py-3.5 flex items-center gap-3 shadow-md shrink-0"
                style={{ backgroundColor: primaryColor }}
            >
                <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center font-bold text-white shadow-inner">
                    <Bot className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                    <h2 className="text-sm font-bold text-white truncate leading-tight">
                        {config?.title || "Atendimento Online"}
                    </h2>
                    <p className="text-[11px] text-white/80 truncate">
                        {config?.subtitle || "Estamos online agora"}
                    </p>
                </div>
            </div>

            {/* Chat Body */}
            {!isRegistered ? (
                /* Registration Screen */
                <div className="flex-1 flex flex-col justify-center p-6 bg-slate-900">
                    <div className="bg-slate-950/60 p-5 rounded-2xl border border-slate-800 shadow-xl space-y-4">
                        <div className="text-center space-y-1">
                            <h3 className="text-base font-bold text-white">Bem-vindo ao Atendimento!</h3>
                            <p className="text-xs text-slate-400">
                                {config?.welcomeMessage || "Digite seu nome para iniciar a conversa."}
                            </p>
                        </div>

                        <form onSubmit={handleRegister} className="space-y-3 pt-2">
                            <div>
                                <label className="text-[11px] text-slate-400 block mb-1">Seu Nome *</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Como podemos te chamar?"
                                    value={visitorName}
                                    onChange={(e) => setVisitorName(e.target.value)}
                                    className="w-full px-3 py-2 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                                />
                            </div>

                            {config?.requireEmail && (
                                <div>
                                    <label className="text-[11px] text-slate-400 block mb-1">Seu E-mail</label>
                                    <input
                                        type="email"
                                        placeholder="seuemail@exemplo.com"
                                        value={visitorEmail}
                                        onChange={(e) => setVisitorEmail(e.target.value)}
                                        className="w-full px-3 py-2 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                                    />
                                </div>
                            )}

                            <button
                                type="submit"
                                style={{ backgroundColor: primaryColor }}
                                className="w-full py-2.5 rounded-lg text-xs font-bold text-white shadow-md hover:brightness-110 transition-all cursor-pointer mt-2"
                            >
                                Iniciar Conversa
                            </button>
                        </form>
                    </div>
                </div>
            ) : (
                /* Messages Area */
                <div className="flex-1 flex flex-col bg-slate-900 overflow-hidden">
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {/* Welcome bubble */}
                        {config?.welcomeMessage && (
                            <div className="flex flex-col max-w-[85%] mr-auto bg-slate-800/90 text-slate-200 border border-slate-700/60 rounded-2xl rounded-bl-none px-3.5 py-2.5 text-xs shadow-sm">
                                <p>{config.welcomeMessage}</p>
                                <span className="text-[9px] text-slate-400 mt-1 self-end">Equipe</span>
                            </div>
                        )}

                        {messages.map((m) => (
                            <div
                                key={m.id}
                                className={`flex flex-col max-w-[85%] ${
                                    m.sender === "visitor"
                                        ? "ml-auto text-white rounded-2xl rounded-br-none"
                                        : "mr-auto bg-slate-800 text-slate-200 border border-slate-700 rounded-2xl rounded-bl-none"
                                } px-3.5 py-2 text-xs shadow-sm leading-relaxed`}
                                style={m.sender === "visitor" ? { backgroundColor: primaryColor } : {}}
                            >
                                <p className="whitespace-pre-line">{m.text}</p>
                                <div className="flex items-center gap-1 mt-1 self-end text-[9px] opacity-75">
                                    <span>
                                        {new Date(m.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                    </span>
                                    {m.sender === "visitor" && <CheckCheck className="h-3 w-3" />}
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Bar */}
                    <form onSubmit={handleSendMessage} className="p-3 bg-slate-950 border-t border-slate-800 flex gap-2">
                        <input
                            type="text"
                            placeholder="Digite sua mensagem..."
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            className="flex-1 px-3.5 py-2 text-xs rounded-full bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                        />
                        <button
                            type="submit"
                            disabled={sending || !inputText.trim()}
                            style={{ backgroundColor: primaryColor }}
                            className="w-8 h-8 rounded-full flex items-center justify-center text-white disabled:opacity-40 shadow cursor-pointer hover:brightness-110 transition-all shrink-0"
                        >
                            {sending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}
