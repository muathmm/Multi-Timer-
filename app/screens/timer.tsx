import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import DraggableFlatList, { RenderItemParams } from "react-native-draggable-flatlist";
import { Swipeable } from "react-native-gesture-handler";
import { useTimers } from "../../context/TimerContext";
import AddTimerModal from "../components/AddTimerModal";
import TimerCard from "../components/TimerCards";
import TipModal from "../components/TipModal";

const { width } = Dimensions.get("window");

const TIPS = [
  { id: "1", title: "Drink Water", short: "Stay hydrated", img: require("../../assets/images/2.png"), full: "Drink 8 glasses of water daily for better health.", emoji: "💧" },
  { id: "2", title: "Breathe Deeply", short: "Reduce stress", img: require("../../assets/images/1.png"), full: "Practice deep breathing 5 minutes daily to relax.", emoji: "🌬️" },
  { id: "3", title: "Stretch Often", short: "Boost circulation", img: require("../../assets/images/3.png"), full: "Stretch every hour to avoid stiffness.", emoji: "🧘‍♂️" },
];

export default function TimersScreen() {
  const { timers, addTimer, startTimer, pauseTimer, deleteTimer, resetTimer, now, reorderTimers } = useTimers();
  const [tipModalVisible, setTipModalVisible] = useState(false);
  const [selectedTip, setSelectedTip] = useState<any>(null);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  const pulse = useMemo(() => new Animated.Value(1), []);

  Animated.loop(
    Animated.sequence([
      Animated.timing(pulse, { toValue: 1.08, duration: 700, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      Animated.timing(pulse, { toValue: 1.0, duration: 700, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
    ])
  ).start();

  const handleAddTimer = (label: string, secs: number, options: any) => addTimer(label, secs, options);

  const handleRepeat = async (id: string) => {
    const t = timers.find((x: any) => x.id === id);
    if (!t) return;

    const { label, duration, repeat } = t;

    deleteTimer(id);
    await addTimer(label, duration, { autoStart: true, repeat }); 
  };

  const toggleMode = () => setIsDarkMode(!isDarkMode);

  const renderSwipeActions = (itemId: string) => (
    <View style={styles.swipeActions}>
      <TouchableOpacity style={[styles.swipeBtn, { backgroundColor: "#EF4444" }]} onPress={() => deleteTimer(itemId)}>
        <Text style={styles.swipeText}>Delete</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.swipeBtn, { backgroundColor: "#F59E0B" }]} onPress={() => pauseTimer(itemId)}>
        <Text style={styles.swipeText}>Pause</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? "#0F172A" : "#F9FAFB" }]}>
 
      <View style={[styles.header, { backgroundColor: isDarkMode ? "#1E293B" : "#E0E7FF" }]}>
        <Image source={require("../../assets/images/logo.png")} style={styles.logo} />
        <Text style={[styles.title, { color: isDarkMode ? "#FACC15" : "#2563EB" }]}>⏱ Multi Timer</Text>
        <TouchableOpacity onPress={toggleMode} style={styles.modeBtn}>
          <Ionicons name={isDarkMode ? "sunny-outline" : "moon-outline"} size={24} color={isDarkMode ? "#FACC15" : "#2563EB"} />
        </TouchableOpacity>
      </View>

      {/* Health Tips */}
      <Text style={[styles.sectionTitle, { color: isDarkMode ? "#FBBF24" : "#2563EB" }]}>💡 Health Tips</Text>
      <Animated.ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tipsScroll}>
        {TIPS.map((tip) => (
          <Animated.View key={tip.id} style={[styles.tipCard, { backgroundColor: isDarkMode ? "#1E293B" : "#FFF" }]}>
            <TouchableOpacity onPress={() => { setSelectedTip(tip); setTipModalVisible(true); }} activeOpacity={0.8}>
              <Animated.Image source={tip.img} style={[styles.tipImage, { transform: [{ scale: pulse }] }]} />
              <Text style={[styles.tipTitle, { color: isDarkMode ? "#FACC15" : "#2563EB" }]}>{tip.emoji} {tip.title}</Text>
              <Text style={[styles.tipShort, { color: isDarkMode ? "#E5E7EB" : "#374151" }]}>{tip.short}</Text>
              <Text style={styles.learnMore}>Learn More →</Text>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </Animated.ScrollView>

      {/* Timers List */}
      <Text style={[styles.sectionTitle, { color: isDarkMode ? "#FBBF24" : "#2563EB" }]}>⏱ Your Timers</Text>
      <View style={{ flex: 1, paddingHorizontal: 16, marginTop: 8 }}>
        {timers.length === 0 ? (
          <View style={styles.emptyWrapper}>
            <Text style={[styles.emptyText, { color: isDarkMode ? "#FFF" : "#111" }]}>
              No timers yet. Add one to get started!
            </Text>
          </View>
        ) : (
          <DraggableFlatList
            data={timers}
            keyExtractor={(item) => item.id}
            onDragEnd={({ data }) => reorderTimers(data)}
            contentContainerStyle={{ paddingBottom: 180 }} 
            renderItem={({ item, drag, isActive }: RenderItemParams<any>) => (
              <Swipeable renderRightActions={() => renderSwipeActions(item.id)}>
                <TouchableOpacity
                  onLongPress={item.status !== "completed" ? drag : undefined}
                  disabled={isActive}
                  activeOpacity={1}
                >
                  <TimerCard
                    timer={item}
                    now={Date.now()}
                    onStart={() => startTimer(item.id)}
                    onPause={() => pauseTimer(item.id)}
                    onDelete={() => deleteTimer(item.id)}
                    onRepeat={() => handleRepeat(item.id)}
                    isDarkMode={isDarkMode}
                  />
                </TouchableOpacity>
              </Swipeable>
            )}
          />
        )}
      </View>

      {/* Add Timer FAB */}
      <Animated.View style={[styles.fab, { transform: [{ scale: pulse }] }]}>
        <TouchableOpacity onPress={() => setAddModalVisible(true)}>
          <Text style={styles.fabText}>+ Add Timer</Text>
        </TouchableOpacity>
      </Animated.View>

      <TipModal visible={tipModalVisible} tip={selectedTip} onClose={() => setTipModalVisible(false)} />
      <AddTimerModal visible={addModalVisible} onClose={() => setAddModalVisible(false)} onAdd={handleAddTimer} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    paddingHorizontal: 16, 
    paddingTop: 16, 
    paddingBottom: 16,
  },
  header: { 
    flexDirection: "row", 
    alignItems: "center", 
    padding: 16, 
    borderBottomLeftRadius: 20, 
    borderBottomRightRadius: 20,
    marginBottom: 12 
  },
  logo: { 
    width: 40, 
    height: 40, 
    marginRight: 10, 
    borderRadius: 20, 
    borderWidth: 2, 
    borderColor: "#FACC15" 
  },
  title: { 
    fontSize: 22, 
    fontWeight: "bold", 
    flex: 1 
  },
  modeBtn: { padding: 6 },
  sectionTitle: { 
    marginTop: 16, 
    marginBottom: 8, 
    fontSize: 20, 
    fontWeight: "700" 
  },
  tipsScroll: { 
    marginBottom: 16, 
    maxHeight: 180,
  },
  tipCard: { 
    width: width * 0.4, 
    marginRight: 16, 
    borderRadius: 16, 
    padding: 10 
  },
  tipImage: { 
    width: "100%", 
    height: 90, 
    borderRadius: 12, 
    marginBottom: 8 
  },
  tipTitle: { 
    fontSize: 14, 
    fontWeight: "700" 
  },
  tipShort: { 
    fontSize: 12, 
    marginVertical: 2 
  },
  learnMore: { 
    fontSize: 12, 
    fontWeight: "600", 
    color: "#3B82F6", 
    alignSelf: "flex-end" 
  },
  emptyWrapper: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center", 
    marginTop: 40 
  },
  emptyText: { 
    fontSize: 16, 
    textAlign: "center" 
  },
  fab: { 
    position: "absolute", 
    bottom: 24, 
    right: 24, 
    backgroundColor: "#6366F1", 
    borderRadius: 30, 
    paddingVertical: 14, 
    paddingHorizontal: 24, 
    elevation: 10 
  },
  fabText: { 
    color: "#fff", 
    fontWeight: "bold", 
    fontSize: 16 
  },
  swipeActions: { 
    flexDirection: "row", 
    alignItems: "center" 
  },
  swipeBtn: { 
    justifyContent: "center", 
    alignItems: "center", 
    width: 70, 
    marginVertical: 4, 
    borderRadius: 8 
  },
  swipeText: { 
    color: "#fff", 
    fontWeight: "bold" 
  },
});

