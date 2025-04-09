import { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter, DrawerClose } from "@/components/ui/drawer";

export function UrlTable({ urlData, setUrlData }: { urlData: any[], setUrlData: (data: any[]) => void }) {
  const [currentUrl, setCurrentUrl] = useState("");
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [editUrlId, setEditUrlId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState<string>("");

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

  const handleCopy = (shortUrl: string) => {
    navigator.clipboard.writeText(shortUrl);
    setCopiedUrl(shortUrl);
  };

  const handleShare = (shortUrl: string) => {
    setCurrentUrl(shortUrl);
    document.getElementById("drawer-trigger")?.click();
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this URL?");
    if (!confirmed) return;

    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/dashboard/share/deleteUrl/${id}`, {
      method: "DELETE",
    });
    if (response.ok) {
      setUrlData(urlData.filter((url) => url._id !== id));
    } else {
      alert("Failed to delete URL");
    }
  };

  const handleEdit = (id: string, title: string) => {
    setEditUrlId(id);
    setNewTitle(title);
  };

  const handleUpdate = async () => {
    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/dashboard/share/updateUrl/${editUrlId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title: newTitle }),
    });
    if (response.ok) {
      const updatedUrl = await response.json();
      setUrlData(urlData.map((url) => (url._id === editUrlId ? updatedUrl : url)));
      setEditUrlId(null);
      setNewTitle("");
    } else {
      alert("Failed to update URL");
    }
  };

  const shareOnPlatform = (platform: string) => {
    let shareUrl = "";
    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`;
        break;
      case "instagram":
        shareUrl = `https://www.instagram.com/?url=${encodeURIComponent(currentUrl)}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(currentUrl)}`;
        break;
      default:
        break;
    }
    window.open(shareUrl, "_blank");
  };

  return (
    <div className="justify-center p-4 border border-gray-500 rounded-xl">
      <h1 className="text-2xl font-bold mb-4">Table of the links</h1>
      <Table>
        <TableCaption>A list of your shortened URLs.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="font-bold">Title</TableHead>
            <TableHead className="font-bold">Long URL</TableHead>
            <TableHead className="font-bold">Short URL</TableHead>
            <TableHead className="font-bold">Actions</TableHead>
            <TableHead className="font-bold">Created Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {urlData.map((data, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">
                {editUrlId === data._id ? (
                  <Input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="mb-4 w-full max-w-md"
                  />
                ) : (
                  data.title
                )}
              </TableCell>
              <TableCell>
                <a
                  href={data.longURL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {data.longURL}
                </a>
              </TableCell>
              <TableCell>
                <a
                  href="#"
                  onClick={() => handleShortUrlClick(data.shortURL)}
                >
                  {data.shortURL}
                </a>
              </TableCell>
              <TableCell>
                <Button
                  className="m-4 bg-blue-500 rounded-full w-20 text-white"
                  onClick={() => handleCopy(data.shortURL)}
                  disabled={copiedUrl === data.shortURL}
                >
                  {copiedUrl === data.shortURL ? "Copied" : "Copy"}
                </Button>
                <Button className="m-4 w-13 bg-blue-500 rounded-full text-white" onClick={() => handleShare(data.shortURL)}>
                  Share
                </Button>
                <Button className="m-4 w-13 bg-red-500 rounded-full text-white" onClick={() => handleDelete(data._id)}>
                  Delete
                </Button>
                {editUrlId === data._id ? (
                  <Button className="m-4 w-13 bg-green-500 rounded-full text-white" onClick={handleUpdate}>
                    Update
                  </Button>
                ) : (
                  <Button className="m-4 w-13 bg-yellow-500 rounded-full text-white" onClick={() => handleEdit(data._id, data.title)}>
                    Edit
                  </Button>
                )}
              </TableCell>
              <TableCell>
                {new Date(data.createdDate).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={5}>Total URLs: {urlData.length}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>

      <Drawer>
        <DrawerTrigger asChild>
          <Button id="drawer-trigger" style={{ display: "none" }}>Open Drawer</Button>
        </DrawerTrigger>
        <DrawerContent className="bg-white">
          <div className="mx-auto w-full max-w-sm">
            <DrawerHeader>
              <DrawerTitle>Share This Link to: </DrawerTitle>
            </DrawerHeader>
            <div className="p-4">
            <Button className="m-4 w-13 bg-blue-500 rounded-full" onClick={() => shareOnPlatform("facebook")}>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M20 1C21.6569 1 23 2.34315 23 4V20C23 21.6569 21.6569 23 20 23H4C2.34315 23 1 21.6569 1 20V4C1 2.34315 2.34315 1 4 1H20ZM20 3C20.5523 3 21 3.44772 21 4V20C21 20.5523 20.5523 21 20 21H15V13.9999H17.0762C17.5066 13.9999 17.8887 13.7245 18.0249 13.3161L18.4679 11.9871C18.6298 11.5014 18.2683 10.9999 17.7564 10.9999H15V8.99992C15 8.49992 15.5 7.99992 16 7.99992H18C18.5523 7.99992 19 7.5522 19 6.99992V6.31393C19 5.99091 18.7937 5.7013 18.4813 5.61887C17.1705 5.27295 16 5.27295 16 5.27295C13.5 5.27295 12 6.99992 12 8.49992V10.9999H10C9.44772 10.9999 9 11.4476 9 11.9999V12.9999C9 13.5522 9.44771 13.9999 10 13.9999H12V21H4C3.44772 21 3 20.5523 3 20V4C3 3.44772 3.44772 3 4 3H20Z" fill="#ffffff"></path> </g></svg>
              </Button>
              <Button className="m-4 w-13 bg-blue-500 rounded-full" onClick={() => shareOnPlatform("instagram")}>
              <svg fill="#ffffff" viewBox="0 0 27 27" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M20.445 5h-8.891A6.559 6.559 0 0 0 5 11.554v8.891A6.559 6.559 0 0 0 11.554 27h8.891a6.56 6.56 0 0 0 6.554-6.555v-8.891A6.557 6.557 0 0 0 20.445 5zm4.342 15.445a4.343 4.343 0 0 1-4.342 4.342h-8.891a4.341 4.341 0 0 1-4.341-4.342v-8.891a4.34 4.34 0 0 1 4.341-4.341h8.891a4.342 4.342 0 0 1 4.341 4.341l.001 8.891z"></path><path d="M16 10.312c-3.138 0-5.688 2.551-5.688 5.688s2.551 5.688 5.688 5.688 5.688-2.551 5.688-5.688-2.55-5.688-5.688-5.688zm0 9.163a3.475 3.475 0 1 1-.001-6.95 3.475 3.475 0 0 1 .001 6.95zM21.7 8.991a1.363 1.363 0 1 1-1.364 1.364c0-.752.51-1.364 1.364-1.364z"></path></g></svg>
              </Button>
              <Button className="m-4 w-13 bg-blue-500 rounded-full" onClick={() => shareOnPlatform("linkedin")}>
              <svg fill="#ffffff" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="-271 283.9 256 235.1"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <rect x="-264.4" y="359.3" width="49.9" height="159.7"></rect> <path d="M-240.5,283.9c-18.4,0-30.5,11.9-30.5,27.7c0,15.5,11.7,27.7,29.8,27.7h0.4c18.8,0,30.5-12.3,30.4-27.7 C-210.8,295.8-222.1,283.9-240.5,283.9z"></path> <path d="M-78.2,357.8c-28.6,0-46.5,15.6-49.8,26.6v-25.1h-56.1c0.7,13.3,0,159.7,0,159.7h56.1v-86.3c0-4.9-0.2-9.7,1.2-13.1 c3.8-9.6,12.1-19.6,27-19.6c19.5,0,28.3,14.8,28.3,36.4V519h56.6v-88.8C-14.9,380.8-42.7,357.8-78.2,357.8z"></path> </g> </g></svg>
              </Button>
            </div>
            <DrawerFooter>
              <DrawerClose asChild>
                <Button variant="outline">Close</Button>
              </DrawerClose>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}