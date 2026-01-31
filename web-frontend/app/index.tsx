import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { authService } from "../services/auth";

type AuthState = "checking" | "authenticated" | "unauthenticated";

export default function Index() {
  const [authState, setAuthState] = useState<AuthState>("checking");

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await authService.getStoredToken();
        setAuthState(token ? "authenticated" : "unauthenticated");
      } catch (error) {
        setAuthState("unauthenticated");
      }
    };

    checkToken();
  }, []);

  if (authState === "checking") {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1E90FF" />
      </View>
    );
  }

  return <Redirect href={authState === "authenticated" ? "/home" : "/login"} />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
});
