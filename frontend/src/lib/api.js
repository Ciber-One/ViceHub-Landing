import axios from "axios";

export const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export async function joinWaitlist(email, source = "landing") {
  const { data } = await axios.post(`${API}/waitlist`, { email, source });
  return data;
}

export async function streamCompanion(message, sessionId, onDelta) {
  const res = await fetch(`${API}/companion/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, session_id: sessionId }),
  });
  if (!res.ok || !res.body) throw new Error("Companion unavailable");
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const parts = buffer.split("\n\n");
    buffer = parts.pop();
    for (const part of parts) {
      const line = part.trim();
      if (!line.startsWith("data:")) continue;
      const payload = JSON.parse(line.slice(5).trim());
      if (payload.delta) onDelta(payload.delta);
      if (payload.error) throw new Error(payload.error);
    }
  }
}
