import { useRouter } from "expo-router";
import { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function SettingsScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [hapticsEnabled, setHapticsEnabled] = useState(true);
  const router = useRouter();

  const handleLogout = () => {
    router.replace("/login");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.heroHeader}>
          <Text style={styles.heroTitle}>Settings</Text>
          <Text style={styles.heroSubtitle}>
            Customize your MotoRide experience.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Ride experience</Text>
          <View style={styles.row}>
            <View>
              <Text style={styles.rowLabel}>Push notifications</Text>
              <Text style={styles.rowSubtext}>Trip updates and promos</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              thumbColor="#fff"
              trackColor={{ false: "#d1d9e2", true: "#02894b" }}
            />
          </View>
          <View style={styles.row}>
            <View>
              <Text style={styles.rowLabel}>Haptic feedback</Text>
              <Text style={styles.rowSubtext}>Vibrations for key actions</Text>
            </View>
            <Switch
              value={hapticsEnabled}
              onValueChange={setHapticsEnabled}
              thumbColor="#fff"
              trackColor={{ false: "#d1d9e2", true: "#02894b" }}
            />
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Account</Text>
          <TouchableOpacity style={styles.actionRow}>
            <Text style={styles.actionLabel}>Payment methods</Text>
            <Text style={styles.actionChevron}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionRow}>
            <Text style={styles.actionLabel}>Ride history</Text>
            <Text style={styles.actionChevron}>›</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Sign out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f5fbff",
  },
  container: {
    padding: 20,
    gap: 16,
  },
  heroHeader: {
    backgroundColor: "#00a86b",
    borderRadius: 24,
    padding: 20,
    gap: 6,
    shadowColor: "#00a86b",
    shadowOpacity: 0.25,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
  },
  heroTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "800",
  },
  heroSubtitle: {
    color: "#d6f8ea",
    fontSize: 14,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 18,
    shadowColor: "#0f172a",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    gap: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#061b26",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rowLabel: {
    fontWeight: "600",
    color: "#0f1f2b",
  },
  rowSubtext: {
    color: "#6c7a84",
    fontSize: 13,
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#f1f4f6",
  },
  actionLabel: {
    color: "#0f1f2b",
    fontWeight: "600",
  },
  actionChevron: {
    color: "#7b8a96",
    fontSize: 18,
  },
  logoutButton: {
    marginTop: 8,
    paddingVertical: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#ffd8de",
    alignItems: "center",
    backgroundColor: "#fff6f8",
  },
  logoutText: {
    color: "#ff4d6a",
    fontWeight: "700",
  },
});
