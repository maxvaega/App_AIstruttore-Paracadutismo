import { BASE_URL } from "@/constants/Api";
import { fetch as fetchExpo } from "expo/fetch";

export async function ask(message: string) {
  try {
    const req = await fetch(BASE_URL + "/query", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
      }),
    });

    const res: ApiResAsk = await req.json();
    const text = res.result;
    return text;
  } catch (e) {
    console.log(e);
  }
}

export async function askWithStream(message: string) {
  try {
    const controller = new AbortController();
    const response = await fetchExpo(BASE_URL + "/stream_query", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
        userid: "todo",
      }),
      signal: controller.signal,
    });

    if (!response.ok || !response.body) {
      throw new Error("Errore durante la chiamata all'API");
    }
    return response;
  } catch (e) {
    console.log(e);
  }
}

interface ApiResAsk {
  result: string;
}
