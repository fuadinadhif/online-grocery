export async function fetchJsonApi({
  url,
  method = "GET",
  body,
  credentials,
  errorMessage,
}: {
  url: string;
  method?: string;
  body?: Record<string, unknown>;
  credentials?: boolean;
  errorMessage: string;
}) {
  const response = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    credentials: credentials ? "include" : "omit",
  });

  const data = await response.json();

  if (!response.ok || !data) {
    const message = data.message ? data.message : data;
    throw new Error(
      errorMessage || message || "Unknown error when fetching data",
    );
  }

  return data;
}
