import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function UrlShortener({ onNewUrlData }: { onNewUrlData: (data: any) => void }) {
  const [longUrl, setLongUrl] = useState("");
  const [title, setTitle] = useState("");
  const [shortUrl, setShortUrl] = useState("");

  const handleShorten = async () => {
    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/dashboard/share/shortenUrl`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
        credentials: "include",
      body: JSON.stringify({ longURL: longUrl, title }),
    });

    if (response.ok) {
      const data = await response.json();
      setShortUrl(data.shortURL);
      onNewUrlData(data);
    } else {
      alert("Failed to shorten URL");
    }
  };

  const handleShortUrlClick = async (shortUrl: string) => {
    const shortId = shortUrl.split("/").pop();
    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/dashboard/share/url/${shortId}`, {
        credentials: "include",
    });
    if (response.ok) {
      const longUrl = await response.text();
      window.open(longUrl, "_blank");
    } else {
      alert("Failed to redirect to the long URL");
    }
  };

  return (
    <div className="justify-center p-4 border border-gray-500 rounded-xl">
      <h1 className="text-2xl font-bold mb-4">Shorten a long link</h1>
      <p className="mt-7 mb-2 font-bold">Paste your long link here:</p>
      <Input
        type="text"
        placeholder="https://example.com/your-long-link"
        value={longUrl}
        onChange={(e) => setLongUrl(e.target.value)}
        className="mb-4 w-full max-w-md border-solid"
      />
      <p className="mt-7 mb-2 font-bold">Title:</p>
      <Input
        type="text"
        placeholder="Website Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="mb-4 w-full max-w-md border-solid"
      />
      <Button
        onClick={handleShorten}
        className="mb-4 w-13 bg-blue-500 text-white"
      >
        Shorten URL
      </Button>
      {shortUrl && (
        <div className="mt-4">
          <p className="font-bold">Shortened URL:</p>
          <a
            href="#"
            onClick={() => handleShortUrlClick(shortUrl)}
          >
            {shortUrl}
          </a>
        </div>
      )}
    </div>
  );
}