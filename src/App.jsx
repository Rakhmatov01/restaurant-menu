import { useEffect, useState } from "react";
import Login from "./Login";
import Menu from "./Menu";
import { useParams } from "react-router-dom";
import { checkActiveSession as apiCheckActiveSession } from "./api";
export default function App() {
  const { tableNumber } = useParams();
  const [token, setToken] = useState(() => {
    return localStorage.getItem("session_token") || null;
  });
  const [active, setActive] = useState(false);
  const [loading, setLoading] = useState(true);

  // Save token to localStorage whenever it changes
  useEffect(() => {
    if (token) {
      localStorage.setItem("session_token", token);
    }
  }, [token]);

  useEffect(() => {
    setLoading(true);
    async function checkActiveSession(tableNumber) {
      try {
        const data = await apiCheckActiveSession(tableNumber);
        setActive(data.active);
        if (data.active && data.session?.token) {
          setToken(data.session.token);
        }
      } catch (error) {
        console.error("Session check error:", error);
        setActive(false);
      } finally {
        setLoading(false);
      }
    }

    if (tableNumber) {
      checkActiveSession(tableNumber);
    }
  }, [tableNumber]);

  if (loading)
    return (
      <div className="loading-container">
        <div className="loader"></div>
      </div>
    );
  return !active || !token ? (
    <Login
      setActive={setActive}
      setToken={setToken}
      tableNumber={tableNumber}
    />
  ) : (
    <Menu token={token} tableNumber={tableNumber} />
  );
}
