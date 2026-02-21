import { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import API from "../services/api";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Dashboard() {
  const router = useRouter();
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getLocation();
  }, []);

  const getLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Location permission required");
      return;
    }

    const loc = await Location.getCurrentPositionAsync({});
    setLocation({ lat: loc.coords.latitude, lng: loc.coords.longitude });
  };

  const sendSOS = async () => {
    if (!location) return Alert.alert("Fetching location...");

    try {
      setLoading(true);
      setStatus("");

      await API.post("/sos", {
        latitude: location.lat,
        longitude: location.lng,
      });

      setStatus("🚨 Emergency Alert Sent Successfully");
    } catch (err) {
      setStatus("⚠️ Failed to send alert");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.push("/profile")}>
          <Text style={styles.profileIcon}>👤</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.centerContent}>
        <TouchableOpacity
          style={styles.sosBtn}
          onPress={sendSOS}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="large" />
          ) : (
            <Text style={styles.sosText}>SOS</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.label}>Tap to Send Emergency Alert</Text>

        {location && (
          <Text style={styles.coords}>
            📍 {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
          </Text>
        )}

        {status ? <Text style={styles.status}>{status}</Text> : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  profileIcon: {
    fontSize: 28,
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  sosBtn: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "#DC2626",
    justifyContent: "center",
    alignItems: "center",
    elevation: 12,
  },
  sosText: {
    color: "#fff",
    fontSize: 50,
    fontWeight: "bold",
  },
  label: {
    marginTop: 25,
    fontSize: 18,
    color: "#666",
  },
  coords: {
    marginTop: 10,
    fontSize: 14,
    color: "#888",
  },
  status: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: "600",
    color: "#16A34A",
    textAlign: "center",
    paddingHorizontal: 20,
  },
});