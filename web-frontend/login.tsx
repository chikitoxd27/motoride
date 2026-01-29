import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Link } from "expo-router";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function LoginScreen() {
  return (
    <View style={styles.container}>
      <MaterialCommunityIcons
        name="motorbike"
        size={96}
        color="#1E90FF"
        style={styles.logo}
      />
      <Text style={styles.title}>MotoRide</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter email"
        placeholderTextColor="#999"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        textContentType="emailAddress"
      />
      <TextInput
        style={styles.input}
        placeholder="Enter password"
        placeholderTextColor="#999"
        secureTextEntry
      />

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      {/* Create Account section */}
      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>Don't have an account yet?</Text>
        <Link href="/register" style={styles.signupLink}>
          Create Account
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
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    backgroundColor: "#f9f9f9",
  },
  button: {
    backgroundColor: "#1E90FF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
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
