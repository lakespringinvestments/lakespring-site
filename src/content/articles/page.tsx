import { redirect } from "next/navigation";

// The News & Perspectives grid is now the homepage (/).
// This keeps any existing links to /articles working.
export default function ArticlesRedirect() {
  redirect("/");
}
