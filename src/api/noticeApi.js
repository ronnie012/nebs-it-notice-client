const BASE = import.meta.env.VITE_API_BASE_URL;

export async function createNotice(data) {
  const res = await fetch(`${BASE}/notices`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function getNotices(query = "") {
  const res = await fetch(`${BASE}/notices${query}`);
  return res.json();
}

export async function updateStatus(id, status) {
  const res = await fetch(`${BASE}/notices/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  return res.json();
}

export async function getNoticeById(id) {
  const res = await fetch(`${BASE}/notices/${id}`);
  return res.json();
}

export async function deleteNotice(id) {
  const res = await fetch(`${BASE}/notices/${id}`, {
    method: "DELETE",
  });
  return res.json();
}

export async function updateNotice(id, data) {
  const res = await fetch(`${BASE}/notices/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

// # Access insice code:
// const API = import.meta.env.VITE_API_BASE_URL;

