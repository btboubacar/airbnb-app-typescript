import axios, { Axios, AxiosError } from "axios";

import { BodyUpdate } from "../interfaces/user";

class ApiClient {
  http = axios.create({
    baseURL: "https://lereacteur-bootcamp-api.herokuapp.com/api/airbnb",
  });

  async getRooms() {
    const response = await this.http.get("/rooms");
    return response.data;
  }

  async getRoom<T>(id: T) {
    const response = await this.http.get(`/rooms/${id}`);
    return response.data;
  }

  async login(obj: {}) {
    const response = await this.http.post(`/user/log_in`, obj);
    return response.data;
  }
  async signup(obj: {}) {
    const response = await this.http.post(`/user/sign_up`, obj);
    return response.data;
  }

  async getUser(id: string, userToken: string) {
    const response = await this.http.get(`/user/${id}`, {
      headers: { Authorization: `Bearer ${userToken}` },
    });
    return response.data;
  }

  async getRoomLocations(latitude: number, longitude: number) {
    const response = await this.http.get(
      `/rooms/around?latitude=${latitude}&longitude=${longitude}`
    );
    return response.data;
  }

  async update<T extends BodyUpdate>(body: T, userToken: string) {
    const response = await this.http.put("/user/update", body, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });
    return response.data;
  }

  async upload(data: FormData, userToken: string) {
    try {
      const response = await this.http.put("/user/upload_picture", data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${userToken}`,
        },
      });
      return response.data;
    } catch (error) {
      const err = error as AxiosError;
      console.log(err.response);
    }
  }
}

export default new ApiClient();
