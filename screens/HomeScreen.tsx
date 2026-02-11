import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  PermissionsAndroid,
  Platform,
  Alert,
  ActivityIndicator,
  Linking,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import RNBluetoothClassic from 'react-native-bluetooth-classic';
import Icon from 'react-native-vector-icons/Feather';
import RadarCircle from '../component/RadarCircle';
import SliderNames from '../component/SliderNames';

const HomeScreen = ({navigation}: any) => {
  const [devices, setDevices] = useState<any[]>([]);

  const [isBluetoothOn, setIsBluetoothOn] = useState(false);
  const [isLoading, setisLoading] = useState(false);

  //   const requestBluetoothAndLocationPermission = async () => {
  //     try {
  //       if (Platform.OS === 'android') {
  //         const locationGranted = await PermissionsAndroid.request(
  //           PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  //           {
  //             title: 'Permission de localisation',
  //             message:
  //               'Cette application a besoin de votre position pour détecter les appareils Bluetooth à proximité.',
  //             buttonNeutral: 'Plus tard',
  //             buttonNegative: 'Annuler',
  //             buttonPositive: 'OK',
  //           },
  //         );

  //         if (locationGranted !== PermissionsAndroid.RESULTS.GRANTED) {
  //           Alert.alert(
  //             'Permission refusée',
  //             'Impossible d’activer le Bluetooth.',
  //           );
  //           return false;
  //         }
  //       }

  //       const enabled = await RNBluetoothClassic.isBluetoothEnabled();
  //       if (!enabled) {
  //         const activated = await RNBluetoothClassic.requestBluetoothEnabled();
  //         return activated;
  //       }

  //       return true;
  //     } catch (error) {
  //       console.error('Erreur Bluetooth:', error);
  //       return false;
  //     }
  //   };

  //   const handleStartSearch = async () => {
  //     setisLoading(true);
  //     const success = await requestBluetoothAndLocationPermission();
  //     if (success) {
  //       setIsBluetoothOn(true);
  //       try {
  //         const devices = await RNBluetoothClassic.startDiscovery();
  //         console.log('Appareils trouvés:', devices);
  //         setisLoading(false);
  //       } catch (e) {
  //         console.error('Erreur pendant la découverte:', e);
  //         setisLoading(true);
  //       }
  //     }
  //   };

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
    setisLoading(true);
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
      } else {
        setIsBluetoothOn(true);
      }
      // Obtenir la position GPS actuelle du téléphone
      // setisloading(true);
      Geolocation.getCurrentPosition(
        async (position: any) => {
          const {latitude, longitude} = position.coords;

          console.log('gps lat lon', latitude, longitude);

          // Scanner les appareils Bluetooth
          setisLoading(true);
          const discovered = await RNBluetoothClassic.startDiscovery();

          // Ajouter la position actuelle aux appareils détectés
          const devicesWithLocation = discovered.map(device => ({
            ...device,
            latitude, // Position du téléphone utilisateur
            longitude,
          }));

          setDevices(devicesWithLocation);
          setisLoading(false);
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
      setisLoading(false);
    }
  };

  useEffect(() => {
    if (devices.length > 0) {
      navigation.navigate('DetectedDevices', {devices: devices});
    }
  }, [devices, navigation]);

  const names = [
    'Chadrac LEMBO-MATA',
    'MUKANYA MITSHI Franck',
    'Lusumba Wisungata Frank',
  ];

  return (
    <View style={styles.container}>
      <View style={styles.radarWrapper}>
        {isBluetoothOn && (
          <>
            <RadarCircle delay={0} color="#007bff" />
            <RadarCircle delay={500} color="#007bff" />
            <RadarCircle delay={1000} color="#007bff" />
          </>
        )}
        <View
          style={[
            styles.circleContainer,
            isBluetoothOn ? styles.active : styles.inactive,
          ]}>
          <Icon
            name="bluetooth"
            size={64}
            color={isBluetoothOn ? '#fff' : '#aaa'}
          />
        </View>
      </View>

      <Text style={styles.title}>Device Locator</Text>
      <Text style={styles.subtitle}>
        Veuillez cliquer sur l’icône Bluetooth pour l’activer sur votre
        téléphone, ensuite lancer la recherche
      </Text>

      <TouchableOpacity style={styles.button} onPress={scanDevices}>
        {isLoading ? (
          <Text style={styles.buttonText}>
            Entrain de chercher <ActivityIndicator size="small" color="#fff" />
          </Text>
        ) : (
          <Text style={styles.buttonText}>Lancer la recherche</Text>
        )}
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.textFooter}>© Copyright by</Text>
        <SliderNames names={names} interval={2500} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0c0c0c',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  radarWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 200,
    height: 200,
    marginBottom: 30,
  },
  circleContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inactive: {
    backgroundColor: '#222',
  },
  active: {
    backgroundColor: '#007bff',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#ccc',
    textAlign: 'center',
    marginVertical: 15,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 30,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  footer: {
    position: 'absolute',
    bottom: 20,
  },
  textFooter: {
    color: '#888',
    fontSize: 12,
    textAlign: 'center',
  },
});

export default HomeScreen;
