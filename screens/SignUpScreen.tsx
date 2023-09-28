import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";

import { SignUpSreenProps } from "../navigation/types";

//interfaces
interface Props {
  setToken: (token: string, id: string) => void;
  navigation: SignUpSreenProps;
}

// backend api route
import { AxiosError } from "axios";
import backendApi from "../api/client";

const SignUpScreen = ({ navigation, setToken }: Props) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [checkPassword, setCheckPassword] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async () => {
    if (!email || !username || !password || !confirmPassword || !description) {
      alert("Empty fields : all input must be filled in !");
    } else if (password !== confirmPassword) {
      setCheckPassword(true);
    } else {
      try {
        setIsSubmitting(true);
        const response = await backendApi.signup({
          email,
          username,
          description,
          password,
        });
        setIsSubmitting(false);

        // set userToken
        setToken(response.token, response.id);
        alert("Account successfully created !");
        console.log(response);
        setUsername("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setDescription("");
        setCheckPassword(false);
      } catch (err) {
        setIsSubmitting(false);
        const error = err as AxiosError;
        if (error.response?.data) {
          setErrorMessage(
            "Error during signup or this account is already used "
          );
        }
      }
    }
  };

  return (
    <KeyboardAwareScrollView
      style={styles.container}
      extraHeight={10}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.logoBloc}>
        <Image
          source={require("../assets/airbnb-logo.jpg")}
          style={styles.logo}
        />
        <Text style={[styles.textGrey, styles.textSignUp]}>Sign Up</Text>
        {
          <ActivityIndicator
            animating={isSubmitting}
            color="green"
            size="large"
            style={[styles.indicator, { opacity: isSubmitting ? 0 : 1 }]}
          />
        }
      </View>
      <View style={styles.topInput}>
        <View style={styles.inputBloc}>
          <TextInput
            value={email}
            placeholder="email"
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.inputText}
            onChangeText={(input) => {
              setEmail(input);
            }}
            onChange={() => {
              setErrorMessage("");
            }}
          />
          <TextInput
            value={username}
            placeholder="username"
            keyboardType="default"
            autoCapitalize="none"
            style={styles.inputText}
            onChangeText={(input) => {
              setUsername(input);
            }}
            onChange={() => {
              setErrorMessage("");
            }}
          />
          <TextInput
            value={description}
            keyboardType="default"
            placeholder="Describe yourself in a few words ..."
            onChangeText={(input) => {
              setDescription(input);
            }}
            multiline
            style={[styles.inputText, styles.description]}
          />
          <View style={styles.passwordField}>
            <TextInput
              value={password}
              placeholder="password"
              keyboardType="default"
              secureTextEntry={!passwordVisible}
              autoCapitalize="none"
              style={styles.inputText}
              onChangeText={(input) => {
                setPassword(input);
              }}
              onChange={() => {
                setCheckPassword(false);
                setErrorMessage("");
              }}
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
          <View style={styles.passwordField}>
            <TextInput
              value={confirmPassword}
              placeholder="confirm password"
              keyboardType="default"
              secureTextEntry={!passwordVisible}
              autoCapitalize="none"
              onChangeText={(input) => {
                setConfirmPassword(input);
              }}
              onChange={() => {
                setCheckPassword(false);
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
          {checkPassword && (
            <Text style={styles.passWrong}>
              The two passwords must be the same
            </Text>
          )}
          {errorMessage && (
            <Text style={[styles.errorLogin]}>{errorMessage}</Text>
          )}
        </View>
        <TouchableOpacity style={styles.btnContainer} disabled={!isSubmitting}>
          <Text style={styles.btn} onPress={handleSubmit}>
            Sign up
          </Text>
        </TouchableOpacity>
        <Text
          style={styles.tagSign}
          onPress={() => {
            navigation.navigate("SignIn");
          }}
        >
          Already have an account ? Sign in
        </Text>
        <View style={styles.bottomLine}></View>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default SignUpScreen;

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
    gap: 20,
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
  },

  indicator: {
    marginBottom: 5,
  },

  topInput: {
    marginBottom: 0,
    paddingBottom: 0,
  },

  inputBloc: {
    gap: 10,
  },

  inputText: {
    width: "100%",
    fontSize: 16,
    borderWidth: 2,
    borderColor: "white",
    borderBottomColor: "#FFBAC0",
    paddingBottom: 8,
  },
  description: {
    height: 120,
    borderColor: "#FFBAC0",
    paddingLeft: 10,
    textAlignVertical: "top",
  },
  passwordField: {
    flexDirection: "row",
    position: "relative",
  },
  eye: {
    position: "absolute",
    right: 10,
  },

  passWrong: {
    color: "red",
    fontSize: 16,
    height: 20,
  },

  errorLogin: {
    color: "red",
  },
  // ------ button
  btnContainer: {
    height: 50,
    width: 190,
    borderColor: "#F9585D",
    borderWidth: 3,
    borderRadius: 30,
    justifyContent: "center",
    alignSelf: "center",
    marginTop: 60,
  },
  btn: {
    fontSize: 20,
    textAlign: "center",
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
