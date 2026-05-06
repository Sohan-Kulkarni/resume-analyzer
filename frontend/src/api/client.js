const API_BASE_URL = import.meta.env.VITE_API_URL || "https://resume-analyzer-2-83ad.onrender.com";

export async function uploadResume(file) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/upload-resume`, {
    method: "POST",
    body: formData,
  });

  return parseResponse(response);
}

export async function analyzeResume(payload) {
  const response = await fetch(`${API_BASE_URL}/analyze`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return parseResponse(response);
}

export async function getHistory() {
  const response = await fetch(`${API_BASE_URL}/history`);
  return parseResponse(response);
}

async function parseResponse(response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.detail || "Something went wrong. Please try again.");
  }
  return data;
}
