import { supabase } from "@/lib/supabase";
import axios from "axios";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function GetUsers() {
  const endpoint = `${BACKEND_URL}/users`;
  console.log(endpoint)
  const response = await axios.get(endpoint);
  return response.data;
}

export async function GetUserByID() {
  const { data } = await supabase.auth.getSession();
  const id = data.session?.user.id;
  const token = data.session?.access_token;
  const endpoint = `${BACKEND_URL}/users/${id}`;

  const response = await axios.get(endpoint);

  console.log(response.data);

}
