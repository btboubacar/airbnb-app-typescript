import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useState } from "react";
import Constants from "expo-constants";
import { Ionicons } from "@expo/vector-icons";

// api
import { AxiosError } from "axios";
import backendApi from "../api/client";

// navigation
import { SignInSreenProps } from "../navigation/types";

// interface
import { UserLogin } from "../interfaces/user";

interface Props {
  setToken: (token: string, id: string) => void;
  navigation: SignInSreenProps;
}

export default function SignInScreen({ setToken, navigation }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(true);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password) {
      alert("Empty fields : all input must be filled in !");
    } else {
      try {
        const obj: UserLogin = {
          email,
          password,
        };
        setIsSubmitting(true);
        const response = await backendApi.login(obj);

        // set userToken
        setToken(response.token, response.id);

        setIsSubmitting(false);
        alert("Successfully logged in !");
        setEmail("");
        setPassword("");
      } catch (err) {
        const error = err as AxiosError;

        setIsSubmitting(false);
        console.log(error.response);
        if (error.response?.data) {
          setErrorMessage(
            "Incorrect  email and/or password. Or Account does not exist"
          );
        }
      }
    }
  };

  return (
    <KeyboardAwareScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.logoBloc}>
        <Image
          source={require("../assets/airbnb-logo.jpg")}
          style={styles.logo}
        />
        <Text style={[styles.textGrey, styles.textSignUp]}>Sign in</Text>
        {
          <ActivityIndicator
            animating={isSubmitting}
            color="green"
            size="large"
            style={[{ opacity: isSubmitting ? 0 : 1 }]}
          />
        }
      </View>
      <View style={styles.topInput}>
        <View style={styles.inputBloc}>
          <TextInput
            autoCapitalize="none"
            value={email}
            placeholder="email"
            keyboardType="email-address"
            onChangeText={(input) => {
              setEmail(input);
            }}
            onChange={() => {
              setErrorMessage("");
            }}
            style={styles.inputText}
          />
          <View style={styles.passwordField}>
            <TextInput
              autoCapitalize="none"
              value={password}
              placeholder="password"
              keyboardType="default"
              secureTextEntry={!passwordVisible}
              onChangeText={(input) => {
                setPassword(input);
              }}
              onChange={() => {
                setErrorMessage("");
              }}
              style={styles.inputText}
            />
            <Ionicons
              name="eye"
              size={24}
              color="black"
              style={styles.eye}
              onPress={() => {
                setPasswordVisible(!passwordVisible);
              }}
            />
          </View>
          {errorMessage && (
            <Text style={[styles.errorLogin]}>{errorMessage}</Text>
          )}
        </View>

        <TouchableOpacity style={styles.btnContainer} disabled={!isSubmitting}>
          <Text style={styles.btn} onPress={handleSubmit}>
            Sign in
          </Text>
        </TouchableOpacity>
        <Text
          style={styles.tagSign}
          onPress={() => {
            navigation.navigate("SignUp");
          }}
        >
          No account ? Register
        </Text>
        <View style={styles.bottomLine}></View>
      </View>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    paddingTop: Constants.statusBarHeight,
    padding: 40,
    flex: 1,
  },

  textGrey: {
    color: "#717171",
  },

  textLight: {
    color: "#7C7C7C",
  },

  //  ---- logo
  logoBloc: {
    marginTop: 10,
    gap: 10,
    alignItems: "center",
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: "contain",
  },
  // ----- Sign Up---
  textSignUp: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 30,
  },

  topInput: {
    marginBottom: 0,
    height: "100%",
  },

  inputBloc: {
    gap: 30,

    paddingTop: 10,
    paddingBottom: 80,
  },

  inputText: {
    width: "100%",
    fontSize: 16,
    borderWidth: 2,
    borderColor: "white",
    borderBottomColor: "#FFBAC0",
    paddingBottom: 8,
  },

  errorLogin: {
    color: "red",
  },

  passwordField: {
    flexDirection: "row",
    position: "relative",
  },
  eye: {
    position: "absolute",
    right: 10,
  },

  // ---- button
  btnContainer: {
    height: 50,
    width: 190,
    borderColor: "#F9585D",
    borderWidth: 3,
    borderRadius: 30,
    justifyContent: "center",

    alignSelf: "center",
    marginTop: 40,
  },
  btn: {
    fontSize: 20,
    textAlign: "center",
    width: "100%",
    height: "100%",
    paddingTop: 10,
  },
  tagSign: {
    alignSelf: "center",
    marginTop: 25,
    marginBottom: 40,
  },
  bottomLine: {
    width: 138,
    height: 4,
  },
});
