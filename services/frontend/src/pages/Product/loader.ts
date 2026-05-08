import { redirect, type LoaderFunctionArgs } from "react-router";
import httpClient from "../../utils/httpClient";
import type { RawProduct, RawUser } from "./types";
import { formatProductPageData } from "./utils";
import { notify } from "../../utils/notifications";

export const productLoader = async ({ params }: LoaderFunctionArgs) => {
  try {
    const { id } = params;

    if (!id) {
      return redirect("/404");
    }

    const listingResponse = await httpClient.get(`/catalog/listings/${id}`);
    const product: RawProduct = listingResponse.data.data;

    if (!product || !product.id) {
      return redirect("/404");
    }

    const userId = product.userId || product.user_id;

    if (!userId) {
      return redirect("/404");
    }

    const userResponse = await httpClient.get(`/auth/user/${userId}`);
    const user: RawUser = userResponse.data.user || userResponse.data.data || userResponse.data;

    if (!user) {
      return redirect("/404");
    }

    return formatProductPageData(product, user);
  } catch {
    notify('error', 'Error de conexión', 'No se ha podido cargar el producto.');
    return redirect("/404");
  }
};
