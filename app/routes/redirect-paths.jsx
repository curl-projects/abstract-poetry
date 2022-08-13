import { redirect } from "@remix-run/node";

export async function action({ request }){
  const formData = await request.formData();
  const redirectURL = formData.get('redirectURL')
  return redirect(redirectURL)
}
