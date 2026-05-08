import { Link } from "react-router";
import AvatarInitials from "../../../components/AvtarCss";
import type { SellerPreviewProps } from "../types";

export const SellerPreview = ({ id, name, memberSince }: SellerPreviewProps) => (
  <Link
    to={`/user/${id}`}
    className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition-colors mb-8 group cursor-pointer"
  >
    <AvatarInitials name={name} size={48} className="shadow-sm" />
    <div>
      <h4 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{name}</h4>
      <p className="text-sm text-gray-500">{memberSince}</p>
    </div>
  </Link>
);
