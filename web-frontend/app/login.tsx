import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Google from "expo-auth-session/providers/google";
import { Link } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const [isLoading, setIsLoading] = useState(false);

  const clientIds = useMemo(
    () => ({
      webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
      androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
      iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    }),
    [],
  );

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: clientIds.webClientId,
    webClientId: clientIds.webClientId,
    androidClientId: clientIds.androidClientId,
    iosClientId: clientIds.iosClientId,
  });

  useEffect(() => {
    if (!response) return;

    if (response.type === "success") {
      setIsLoading(false);
      Alert.alert(
        "Google login",
        "Successfully authenticated with Google. Exchange token with backend next.",
      );
    }

    if (response.type === "error" || response.type === "dismiss") {
      setIsLoading(false);
    }
  }, [response]);

  const handleGoogleLogin = async () => {
    if (!request) {
      Alert.alert(
        "Google login unavailable",
        "Client IDs are missing. Please configure EXPO_PUBLIC_GOOGLE_* env vars.",
      );
      return;
    }

    try {
      setIsLoading(true);
      const result = await promptAsync();
      if (result.type !== "success") {
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      Alert.alert("Google login failed", "Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <MaterialCommunityIcons
        name="motorbike"
        size={96}
        color="#1E90FF"
        style={styles.logo}
      />
      <Text style={styles.title}>MotoRide</Text>
      <Text style={styles.subtitle}>
        Continue securely with your Google account to manage your rides.
      </Text>

      <TouchableOpacity
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={handleGoogleLogin}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <View style={styles.buttonContent}>
            <MaterialCommunityIcons
              name="google"
              size={22}
              color="#fff"
              style={styles.googleIcon}
            />
            <Text style={styles.buttonText}>Continue with Google</Text>
          </View>
        )}
      </TouchableOpacity>

      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>New to MotoRide?</Text>
        <Link href={{ pathname: "/register" }} style={styles.signupLink}>
          Create an account
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
    color: "#007bff",
  },
  logo: {
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginBottom: 30,
  },
  button: {
    backgroundColor: "#1E90FF",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
    marginTop: 10,
  },
  buttonDisabled: {
    opacity: 0.8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  googleIcon: {
    marginRight: 4,
  },
  signupContainer: {
    flexDirection: "row",
    marginTop: 20,
  },
  signupText: {
    fontSize: 14,
    color: "#555",
    marginRight: 5,
  },
  signupLink: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1E90FF",
  },
});
