import { useEffect, useRef } from "react";
import { MessageStatus, type StatusType } from "./MessageStatus";
import { ArrowLeft } from "../BackButton/assets/ArrowLeft";

export interface Message {
  id: string;
  text: string;
  senderId: string;
  time: string;
  status: StatusType;
}

interface ChatWindowProps {
  messages: Message[];
  currentUserId: string;
  contactName: string;
  contactAvatar?: string;
  onBack?: () => void;
}

export const ChatWindow = ({ messages, currentUserId, contactName, contactAvatar, onBack }: ChatWindowProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  //scroll
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-1 min-h-0 overflow-y-auto bg-slate-50 flex flex-col">
      <div className="sticky top-0 z-20 bg-white border-b border-slate-200 px-4 py-3 flex items-center gap-3 shadow-sm">
        {onBack && (
          <button
            onClick={onBack}
            className="md:hidden flex items-center justify-center"
            aria-label="Volver a conversaciones"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
          </button>
        )}
        <div className="w-10 h-10 rounded-full bg-slate-200 shrink-0 overflow-hidden flex items-center justify-center relative border border-slate-100">
          <span className="text-slate-500 font-bold absolute">
            {contactName.charAt(0).toUpperCase()}
          </span>
          {contactAvatar && (
            <img
              src={contactAvatar}
              alt={contactName}
              className="w-full h-full object-cover relative z-10"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          )}
        </div>
        <h3 className="font-semibold text-slate-800">{contactName}</h3>
      </div>

      <div className="flex-1 overflow-x-hidden overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => {
          const isMine = msg.senderId === currentUserId;
          return (
            <div key={msg.id} className={`flex w-full min-w-0 ${isMine ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[75%] min-w-0 overflow-hidden rounded-2xl p-3 text-sm shadow-sm border
                  ${isMine
                    ? "rounded-tr-none bg-teal-50 border-teal-100 text-slate-800"
                    : "rounded-tl-none bg-white border-slate-200 text-slate-800"
                  }`}
              >
                <p className="wrap-break-word">{msg.text}</p>
                <div className={`mt-1 flex items-center gap-1 text-[10px] ${isMine ? "justify-end text-teal-600" : "justify-end text-slate-400"}`}>
                  <span>{msg.time}</span>
                  {isMine && <MessageStatus status={msg.status} />}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};
