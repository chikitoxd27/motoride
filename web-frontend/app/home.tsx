import { Link, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

type RideForm = {
  pickup: string;
  dropoff: string;
};

const createInitialForm = (): RideForm => ({
  pickup: "City of San Fernando, La Union",
  dropoff: "",
});

export default function HomeScreen() {
  const router = useRouter();
  const [form, setForm] = useState(createInitialForm());
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canSubmit = useMemo(() => {
    const hasPickup = form.pickup.trim().length > 0;
    const hasDropoff = form.dropoff.trim().length > 0;
    return hasPickup && hasDropoff;
  }, [form.pickup, form.dropoff]);

  const handleBookRide = async () => {
    if (!canSubmit || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      router.push({
        pathname: "/booking",
        params: {
          pickup: form.pickup,
          dropoff: form.dropoff || "",
        },
      } as const);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 16 : 0}
      >
        <ScrollView
          style={styles.screen}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.topBar}>
            <View>
              <Text style={styles.topBarTitle}>MotoRide</Text>
              <Text style={styles.topBarSubtitle}>
                Where are we heading today?
              </Text>
            </View>
            <Link href={{ pathname: "/profile" }} asChild>
              <TouchableOpacity style={styles.profileButton}>
                <Text style={styles.profileInitials}>JD</Text>
              </TouchableOpacity>
            </Link>
          </View>
          <View style={styles.mapCard}>
            <View style={styles.mapHeader}>
              <View>
                <Text style={styles.mapLocationTitle}>La Union Province</Text>
                <Text style={styles.mapLocationSubtitle}>San Fernando</Text>
              </View>
              <TouchableOpacity style={styles.mapActionButton}>
                <Text style={styles.mapActionIcon}>➤</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.mockMap}>
              <View style={[styles.mapDot, styles.mapDotPrimary]} />
              <View style={[styles.mapDot, styles.mapDotSecondary]} />
              <View style={[styles.mapDot, styles.mapDotAccent]} />
              <View style={styles.mapPin}>
                <Text style={styles.mapPinLabel}>🚦</Text>
              </View>
            </View>
            <View style={styles.mapFooter}>
              <Text style={styles.mapFooterTitle}>
                Mock Map View - For demo purposes
              </Text>
              <Text style={styles.mapFooterSubtitle}>
                Replace with Google Maps API for production use
              </Text>
            </View>
          </View>

          <View style={styles.formCard}>
            <View style={styles.locationRow}>
              <View style={[styles.locationIcon, styles.pickupIcon]} />
              <TextInput
                style={styles.locationInput}
                value={form.pickup}
                onChangeText={(pickup) =>
                  setForm((prev) => ({ ...prev, pickup }))
                }
                placeholder="Pickup"
                placeholderTextColor="#b2bbc9"
              />
            </View>
            <View style={styles.locationRow}>
              <View style={[styles.locationIcon, styles.dropoffIcon]} />
              <TextInput
                style={styles.locationInput}
                value={form.dropoff}
                onChangeText={(dropoff) =>
                  setForm((prev) => ({ ...prev, dropoff }))
                }
                placeholder="Where to?"
                placeholderTextColor="#b2bbc9"
              />
            </View>
          </View>

          <View style={styles.rideCard}>
            <View style={styles.rideIconContainer}>
              <Text style={styles.rideIcon}>🛵</Text>
            </View>
            <View style={styles.rideInfo}>
              <Text style={styles.rideName}>MotoRide</Text>
              <Text style={styles.rideEta}>2 min away</Text>
            </View>
            <View style={styles.rideFare}>
              <Text style={styles.rideFareAmount}>₱50</Text>
              <Text style={styles.rideFareLabel}>base fare</Text>
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.bookButton,
              (!canSubmit || isSubmitting) && styles.bookButtonDisabled,
            ]}
            disabled={!canSubmit || isSubmitting}
            onPress={handleBookRide}
          >
            <Text style={styles.bookButtonText}>
              {isSubmitting ? "Booking…" : "Book MotoRide"}
            </Text>
          </TouchableOpacity>

          <View style={styles.bottomMenu}>
            <Link href={{ pathname: "/schedule" }} asChild>
              <TouchableOpacity style={styles.bottomMenuItem}>
                <Text style={styles.bottomMenuIcon}>🗓️</Text>
                <Text style={styles.bottomMenuLabel}>Schedule</Text>
              </TouchableOpacity>
            </Link>
            <Link href={{ pathname: "/rides" }} asChild>
              <TouchableOpacity style={styles.bottomMenuItem}>
                <Text style={styles.bottomMenuIcon}>🧍</Text>
                <Text style={styles.bottomMenuLabel}>My Rides</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

type Styles = {
  safeArea: ViewStyle;
  keyboardContainer: ViewStyle;
  screen: ViewStyle;
  scrollContent: ViewStyle;
  topBar: ViewStyle;
  topBarTitle: TextStyle;
  topBarSubtitle: TextStyle;
  profileButton: ViewStyle;
  profileInitials: TextStyle;
  mapCard: ViewStyle;
  mapHeader: ViewStyle;
  mapLocationTitle: TextStyle;
  mapLocationSubtitle: TextStyle;
  mapActionButton: ViewStyle;
  mapActionIcon: TextStyle;
  mockMap: ViewStyle;
  mapDot: ViewStyle;
  mapDotPrimary: ViewStyle;
  mapDotSecondary: ViewStyle;
  mapDotAccent: ViewStyle;
  mapPin: ViewStyle;
  mapPinLabel: TextStyle;
  mapFooter: ViewStyle;
  mapFooterTitle: TextStyle;
  mapFooterSubtitle: TextStyle;
  formCard: ViewStyle;
  locationRow: ViewStyle;
  locationIcon: ViewStyle;
  pickupIcon: ViewStyle;
  dropoffIcon: ViewStyle;
  locationInput: TextStyle;
  rideCard: ViewStyle;
  rideIconContainer: ViewStyle;
  rideIcon: TextStyle;
  rideInfo: ViewStyle;
  rideName: TextStyle;
  rideEta: TextStyle;
  rideFare: ViewStyle;
  rideFareAmount: TextStyle;
  rideFareLabel: TextStyle;
  bookButton: ViewStyle;
  bookButtonDisabled: ViewStyle;
  bookButtonText: TextStyle;
  bottomMenu: ViewStyle;
  bottomMenuItem: ViewStyle;
  bottomMenuIcon: TextStyle;
  bottomMenuLabel: TextStyle;
};

const styles = StyleSheet.create<Styles>({
  safeArea: {
    flex: 1,
    backgroundColor: "#f5fbff",
  },
  keyboardContainer: {
    flex: 1,
  },
  screen: {
    flex: 1,
    backgroundColor: "#f5fbff",
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 32,
    gap: 16,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  topBarTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#062015",
  },
  topBarSubtitle: {
    fontSize: 14,
    color: "#4d6c62",
    marginTop: 4,
  },
  profileButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#02894b",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#02894b",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  profileInitials: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 18,
  },
  mapCard: {
    backgroundColor: "#e4fbf2",
    borderRadius: 24,
    padding: 18,
    gap: 14,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  mapHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  mapLocationTitle: {
    fontSize: 14,
    color: "#1f513a",
    fontWeight: "600",
  },
  mapLocationSubtitle: {
    fontSize: 16,
    color: "#1f513a",
    fontWeight: "700",
  },
  mapActionButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  mapActionIcon: {
    fontSize: 20,
    color: "#0b8f57",
  },
  mockMap: {
    height: 160,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
    backgroundColor: "#d3f4e5",
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  mapDot: {
    position: "absolute",
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  mapDotPrimary: {
    backgroundColor: "#0aa378",
    top: 32,
    left: 60,
  },
  mapDotSecondary: {
    backgroundColor: "#ffc53d",
    top: 90,
    right: 50,
  },
  mapDotAccent: {
    backgroundColor: "#2e89ff",
    bottom: 30,
    left: 120,
  },
  mapPin: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#0aa378",
    alignItems: "center",
    justifyContent: "center",
  },
  mapPinLabel: {
    fontSize: 20,
    color: "#fff",
  },
  mapFooter: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 12,
    gap: 4,
  },
  mapFooterTitle: {
    fontSize: 14,
    color: "#163126",
    fontWeight: "600",
  },
  mapFooterSubtitle: {
    fontSize: 12,
    color: "#7d8a84",
  },
  formCard: {
    backgroundColor: "#fdfefe",
    borderRadius: 18,
    padding: 16,
    gap: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: "#edf1f4",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#fff",
  },
  locationIcon: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  pickupIcon: {
    backgroundColor: "#1fbe7c",
  },
  dropoffIcon: {
    backgroundColor: "#ff6574",
  },
  locationInput: {
    flex: 1,
    fontSize: 16,
    color: "#162029",
    fontWeight: "500",
  },
  rideCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e4fbf2",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#b1f1d5",
    gap: 14,
  },
  rideIconContainer: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "#ffe9ef",
    alignItems: "center",
    justifyContent: "center",
  },
  rideIcon: {
    fontSize: 24,
  },
  rideInfo: {
    flex: 1,
  },
  rideName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#103d2b",
  },
  rideEta: {
    color: "#4d6c62",
    fontSize: 14,
  },
  rideFare: {
    alignItems: "flex-end",
  },
  rideFareAmount: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0f8b54",
  },
  rideFareLabel: {
    color: "#5c746b",
    fontSize: 12,
  },
  bookButton: {
    backgroundColor: "#02894b",
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: "center",
    shadowColor: "#02894b",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 3,
  },
  bookButtonDisabled: {
    opacity: 0.6,
  },
  bookButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  bottomMenu: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    paddingTop: 4,
  },
  bottomMenuItem: {
    alignItems: "center",
    gap: 6,
  },
  bottomMenuIcon: {
    fontSize: 22,
  },
  bottomMenuLabel: {
    fontSize: 13,
    color: "#56616e",
    fontWeight: "600",
  },
});
