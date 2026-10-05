"use client";

import { useState, useEffect } from "react";
import { ChatList } from "./chat-list";
import { ChatWindow } from "./chat-window";
import { MessageCircle } from "lucide-react";
import { formatToWhatsAppJid } from "@/lib/phone-utils";

interface ChatLayoutClientProps {
    sessionId: string;
    initialJid?: string;
}

interface SelectedChat {
    jid: string;
    name?: string;
}

export function ChatLayoutClient({ sessionId, initialJid }: ChatLayoutClientProps) {
    const [selectedChat, setSelectedChat] = useState<SelectedChat | null>(
        initialJid ? { jid: initialJid } : null
    );

    // Sync selected chat to URL pathname
    useEffect(() => {
        if (typeof window === "undefined") return;
        const base = "/dashboard/chat";
        if (selectedChat) {
            const number = selectedChat.jid.split("@")[0];
            const newPath = `${base}/${number}`;
            if (window.location.pathname !== newPath) {
                window.history.replaceState(null, "", newPath);
            }
        } else {
            if (window.location.pathname !== base) {
                window.history.replaceState(null, "", base);
            }
        }
    }, [selectedChat]);

    // Handle browser back/forward
    useEffect(() => {
        const handlePopState = () => {
            const path = window.location.pathname;
            if (path.startsWith("/dashboard/chat/")) {
                const rawJid = path.replace("/dashboard/chat/", "");
                const jid = formatToWhatsAppJid(decodeURIComponent(rawJid));
                setSelectedChat({ jid });
            } else {
                setSelectedChat(null);
            }
        };
        window.addEventListener("popstate", handlePopState);
        return () => window.removeEventListener("popstate", handlePopState);
    }, []);

    const handleSelectChat = (jid: string, name?: string) => {
        setSelectedChat({ jid, name });
    };

    const handleBack = () => {
        setSelectedChat(null);
        if (typeof window !== "undefined") {
            window.history.replaceState(null, "", "/dashboard/chat");
        }
    };

    return (
        // Outer: flex row, full height, overflow hidden — containment chain root
        <div className="flex h-full bg-background rounded-xl border border-border/40 shadow-sm overflow-hidden min-h-0">
            {/* Chat List Panel */}
            <div className={`w-full md:w-80 lg:w-[340px] border-r border-border/30 overflow-hidden shrink-0 flex flex-col
                ${selectedChat ? "hidden md:flex" : "flex"}`}
            >
                {/* Inner flex-col: header fixed + virtuoso fills rest */}
                <ChatList
                    sessionId={sessionId}
                    onSelectChat={handleSelectChat}
                    selectedJid={selectedChat?.jid}
                />
            </div>

            {/* Chat Window Panel */}
            <div className={`flex-1 overflow-hidden flex flex-col min-w-0
                ${!selectedChat ? "hidden md:flex" : "flex"}`}
            >
                {selectedChat ? (
                    <ChatWindow
                        sessionId={sessionId}
                        jid={selectedChat.jid}
                        name={selectedChat.name}
                        onBack={handleBack}
                    />
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center min-w-0 min-h-0 whatsapp-chat-wallpaper relative p-6 border-l border-border/40 text-center select-none">
                        <div className="max-w-md mx-auto space-y-4">
                            <div className="h-16 w-16 rounded-full bg-[#202c33] text-[#00a884] flex items-center justify-center mx-auto shadow-md border border-white/[0.05]">
                                <MessageCircle className="h-8 w-8" />
                            </div>
                            <div className="space-y-1.5">
                                <h2 className="text-xl font-semibold text-[#e9edef] tracking-tight">
                                    WhatsApp Web
                                </h2>
                                <p className="text-xs text-[#8696a0] leading-relaxed">
                                    Envie e receba mensagens sem precisar manter seu celular conectado. Selecione uma conversa ao lado para começar.
                                </p>
                            </div>
                        </div>
                        <div className="absolute bottom-6 flex items-center gap-1.5 text-[11px] text-[#8696a0]/70">
                            <span>🔒 Protegido com criptografia de ponta a ponta</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
