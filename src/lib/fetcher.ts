export function getAdminApiBaseUrl(): string {
  // Support both naming styles
  const base =
    process.env.ADMINAPIBASE_URL ||
    process.env.ADMIN_API_BASE_URL ||
    process.env.NEXT_PUBLIC_ADMIN_API_BASE_URL;

  if (!base) {
    throw new Error(
      'Admin API base URL is not set. Set ADMINAPIBASE_URL (or ADMIN_API_BASE_URL) in .env.local',
    );
  }
  return base;
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const base = getAdminApiBaseUrl();
  const url = `${base}${path}`;

  const res = await fetch(url, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || `Request failed: ${res.status}`);
  }

  return res.json();
}
