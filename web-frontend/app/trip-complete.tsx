import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function TripCompleteScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ pickup?: string; dropoff?: string }>();
  const pickup = params.pickup ?? "SM City Manila";
  const dropoff = params.dropoff ?? "Quezon City Circle";
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.screen}>
        <View style={styles.heroCard}>
          <View style={styles.heroIconCircle}>
            <Text style={styles.heroIcon}>✔</Text>
          </View>
          <Text style={styles.heroTitle}>Trip Complete!</Text>
          <Text style={styles.heroSubtitle}>Thanks for riding with us</Text>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Total Fare</Text>
          <Text style={styles.summaryValue}>₱120</Text>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryItemLabel}>Base fare</Text>
            <Text style={styles.summaryItemValue}>₱50</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryItemLabel}>Distance (5.2 km)</Text>
            <Text style={styles.summaryItemValue}>₱65</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryItemLabel}>Time (15 min)</Text>
            <Text style={styles.summaryItemValue}>₱5</Text>
          </View>
        </View>

        <View style={styles.routeCard}>
          <View style={styles.routeSection}>
            <View style={[styles.dot, styles.pickupDot]} />
            <View style={styles.routeTextGroup}>
              <Text style={styles.routeLabel}>Pickup</Text>
              <Text style={styles.routeLocation}>{pickup}</Text>
            </View>
            <Text style={styles.routeTime}>2:30 PM</Text>
          </View>
          <View style={styles.routeDivider} />
          <View style={styles.routeSection}>
            <View style={[styles.dot, styles.dropoffDot]} />
            <View style={styles.routeTextGroup}>
              <Text style={styles.routeLabel}>Drop-off</Text>
              <Text style={styles.routeLocation}>{dropoff}</Text>
            </View>
            <Text style={styles.routeTime}>2:45 PM</Text>
          </View>
        </View>

        <View style={styles.driverCard}>
          <View style={styles.driverAvatar}>
            <Text style={styles.driverAvatarInitials}>JD</Text>
          </View>
          <View>
            <Text style={styles.driverName}>Juan Dela Cruz</Text>
            <Text style={styles.driverRole}>Your rider</Text>
          </View>
        </View>

        <View style={styles.ratingCard}>
          <Text style={styles.ratingTitle}>Rate your driver</Text>
          <Text style={styles.ratingSubtitle}>
            Your feedback helps us keep every MotoRide experience awesome.
          </Text>
          <View style={styles.starRow}>
            {[1, 2, 3, 4, 5].map((value) => (
              <Pressable
                key={value}
                style={styles.starButton}
                onPress={() => setRating(value)}
                accessibilityRole="button"
                accessibilityLabel={`${value} star${value > 1 ? "s" : ""}`}
              >
                <Text
                  style={[
                    styles.star,
                    rating >= value ? styles.starActive : styles.starInactive,
                  ]}
                >
                  ★
                </Text>
              </Pressable>
            ))}
          </View>
          <TextInput
            style={styles.feedbackInput}
            placeholder="Share more about your ride (optional)"
            placeholderTextColor="#8a97a4"
            multiline
            value={feedback}
            onChangeText={setFeedback}
          />
          <TouchableOpacity
            style={styles.submitRatingButton}
            onPress={() => router.replace("/home")}
            disabled={!rating}
          >
            <Text style={styles.submitRatingText}>
              {rating ? "Submit rating" : "Tap a star to rate"}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => router.replace("/home")}
        >
          <Text style={styles.primaryButtonText}>Book Another Ride</Text>
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
  screen: {
    padding: 20,
    gap: 18,
  },
  heroCard: {
    backgroundColor: "#00a86b",
    borderRadius: 28,
    paddingVertical: 30,
    alignItems: "center",
    gap: 10,
  },
  heroIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  heroIcon: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "800",
  },
  heroTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "800",
  },
  heroSubtitle: {
    color: "#e7fff3",
    fontSize: 14,
  },
  summaryCard: {
    backgroundColor: "#e1ffef",
    borderRadius: 20,
    padding: 16,
    gap: 10,
    borderWidth: 1,
    borderColor: "#b7f3d1",
  },
  summaryLabel: {
    color: "#176745",
    fontSize: 14,
  },
  summaryValue: {
    fontSize: 32,
    fontWeight: "800",
    color: "#02894b",
  },
  summaryDivider: {
    height: 1,
    backgroundColor: "#c6eed8",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  summaryItemLabel: {
    color: "#386152",
  },
  summaryItemValue: {
    color: "#1f2c26",
    fontWeight: "600",
  },
  routeCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: "#e0e8f0",
  },
  routeSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  pickupDot: {
    backgroundColor: "#1fbe7c",
  },
  dropoffDot: {
    backgroundColor: "#ff6574",
  },
  routeTextGroup: {
    flex: 1,
  },
  routeLabel: {
    color: "#7e8b9c",
    fontSize: 13,
  },
  routeLocation: {
    color: "#101b26",
    fontWeight: "700",
  },
  routeTime: {
    color: "#4e5c68",
  },
  routeDivider: {
    height: 1,
    backgroundColor: "#eef0f4",
  },
  driverCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    flexDirection: "row",
    gap: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#dfe7ef",
  },
  driverAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#11182b",
    alignItems: "center",
    justifyContent: "center",
  },
  driverAvatarInitials: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },
  driverName: {
    color: "#111b24",
    fontSize: 18,
    fontWeight: "700",
  },
  driverRole: {
    color: "#6d7b8a",
  },
  ratingCard: {
    backgroundColor: "#fff",
    borderRadius: 22,
    padding: 18,
    gap: 12,
    borderWidth: 1,
    borderColor: "#e4ecf3",
  },
  ratingTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#041724",
  },
  ratingSubtitle: {
    color: "#6c7c8b",
    fontSize: 13,
    lineHeight: 18,
  },
  starRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  starButton: {
    flex: 1,
    alignItems: "center",
  },
  star: {
    fontSize: 32,
  },
  starActive: {
    color: "#f4b400",
  },
  starInactive: {
    color: "#d4dde6",
  },
  feedbackInput: {
    borderWidth: 1,
    borderColor: "#dbe4ed",
    borderRadius: 18,
    padding: 14,
    minHeight: 90,
    textAlignVertical: "top",
    fontSize: 14,
    color: "#041724",
    backgroundColor: "#f8fbff",
  },
  submitRatingButton: {
    marginTop: 4,
    paddingVertical: 14,
    borderRadius: 18,
    backgroundColor: "#02894b",
    alignItems: "center",
    opacity: 1,
  },
  submitRatingText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  primaryButton: {
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#06c167",
    paddingVertical: 15,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#06c167",
    fontSize: 16,
    fontWeight: "700",
  },
});
