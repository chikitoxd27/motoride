import { MaterialCommunityIcons } from "@expo/vector-icons";
import { makeRedirectUri } from "expo-auth-session";
import * as Google from "expo-auth-session/providers/google";
import { Link, useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { authService } from "../services/auth";

type ExpoAwareGoogleAuthRequestConfig =
  Partial<Google.GoogleAuthRequestConfig> & {
    expoClientId?: string;
  };

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [isEmailLoginLoading, setIsEmailLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const clientIds = useMemo(
    () => ({
      webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
      androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
      iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    }),
    [],
  );

  const redirectUri = useMemo(
    () => makeRedirectUri({ scheme: "motoride" }),
    [],
  );

  const googleAuthConfig: ExpoAwareGoogleAuthRequestConfig = {
    expoClientId: clientIds.webClientId,
    webClientId: clientIds.webClientId,
    androidClientId: clientIds.androidClientId,
    iosClientId: clientIds.iosClientId,
    redirectUri,
  };

  const [request, response, promptAsync] =
    Google.useAuthRequest(googleAuthConfig);

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

  const handleEmailPasswordLogin = async () => {
    if (!credentials.email || !credentials.password) {
      Alert.alert("Missing information", "Enter both email and password.");
      return;
    }

    try {
      setIsEmailLoginLoading(true);
      setLoginError(null);
      const authResponse = await authService.login({
        email: credentials.email.trim(),
        password: credentials.password,
      });

      Alert.alert("Welcome back", `Signed in as ${authResponse.user.email}.`);
      router.replace("/");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to authenticate.";
      setLoginError(message);
      Alert.alert("Login failed", message);
    } finally {
      setIsEmailLoginLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View style={styles.container}>
            <View style={styles.heroCard}>
              <MaterialCommunityIcons
                name="motorbike"
                size={76}
                color="#ffffff"
                style={styles.logo}
              />
              <Text style={styles.title}>Welcome back</Text>
              <Text style={styles.subtitle}>
                Sign in to manage your MotoRide trips and bookings.
              </Text>
            </View>

            <View style={styles.authCard}>
              <View style={styles.formContainer}>
                <TextInput
                  value={credentials.email}
                  onChangeText={(email) =>
                    setCredentials((prev) => ({ ...prev, email }))
                  }
                  placeholder="Email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  returnKeyType="next"
                  style={styles.input}
                  placeholderTextColor="#0f172a"
                />
                <TextInput
                  value={credentials.password}
                  onChangeText={(password) =>
                    setCredentials((prev) => ({ ...prev, password }))
                  }
                  placeholder="Password"
                  secureTextEntry
                  autoCapitalize="none"
                  returnKeyType="done"
                  onSubmitEditing={handleEmailPasswordLogin}
                  style={styles.input}
                  placeholderTextColor="#0f172a"
                />
                <TouchableOpacity
                  style={[
                    styles.primaryButton,
                    isEmailLoginLoading && styles.buttonDisabled,
                  ]}
                  onPress={handleEmailPasswordLogin}
                  disabled={isEmailLoginLoading}
                >
                  {isEmailLoginLoading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.primaryButtonText}>Sign in</Text>
                  )}
                </TouchableOpacity>
                {loginError ? (
                  <Text style={styles.errorText}>{loginError}</Text>
                ) : null}
              </View>

              <View style={styles.dividerContainer}>
                <View style={styles.divider} />
                <Text style={styles.dividerLabel}>or</Text>
                <View style={styles.divider} />
              </View>

              <TouchableOpacity
                style={[
                  styles.googleButton,
                  isLoading && styles.buttonDisabled,
                ]}
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
                    <Text style={styles.googleButtonText}>
                      Continue with Google
                    </Text>
                  </View>
                )}
              </TouchableOpacity>

              <View style={styles.signupContainer}>
                <Text style={styles.signupText}>New to MotoRide?</Text>
                <Link
                  href={{ pathname: "/register" }}
                  style={styles.signupLink}
                >
                  Create an account
                </Link>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f5fbff",
  },
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 24,
    gap: 24,
  },
  heroCard: {
    backgroundColor: "#00a86b",
    borderRadius: 28,
    paddingVertical: 28,
    paddingHorizontal: 24,
    shadowColor: "#00a86b",
    shadowOpacity: 0.3,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
  },
  authCard: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 24,
    shadowColor: "#0f172a",
    shadowOpacity: 0.08,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    textAlign: "left",
    color: "#ffffff",
    marginBottom: 6,
  },
  logo: {
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    color: "#d8f5e7",
    textAlign: "left",
  },
  formContainer: {
    width: "100%",
    gap: 12,
    marginBottom: 16,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#e0e8f0",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#0f172a",
    backgroundColor: "#f8fbff",
  },
  primaryButton: {
    backgroundColor: "#02894b",
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: "center",
    shadowColor: "#02894b",
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    gap: 10,
    marginBottom: 10,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#edf1f5",
  },
  dividerLabel: {
    color: "#7a8a9a",
    fontSize: 14,
    textTransform: "uppercase",
  },
  googleButton: {
    backgroundColor: "#0f7dd1",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 18,
    alignItems: "center",
    width: "100%",
    marginTop: 10,
  },
  buttonDisabled: {
    opacity: 0.8,
  },
  googleButtonText: {
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
    marginTop: 24,
  },
  signupText: {
    fontSize: 14,
    color: "#6b7684",
    marginRight: 5,
  },
  signupLink: {
    fontSize: 14,
    fontWeight: "700",
    color: "#02894b",
  },
  errorText: {
    color: "#d9534f",
    fontSize: 14,
    marginTop: 8,
    textAlign: "center",
  },
});
