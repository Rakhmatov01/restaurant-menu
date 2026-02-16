// Centralized API helpers
// Use REACT_APP_API_BASE to override the default base URL
export const API_BASE =
  process.env.REACT_APP_API_BASE || "http://127.0.0.1:8000";

async function parseResponse(res) {
  const contentType = res.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const body = isJson ? await res.json() : await res.text();

  if (!res.ok) {
    const message =
      (body && (body.error || body.message || body.detail)) ||
      body ||
      res.statusText;
    const err = new Error(
      typeof message === "string" ? message : JSON.stringify(message),
    );
    err.status = res.status;
    err.body = body;
    throw err;
  }
  return body;
}

export async function checkActiveSession(tableNumber) {
  const res = await fetch(`${API_BASE}/api/session/active/${tableNumber}`);
  return parseResponse(res);
}

export async function startSession({ tableNumber, customerName }) {
  const res = await fetch(`${API_BASE}/api/session/start`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      table_number: tableNumber,
      customer_name: customerName,
    }),
  });
  return parseResponse(res);
}

export async function getMenu(token) {
  const res = await fetch(`${API_BASE}/api/menu`, {
    headers: { Authorization: `Token ${token}` },
  });
  return parseResponse(res);
}
