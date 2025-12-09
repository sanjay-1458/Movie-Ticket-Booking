import type Show from "./show";
import type User from "./user";

export default interface Booking {
  _id: string;
  user: User;
  show: Show;
  amount: number;
  bookedSeats: string[];
  isPaid: boolean;

  paymentLink?: string;
  createdAt?: string;
  updatedAt?: string;
}
