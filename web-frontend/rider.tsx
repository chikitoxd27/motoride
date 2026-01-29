import { View, Text, Button } from "react-native";
import { Link } from "expo-router";

export default function RiderScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 20, marginBottom: 20 }}>Rider Screen</Text>

      <Link href="/" asChild>
        <Button title="Back to Home" />
      </Link>
    </View>
  );
}
