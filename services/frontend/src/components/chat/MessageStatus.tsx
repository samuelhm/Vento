import React from "react";

export type StatusType = "sent" | "delivered" | "read";

interface Props {
  status: StatusType;
}

export const MessageStatus: React.FC<Props> = ({ status }) => {
  if (status === "sent") {
    return <span className="text-slate-400 text-[10px] font-bold tracking-tighter">✓</span>;
  }
  if (status === "delivered") {
    return <span className="text-slate-400 text-[10px] font-bold tracking-tighter">✓✓</span>;
  }
  if (status === "read") {
    return <span className="text-teal-500 text-[10px] font-bold tracking-tighter">✓✓</span>;
  }
  return null;
};