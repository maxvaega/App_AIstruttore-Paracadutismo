import { Pressable, Text, StyleSheet } from "react-native";
import { ThemedText } from "../ThemedText";

interface Props {
  title: string;
  onPress: () => void;
}

export default function (props: Props) {
  return (
    <Pressable style={styles.button} onPress={props.onPress}>
      <ThemedText style={styles.text}>{props.title}</ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: "#611aa3",
    width: "100%",
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
  },
});
