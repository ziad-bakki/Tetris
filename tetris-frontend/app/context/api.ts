import { supabase } from "@/lib/supabase";
import axios from "axios";
import { Profile } from "../interfaces/backendtypes";
import { headers } from "next/headers";

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


export async function DeleteUser() {
  const { data } = await supabase.auth.getSession();
  const accessToken = data.session?.access_token;
  const id = data.session?.user.id;
  const endpoint = `${BACKEND_URL}/users/${id}`;

  // const response = await axios.delete(endpoint,);
  const response = await fetch(
    endpoint,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  )

  if (response.ok) {
    return response.json();
  }

  return { message: "Failed to delete user" };
}

