import { supabase } from "@/lib/supabase";
import axios from "axios";
import { Leaderboard, Profile, UserStats } from "../interfaces/backendtypes";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function GetUsers(): Promise<Profile[]> {
  const endpoint = `${BACKEND_URL}/users`;
  const response = await axios.get<Profile[]>(endpoint);
  return response.data;
}

export async function GetUserByID(): Promise<Profile | null> {
  const { data } = await supabase.auth.getSession();
  const id = data.session?.user.id;
  if (!id) return null;
  const endpoint = `${BACKEND_URL}/users/${id}`;

  const response = await axios.get(endpoint);

  return response.data
}


export async function DeleteUser() {
  const { data } = await supabase.auth.getSession();
  const accessToken = data.session?.access_token;
  const id = data.session?.user.id;
  if (!id) return { message: "No active session" };
  const endpoint = `${BACKEND_URL}/users/${id}`;

  const response = await axios.delete(endpoint, {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });

  return response.data;

}

export async function GetUserStatsByID(): Promise<UserStats | null> {

  const { data } = await supabase.auth.getSession();
  const id = data.session?.user.id;

  if (!id) return null;

  const endpoint = `${BACKEND_URL}/users/${id}/stats`

  const response = await axios.get(endpoint);

  return response.data;




}

export async function UpdateUserStats(stats: Partial<UserStats>) {
  const { data } = await supabase.auth.getSession();
  const accessToken = data.session?.access_token;
  const id = data.session?.user.id;
  if (!id) return null;

  const endpoint = `${BACKEND_URL}/users/${id}/stats`;

  const response = await axios.put(endpoint, stats, {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });

  return response.data;
}



export async function GetLeaderboardsByScore(): Promise<Leaderboard[] | null> {
  const { data } = await supabase.auth.getSession();
  const accessToken = data.session?.access_token;
  const id = data.session?.user.id;
  if (!id) return null;

  const endpoint = `${BACKEND_URL}/leaderboard/high-score`;

  const response = await axios.get<Leaderboard[]>(endpoint);

  return response.data;
}


export async function GetLeaderboardsByLines(): Promise<Leaderboard[] | null> {
  const { data } = await supabase.auth.getSession();
  const accessToken = data.session?.access_token;
  const id = data.session?.user.id;
  if (!id) return null;

  const endpoint = `${BACKEND_URL}/leaderboard/lines-cleared`;

  const response = await axios.get<Leaderboard[]>(endpoint);

  return response.data;
}
