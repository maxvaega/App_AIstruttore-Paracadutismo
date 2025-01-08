import { useAuth0 as useAuth0Native } from "react-native-auth0";
import { useAuth0 as useAuth0Web } from "@auth0/auth0-react";
import { Platform } from "react-native";

export function useAuth() {
  const hookWeb = useAuth0Web();
  const hookNative = useAuth0Native();

  return {
    login:
      Platform.OS === "web" ? hookWeb.loginWithRedirect : hookNative.authorize,
    logout: Platform.OS === "web" ? hookWeb.logout : hookNative.clearSession,
    user: Platform.OS === "web" ? hookWeb.user : hookNative.user,
    isLoading: Platform.OS === "web" ? hookWeb.isLoading : hookNative.isLoading,
  };
}
