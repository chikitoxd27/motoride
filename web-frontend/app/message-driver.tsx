import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
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

type ChatEntry = {
  id: number;
  sender: "driver" | "rider";
  text: string;
};

export default function MessageDriverScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ name?: string }>();
  const driverName = params.name ?? "Your Driver";
  const [messageDraft, setMessageDraft] = useState("");
  const [messages, setMessages] = useState<ChatEntry[]>([
    {
      id: 1,
      sender: "driver",
      text: `Hi! I'm near the pickup spot. Let me know when you're ready.`,
    },
  ]);

  const handleSend = () => {
    const trimmed = messageDraft.trim();
    if (!trimmed) return;
    setMessages((prev) => [
      ...prev,
      { id: prev.length + 1, sender: "rider", text: trimmed },
    ]);
    setMessageDraft("");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>{driverName}</Text>
            <Text style={styles.headerSubtitle}>Driver chat</Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.messagesContainer}>
          {messages.map((entry) => (
            <View
              key={entry.id}
              style={[
                styles.messageBubble,
                entry.sender === "rider"
                  ? styles.messageBubbleRider
                  : styles.messageBubbleDriver,
              ]}
            >
              <Text
                style={
                  entry.sender === "rider"
                    ? styles.messageTextRider
                    : styles.messageTextDriver
                }
              >
                {entry.text}
              </Text>
            </View>
          ))}
        </ScrollView>

        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Type a message"
            placeholderTextColor="#8da0b4"
            value={messageDraft}
            onChangeText={setMessageDraft}
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f6fbff",
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 18,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e6edf5",
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#d8e2ef",
    alignItems: "center",
    justifyContent: "center",
  },
  backIcon: {
    fontSize: 18,
    color: "#123046",
    fontWeight: "700",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0a1d2f",
  },
  headerSubtitle: {
    fontSize: 13,
    color: "#708399",
  },
  messagesContainer: {
    padding: 20,
    gap: 10,
  },
  messageBubble: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 16,
    maxWidth: "85%",
  },
  messageBubbleDriver: {
    alignSelf: "flex-start",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#dbe6f2",
  },
  messageBubbleRider: {
    alignSelf: "flex-end",
    backgroundColor: "#06c167",
  },
  messageTextDriver: {
    color: "#102437",
  },
  messageTextRider: {
    color: "#fff",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e6edf5",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#d5e2f0",
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#0a1d2f",
  },
  sendButton: {
    backgroundColor: "#06c167",
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  sendButtonText: {
    color: "#fff",
    fontWeight: "700",
  },
});
