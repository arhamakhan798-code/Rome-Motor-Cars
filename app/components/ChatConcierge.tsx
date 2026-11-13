"use client";

import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export interface Message {
  id: string;
  sender: "concierge" | "client";
  text: string;
  time: string;
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: string;
  messages: Message[];
}

const STORAGE_KEY = "rmc_chat_sessions_v2";

export default function ChatConcierge() {
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Multi-session state
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string>("");

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize from localStorage or create default session
  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: ChatSession[] = JSON.parse(stored);
        if (parsed && parsed.length > 0) {
          setSessions(parsed);
          setActiveSessionId(parsed[0].id);
          return;
        }
      }
    } catch (e) {
      console.warn("Could not load stored chat sessions:", e);
    }

    // Default first session
    const firstSessionId = `session-${Date.now()}`;
    const initialSession: ChatSession = {
      id: firstSessionId,
      title: "Atelier Advisory",
      createdAt: new Date().toLocaleDateString([], { month: "short", day: "numeric" }),
      messages: [
        {
          id: "welcome-1",
          sender: "concierge",
          text: `Welcome to Rome Motor Cars. I am your Atelier Concierge, connected live to our 205-vehicle reserve and Corporate Governance Handbook. How may I assist your automotive journey today?`,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ],
    };

    setSessions([initialSession]);
    setActiveSessionId(firstSessionId);
  }, []);

  // Save sessions to localStorage on update
  useEffect(() => {
    if (mounted && sessions.length > 0) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
      } catch (e) {
        console.warn("Could not persist chat sessions:", e);
      }
    }
  }, [sessions, mounted]);

  const activeSession = sessions.find((s) => s.id === activeSessionId) || sessions[0];
  const activeMessages = activeSession ? activeSession.messages : [];

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (isOpen && !showHistory) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [activeMessages, isTyping, isOpen, showHistory]);

  const handleToggleOpen = () => {
    setIsOpen((prev) => !prev);
    if (!isOpen) {
      setHasUnread(false);
    }
  };

  const handleCreateNewChat = () => {
    const newId = `session-${Date.now()}`;
    const newSession: ChatSession = {
      id: newId,
      title: `Advisory Session #${sessions.length + 1}`,
      createdAt: new Date().toLocaleDateString([], { month: "short", day: "numeric" }),
      messages: [
        {
          id: `welcome-${Date.now()}`,
          sender: "concierge",
          text: `Good day, ${user?.username || "patron"}. A new advisory session has commenced. How may I assist you with our live fleet or acquisition policies?`,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ],
    };

    setSessions((prev) => [newSession, ...prev]);
    setActiveSessionId(newId);
    setShowHistory(false);
  };

  const handleDeleteSession = (idToDelete: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (sessions.length <= 1) {
      // If deleting the only session, just reset it
      handleCreateNewChat();
      return;
    }
    const remaining = sessions.filter((s) => s.id !== idToDelete);
    setSessions(remaining);
    if (activeSessionId === idToDelete) {
      setActiveSessionId(remaining[0].id);
    }
  };

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || !activeSession) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const userMsg: Message = {
      id: `client-${Date.now()}`,
      sender: "client",
      text,
      time: timeStr,
    };

    // Update active session with user message
    const updatedMessages = [...activeSession.messages, userMsg];

    // If first custom message, update session title intelligently
    let updatedTitle = activeSession.title;
    if (activeSession.messages.length <= 1) {
      updatedTitle = text.slice(0, 24) + (text.length > 24 ? "..." : "");
    }

    setSessions((prev) =>
      prev.map((s) =>
        s.id === activeSession.id ? { ...s, title: updatedTitle, messages: updatedMessages } : s
      )
    );

    setInput("");
    setIsTyping(true);

    try {
      // Send conversation history to RAG endpoint (incorporating full conversational memory)
      const formattedHistory = updatedMessages.map((m) => ({
        role: m.sender === "client" ? ("user" as const) : ("assistant" as const),
        content: m.text,
      }));

      const res = await fetch("/api/chat/concierge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: formattedHistory,
          clientName: user?.username || "Distinguished Client",
        }),
      });

      const data = await res.json();
      const replyText = data.reply || "Our Atelier specialists are reviewing your request. Please explore our 205-vehicle showroom or reserve a viewing session anytime.";

      const replyMsg: Message = {
        id: `concierge-${Date.now()}`,
        sender: "concierge",
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setSessions((prev) =>
        prev.map((s) =>
          s.id === activeSession.id
            ? { ...s, messages: [...updatedMessages, replyMsg] }
            : s
        )
      );
    } catch (err) {
      console.error("Chat error:", err);
      const errorMsg: Message = {
        id: `error-${Date.now()}`,
        sender: "concierge",
        text: "I apologize, my communication link with the vault registry was momentarily disrupted. Please try again or inquire about specific vehicles in our fleet.",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setSessions((prev) =>
        prev.map((s) =>
          s.id === activeSession.id ? { ...s, messages: [...updatedMessages, errorMsg] } : s
        )
      );
    } finally {
      setIsTyping(false);
    }
  };

  const quickPrompts = [
    "What V12 cars do you have?",
    "Tell me the return policy",
    "Private viewing booking rules?",
    "How are cars shipped?",
  ];

  /**
   * Renders a concierge message with luxury formatting:
   * - **bold** → white bold spans
   * - Lines starting with "•" or "-" → styled crimson-arrow bullet rows
   * - Lines ending with ":" (short ≤52 chars) → gold/crimson section headings
   * - Blank lines → spacers
   * - First paragraph auto-detected as an intro line (slightly lighter color)
   */
  const renderConciergeMessage = (text: string) => {
    const lines = text.split("\n");
    const elements: React.ReactNode[] = [];
    let firstContentSeen = false;

    lines.forEach((line, i) => {
      const trimmed = line.trim();

      if (!trimmed) {
        elements.push(<div key={i} style={{ height: "8px" }} />);
        return;
      }

      // Section heading: short line ending with ":"
      if (trimmed.endsWith(":") && trimmed.length <= 52 && !trimmed.startsWith("•") && !trimmed.startsWith("-")) {
        firstContentSeen = true;
        elements.push(
          <div
            key={i}
            style={{
              fontFamily: "var(--font-montserrat), 'Montserrat', sans-serif",
              fontSize: "0.68rem",
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#ef4444",
              marginTop: i === 0 ? 0 : "14px",
              marginBottom: "6px",
              borderBottom: "1px solid rgba(239, 68, 68, 0.25)",
              paddingBottom: "4px",
            }}
          >
            {trimmed.slice(0, -1)}
          </div>
        );
        return;
      }

      // Bullet point line
      if (trimmed.startsWith("•") || (trimmed.startsWith("-") && trimmed.length > 2)) {
        firstContentSeen = true;
        const content = trimmed.replace(/^[•\-]\s*/, "");
        elements.push(
          <div
            key={i}
            style={{
              display: "flex",
              gap: "9px",
              alignItems: "flex-start",
              marginBottom: "7px",
              paddingLeft: "2px",
            }}
          >
            <span style={{
              color: "#ef4444",
              fontSize: "0.7rem",
              marginTop: "3px",
              flexShrink: 0,
              lineHeight: 1,
            }}>▸</span>
            <span style={{
              fontSize: "0.81rem",
              lineHeight: 1.6,
              color: "rgba(255,255,255,0.88)",
              letterSpacing: "0.01em",
            }}>
              {renderInlineBold(content)}
            </span>
          </div>
        );
        return;
      }

      // First content line = intro paragraph (slightly muted)
      const isIntro = !firstContentSeen;
      firstContentSeen = true;

      elements.push(
        <p
          key={i}
          style={{
            margin: 0,
            marginBottom: "6px",
            fontSize: isIntro ? "0.83rem" : "0.81rem",
            lineHeight: 1.65,
            color: isIntro ? "rgba(255,255,255,0.75)" : "rgba(255,255,255,0.88)",
            fontStyle: isIntro ? "italic" : "normal",
            letterSpacing: "0.01em",
          }}
        >
          {renderInlineBold(trimmed)}
        </p>
      );
    });

    return <>{elements}</>;
  };

  /** Splits text on **bold** markers and returns spans */
  const renderInlineBold = (text: string): React.ReactNode => {
    const parts = text.split(/\*\*(.+?)\*\*/g);
    return parts.map((part, i) =>
      i % 2 === 1 ? (
        <strong
          key={i}
          style={{
            color: "#ffffff",
            fontWeight: 700,
            letterSpacing: "0.01em",
          }}
        >
          {part}
        </strong>
      ) : (
        <span key={i}>{part}</span>
      )
    );
  };

  if (!mounted) return null;

  return (
    <>
      {/* ── Floating Concierge Chat Window ── */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            bottom: "95px",
            right: "24px",
            width: "min(92vw, 420px)",
            height: "min(75vh, 560px)",
            backgroundColor: "rgba(10, 11, 14, 0.97)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: "1px solid rgba(239, 68, 68, 0.35)",
            borderRadius: "18px",
            boxShadow: "0 25px 60px rgba(0, 0, 0, 0.95), 0 0 35px rgba(220, 38, 38, 0.25)",
            display: "flex",
            flexDirection: "column",
            zIndex: 95,
            overflow: "hidden",
            animation: "modalFadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          {/* Header Bar */}
          <div
            style={{
              padding: "0.85rem 1.2rem",
              backgroundColor: "rgba(14, 16, 21, 0.95)",
              borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "10px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  backgroundColor: "rgba(220, 38, 38, 0.15)",
                  border: "1px solid #ef4444",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.95rem",
                  color: "#ef4444",
                  boxShadow: "0 0 10px rgba(220, 38, 38, 0.4)",
                  flexShrink: 0,
                }}
              >
                🏛️
              </div>
              <div style={{ minWidth: 0 }}>
                <div
                  style={{
                    fontFamily: "var(--font-cinzel), 'Cinzel', serif",
                    fontSize: "0.82rem",
                    fontWeight: 600,
                    letterSpacing: "0.06em",
                    color: "#ffffff",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {showHistory ? "Conversation History" : activeSession?.title || "Rome Concierge"}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "0.65rem", color: "#22c55e" }}>
                  <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#22c55e", display: "inline-block", boxShadow: "0 0 6px #22c55e" }} />
                  <span>Private Atelier Concierge</span>
                </div>
              </div>
            </div>

            {/* Header Controls: History Toggle, New Chat, Close */}
            <div style={{ display: "flex", alignItems: "center", gap: "6px", flexShrink: 0 }}>
              <button
                onClick={() => setShowHistory((prev) => !prev)}
                title={showHistory ? "Back to Current Chat" : "View Chat History"}
                style={{
                  padding: "4px 8px",
                  borderRadius: "14px",
                  backgroundColor: showHistory ? "rgba(220, 38, 38, 0.25)" : "rgba(255, 255, 255, 0.08)",
                  border: showHistory ? "1px solid #ef4444" : "1px solid rgba(255, 255, 255, 0.15)",
                  color: "#ffffff",
                  fontSize: "0.68rem",
                  fontWeight: 600,
                  letterSpacing: "0.04em",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                {showHistory ? "💬 Chat" : "📜 History"}
              </button>

              <button
                onClick={handleCreateNewChat}
                title="Start a Fresh Conversation"
                style={{
                  padding: "4px 8px",
                  borderRadius: "14px",
                  backgroundColor: "#dc2626",
                  border: "none",
                  color: "#ffffff",
                  fontSize: "0.68rem",
                  fontWeight: 600,
                  letterSpacing: "0.04em",
                  cursor: "pointer",
                  boxShadow: "0 0 10px rgba(220, 38, 38, 0.4)",
                  transition: "all 0.2s ease",
                }}
              >
                + New
              </button>

              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close Concierge"
                style={{
                  background: "none",
                  border: "none",
                  color: "rgba(255, 255, 255, 0.5)",
                  fontSize: "1.1rem",
                  cursor: "pointer",
                  padding: "4px 6px",
                  lineHeight: 1,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#ffffff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "rgba(255, 255, 255, 0.5)";
                }}
              >
                ✕
              </button>
            </div>
          </div>

          {/* ── HISTORY DRAWER / VIEW ── */}
          {showHistory ? (
            <div
              style={{
                flex: 1,
                padding: "1rem",
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                <span style={{ fontSize: "0.72rem", color: "rgba(255, 255, 255, 0.6)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                  Saved Conversations ({sessions.length})
                </span>
                <button
                  onClick={handleCreateNewChat}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#ef4444",
                    fontSize: "0.7rem",
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                >
                  + New Chat
                </button>
              </div>

              {sessions.map((s) => {
                const isSelected = s.id === activeSessionId;
                const lastMsg = s.messages[s.messages.length - 1]?.text || "No messages";

                return (
                  <div
                    key={s.id}
                    onClick={() => {
                      setActiveSessionId(s.id);
                      setShowHistory(false);
                    }}
                    style={{
                      padding: "0.75rem 0.9rem",
                      borderRadius: "10px",
                      backgroundColor: isSelected ? "rgba(220, 38, 38, 0.15)" : "rgba(255, 255, 255, 0.04)",
                      border: isSelected ? "1px solid rgba(220, 38, 38, 0.5)" : "1px solid rgba(255, 255, 255, 0.08)",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      position: "relative",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "4px" }}>
                      <span style={{ fontSize: "0.8rem", fontWeight: 600, color: isSelected ? "#ef4444" : "#ffffff" }}>
                        {s.title}
                      </span>
                      <span style={{ fontSize: "0.62rem", color: "rgba(255, 255, 255, 0.4)" }}>
                        {s.createdAt}
                      </span>
                    </div>
                    <div style={{ fontSize: "0.7rem", color: "rgba(255, 255, 255, 0.6)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {lastMsg}
                    </div>

                    <button
                      onClick={(e) => handleDeleteSession(s.id, e)}
                      title="Delete Conversation"
                      style={{
                        position: "absolute",
                        top: "8px",
                        right: "8px",
                        background: "none",
                        border: "none",
                        color: "rgba(255, 255, 255, 0.3)",
                        fontSize: "0.75rem",
                        cursor: "pointer",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = "#ef4444";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = "rgba(255, 255, 255, 0.3)";
                      }}
                    >
                      🗑️
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            /* ── ACTIVE CHAT MESSAGES BODY ── */
            <>
              <div
                style={{
                  flex: 1,
                  padding: "1rem",
                  overflowY: "auto",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                {activeMessages.map((msg) => {
                  const isUser = msg.sender === "client";
                  return (
                    <div
                      key={msg.id}
                      style={{
                        alignSelf: isUser ? "flex-end" : "flex-start",
                        maxWidth: "88%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: isUser ? "flex-end" : "flex-start",
                      }}
                    >
                      <div
                        style={{
                          padding: isUser ? "0.65rem 0.95rem" : "0.9rem 1.1rem",
                          borderRadius: isUser ? "16px 16px 2px 16px" : "2px 16px 16px 16px",
                          backgroundColor: isUser ? "#dc2626" : "rgba(255, 255, 255, 0.055)",
                          border: isUser ? "none" : "1px solid rgba(255, 255, 255, 0.1)",
                          borderLeft: isUser ? undefined : "2px solid rgba(239, 68, 68, 0.5)",
                          color: "#ffffff",
                          fontSize: "0.82rem",
                          lineHeight: 1.6,
                          boxShadow: isUser
                            ? "0 4px 14px rgba(220, 38, 38, 0.3)"
                            : "0 2px 12px rgba(0,0,0,0.3)",
                          fontFamily: "var(--font-montserrat), 'Montserrat', sans-serif",
                        }}
                      >
                        {isUser ? msg.text : renderConciergeMessage(msg.text)}
                      </div>
                      <span
                        style={{
                          fontSize: "0.62rem",
                          color: "rgba(255, 255, 255, 0.4)",
                          marginTop: "4px",
                          padding: "0 4px",
                        }}
                      >
                        {msg.time}
                      </span>
                    </div>
                  );
                })}

                {isTyping && (
                  <div
                    style={{
                      alignSelf: "flex-start",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "8px 14px",
                      backgroundColor: "rgba(255, 255, 255, 0.05)",
                      borderRadius: "14px",
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                    }}
                  >
                    <span style={{ fontSize: "0.72rem", color: "rgba(255, 255, 255, 0.7)" }}>
                      Consulting live inventory & policy records
                    </span>
                    <span style={{ animation: "spin 1s linear infinite", display: "inline-block", fontSize: "0.85rem" }}>
                      ⚙️
                    </span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Prompts Carousel */}
              <div
                style={{
                  padding: "0.4rem 0.8rem",
                  display: "flex",
                  gap: "6px",
                  overflowX: "auto",
                  scrollbarWidth: "none",
                  borderTop: "1px solid rgba(255, 255, 255, 0.05)",
                }}
              >
                {quickPrompts.map((p) => (
                  <button
                    key={p}
                    onClick={() => handleSend(p)}
                    style={{
                      whiteSpace: "nowrap",
                      padding: "4px 10px",
                      borderRadius: "16px",
                      backgroundColor: "rgba(255, 255, 255, 0.05)",
                      border: "1px solid rgba(255, 255, 255, 0.12)",
                      color: "rgba(255, 255, 255, 0.75)",
                      fontSize: "0.68rem",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "rgba(220, 38, 38, 0.2)";
                      e.currentTarget.style.borderColor = "#ef4444";
                      e.currentTarget.style.color = "#ffffff";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.05)";
                      e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.12)";
                      e.currentTarget.style.color = "rgba(255, 255, 255, 0.75)";
                    }}
                  >
                    {p}
                  </button>
                ))}
              </div>

              {/* Input Area */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                style={{
                  padding: "0.8rem",
                  backgroundColor: "rgba(12, 13, 17, 0.95)",
                  borderTop: "1px solid rgba(255, 255, 255, 0.08)",
                  display: "flex",
                  gap: "8px",
                }}
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Inquire about live fleet or policies..."
                  style={{
                    flex: 1,
                    padding: "0.65rem 0.9rem",
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    borderRadius: "20px",
                    color: "#ffffff",
                    fontSize: "0.8rem",
                    outline: "none",
                  }}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  style={{
                    padding: "0.65rem 1.1rem",
                    backgroundColor: input.trim() && !isTyping ? "#dc2626" : "rgba(255, 255, 255, 0.1)",
                    border: "none",
                    borderRadius: "20px",
                    color: "#ffffff",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    cursor: input.trim() && !isTyping ? "pointer" : "default",
                    transition: "all 0.2s ease",
                  }}
                >
                  Send
                </button>
              </form>
            </>
          )}
        </div>
      )}

      {/* ── Floating Trigger Button (Bottom Right) ── */}
      <button
        onClick={handleToggleOpen}
        aria-label="Open Rome Concierge Chat"
        title="Rome Motor Cars Private Concierge"
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          zIndex: 90,
          width: "56px",
          height: "56px",
          borderRadius: "50%",
          backgroundColor: "#0d0e12",
          border: "1.5px solid #ef4444",
          color: "#ffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          boxShadow: "0 8px 30px rgba(0, 0, 0, 0.9), 0 0 20px rgba(220, 38, 38, 0.45)",
          transition: "transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.08) translateY(-3px)";
          e.currentTarget.style.boxShadow = "0 12px 35px rgba(0, 0, 0, 0.95), 0 0 30px rgba(220, 38, 38, 0.7)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1) translateY(0)";
          e.currentTarget.style.boxShadow = "0 8px 30px rgba(0, 0, 0, 0.9), 0 0 20px rgba(220, 38, 38, 0.45)";
        }}
      >
        {isOpen ? (
          <span style={{ fontSize: "1.3rem", lineHeight: 1 }}>✕</span>
        ) : (
          <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: "1.45rem" }}>💬</span>
            {hasUnread && (
              <span
                style={{
                  position: "absolute",
                  top: "-4px",
                  right: "-4px",
                  width: "11px",
                  height: "11px",
                  borderRadius: "50%",
                  backgroundColor: "#22c55e",
                  border: "2px solid #0d0e12",
                  boxShadow: "0 0 8px #22c55e",
                }}
              />
            )}
          </div>
        )}
      </button>
    </>
  );
}
