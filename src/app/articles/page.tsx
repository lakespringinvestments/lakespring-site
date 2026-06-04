import { redirect } from "next/navigation";

// Stories & Perspectives is now the homepage (/).
// This keeps any old /articles links working.
export default function ArticlesRedirect() {
  redirect("/");
}
