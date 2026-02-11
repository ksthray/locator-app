import {
  FlatList,
  NativeEventEmitter,
  NativeModules,
  PermissionsAndroid,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import BleManager from 'react-native-ble-manager';

const ConnectDevice = () => {
  const [isCanning, setisCanning] = useState(false);
  const [bleDevices, setbleDevices] = useState<any[]>([]);
  const BleManagerModule = NativeModules.BleManager;
  const BleManagerEmitter = new NativeEventEmitter(BleManagerModule);

  useEffect(() => {
    BleManager.start({showAlert: false}).then(() => {
      console.log('Module initialized');
    });
  });

  useEffect(() => {
    BleManager.enableBluetooth()
      .then(() => {
        console.log('The Bluetooth is already enabled or the user confirm');
        requestPermission();
      })
      .catch(() => {
        console.log('The user refuse to enabled bleutooth');
      });
  }, []);

  useEffect(() => {
    let stopListener = BleManagerEmitter.addListener(
      'BleManagerStopScan',
      () => {
        setisCanning(false);
        handleGetConnectedDevices();
        console.log('Stop Scan');
      },
    );

    return () => stopListener.remove();
  }, []);

  const requestPermission = async () => {
    const granted = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE,
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
    ]);

    if (granted) {
      startCanning();
    }
  };

  const startCanning = () => {
    if (!isCanning) {
      BleManager.scan([], 10, false)
        .then(() => {
          console.log('Scan started');
          setisCanning(true);
        })
        .catch(err => {
          console.error(err);
        });
    }
  };

  const handleGetConnectedDevices = () => {
    BleManager.getDiscoveredPeripherals().then(result => {
      if (result.length === 0) {
        console.log('Aucun device trouvé');
        startCanning();
      } else {
        const allDevices = result.filter(item => item.name !== null);
        setbleDevices(allDevices);
      }
      console.log('Voici les peripheriques:', result);
    });
  };

  const renderItem = ({item}: any) => {
    return (
      <View style={styles.bleCard}>
        <Text style={styles.bleText}>{item.name}</Text>
        <TouchableOpacity>
          <Text style={styles.btnText}>Connexion</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text>Locator App</Text>
      <Text>This an detect bluetooth devices application</Text>
      {isCanning ? (
        <View style={styles.scan}>
          <Text>Entrain de scanner...</Text>
        </View>
      ) : (
        <View>
          <FlatList
            data={bleDevices}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderItem}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  scan: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bleCard: {
    width: '90%',
    padding: 10,
    alignSelf: 'center',
    marginVertical: 10,
    backgroundColor: 'orange',
    elevation: 5,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bleText: {
    fontSize: 20,
    fontWeight: '800',
  },
  btnText: {
    fontSize: 14,
    fontWeight: '400',
  },
  bleBtn: {
    width: 100,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    backgroundColor: 'yellow',
  },
});

export default ConnectDevice;
