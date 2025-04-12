import { useEffect, useState } from "react";

export function useAuth() {
  const [token, setToken] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      setToken(token);
    }

    setIsLoading(false);
  }, []);

  return { token, isLoading };
}
