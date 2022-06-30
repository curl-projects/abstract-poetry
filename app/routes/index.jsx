import { PaperViewer } from "~/components/PaperViewer/paper-viewer.js"
import { redirect } from "@remix-run/node"

export const loader = async() => {
  return redirect("/seed")
}
