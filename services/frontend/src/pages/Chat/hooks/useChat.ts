import { useState, useEffect, useRef, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import type { Message } from "../../../components/chat/ChatWindow";
import type { ChatMessageApi, IncomingSocketMessage } from "../types";
import httpClient from "../../../utils/httpClient";

interface UseChatProps {
  currentUserId?: string;
  activeChatId: string | null;
}

export const useChat = ({ currentUserId, activeChatId }: UseChatProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const socketRef = useRef<Socket | null>(null);

  const loadHistory = useCallback(async () => {
    if (!currentUserId || !activeChatId) return;

    try {
      const res = await httpClient.get(`/chats/${activeChatId}/messages`);
      const data = res.data as ChatMessageApi[];

      const formattedMessages: Message[] = (Array.isArray(data) ? data : []).map(
        (msg: ChatMessageApi) => ({
          id: msg.id,
          text: msg.content,
          senderId: msg.senderId,
          time: new Date(msg.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          status: msg.read ? "read" : "sent",
        })
      );
      setMessages(formattedMessages);

      if (socketRef.current) {
        socketRef.current.emit("mark_as_read", { conversationId: activeChatId });
      }
    } catch (err) {
      console.error("Error fetching chat history:", err);
    }
  }, [currentUserId, activeChatId]);

  useEffect(() => {
    if (!currentUserId || !activeChatId) return;

    loadHistory();

    socketRef.current = io("/", {
      withCredentials: true,
      path: "/socket.io",
    });

    const socket = socketRef.current;

    socket.on("connect", () => {
      socket.emit("join_conversation", { conversationId: activeChatId });
    });

    socket.on("error_message", (err) =>
      console.error("WebSocket error received:", err)
    );

    socket.on("new_message", (incomingMsg: IncomingSocketMessage) => {
      const formattedMsg: Message = {
        id: incomingMsg.id,
        text: incomingMsg.content,
        senderId: incomingMsg.senderId,
        time: new Date(incomingMsg.createdAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        status: "sent",
      };

      setMessages((prev) => {
        if (formattedMsg.senderId === currentUserId) {
          const isOptimisticMessage = prev.find(
            (m) => m.text === formattedMsg.text && m.id !== formattedMsg.id
          );

          if (isOptimisticMessage) {
            return prev.map((m) =>
              m.id === isOptimisticMessage.id ? formattedMsg : m
            );
          }
        }
        return [...prev, formattedMsg];
      });

      if (incomingMsg.senderId !== currentUserId) {
        socket.emit("mark_as_read", { conversationId: activeChatId });
      }
    });

    socket.on("message_read", ({ by }) => {
      if (by !== currentUserId) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.senderId === currentUserId ? { ...msg, status: "read" } : msg
          )
        );
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [activeChatId, currentUserId, loadHistory]);

  const handleSendMessage = useCallback(
    (text: string) => {
      if (!currentUserId || !activeChatId) return;

      const localMessages: Message = {
        id: Date.now().toString(),
        text,
        senderId: currentUserId,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        status: "sent",
      };

      setMessages((prev) => [...prev, localMessages]);

      if (socketRef.current) {
        socketRef.current.emit("send_message", {
          conversationId: activeChatId,
          content: text,
          type: "TEXT",
        });
      } else {
        console.error("Socket is not connected. Message dispatch failed.");
      }
    },
    [currentUserId, activeChatId]
  );

  return {
    messages,
    handleSendMessage,
  };
};
