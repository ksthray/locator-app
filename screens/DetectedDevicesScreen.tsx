import React from 'react';
import {View, Text, FlatList, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';

interface Device {
  name: string;
  address: string;
  id: string;
  bonded: boolean;
  type: 'DUAL';
  extra: {
    rssi: number;
  };
  latitude: number;
  longitude: number;
}

const DetectedDevicesScreen = ({route}: any) => {
  const navigation: any = useNavigation();
  const detectedDevices: Device[] = route.params.devices;

  const renderDeviceItem = ({item}: {item: Device}) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('DeviceDetails', {device: item})}
      style={styles.deviceItem}>
      <View>
        <Text style={styles.deviceName}>
          {item.name || 'Inconnu'} - {item.address}
        </Text>
        {/* <Text>RSSI: {item.extra.rssi}</Text> */}
      </View>
      <Icon name="ellipsis-vertical" size={20} color="#bbb" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}>
        <Icon name="chevron-back" size={28} color="white" />
      </TouchableOpacity>

      <View style={styles.headerCard}>
        <View style={styles.headerCardContent}>
          <Icon
            name="bluetooth"
            size={20}
            color="white"
            style={styles.iconBluetooth}
          />
          <View>
            <Text style={styles.headerTitle}>Device Locator</Text>
            <Text style={styles.headerText}>
              L’application scan tous les appareils se trouvant aux alentours et
              vous affiche leur liste plus bas.
            </Text>
          </View>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Appareils détectés</Text>
      <View style={styles.deviceListCard}>
        <FlatList
          data={detectedDevices}
          keyExtractor={item => item.id}
          renderItem={renderDeviceItem}
        />
      </View>

      <Text style={styles.footer}>© Copyright by Chadrac LEMBO-MATA</Text>
    </View>
  );
};

export default DetectedDevicesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d0d0d',
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  backButton: {
    marginBottom: 20,
  },
  headerCard: {
    backgroundColor: '#1c1c1e',
    borderRadius: 12,
    padding: 15,
    marginBottom: 25,
  },
  headerCardContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  iconBluetooth: {
    backgroundColor: '#007bff',
    borderRadius: 8,
    padding: 8,
    marginTop: 4,
  },
  headerTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerText: {
    color: '#aaa',
    fontSize: 12,
    marginTop: 4,
    lineHeight: 18,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 8,
  },
  deviceListCard: {
    backgroundColor: '#1c1c1e',
    borderRadius: 12,
  },
  deviceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 15,
    borderBottomColor: '#333',
    borderBottomWidth: 1,
  },
  deviceName: {
    color: 'white',
    fontSize: 15,
  },
  footer: {
    color: '#888',
    textAlign: 'center',
    fontSize: 12,
    position: 'absolute',
    bottom: 15,
    width: '100%',
  },
});
