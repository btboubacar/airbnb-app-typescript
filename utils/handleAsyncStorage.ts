import AsyncStorage from "@react-native-async-storage/async-storage";

export default class HandleAsyncStorage {
  constructor(private token?: string | null, private id?: string | null) {
    this.token = token;
    this.id = id;
  }

  async handleStorage() {
    if (this.token && this.id) {
      try {
        await AsyncStorage.setItem(
          "userToken",
          JSON.stringify([this.token, this.id])
        );
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        await AsyncStorage.removeItem("userToken");
      } catch (error) {
        console.log(error);
      }
    }
  }

  async getAsyncStorage() {
    const value = await AsyncStorage.getItem("userToken");
    let tab = "";
    if (value) tab = JSON.parse(value);
    if (tab.length > 0) return tab;
    return [null, null];
  }
}
