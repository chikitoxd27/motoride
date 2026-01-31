import { Link, useRouter } from "expo-router";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const mockStats = [
  { label: "Completed rides", value: 128 },
  { label: "Rating", value: "4.9★" },
  { label: "Member since", value: "2022" },
];

export default function ProfileScreen() {
  const router = useRouter();

  const handleLogout = () => {
    router.replace("/login");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.heroCard}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarInitials}>JD</Text>
          </View>
          <View style={styles.heroTextGroup}>
            <Text style={styles.heroTitle}>Julia Dela Cruz</Text>
            <Text style={styles.heroSubtitle}>julia@example.com</Text>
          </View>
          <Link href={{ pathname: "/settings" }} asChild>
            <View style={styles.editButton}>
              <Text style={styles.editButtonText}>Edit</Text>
            </View>
          </Link>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Ride stats</Text>
          <View style={styles.statsRow}>
            {mockStats.map((stat) => (
              <View style={styles.statItem} key={stat.label}>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Quick actions</Text>
          <View style={styles.actionsList}>
            <Link href={{ pathname: "/settings" }} asChild>
              <View style={styles.actionRow}>
                <Text style={styles.actionLabel}>Account settings</Text>
                <Text style={styles.actionChevron}>›</Text>
              </View>
            </Link>
            <TouchableOpacity style={styles.actionRow}>
              <Text style={styles.actionLabel}>Payment methods</Text>
              <Text style={styles.actionChevron}>›</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionRow}>
              <Text style={styles.actionLabel}>Support center</Text>
              <Text style={styles.actionChevron}>›</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Log out</Text>
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
  heroCard: {
    backgroundColor: "#00a86b",
    borderRadius: 28,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    shadowColor: "#00a86b",
    shadowOpacity: 0.25,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
  },
  avatarCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitials: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "800",
  },
  heroTextGroup: {
    flex: 1,
    gap: 4,
  },
  heroTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "800",
  },
  heroSubtitle: {
    color: "#d6f8ea",
  },
  editButton: {
    backgroundColor: "rgba(255,255,255,0.18)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
  },
  editButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 22,
    padding: 18,
    shadowColor: "#0f172a",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#061b26",
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "700",
    color: "#02894b",
  },
  statLabel: {
    color: "#6c7a84",
    marginTop: 4,
    fontSize: 13,
  },
  actionsList: {
    gap: 6,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#f5fbff",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  actionLabel: {
    fontWeight: "600",
    color: "#0f1f2b",
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
