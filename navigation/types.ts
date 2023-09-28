import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import { RouteProp, CompositeNavigationProp } from "@react-navigation/native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";

export type HomeStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
  StackTabHome: undefined;
  Home: undefined;
  Room: { id: string };
  AroundMe: undefined;
  RoomAround: { id: string };
  //   Test: undefined;
  Profile: undefined;
};

export type RoomSreenProps = NativeStackScreenProps<HomeStackParamList, "Room">;
export type SignInSreenProps = NativeStackNavigationProp<
  HomeStackParamList,
  "SignIn"
>;
export type SignUpSreenProps = NativeStackNavigationProp<
  HomeStackParamList,
  "SignUp"
>;
export type HomeSreenProps = NativeStackNavigationProp<
  HomeStackParamList,
  "Home"
>;
export type AroundScreenProps = NativeStackScreenProps<
  HomeStackParamList,
  "AroundMe"
>;
