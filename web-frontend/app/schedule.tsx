import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const CUSTOM_DATE = "Custom date";
const CUSTOM_TIME = "Custom time";

const dateOptions = [
  { label: "Today" },
  { label: "Tomorrow" },
  { label: "Mon, Feb 2" },
  { label: "Tue, Feb 3" },
  { label: "Wed, Feb 4" },
  { label: "Thu, Feb 5" },
  { label: "Fri, Feb 6" },
  { label: CUSTOM_DATE },
];

const timeSlots = [
  "8:00 AM",
  "10:30 AM",
  "1:00 PM",
  "3:30 PM",
  "6:00 PM",
  CUSTOM_TIME,
];

export default function ScheduleScreen() {
  const router = useRouter();
  const [pickup, setPickup] = useState("City of San Fernando, La Union");
  const [dropoff, setDropoff] = useState("");
  const [selectedDate, setSelectedDate] = useState(dateOptions[0].label);
  const [customDateChoice, setCustomDateChoice] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState(timeSlots[2]);
  const [customTimeChoice, setCustomTimeChoice] = useState<string | null>(null);
  const [notes, setNotes] = useState("");

  const upcomingCustomDates = useMemo(() => {
    return Array.from({ length: 10 }).map((_, index) => {
      const date = new Date();
      date.setDate(date.getDate() + index + 1);
      return date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      });
    });
  }, []);

  const customTimeSlots = useMemo(() => {
    const slots: string[] = [];
    for (let hour = 6; hour <= 22; hour++) {
      for (const minute of [0, 30]) {
        if (hour === 22 && minute > 0) continue;
        const date = new Date();
        date.setHours(hour, minute, 0, 0);
        slots.push(
          date.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
          }),
        );
      }
    }
    return slots;
  }, []);

  const canSubmit = useMemo(() => {
    const hasRoute = pickup.trim().length > 0 && dropoff.trim().length > 0;
    const hasDate = selectedDate !== CUSTOM_DATE ? true : !!customDateChoice;
    const hasTime = selectedTime !== CUSTOM_TIME ? true : !!customTimeChoice;
    return hasRoute && hasDate && hasTime;
  }, [
    pickup,
    dropoff,
    selectedDate,
    customDateChoice,
    selectedTime,
    customTimeChoice,
  ]);

  const handleScheduleRide = () => {
    if (!canSubmit) {
      Alert.alert("Missing info", "Enter pickup and drop-off details.");
      return;
    }

    const dateLabel =
      selectedDate === CUSTOM_DATE && customDateChoice
        ? customDateChoice
        : selectedDate;
    const timeLabel =
      selectedTime === CUSTOM_TIME && customTimeChoice
        ? customTimeChoice
        : selectedTime;

    Alert.alert(
      "Ride scheduled",
      `${dateLabel} at ${timeLabel}\n${pickup} → ${dropoff}`,
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 80}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          stickyHeaderIndices={[0]}
          bounces={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.hero}>
            <TouchableOpacity
              accessibilityRole="button"
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <Text style={styles.backButtonIcon}>←</Text>
            </TouchableOpacity>
            <Text style={styles.heroTitle}>Schedule a Ride</Text>
            <Text style={styles.heroSubtitle}>Book your ride in advance</Text>
          </View>

          <View style={styles.sectionWrapper}>
            <Text style={styles.sectionTitle}>Route Details</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Pickup Location</Text>
              <View style={styles.inputRow}>
                <View style={styles.pickupDot} />
                <TextInput
                  style={styles.input}
                  value={pickup}
                  onChangeText={setPickup}
                  placeholder="Enter pickup"
                  placeholderTextColor="#a7b3c2"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Drop-off Location</Text>
              <View style={styles.inputRow}>
                <View style={styles.dropoffDot} />
                <TextInput
                  style={styles.input}
                  value={dropoff}
                  onChangeText={setDropoff}
                  placeholder="Enter destination"
                  placeholderTextColor="#a7b3c2"
                />
              </View>
            </View>
          </View>

          <View style={styles.sectionWrapper}>
            <Text style={styles.sectionTitle}>Select Date</Text>
            <View style={styles.chipGrid}>
              {dateOptions.map((option) => (
                <TouchableOpacity
                  key={option.label}
                  style={[
                    styles.chip,
                    selectedDate === option.label && styles.chipSelected,
                  ]}
                  onPress={() => setSelectedDate(option.label)}
                >
                  <Text
                    style={[
                      styles.chipLabel,
                      selectedDate === option.label && styles.chipLabelSelected,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {selectedDate === CUSTOM_DATE ? (
              <View style={styles.customPicker}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {upcomingCustomDates.map((label) => (
                    <TouchableOpacity
                      key={label}
                      style={[
                        styles.chip,
                        customDateChoice === label && styles.chipSelected,
                      ]}
                      onPress={() => setCustomDateChoice(label)}
                    >
                      <Text
                        style={[
                          styles.chipLabel,
                          customDateChoice === label &&
                            styles.chipLabelSelected,
                        ]}
                      >
                        {label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            ) : null}
          </View>

          <View style={styles.sectionWrapper}>
            <Text style={styles.sectionTitle}>Select Time</Text>
            <View style={styles.chipGrid}>
              {timeSlots.map((slot) => (
                <TouchableOpacity
                  key={slot}
                  style={[
                    styles.chip,
                    selectedTime === slot && styles.chipSelected,
                  ]}
                  onPress={() => setSelectedTime(slot)}
                >
                  <Text
                    style={[
                      styles.chipLabel,
                      selectedTime === slot && styles.chipLabelSelected,
                    ]}
                  >
                    {slot}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {selectedTime === CUSTOM_TIME ? (
              <View style={styles.customPicker}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {customTimeSlots.map((slot) => (
                    <TouchableOpacity
                      key={slot}
                      style={[
                        styles.chip,
                        customTimeChoice === slot && styles.chipSelected,
                      ]}
                      onPress={() => setCustomTimeChoice(slot)}
                    >
                      <Text
                        style={[
                          styles.chipLabel,
                          customTimeChoice === slot && styles.chipLabelSelected,
                        ]}
                      >
                        {slot}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            ) : null}
          </View>

          <View style={[styles.sectionWrapper, styles.notesSection]}>
            <Text style={styles.sectionTitle}>Notes for driver</Text>
            <TextInput
              style={[styles.textArea, styles.input]}
              value={notes}
              onChangeText={setNotes}
              placeholder="Optional instructions (e.g. gate code, meet-up spot)"
              placeholderTextColor="#6d7b8c"
              multiline
            />
          </View>

          <TouchableOpacity
            style={[
              styles.primaryButton,
              !canSubmit && styles.primaryButtonDisabled,
            ]}
            disabled={!canSubmit}
            onPress={handleScheduleRide}
          >
            <Text style={styles.primaryButtonText}>Schedule Ride</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f5fbff",
  },
  keyboardView: {
    flex: 1,
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
  sectionWrapper: {
    paddingHorizontal: 20,
    gap: 14,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111c27",
  },
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    color: "#6d7b8c",
    fontWeight: "600",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#f2f4f7",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
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
  input: {
    flex: 1,
    fontSize: 16,
    color: "#0f1724",
  },
  customInput: {
    backgroundColor: "#f2f4f7",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginTop: 6,
  },
  chipGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  chip: {
    borderWidth: 1,
    borderColor: "#e0e8f0",
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 18,
    minWidth: 110,
    alignItems: "center",
  },
  chipSelected: {
    borderColor: "#21c78f",
    backgroundColor: "#e8fff5",
  },
  chipLabel: {
    color: "#5f6b7c",
    fontWeight: "600",
  },
  chipLabelSelected: {
    color: "#04a06d",
  },
  customPicker: {
    marginTop: 8,
  },
  textArea: {
    minHeight: 90,
    textAlignVertical: "top",
    borderWidth: 1,
    borderColor: "#d7e1ec",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 14,
    backgroundColor: "#fff",
  },
  notesSection: {
    marginBottom: 20,
  },
  primaryButton: {
    marginHorizontal: 20,
    backgroundColor: "#7fdcaf",
    borderRadius: 22,
    paddingVertical: 16,
    alignItems: "center",
  },
  primaryButtonDisabled: {
    opacity: 0.5,
  },
  primaryButtonText: {
    color: "#0d3826",
    fontSize: 16,
    fontWeight: "700",
  },
});
