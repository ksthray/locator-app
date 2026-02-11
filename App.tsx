/* eslint-disable react-native/no-inline-styles */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

// import ScanDevicesScreen from './screens/ScanDevicesScreen';
// import ScanConnectDevicesScreen from './screens/ScanConnectDevices';
import BluetoothScanner from './screens/BleutoothScanner';
import DeviceLocation from './screens/DeviceLocation';
import HomeScreen from './screens/HomeScreen';
import DetectedDevicesScreen from './screens/DetectedDevicesScreen';
import DeviceDetailsScreen from './screens/DeviceDetailsScreen';
// import PeripheralDetailsScreen from './screens/PeripheralDetailsScreen';

const Stack = createNativeStackNavigator();

function App(): React.JSX.Element {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="HomeScreen">
          <Stack.Screen
            name="HomeScreen"
            component={HomeScreen}
            options={{title: 'Home', headerShown: false}}
          />
          <Stack.Screen
            name="DetectedDevices"
            component={DetectedDevicesScreen}
            options={{title: 'DetectedDevices', headerShown: false}}
          />
          <Stack.Screen
            name="DeviceDetails"
            component={DeviceDetailsScreen}
            options={{title: 'DeviceDetails', headerShown: false}}
          />
          <Stack.Screen
            name="BluetoothScanner"
            component={BluetoothScanner}
            options={{title: 'Scanner Bluetooth'}}
          />
          <Stack.Screen
            name="DeviceLocation"
            component={DeviceLocation}
            options={{title: "Localisation de l'Appareil"}}
          />
          {/* <Stack.Screen
          name="ScanDevicesConnect"
          component={ScanConnectDevicesScreen}
        /> */}
          {/* <Stack.Screen name="ScanDevices" component={ScanDevicesScreen} /> */}
          {/* <Stack.Screen
          name="PeripheralDetails"
          component={PeripheralDetailsScreen}
        /> */}
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

export default App;
