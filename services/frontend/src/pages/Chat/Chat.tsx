import { useAuth } from "../../contexts/AuthContext";
import { ChatWindow } from "../../components/chat/ChatWindow";
import { ChatInput } from "../../components/chat/ChatInput";
import { ProductCard } from "../../components/ProductCard";
import type { Product } from "../../types/searchTypes";
import { useInbox } from "./hooks/useInbox";
import { useChat } from "./hooks/useChat";
import { useIsMobile } from "../../hooks/useIsMobile";

export const Chat = () => {
  const { user, isLoading, isAuthenticated } = useAuth();
  const currentUserId = user?.id;
  const isMobile = useIsMobile();

  const { inbox, activeChatId, setActiveChatId } = useInbox({ currentUserId, autoSelect: !isMobile });
  const { messages, handleSendMessage } = useChat({
    currentUserId,
    activeChatId,
  });

  if (isLoading)
    return (
      <div className="flex h-[calc(100vh-64px)] items-center justify-center bg-slate-50">
        <p className="text-slate-500">Cargando usuario...</p>
      </div>
    );
  if (!isAuthenticated || !currentUserId)
    return (
      <div className="flex h-[calc(100vh-64px)] items-center justify-center bg-slate-50">
        <p className="text-rose-500">Necesitas iniciar sesión</p>
      </div>
    );

  const activeChatDetails = inbox.find((c) => c.id === activeChatId);
  const activeChatProduct: Product | null = activeChatDetails
    ? {
        id: activeChatDetails.productId,
        userId: activeChatDetails.productUserId,
        title: activeChatDetails.productName,
        description: activeChatDetails.productDescription || "Sin descripción",
        price: activeChatDetails.productPrice,
        state: activeChatDetails.productState,
        createdAt: "",
        latitude: activeChatDetails.productLatitude,
        longitude: activeChatDetails.productLongitude,
        city: activeChatDetails.productCity,
        wishlist: false,
        reviewAvg: activeChatDetails.productReviewAvg,
        photos: activeChatDetails.productPhotoPath
          ? [
              {
                path: activeChatDetails.productPhotoPath,
                position: 0,
              },
            ]
          : null,
      }
    : null;

  return (
    <div className="flex h-full w-full overflow-hidden bg-white text-slate-800">
      {/* Sidebar: Inbox List — full-width on mobile when no chat open, sidebar on desktop */}
      <div
        className={`min-w-0 flex-col border-r border-slate-200 md:flex md:w-1/3 md:max-w-sm ${
          activeChatId ? "hidden md:flex" : "flex w-full"
        }`}
      >
        <div className="border-b border-slate-200 p-4">
          <h2 className="font-semibold">Bandeja</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {inbox.length === 0 ? (
            <p className="mt-4 p-4 text-center text-sm text-slate-400">
              No tienes conversaciones
            </p>
          ) : (
            inbox.map((chat) => (
              <div
                key={chat.id}
                onClick={() => setActiveChatId(chat.id)}
                className={`flex cursor-pointer gap-3 border-l-4 p-4 transition ${
                  activeChatId === chat.id
                    ? "border-teal-500 bg-slate-50"
                    : "border-transparent hover:bg-slate-50"
                }`}
              >
                {/* User Avatar */}
                <div className="relative flex h-14 w-14 flex-shrink-0 items-center justify-center overflow-hidden rounded-full border border-slate-100 bg-slate-200 shadow-sm">
                  <span className="absolute text-xl font-bold text-slate-500">
                    {chat.contactName.charAt(0).toUpperCase()}
                  </span>
                  {chat.avatar && (
                    <img
                      src={chat.avatar}
                      alt={chat.contactName}
                      className="relative z-10 h-full w-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  )}
                </div>

                <div className="flex min-w-0 flex-1 flex-col justify-center">
                  <p className="truncate text-sm font-medium">
                    {chat.contactName}
                  </p>
                  <p className="truncate text-xs font-semibold text-slate-500">
                    {chat.productName}
                  </p>
                  {chat.lastMessage && (
                    <p className="mt-0.5 truncate text-xs text-slate-400">
                      {chat.lastMessage}
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Area: Chat Window — hidden on mobile when no chat open */}
      <div
        className={`relative min-w-0 min-h-0 flex-1 flex-col ${
          activeChatId ? "flex" : "hidden md:flex"
        }`}
      >
        {activeChatId ? (
          <>
            <ChatWindow
              messages={messages}
              currentUserId={currentUserId}
              contactName={activeChatDetails?.contactName || "Usuario"}
              contactAvatar={activeChatDetails?.avatar}
              onBack={() => setActiveChatId(null)}
            />
            <ChatInput onSendMessage={handleSendMessage} />
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center text-slate-400">
            Selecciona una conversación
          </div>
        )}
      </div>

      {/* Sidebar: Product Details */}
      <div className="hidden w-1/4 min-w-[240px] flex-col items-start border-l border-slate-200 bg-slate-50 p-6 lg:flex">
        {activeChatProduct ? (
          <div className="w-full">
            <ProductCard product={activeChatProduct} isPrivateView={true} />
          </div>
        ) : null}
      </div>
    </div>
  );
};
