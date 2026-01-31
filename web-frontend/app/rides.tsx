import { useRouter } from "expo-router";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function RidesScreen() {
  const router = useRouter();
  const completedCount: number = 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <TouchableOpacity
            accessibilityRole="button"
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Text style={styles.backButtonIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.heroTitle}>My Rides</Text>
          <Text style={styles.heroSubtitle}>
            {completedCount} {completedCount === 1 ? "ride" : "rides"} completed
          </Text>
        </View>

        <View style={styles.emptyState}>
          <View style={styles.emptyIconWrapper}>
            <Text style={styles.emptyIcon}>📅</Text>
          </View>
          <Text style={styles.emptyTitle}>No Completed Rides</Text>
          <Text style={styles.emptySubtitle}>
            Finish a ride to start building your trip history and receipts.
          </Text>

          <TouchableOpacity
            style={styles.ctaButton}
            onPress={() => router.push("/")}
          >
            <Text style={styles.ctaButtonText}>Book Your First Ride</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f5fbff",
  },
  content: {
    paddingBottom: 32,
  },
  hero: {
    backgroundColor: "#00a86b",
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    paddingHorizontal: 20,
    paddingBottom: 32,
    paddingTop: 18,
    gap: 8,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.6)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  backButtonIcon: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  heroTitle: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "800",
  },
  heroSubtitle: {
    color: "#daf8ee",
    fontSize: 15,
  },
  emptyState: {
    alignItems: "center",
    paddingHorizontal: 32,
    paddingTop: 80,
    gap: 16,
  },
  emptyIconWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#e1fff0",
    alignItems: "center",
    justifyContent: "center",
  },
  emptyIcon: {
    fontSize: 42,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0f1f2b",
  },
  emptySubtitle: {
    fontSize: 15,
    color: "#5c6b7a",
    textAlign: "center",
  },
  ctaButton: {
    marginTop: 12,
    backgroundColor: "#02894b",
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 32,
    shadowColor: "#02894b",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 3,
  },
  ctaButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
