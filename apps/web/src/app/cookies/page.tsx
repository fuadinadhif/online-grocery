"use client";

import { useEffect, useState } from "react";

export default function CookiesPage() {
  const [cookieData, setCookieData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchCookies() {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_DOMAIN}/cookies`,
          { credentials: "include" },
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setCookieData(data);
      } catch (e) {
        if (e instanceof Error) {
          setError(e);
          console.error("Failed to fetch cookies:", e);
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchCookies();
  }, []);

  useEffect(() => {
    async function fetchMe() {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_DOMAIN}/me`);
      const data = await response.json();

      console.log(data);
    }

    fetchMe();
  }, []);

  if (isLoading) {
    return (
      <main className="max-wrapper">
        <p>Loading cookies...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="max-wrapper">
        <p>Error: {error.message}</p>
      </main>
    );
  }

  if (cookieData) {
    console.log("Cookie Data:", cookieData);

    return (
      <main className="max-wrapper">
        <h2>Cookies:</h2>
        <pre>{JSON.stringify(cookieData, null, 2)}</pre>
      </main>
    );
  }

  return (
    <main className="max-wrapper">
      <p>No cookie data available.</p>
    </main>
  );
}
