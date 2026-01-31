import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

export default function BookingScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ pickup?: string; dropoff?: string }>();
  const pickupLabel = params.pickup ?? "Not specified";
  const dropoffLabel = params.dropoff?.trim()
    ? params.dropoff
    : "Not specified";

  const [isComplete, setIsComplete] = useState(false);
  const driverProfile = {
    name: "Juan Dela Cruz",
    plate: "Honda TMX 155 • ABC 1234",
    rating: "★ 4.9",
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsComplete(true), 3500);
    return () => clearTimeout(timer);
  }, []);

  const statusLabel = useMemo(
    () => (isComplete ? "Driver confirmed!" : "Finding your rider…"),
    [isComplete],
  );

  const subLabel = isComplete
    ? "Your MotoRide partner is on the way."
    : "This usually takes less than a minute";

  const handleCancel = () => {
    router.replace("/home");
  };

  const handleStartRide = () => {
    router.push({
      pathname: "/ride-progress",
      params: {
        pickup: pickupLabel,
        dropoff: dropoffLabel,
      },
    } as const);
  };

  const handleCallDriver = () => {
    const href = `/call-driver?name=${encodeURIComponent(driverProfile.name)}`;
    router.push(href as never);
  };

  const handleMessageDriver = () => {
    const href = `/message-driver?name=${encodeURIComponent(driverProfile.name)}`;
    router.push(href as never);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.screen}>
        {isComplete ? (
          <>
            <View style={styles.arrivalMapCard}>
              <View style={styles.arrivalStatusBanner}>
                <Text style={styles.arrivalStatusTitle}>
                  Driver has arrived!
                </Text>
                <Text style={styles.arrivalStatusSubtitle}>
                  Please head to the pickup point
                </Text>
              </View>
              <View style={styles.mockMap}>
                <View style={[styles.mapDot, styles.mapDotPrimary]} />
                <View style={[styles.mapDot, styles.mapDotSecondary]} />
                <View style={[styles.mapDot, styles.mapDotAccent]} />
                <View style={styles.mapPin}>
                  <Text style={styles.mapPinLabel}>🛵</Text>
                </View>
              </View>
              <View style={styles.mapFooterRow}>
                <View>
                  <Text style={styles.mapFooterTitle}>
                    Mock Map View - For demo purposes
                  </Text>
                  <Text style={styles.mapFooterSubtitle}>
                    Replace with Google Maps API for production use
                  </Text>
                </View>
                <TouchableOpacity style={styles.mapActionButtonSmall}>
                  <Text style={styles.mapActionIcon}>➤</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.driverCard}>
              <View style={styles.driverAvatar}>
                <Text style={styles.driverAvatarInitials}>JD</Text>
              </View>
              <View style={styles.driverInfo}>
                <Text style={styles.driverName}>
                  {driverProfile.name}
                  <Text style={styles.driverRating}>
                    {" "}
                    {driverProfile.rating}
                  </Text>
                </Text>
                <Text style={styles.driverVehicle}>{driverProfile.plate}</Text>
                <Text style={styles.driverStatus}>Waiting for you</Text>
              </View>
            </View>

            <View style={styles.lookForCard}>
              <Text style={styles.lookForTitle}>Look for:</Text>
              <Text style={styles.lookForItem}>
                • Black helmet with red stripes
              </Text>
              <Text style={styles.lookForItem}>• Blue jacket</Text>
              <Text style={styles.lookForItem}>• Honda motorcycle</Text>
            </View>

            <View style={styles.actionRow}>
              <TouchableOpacity
                style={[styles.actionButton, styles.callButton]}
                onPress={handleCallDriver}
              >
                <Text style={styles.actionButtonText}>Call Driver</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.messageButton]}
                onPress={handleMessageDriver}
              >
                <Text style={styles.messageButtonText}>Message</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.pickupCard}>
              <Text style={styles.pickupLabel}>Pickup Location</Text>
              <Text style={styles.pickupValue}>{pickupLabel}</Text>
              <Text style={styles.pickupNote}>
                Main Entrance, near Starbucks
              </Text>
            </View>

            <TouchableOpacity
              style={styles.startRideButton}
              onPress={handleStartRide}
            >
              <Text style={styles.startRideText}>
                I'm on board - Start Ride
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <View style={styles.spinnerContainer}>
              <View
                style={[
                  styles.spinnerCircle,
                  isComplete && styles.spinnerCircleReady,
                ]}
              >
                <ActivityIndicator
                  size="large"
                  color="#fff"
                  animating={!isComplete}
                />
                {isComplete ? <Text style={styles.readyIcon}>✔</Text> : null}
              </View>
            </View>

            <View style={styles.statusContainer}>
              <Text style={styles.statusTitle}>{statusLabel}</Text>
              <Text style={styles.statusSubtitle}>{subLabel}</Text>
            </View>

            <View style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <View style={[styles.dot, styles.dotPickup]} />
                <View>
                  <Text style={styles.summaryLabel}>Pickup</Text>
                  <Text style={styles.summaryValue}>{pickupLabel}</Text>
                </View>
              </View>
              <View style={styles.summaryRow}>
                <View style={[styles.dot, styles.dotDropoff]} />
                <View>
                  <Text style={styles.summaryLabel}>Drop-off</Text>
                  <Text style={styles.summaryValue}>{dropoffLabel}</Text>
                </View>
              </View>
            </View>

            <View style={styles.metricsRow}>
              <View style={styles.metricBox}>
                <Text style={styles.metricValue}>₱50</Text>
                <Text style={styles.metricLabel}>Estimated fare</Text>
              </View>
              <View style={styles.metricDivider} />
              <View style={styles.metricBox}>
                <Text style={styles.metricValue}>~5 min</Text>
                <Text style={styles.metricLabel}>Estimated time</Text>
              </View>
            </View>

            <Pressable style={styles.cancelButton} onPress={handleCancel}>
              <Text style={styles.cancelText}>✕ Cancel Request</Text>
            </Pressable>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

type Styles = {
  safeArea: ViewStyle;
  screen: ViewStyle;
  spinnerContainer: ViewStyle;
  spinnerCircle: ViewStyle;
  spinnerCircleReady: ViewStyle;
  readyIcon: TextStyle;
  statusContainer: ViewStyle;
  statusTitle: TextStyle;
  statusSubtitle: TextStyle;
  summaryCard: ViewStyle;
  summaryRow: ViewStyle;
  dot: ViewStyle;
  dotPickup: ViewStyle;
  dotDropoff: ViewStyle;
  summaryLabel: TextStyle;
  summaryValue: TextStyle;
  metricsRow: ViewStyle;
  metricBox: ViewStyle;
  metricDivider: ViewStyle;
  metricValue: TextStyle;
  metricLabel: TextStyle;
  cancelButton: ViewStyle;
  cancelText: TextStyle;
  arrivalMapCard: ViewStyle;
  arrivalStatusBanner: ViewStyle;
  arrivalStatusTitle: TextStyle;
  arrivalStatusSubtitle: TextStyle;
  mockMap: ViewStyle;
  mapFooter: ViewStyle;
  mapDot: ViewStyle;
  mapDotPrimary: ViewStyle;
  mapDotSecondary: ViewStyle;
  mapDotAccent: ViewStyle;
  mapPin: ViewStyle;
  mapPinLabel: TextStyle;
  mapFooterRow: ViewStyle;
  mapFooterTitle: TextStyle;
  mapFooterSubtitle: TextStyle;
  mapActionButtonSmall: ViewStyle;
  mapActionIcon: TextStyle;
  driverCard: ViewStyle;
  driverAvatar: ViewStyle;
  driverAvatarInitials: TextStyle;
  driverInfo: ViewStyle;
  driverName: TextStyle;
  driverRating: TextStyle;
  driverVehicle: TextStyle;
  driverStatus: TextStyle;
  lookForCard: ViewStyle;
  lookForTitle: TextStyle;
  lookForItem: TextStyle;
  actionRow: ViewStyle;
  actionButton: ViewStyle;
  callButton: ViewStyle;
  messageButton: ViewStyle;
  actionButtonText: TextStyle;
  messageButtonText: TextStyle;
  pickupCard: ViewStyle;
  pickupLabel: TextStyle;
  pickupValue: TextStyle;
  pickupNote: TextStyle;
  startRideButton: ViewStyle;
  startRideText: TextStyle;
};

const styles = StyleSheet.create<Styles>({
  safeArea: {
    flex: 1,
    backgroundColor: "#fbfeff",
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
  screen: {
    flexGrow: 1,
    padding: 24,
    backgroundColor: "#fbfeff",
    gap: 24,
  },
  spinnerContainer: {
    alignItems: "center",
  },
  spinnerCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#06c167",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#06c167",
    shadowOpacity: 0.35,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
  },
  spinnerCircleReady: {
    backgroundColor: "#05a355",
  },
  readyIcon: {
    position: "absolute",
    fontSize: 36,
    color: "#fff",
    fontWeight: "700",
  },
  statusContainer: {
    alignItems: "center",
    gap: 6,
  },
  statusTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#031b2a",
  },
  statusSubtitle: {
    fontSize: 14,
    color: "#6c7c8c",
  },
  summaryCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 18,
    gap: 14,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  summaryRow: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  dotPickup: {
    backgroundColor: "#1fbe7c",
  },
  dotDropoff: {
    backgroundColor: "#ff6574",
  },
  summaryLabel: {
    fontSize: 13,
    color: "#7b8794",
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0f1f2b",
  },
  metricsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    backgroundColor: "#fff",
    borderRadius: 18,
    paddingVertical: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  metricBox: {
    alignItems: "center",
    flex: 1,
  },
  metricDivider: {
    width: 1,
    height: 32,
    backgroundColor: "#e0e6ed",
  },
  metricValue: {
    fontSize: 20,
    fontWeight: "700",
    color: "#008555",
  },
  metricLabel: {
    fontSize: 12,
    color: "#6c7c8c",
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: "#d8dde4",
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: "center",
  },
  cancelText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0d1f2a",
  },
  arrivalMapCard: {
    backgroundColor: "#e4fbf2",
    borderRadius: 24,
    padding: 16,
    gap: 12,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
  arrivalStatusBanner: {
    backgroundColor: "#06c167",
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 4,
  },
  arrivalStatusTitle: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 18,
  },
  arrivalStatusSubtitle: {
    color: "#ddf8ec",
    fontSize: 14,
  },
  mockMap: {
    height: 180,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
    backgroundColor: "#d3f4e5",
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  mapDot: {
    position: "absolute",
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  mapDotPrimary: {
    backgroundColor: "#0aa378",
    top: 40,
    left: 50,
  },
  mapDotSecondary: {
    backgroundColor: "#ffc53d",
    top: 110,
    right: 60,
  },
  mapDotAccent: {
    backgroundColor: "#2e89ff",
    bottom: 35,
    left: 120,
  },
  mapPin: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "#0aa378",
    alignItems: "center",
    justifyContent: "center",
  },
  mapPinLabel: {
    fontSize: 22,
  },
  mapFooterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  mapActionButtonSmall: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
  },
  mapActionIcon: {
    fontSize: 20,
    color: "#0b8f57",
  },
  driverCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    alignItems: "center",
    gap: 14,
    borderWidth: 1,
    borderColor: "#c4f2da",
  },
  driverAvatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "#11182b",
    alignItems: "center",
    justifyContent: "center",
  },
  driverAvatarInitials: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },
  driverInfo: {
    flex: 1,
  },
  driverName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#062e1f",
  },
  driverRating: {
    color: "#ffb703",
    fontSize: 14,
    fontWeight: "700",
  },
  driverVehicle: {
    color: "#5e7068",
    marginTop: 2,
  },
  driverStatus: {
    color: "#1fbe7c",
    fontWeight: "600",
    marginTop: 4,
  },
  lookForCard: {
    backgroundColor: "#fff8e7",
    borderRadius: 18,
    padding: 16,
    gap: 4,
    borderWidth: 1,
    borderColor: "#ffe2a9",
  },
  lookForTitle: {
    fontWeight: "700",
    color: "#4d3013",
    marginBottom: 4,
  },
  lookForItem: {
    color: "#4d3013",
  },
  actionRow: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1,
  },
  callButton: {
    backgroundColor: "#06c167",
    borderColor: "#06c167",
  },
  messageButton: {
    borderColor: "#06c167",
  },
  actionButtonText: {
    color: "#fff",
    fontWeight: "700",
  },
  messageButtonText: {
    color: "#06c167",
    fontWeight: "700",
  },
  pickupCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    gap: 4,
    borderWidth: 1,
    borderColor: "#e0e8f0",
  },
  pickupLabel: {
    fontSize: 13,
    color: "#6c7c8c",
  },
  pickupValue: {
    fontSize: 17,
    fontWeight: "700",
    color: "#062e1f",
  },
  pickupNote: {
    fontSize: 13,
    color: "#6c7c8c",
  },
  startRideButton: {
    backgroundColor: "#02894b",
    borderRadius: 20,
    paddingVertical: 18,
    alignItems: "center",
    marginTop: 4,
  },
  startRideText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
  },
});
