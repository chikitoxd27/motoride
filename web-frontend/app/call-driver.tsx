import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function CallDriverScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ name?: string }>();
  const driverName = params.name ?? "Your Driver";
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDuration((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formattedDuration = useMemo(() => {
    const minutes = Math.floor(duration / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (duration % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  }, [duration]);

  const handleEndCall = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.statusLabel}>In-App Call</Text>
        <Text style={styles.driverName}>{driverName}</Text>
        <Text style={styles.duration}>{formattedDuration}</Text>

        <View style={styles.avatarCircle}>
          <Text style={styles.avatarInitials}>
            {driverName
              .split(" ")
              .map((part) => part[0] ?? "")
              .join("")
              .slice(0, 2)
              .toUpperCase()}
          </Text>
        </View>

        <Text style={styles.callHint}>Let your driver know exactly where you are.</Text>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.secondaryButton} onPress={handleEndCall}>
            <Text style={styles.secondaryButtonText}>End Call</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#041c12",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    gap: 20,
  },
  statusLabel: {
    color: "#8edab4",
    fontSize: 16,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  driverName: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "800",
  },
  duration: {
    color: "#8edab4",
    fontSize: 18,
    fontWeight: "600",
  },
  avatarCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitials: {
    color: "#fff",
    fontSize: 40,
    fontWeight: "700",
  },
  callHint: {
    color: "#b2d9ca",
    fontSize: 16,
    textAlign: "center",
  },
  buttonRow: {
    width: "100%",
    marginTop: 20,
  },
  secondaryButton: {
    backgroundColor: "#f44336",
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
