import { useAuth } from "@clerk/clerk-react";
import { useEffect } from "react";
import api from "../lib/axios";

function useAuthReq() {
  const { isSignedIn, getToken, isLoaded } = useAuth();

  useEffect(() => {
    // Set up the interceptor
    const interceptorId = api.interceptors.request.use(
      async (config) => {
        // It's safer to rely on getToken() directly rather than the isSignedIn boolean
        // from the closure, but using isSignedIn here is fine NOW because
        // we are allowing the effect to update properly.
        if (isSignedIn) {
          const token = await getToken();
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // CLEANUP: Eject the interceptor when deps change or component unmounts
    return () => {
      api.interceptors.request.eject(interceptorId);
    };
  }, [isSignedIn, getToken]); // Re-run effect when signedIn state changes

  return { isSignedIn, isClerkLoaded: isLoaded };
}

export default useAuthReq;