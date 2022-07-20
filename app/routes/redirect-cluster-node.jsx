import { redirect } from "@remix-run/node"

export async function action({ request }){
  const formData = await request.formData();
  const redirectString = formData.get('redirectString')

  return redirect(redirectString)
}
