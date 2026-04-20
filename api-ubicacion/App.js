import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Button } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

import socket from './services/socket';
import API from './services/api';

export default function App() {
  const [location, setLocation] = useState(null);
  const [viaje, setViaje] = useState(null);

  //  Ubicación del conductor
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;

      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);

      // enviar ubicación cada 5s
      setInterval(async () => {
        let newLoc = await Location.getCurrentPositionAsync({});

        socket.emit('ubicacion', {
          usuarioId: 'conductor123',
          latitud: newLoc.coords.latitude,
          longitud: newLoc.coords.longitude
        });

      }, 5000);
    })();
  }, []);

  //  Escuchar viajes
  useEffect(() => {
    socket.on('viajeDisponible', (data) => {
      console.log('Nuevo viaje:', data);
      setViaje(data);
    });
  }, []);

  //  Aceptar viaje
  const aceptarViaje = async () => {
    try {
      const res = await API.put(`/viajes/aceptar/${viaje._id}`);

      socket.emit('viajeAceptado', res.data);

      alert('Viaje aceptado ');
      setViaje(null);

    } catch (error) {
      console.log(error);
    }
  };

  if (!location) return null;

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01
        }}
      >
        <Marker
          coordinate={{
            latitude: location.latitude,
            longitude: location.longitude
          }}
          title="Conductor"
          pinColor="blue"
        />
      </MapView>

      {viaje && (
        <View style={styles.card}>
          <Text> Nuevo viaje</Text>
          <Button title="Aceptar" onPress={aceptarViaje} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  card: {
    position: 'absolute',
    bottom: 50,
    backgroundColor: 'white',
    padding: 20,
    width: '90%',
    alignSelf: 'center'
  }
});