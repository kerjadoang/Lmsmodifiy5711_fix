import React from 'react';
import { SafeAreaView, GestureResponderEvent, Image, ScrollView, TouchableOpacity, View } from "react-native";
import UjianMonitoringDua from './UjianMonitoringDua'; // Adjust the path based on your project structure
import UjianMonitoringTiga from './UjianMonitoringTiga';
import UjianMonitoring from './UjianMonitoring';
import UjianMonitoringEmpat from './UjianMonitoringEmpat';

const App = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
  <UjianMonitoringEmpat></UjianMonitoringEmpat>
    </SafeAreaView>
  );
};

export default App;
