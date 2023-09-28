import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Image,
} from "react-native";
import { useEffect, useState } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as ImagePicker from "expo-image-picker";
import { FontAwesome, MaterialIcons, Ionicons } from "@expo/vector-icons";

//backend api
import { AxiosError } from "axios";
import backendApi from "../api/client";

// interfaces
import { BodyUpdate } from "../interfaces/user";

interface Props {
  userToken: string | null;
  userId: string | null;
  setToken: (token: string | null, id: string | null) => void;
}

export default function ProfileScreen({ userToken, setToken, userId }: Props) {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [description, setDescription] = useState("");
  const [avatar, setAvatar] = useState("");
  const [firstSubmitted, setFirstSubmitted] = useState(false);
  const [userBody, setUserBody] = useState({
    username: "",
    email: "",
    description: "",
    avatar: "",
  });

  const askPermissionAndGetPicture = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status === "granted") {
      const response = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [1, 1],
      });
      if (response.canceled === true) {
        alert("No picture selected");
      } else {
        setAvatar(response.assets[0].uri);
      }
    } else {
      alert("Access to media library permission denied");
    }
  };

  const askPermissionAndTakePicture = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status === "granted") {
      const response = await ImagePicker.launchCameraAsync();
      if (response.canceled === true) {
        alert("No picture selected");
      } else {
        setAvatar(response.assets[0].uri);
      }
    } else {
      alert("Access to camera permission denied");
    }
  };

  const sendPicture = async () => {
    try {
      const extension = avatar.split(".")[1];
      const formData: FormData = new FormData();
      // method 1: inspiration from https://github.com/g6ling/React-Native-Tips/issues/1
      formData.append("photo", {
        name: `image.${extension}`,
        type: `image/${extension}`,
        uri: avatar,
      } as unknown as Blob);
      // method 2 :
      //   formData.append(
      //     "photo",
      //     JSON.parse(
      //       JSON.stringify({
      //         name: `image.${extension}`,
      //         type: `image/${extension}`,
      //         uri: avatar,
      //       })
      //     )
      //   );
      const response = await backendApi.upload(formData, userToken as string);

      setUserBody({ ...userBody, ...{ avatar: response.photo.url } });
      alert("Picture successfully uploaded !");
    } catch (err) {
      const error = err as AxiosError;
      console.log(error);
    }
  };

  const sendDetails = async () => {
    const body: BodyUpdate = { email: "", username: "", description: "" };
    if (email) body.email = email;
    if (username) body.username = username;
    if (description) body.description = description;

    const response = await backendApi.update<BodyUpdate>(
      body,
      userToken as string
    );
    console.log(response);
    setUserBody({
      email: response.email,
      username: response.username,
      description: response.description,
      avatar: response.photo?.url,
    });
  };
  // -------
  // -------
  const handleUpdate = () => {
    if (avatar && (email || username || description)) {
      sendPicture();
      setFirstSubmitted(true);
    } else {
      if (avatar) {
        sendPicture();
      } else {
        sendDetails();
      }
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      const response = await backendApi.getUser(
        userId as string,
        userToken as string
      );
      setEmail(response.email);
      setUsername(response.username);
      setDescription(response.description);
      setAvatar(response.photo?.url);
    };
    fetchUser();

    if (firstSubmitted) sendDetails();
    setFirstSubmitted(false);
  }, [firstSubmitted, userBody]);
  return (
    <KeyboardAwareScrollView style={styles.container}>
      <View style={styles.userContainer}>
        {avatar ? (
          <>
            <Image source={{ uri: avatar }} style={styles.user} />
            <TouchableOpacity
              style={styles.trashContainer}
              onPress={() => {
                setAvatar("");
              }}
            >
              <Ionicons
                name="md-trash-outline"
                size={24}
                color="black"
                style={styles.trashCan}
              />
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.user}>
            <FontAwesome name="user" size={100} color="#E7E7E7" />
          </View>
        )}

        <View style={styles.photoCamera}>
          <TouchableOpacity onPress={askPermissionAndGetPicture}>
            <MaterialIcons name="photo-library" size={40} color="#717171" />
          </TouchableOpacity>
          <TouchableOpacity onPress={askPermissionAndTakePicture}>
            <MaterialIcons name="camera-alt" size={40} color="#717171" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="email"
          value={email}
          autoCapitalize="none"
          style={styles.input}
          onChangeText={(input) => setEmail(input)}
        />
        <TextInput
          placeholder="username"
          value={username}
          autoCapitalize="none"
          style={styles.input}
          onChangeText={(input) => setUsername(input)}
        />
        <TextInput
          placeholder="description"
          value={description}
          multiline
          style={[styles.input, styles.description]}
          onChangeText={(input) => setDescription(input)}
        />
      </View>

      <View style={styles.topBtnContainer}>
        <TouchableOpacity style={styles.btnContainer}>
          <Text style={styles.btn} onPress={handleUpdate}>
            Update
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btnContainer, styles.logout]}>
          <Text
            style={styles.btn}
            onPress={() => {
              setToken(null, null);
            }}
          >
            Log out
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
  },
  userContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingTop: 30,
  },
  user: {
    justifyContent: "center",
    alignItems: "center",
    width: 150,
    height: 150,
    borderRadius: 100,
    borderColor: "#FFCED2",
    borderWidth: 2,
  },
  trashContainer: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "white",

    position: "absolute",
    top: 50,
    right: 170,
    alignItems: "center",
    justifyContent: "center",
  },
  trashCan: {
    color: "tomato",
  },
  photoCamera: {
    gap: 20,
  },

  inputContainer: {
    marginTop: 20,
    marginHorizontal: 40,
    gap: 30,
  },
  input: {
    padding: 10,
    width: "100%",
    fontSize: 16,
    borderBottomColor: "#FFBAC0",
    borderBottomWidth: 2,
  },
  description: {
    marginTop: 20,
    borderWidth: 2,
    borderColor: "#FFBAC0",
    height: 100,
    textAlignVertical: "top",
  },
  topBtnContainer: {
    alignItems: "center",
    marginTop: 50,
    gap: 10,
  },

  btnContainer: {
    borderColor: "#F95A5F",
    borderWidth: 2,
    height: 50,
    width: 200,
    borderRadius: 25,
  },
  btn: {
    paddingTop: 10,
    width: "100%",
    height: "100%",
    fontSize: 20,
    textAlign: "center",
    color: "#737373",
  },
  logout: {
    backgroundColor: "#E7E7E7",
  },
});
