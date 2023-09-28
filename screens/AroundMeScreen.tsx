import { ActivityIndicator, StyleSheet, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";

// api
import client from "../api/client";
import { AxiosError } from "axios";

// interfaces
import { RoomType } from "../interfaces/room";
import { AroundScreenProps } from "../navigation/types";
interface LocationInterface {
  latitude: number;
  longitude: number;
}

const userLocation = { latitude: 48.84194, longitude: 2.355 };

const AroundMeScreen = ({ navigation }: AroundScreenProps) => {
  const [coords, setCoords] = useState<LocationInterface>({
    latitude: userLocation.latitude,
    longitude: userLocation.longitude,
  });
  const [error, setError] = useState(false);
  const [roomLocations, setRoomLocations] = useState<RoomType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [finishedLoading, setFinishedLoading] = useState(false);

  useEffect(() => {
    const askLocationPermission = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        const location = await Location.getCurrentPositionAsync();
        setCoords({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });

        setFinishedLoading(true);
      } else {
        setCoords({
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
        });
        setError(true);
        setFinishedLoading(true);
      }
      setIsLoading(false);
    };

    askLocationPermission();
  }, []);

  useEffect(() => {
    const fecthLocations = async () => {
      try {
        if (error === false) {
          const response = await client.getRoomLocations(
            userLocation.latitude,
            userLocation.longitude
          );
          setRoomLocations(response);
          setFinishedLoading(true);
        } else {
          // permission not granted -> dislay all rooms
          const response = await client.getRooms();
          setRoomLocations(response.data);
          setFinishedLoading(true);
        }
      } catch (err) {
        const error = err as AxiosError;
        console.log(error.response);
      }
    };

    if (!isLoading && coords.latitude && coords.longitude) {
      fecthLocations();
    }
  }, [coords, isLoading, error]);

  return !finishedLoading ? (
    <ActivityIndicator />
  ) : (
    <MapView
      style={styles.map}
      initialRegion={{
        // latitude: userLocation.latitude,
        // longitude: userLocation.longitude,
        latitude: coords.latitude,
        longitude: coords.longitude,
        latitudeDelta: 0.8,
        longitudeDelta: 0.8,
      }}
      showsUserLocation
    >
      {roomLocations.map((location) => {
        return (
          <TouchableOpacity key={location._id}>
            <Marker
              coordinate={{
                latitude: location.location[1],
                longitude: location.location[0],
              }}
              title={location.title}
              onPress={() => {
                navigation.navigate("Room", { id: location._id });
              }}
            />
          </TouchableOpacity>
        );
      })}
    </MapView>
  );
};

export default AroundMeScreen;

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  msgContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  msg: {
    textAlign: "center",
    fontSize: 20,
    color: "red",
  },
  subMsg: {
    fontSize: 18,
  },
});
