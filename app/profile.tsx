import { Text, View, Button } from "react-native";
import React from "react";
import { useAuth } from "@/hooks/useAuth";

export default function ProfileScreen() {
  const { logout, user } = useAuth();

  const onPressLogout = async () => {
    try {
      await logout();
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
      }}
    >
      <View>
        <Button onPress={onPressLogout} title="Log out" />
      </View>
      <Text>Welcome {user?.picture}</Text>
    </View>
  );
}