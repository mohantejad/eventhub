export interface UserType {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

export interface EventType {
  id: number;
  title: string;
  description: string;
  city: string;
  date: string;
  created_by: string;
  event_mode: string;
  image: string;
  event_category: string;
  price: number;
  likes: number;
  liked: boolean
}
