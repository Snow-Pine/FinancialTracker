import { useEffect } from "react";
import { useParams } from "react-router-dom";

const RedirectPage = () => {
  const { shortId } = useParams();

  useEffect(() => {
    const handleRedirect = async () => {
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/dashboard/share/url/${shortId}`);
      if (response.ok) {
        const longUrl = await response.text();
        window.location.href = longUrl;
      } else {
        alert("Failed to redirect to the long URL");
      }
    };

    handleRedirect();
  }, [shortId]);

  return <div>Redirecting...</div>;
};

export default RedirectPage;