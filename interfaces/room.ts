interface Photo {
  picture_id: string;
  url: string;
}

interface Account {
  username: string;
  description: string;
  photo: Photo;
}

interface User {
  _id: string;
  account: Account;
  rooms: [];
}

export interface RoomType {
  _id: string;
  description: string;
  location: number[];
  photos: Photo[];
  price: number;
  ratingValue: number;
  reviews: number;
  title: string;
  user: User;
}
