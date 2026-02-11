/* eslint-disable @typescript-eslint/no-shadow */
/**
 * Sample BLE React Native App
 */

import {useNavigation} from '@react-navigation/native';
import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  StatusBar,
  FlatList,
  TouchableHighlight,
  Pressable,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';

import RNBluetoothClassic, {
  BluetoothDevice,
} from 'react-native-bluetooth-classic';

const ScanConnectDevicesScreen = () => {
  const navigation = useNavigation();

  const [availableDevice, setavailableDevice] = useState(false);
  const [enableBleutooth, setenableBleutooth] = useState(false);
  const [isEnabled, setisEnabled] = useState(false);

  const [isScanning, setisScanning] = useState(false);
  const [devices, setDevices] = useState<any>([]);

  const filterValidDevices = (devices: any) => {
    return devices.filter((device: any) => {
      // Vérifier si le nom contient seulement une adresse MAC
      const isMacAddress = /^[0-9A-Fa-f]{2}(:[0-9A-Fa-f]{2}){5}$/.test(
        device.nom,
      );
      return !isMacAddress; // On garde seulement ceux qui ne sont pas des adresses MAC
    });
  };

  const scanDevices = async () => {
    try {
      setisScanning(true);
      const paired = await RNBluetoothClassic.getBondedDevices(); // Appareils déjà connectés

      const discovered = await RNBluetoothClassic.startDiscovery(); // Recherche active

      setDevices([...paired, ...discovered]);
      setisScanning(false);
    } catch (error) {
      console.error('Erreur Bluetooth:', error);
      setisScanning(false);
    }
  };

  const handleAvailableDevice = async () => {
    try {
      const available = await RNBluetoothClassic.isBluetoothAvailable();
      setavailableDevice(available);
    } catch (error) {
      console.log('error', error);
    }
  };

  const handleEnableleDevice = async () => {
    try {
      setisEnabled(true);
      const enabled = await RNBluetoothClassic.isBluetoothEnabled();
      setenableBleutooth(enabled);
      setisEnabled(false);
    } catch (error) {
      console.log('error', error);
      setisEnabled(false);
    }
  };

  const filteredDevices = filterValidDevices(devices);
  console.log('dev:', filteredDevices);

  useEffect(() => {
    handleAvailableDevice();
  }, []);

  const renderItem = ({item}: {item: any}) => {
    const backgroundColor = item.bonded ? '#069400' : Colors.white;
    return (
      <TouchableHighlight underlayColor="#0082FC" onPress={() => {}}>
        <View style={[styles.row, {backgroundColor}]}>
          <Text style={styles.peripheralName}>
            {/* completeLocalName (item.name) & shortAdvertisingName (advertising.localName) may not always be the same */}
            {item.name} - {item?.address}
          </Text>
          <Text style={styles.rssi}>RSSI: {item.rssi}</Text>
        </View>
      </TouchableHighlight>
    );
  };

  return (
    <>
      <StatusBar />
      <SafeAreaView style={styles.body}>
        <View style={styles.buttonGroup}>
          <Pressable style={styles.scanButton} onPress={handleEnableleDevice}>
            <Text style={styles.scanButtonText}>
              {isEnabled ? 'Scanning...' : 'Scan Bluetooth'}
            </Text>
          </Pressable>
        </View>

        <Text>
          {availableDevice
            ? 'Bluetooth disponible'
            : 'Bleutooth pas disponible'}
        </Text>

        <Text>
          {enableBleutooth
            ? 'Vous avez donner accès au Bluetooth'
            : "Vous n'avez pas encore donner accès Bleutooth"}
        </Text>

        <View style={styles.buttonGroup}>
          <Pressable style={styles.scanButton} onPress={scanDevices}>
            <Text style={styles.scanButtonText}>
              {isScanning ? 'Entrain de chercher...' : 'Chercher les appareils'}
            </Text>
          </Pressable>
        </View>

        <FlatList
          data={devices}
          // data={formatedPeripheral(peripherals.values())}
          contentContainerStyle={{rowGap: 12}}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
      </SafeAreaView>
    </>
  );
};

const boxShadow = {
  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
  elevation: 5,
};

const styles = StyleSheet.create({
  engine: {
    position: 'absolute',
    right: 10,
    bottom: 0,
    color: Colors.black,
  },
  buttonGroup: {
    flexDirection: 'row',
    width: '100%',
  },
  scanButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#0a398a',
    margin: 10,
    borderRadius: 12,
    flex: 1,
    ...boxShadow,
  },
  scanButtonText: {
    fontSize: 16,
    letterSpacing: 0.25,
    color: Colors.white,
  },
  body: {
    backgroundColor: '#fefefe',
    flex: 1,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
  peripheralName: {
    fontSize: 16,
    textAlign: 'center',
    padding: 10,
  },
  rssi: {
    fontSize: 12,
    textAlign: 'center',
    padding: 2,
  },
  peripheralId: {
    fontSize: 12,
    textAlign: 'center',
    padding: 2,
    paddingBottom: 20,
  },
  row: {
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: 'orange',
    ...boxShadow,
  },
  noPeripherals: {
    margin: 10,
    textAlign: 'center',
    color: Colors.white,
  },
});

export default ScanConnectDevicesScreen;
