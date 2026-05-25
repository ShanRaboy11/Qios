import { redirect } from "next/navigation";

/**
 * /home is deprecated – the customer ordering experience is now served
 * under /[id]/home where [id] is the tenant identifier obtained by
 * scanning a QR code. Redirect visitors to the QR scanner so they can
 * get a valid tenant link.
 */
export default function CustomerHomeRedirectPage() {
  redirect("/scan");
}
