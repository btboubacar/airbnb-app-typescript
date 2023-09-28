import { StyleSheet, Image, TouchableOpacity } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
// navigation
import { HomeSreenProps } from "../navigation/types";

export default function Logo() {
  const navigation = useNavigation<HomeSreenProps>();
  return (
    <TouchableOpacity onPress={() => navigation.navigate("Home")}>
      <Image
        source={require("../assets/airbnb-logo.jpg")}
        style={styles.logo}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  logo: {
    width: 40,
    height: 40,
    resizeMode: "contain",
  },
});
