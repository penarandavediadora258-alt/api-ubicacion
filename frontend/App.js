import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Button } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import API from './services/api';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './navigation/AppNavigator';
import MapViewDirections from 'react-native-maps-directions';

export default function App() {
  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
}

import socket from './services/socket';
import MapViewDirections from 'react-native-maps-directions';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const logout = async () => {
  await AsyncStorage.removeItem('token');
  navigation.replace('Login');
};
const logout = async () => {
  await AsyncStorage.removeItem('token');
  navigation.replace('Login');
};
  const [location, setLocation] = useState(null);
  const mapRef = useRef(null);
const [drivers, setDrivers] = useState([]);
const pedirViaje = async () => {
  try {
    const response = await API.post('/viajes', {
      origen: {
        lat: location.latitude,
        lng: location.longitude
      },
      destino: {
        lat: location.latitude + 0.01,
        lng: location.longitude + 0.01
      }
    });

    const viaje = response.data;
    const [viajeActivo, setViajeActivo] = useState(null);
    const [conductorLocation, setConductorLocation] = useState(null);

    //  Notificar a conductores en tiempo real
    socket.emit('nuevoViaje', viaje);

    alert('Viaje solicitado ');
  } catch (error) {
    console.log(error);
    alert('Error al pedir viaje');
  }
};

  // Obtener ubicación del usuario
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;

      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);
      useEffect(() => {
  socket.on('viajeConfirmado', (viaje) => {
    setViajeActivo(viaje);
    alert('Conductor en camino');
  });
}, []);
useEffect(() => {
  socket.on('viajeConfirmado', (viaje) => {
    alert(' Un conductor aceptó tu viaje');
    console.log(viaje);
  });
}, []);

      // Enviar ubicación cada 5 segundos
      setInterval(async () => {
        let newLoc = await Location.getCurrentPositionAsync({});

        socket.emit('ubicacion', {
          usuarioId: 'cliente123',
          latitud: newLoc.coords.latitude,
          longitud: newLoc.coords.longitude
        });

      }, 5000);
    })();
  }, []);

  // Escuchar conductores
  useEffect(() => {
  if (conductorLocation && mapRef.current) {
    mapRef.current.animateToRegion({
      latitude: conductorLocation.latitude,
      longitude: conductorLocation.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01
    });
  }
}, [conductorLocation]);
  useEffect(() => {
    socket.on('ubicacionActualizada', (data) => {
      setDrivers((prev) => {
        const filtered = prev.filter(d => d.usuarioId !== data.usuarioId);
        return [...filtered, data];
      });
    });
  }, []);



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
        {/* Usuario */}
        <Marker
          coordinate={{
            latitude: location.latitude,
            longitude: location.longitude
          }}
          title="Tú"
        />

        {/* Conductores */}
        {drivers.map((d, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: d.latitud,
              longitude: d.longitud
            }}
            title="Conductor"
            pinColor="blue"

          />
        ))}
        {viajeActivo && (
  <MapViewDirections
    origin={{
      latitude: viajeActivo.origen.lat,
      longitude: viajeActivo.origen.lng
    }}
    destination={{
      latitude: viajeActivo.destino.lat,
      longitude: viajeActivo.destino.lng
    }}
    apikey="AIzaSyAQSkhuRwZuaVIra0f8oiLLh_Rt6FMq0ew"
    strokeWidth={4}
    strokeColor="black"
  />
)}
{viajeActivo && (
  <>
    <Marker
      coordinate={{
        latitude: viajeActivo.origen.lat,
        longitude: viajeActivo.origen.lng
      }}
      title="Origen"
    />

    <Marker
      coordinate={{
        latitude: viajeActivo.destino.lat,
        longitude: viajeActivo.destino.lng
      }}
      title="Destino"
      pinColor="green"
    />
  </>
)}
      </MapView>
      <Button title="Cerrar sesión" onPress={logout} />

      <Button title="Pedir Viaje" onPress={pedirViaje} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 }
});
