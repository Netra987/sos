import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import * as Location from "expo-location";
import { router } from "expo-router";
import API from "../services/api";

export default function Dashboard() {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return Alert.alert("Permission denied");
      const loc = await Location.getCurrentPositionAsync({});
      setLocation({ lat: loc.coords.latitude, lng: loc.coords.longitude });
    })();
  }, []);

  const sendSOS = async () => {
    if (!location) return Alert.alert("Location not available");
    try {
      await API.post("/sos", { latitude: location.lat, longitude: location.lng });
      setStatus("🚨 SOS Alert Sent!");
    } catch {
      setStatus("Failed to send alert");
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.profileBtn} onPress={() => router.push("/profile")}>
        <Text style={styles.profileText}>👤</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.sosBtn} onPress={sendSOS} activeOpacity={0.7}>
        <Text style={styles.sosText}>SOS</Text>
      </TouchableOpacity>
      <Text style={styles.label}>Send Emergency Alert</Text>
      {location && <Text style={styles.coords}>📍 {location.lat.toFixed(4)}, {location.lng.toFixed(4)}</Text>}
      {status && <Text style={styles.status}>{status}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" },
  profileBtn: { position: "absolute", top: 60, right: 24 },
  profileText: { fontSize: 28 },
  sosBtn: {
    width: 180, height: 180, borderRadius: 90, backgroundColor: "#DC2626",
    justifyContent: "center", alignItems: "center",
    shadowColor: "#DC2626", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.4, shadowRadius: 16, elevation: 10,
  },
  sosText: { color: "#fff", fontSize: 48, fontWeight: "bold" },
  label: { marginTop: 24, fontSize: 18, color: "#666" },
  coords: { marginTop: 12, fontSize: 14, color: "#999" },
  status: { marginTop: 20, fontSize: 16, fontWeight: "600", color: "#16A34A" },
});
