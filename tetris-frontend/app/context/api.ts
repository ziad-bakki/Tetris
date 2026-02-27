import { supabase } from "@/lib/supabase";
import axios from "axios";
import { Profile } from "../interfaces/backendtypes";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function GetUsers(): Promise<Profile[]> {
  const endpoint = `${BACKEND_URL}/users`;
  const response = await axios.get<Profile[]>(endpoint);
  return response.data;
}

export async function GetUserByID(): Promise<Profile> {
  const { data } = await supabase.auth.getSession();
  const id = data.session?.user.id;
  const endpoint = `${BACKEND_URL}/users/${id}`;

  const response = await axios.get(endpoint);

  return response.data


}
