import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function RideProgressScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ pickup?: string; dropoff?: string }>();
  const pickup = params.pickup ?? "SM City Manila";
  const dropoff = params.dropoff?.trim()
    ? params.dropoff
    : "Quezon City Circle";
  const [isArrivedModalVisible, setIsArrivedModalVisible] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleCompleteRide = () => {
    if (isArrivedModalVisible) return;
    setIsArrivedModalVisible(true);
    timeoutRef.current = setTimeout(() => {
      setIsArrivedModalVisible(false);
      router.replace({
        pathname: "/trip-complete",
        params: {
          pickup,
          dropoff,
        },
      } as const);
    }, 1200);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.screen}>
        <View style={styles.mapCard}>
          <View style={styles.mapHeader}>
            <View>
              <Text style={styles.locationTitle}>La Union Province</Text>
              <Text style={styles.locationSubtitle}>San Fernando</Text>
            </View>
            <View style={styles.destinationPill}>
              <Text style={styles.destinationTime}>8 min</Text>
              <Text style={styles.destinationLabel}>to destination</Text>
            </View>
          </View>

          <View style={styles.mockMap}>
            <View style={[styles.mapDot, styles.mapDotPrimary]} />
            <View style={[styles.mapDot, styles.mapDotSecondary]} />
            <View style={[styles.mapDot, styles.mapDotAccent]} />
            <View style={styles.mapRoute} />
            <View style={[styles.mapPin, styles.mapPinStart]}>
              <Text style={styles.mapPinText}>F</Text>
            </View>
            <View style={[styles.mapPin, styles.mapPinEnd]}>
              <Text style={styles.mapPinText}>D</Text>
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

        <View style={styles.driverCard}>
          <View style={styles.driverAvatar}>
            <Text style={styles.driverAvatarInitials}>JD</Text>
          </View>
          <View style={styles.driverInfo}>
            <Text style={styles.driverName}>
              Juan Dela Cruz <Text style={styles.driverRating}>★ 4.9</Text>
            </Text>
            <Text style={styles.driverVehicle}>Honda TMX 155 • ABC 1234</Text>
            <Text style={styles.driverStatus}>On the way to pick you up</Text>
          </View>
        </View>

        <View style={styles.routeCard}>
          <View style={styles.routeRow}>
            <Text style={[styles.routeLabel, styles.pickupDot]}>Pickup</Text>
            <View style={styles.routeDetail}>
              <Text style={styles.routeLocation}>{pickup}</Text>
              <Text style={styles.routeMeta}>3 min</Text>
            </View>
          </View>
          <View style={styles.routeDivider} />
          <View style={styles.routeRow}>
            <Text style={[styles.routeLabel, styles.dropoffDot]}>Drop-off</Text>
            <View style={styles.routeDetail}>
              <Text style={styles.routeLocation}>{dropoff}</Text>
              <Text style={styles.routeMeta}>~15 min</Text>
            </View>
          </View>
        </View>

        <View style={styles.fareCard}>
          <Text style={styles.fareLabel}>Estimated Fare</Text>
          <Text style={styles.fareValue}>₱120</Text>
        </View>

        <TouchableOpacity
          style={styles.completeButton}
          onPress={handleCompleteRide}
        >
          <Text style={styles.completeText}>Complete Ride</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal transparent visible={isArrivedModalVisible} animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.arrivedCard}>
            <View style={styles.arrivedIconCircle}>
              <Text style={styles.arrivedIcon}>✔</Text>
            </View>
            <Text style={styles.arrivedTitle}>You've Arrived!</Text>
            <Text style={styles.arrivedSubtitle}>{dropoff}</Text>
          </View>
        </View>
      </Modal>
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
  mapCard: {
    backgroundColor: "#e4fbf2",
    borderRadius: 24,
    padding: 16,
    gap: 12,
  },
  mapHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  locationTitle: {
    fontSize: 14,
    color: "#1f513a",
    fontWeight: "600",
  },
  locationSubtitle: {
    fontSize: 16,
    color: "#1f513a",
    fontWeight: "700",
  },
  destinationPill: {
    backgroundColor: "#fff",
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: "center",
  },
  destinationTime: {
    fontSize: 18,
    fontWeight: "800",
    color: "#02894b",
  },
  destinationLabel: {
    fontSize: 12,
    color: "#5a6c64",
  },
  mockMap: {
    height: 200,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
    backgroundColor: "#d3f4e5",
    overflow: "hidden",
    position: "relative",
  },
  mapDot: {
    position: "absolute",
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  mapDotPrimary: {
    backgroundColor: "#0aa378",
    top: 60,
    left: 60,
  },
  mapDotSecondary: {
    backgroundColor: "#ffc53d",
    top: 110,
    right: 70,
  },
  mapDotAccent: {
    backgroundColor: "#2e89ff",
    bottom: 30,
    left: 140,
  },
  mapRoute: {
    position: "absolute",
    top: 80,
    left: 70,
    right: 80,
    height: 2,
    backgroundColor: "#33c48d",
    transform: [{ rotate: "-10deg" }],
  },
  mapPin: {
    position: "absolute",
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#0aa378",
    alignItems: "center",
    justifyContent: "center",
  },
  mapPinStart: {
    top: 90,
    left: 40,
  },
  mapPinEnd: {
    top: 60,
    right: 40,
    backgroundColor: "#ff6574",
  },
  mapPinText: {
    color: "#fff",
    fontWeight: "700",
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
  driverCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    flexDirection: "row",
    gap: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#c4f2da",
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
  routeCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: "#e0e8f0",
  },
  routeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  routeLabel: {
    fontWeight: "600",
  },
  pickupDot: {
    color: "#1fbe7c",
  },
  dropoffDot: {
    color: "#ff6574",
  },
  routeDetail: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  routeLocation: {
    fontSize: 16,
    color: "#062e1f",
  },
  routeMeta: {
    color: "#5e7068",
  },
  routeDivider: {
    height: 1,
    backgroundColor: "#eef0f4",
  },
  fareCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#e0e8f0",
  },
  fareLabel: {
    color: "#5e5f6a",
    fontWeight: "600",
  },
  fareValue: {
    fontSize: 20,
    fontWeight: "700",
    color: "#02894b",
  },
  completeButton: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#d8dde4",
    paddingVertical: 16,
    alignItems: "center",
  },
  completeText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0d1f2a",
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  arrivedCard: {
    width: "100%",
    borderRadius: 28,
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: "center",
    gap: 10,
    backgroundColor: "#00a86b",
  },
  arrivedIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  arrivedIcon: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "700",
  },
  arrivedTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "800",
  },
  arrivedSubtitle: {
    color: "#f1fff8",
    fontSize: 14,
  },
});
