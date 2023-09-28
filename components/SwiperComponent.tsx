import React, { Component } from "react";
import { AppRegistry, Image, StyleSheet, Text, View } from "react-native";

import Swiper from "react-native-swiper";

// interfaces
import { RoomType } from "../interfaces/room";

export default class SwiperComponent extends Component<RoomType> {
  constructor(props: RoomType) {
    super(props);
  }
  render() {
    return (
      <Swiper
        style={styles.wrapper}
        showsButtons={true}
        // height={500}
        buttonWrapperStyle={{ height: "100%", top: 0, position: "absolute" }}
        showsPagination={true}
        paginationStyle={{ top: 200, gap: 15 }}
        dotStyle={{ width: 15, height: 15, borderRadius: 7.5 }}
        activeDotStyle={{ width: 15, height: 15, borderRadius: 7.5 }}
        activeDotColor="white"
        dotColor="gray"
        loadMinimal={true}
      >
        {this.props?.photos.map((image, index) => {
          return (
            <View style={styles.slide1} key={index}>
              <Image source={{ uri: image.url }} style={styles.img} />
            </View>
          );
        })}
      </Swiper>
    );
  }
}

AppRegistry.registerComponent("myproject", () => SwiperComponent);

const styles = StyleSheet.create({
  wrapper: {},
  slide1: {
    flex: 1,
  },
  img: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
});
