import { Text, View, Image } from "react-native";
import React from "react";
import MButton from "@/components/ui/MButton";
import { useAuth } from "@/hooks/useAuth";

export default function LoginScreen() {
  const { login } = useAuth();

  const onPressLogin = async () => {
    try {
      await login();
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        marginTop: "30%",
        alignItems: "center",
        padding: 40,
      }}
    >
      <Image
        source={{
          uri: "https://avatar.iran.liara.run/public/42",
        }}
        style={{
          width: 128,
          height: 128,
        }}
      />
      <Text
        style={{
          fontSize: 20,
          color: "black",
          marginTop: 24,
          marginBottom: 24,
          textAlign: "center",
        }}
      >
        Ciao sono Aistruttore. Per chiedermi qualcosa sul paracadutismo devi
        aver effettuato l' accesso.
      </Text>
      <MButton onPress={onPressLogin} title="ACCEDI" />
    </View>
  );
}
