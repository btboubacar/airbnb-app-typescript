import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import Constants from "expo-constants";

// navigation
import { HomeSreenProps } from "../navigation/types";

// api
import backendApi from "../api/client";

// components
import Stars from "../components/Stars";

// interfaces
import { RoomType } from "../interfaces/room";
interface Props {
  navigation: HomeSreenProps;
}

export default function HomeScreen({ navigation }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<RoomType[]>([]);

  useEffect(() => {
    const fetchRooms = async () => {
      const response = await backendApi.getRooms();
      setData(response);
      setIsLoading(false);
    };
    fetchRooms();
  }, []);

  return isLoading === true ? (
    <ActivityIndicator />
  ) : (
    <View style={styles.container}>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={data}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.offerBloc}>
            <TouchableOpacity
              style={styles.imageContainer}
              onPress={() => {
                navigation.navigate("Room", { id: item._id });
              }}
            >
              <Image
                source={{ uri: item.photos[0].url }}
                style={styles.offerImg}
              />

              <View style={styles.infos}>
                <View style={styles.infosText}>
                  <Text style={styles.title} numberOfLines={1}>
                    {item.title}
                  </Text>

                  <View style={styles.priceBloc}>
                    <Text style={styles.price}>{item.price} €</Text>
                  </View>
                  <View style={styles.ratings}>
                    <Stars ratingValue={item.ratingValue} size={20} />
                    <Text style={styles.review}>{item.reviews} reviews</Text>
                  </View>
                </View>
                <Image
                  source={{ uri: item.user.account.photo.url }}
                  style={styles.userImg}
                />
              </View>
            </TouchableOpacity>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator}></View>}
        style={styles.offersContainer}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    paddingTop: Constants.statusBarHeight,
    backgroundColor: "white",
    alignItems: "center",
  },

  offersContainer: {
    marginTop: -20,
  },
  offerBloc: {
    position: "relative",
  },
  imageContainer: {
    width: 350,
    overflow: "hidden",
  },

  offerImg: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
    borderRadius: 5,
  },
  separator: {
    width: "100%",
    borderBottomWidth: 2,
    borderBottomColor: "#E9E9E9",
    marginBottom: 15,
  },

  infos: {
    paddingVertical: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  userImg: {
    width: 80,
    height: 80,
    resizeMode: "contain",
    borderRadius: 40,
  },
  infosText: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    color: "#282828",
  },
  priceBloc: {
    backgroundColor: "black",
    position: "absolute",
    top: -90,
    left: 0,
    width: 80,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
  },

  price: {
    color: "white",
    fontSize: 25,
  },

  ratings: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  review: {
    color: "#BBBBBB",
  },
});
