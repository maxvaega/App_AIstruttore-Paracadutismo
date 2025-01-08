import "../gesture-handler";
import { Stack } from "expo-router";
import { Auth0Provider as Auth0ProviderNative } from "react-native-auth0";
import { Auth0Provider as Auth0ProviderWeb } from "@auth0/auth0-react";
import { Platform, ActivityIndicator, View, SafeAreaView } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useAuth } from "@/hooks/useAuth";
import LoginScreen from "./login";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { createDrawerNavigator } from "@react-navigation/drawer";
import ChatScreen from "./chat";
import ChatWithStreamScreen from "./chatWithStream";
import ProfileScreen from "./profile";

export default function RootLayout() {
  if (Platform.OS === "web") {
    return <AuthProviderWeb />;
  } else {
    return <AuthProviderNative />;
  }
}

const AuthProviderNative = () => (
  <Auth0ProviderNative
    domain={"dev-hldygfksiqb6rf3d.us.auth0.com"}
    clientId={"MRSjewKmL15bVGQoBWJlEFUTK57lykvj"}
  >
    <Childrens />
  </Auth0ProviderNative>
);

const AuthProviderWeb = () => (
  <Auth0ProviderWeb
    domain="dev-hldygfksiqb6rf3d.us.auth0.com"
    clientId="MRSjewKmL15bVGQoBWJlEFUTK57lykvj"
    authorizationParams={{
      redirect_uri: window.location.origin,
    }}
  >
    <Childrens />
  </Auth0ProviderWeb>
);

const Drawer = createDrawerNavigator();

function Childrens() {
  const { isLoading, user } = useAuth();

  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={{
          flex: 1,
        }}
      >
        {isLoading && (
          <View
            style={{
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ActivityIndicator size={"large"} />
          </View>
        )}
        {!isLoading && !user && <LoginScreen />}
        {!isLoading && !!user && (
          <GestureHandlerRootView style={{ flex: 1 }}>
            <Drawer.Navigator>
              <Drawer.Screen
                name="ChatWithStream"
                component={ChatWithStreamScreen}
              />
              <Drawer.Screen name="Chat" component={ChatScreen} />
              <Drawer.Screen name="Profile" component={ProfileScreen} />
            </Drawer.Navigator>
          </GestureHandlerRootView>
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
