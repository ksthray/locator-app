/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {
  View,
  Text,
  Button,
  FlatList,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import RNBluetoothClassic from 'react-native-bluetooth-classic';
import Geolocation from '@react-native-community/geolocation';

import {PermissionsAndroid, Platform} from 'react-native';

const BluetoothScanner = ({navigation}: any) => {
  const [devices, setDevices] = useState<any>([]);

  const [isloading, setisloading] = useState(false);

  const requestLocationAndBluetoothPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, // Localisation précise
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN, // Scan des devices Bluetooth
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT, // Connexion aux devices Bluetooth
      ]);

      const locationGranted =
        granted[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] ===
        PermissionsAndroid.RESULTS.GRANTED;

      const bluetoothScanGranted =
        granted[PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN] ===
        PermissionsAndroid.RESULTS.GRANTED;

      const bluetoothConnectGranted =
        granted[PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT] ===
        PermissionsAndroid.RESULTS.GRANTED;

      if (locationGranted && bluetoothScanGranted && bluetoothConnectGranted) {
        return true;
      } else {
        console.warn('Permissions manquantes pour Localisation ou Bluetooth');
        return false;
      }
    }

    return true; // iOS gère ça différemment
  };

  const scanDevices = async () => {
    try {
      const permissionGranted = await requestLocationAndBluetoothPermission();

      if (!permissionGranted) {
        console.warn('Permissions refusées');
        return;
      }

      // Continue ton code normalement ici :
      // Vérifier si Bluetooth activé
      const enabled = await RNBluetoothClassic.isBluetoothEnabled();
      if (!enabled) {
        await RNBluetoothClassic.requestBluetoothEnabled();
      }
      // Obtenir la position GPS actuelle du téléphone
      // setisloading(true);
      Geolocation.getCurrentPosition(
        async (position: any) => {
          const {latitude, longitude} = position.coords;

          console.log('gps lat lon', latitude, longitude);

          // Scanner les appareils Bluetooth
          setisloading(true);
          const discovered = await RNBluetoothClassic.startDiscovery();

          // Ajouter la position actuelle aux appareils détectés
          const devicesWithLocation = discovered.map(device => ({
            ...device,
            latitude, // Position du téléphone utilisateur
            longitude,
          }));

          setDevices(devicesWithLocation);
          setisloading(false);
        },
        (error: any) => {
          if (error.code === 2) {
            Alert.alert(
              'Activer la localisation',
              'Veuillez activer la localisation GPS pour scanner les appareils Bluetooth.',
              [
                {text: 'Annuler', style: 'cancel'},
                {text: 'Activer', onPress: () => Linking.openSettings()},
              ],
            );
          } else {
            console.log('Erreur GPS:', error);
          }
        },
        {enableHighAccuracy: false, timeout: 15000},
      );
      console.log('check');
      // setisloading(false);
    } catch (error) {
      console.error('Erreur Bluetooth:', error);
      setisloading(false);
    }
  };

  // const scanDevices = async () => {
  //   try {
  //     const permissionGranted = await requestLocationAndBluetoothPermission();

  //     if (!permissionGranted) {
  //       console.warn('Permissions refusées');
  //       return;
  //     }

  //     // Continue ton code normalement ici :
  //     // Vérifier si Bluetooth activé
  //     const enabled = await RNBluetoothClassic.isBluetoothEnabled();
  //     if (!enabled) {
  //       await RNBluetoothClassic.requestBluetoothEnabled();
  //     }
  //     setisloading(true);
  //     const paired = await RNBluetoothClassic.getBondedDevices(); // Appareils déjà connectés

  //     const discovered = await RNBluetoothClassic.startDiscovery(); // Recherche active

  //     setDevices([...paired, ...discovered]);
  //     setisloading(false);
  //   } catch (error) {
  //     console.error('Erreur Bluetooth:', error);
  //     setisloading(false);
  //   }
  // };

  console.log('devices:', devices);

  return (
    <View style={{flex: 1, padding: 20}}>
      <Button
        title={isloading ? 'Entrain de chercher...' : 'Scanner les appareils'}
        onPress={scanDevices}
      />
      {!isloading && (
        <FlatList
          data={devices}
          keyExtractor={item => item.address}
          renderItem={({item}) => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('DeviceLocation', {device: item})
              }
              style={{
                padding: 10,
                marginVertical: 5,
                backgroundColor: '#ddd',
                borderRadius: 5,
              }}>
              <Text>
                {item.name || 'Inconnu'} - {item.address}
              </Text>
              <Text>RSSI: {item.extra.rssi}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

export default BluetoothScanner;
