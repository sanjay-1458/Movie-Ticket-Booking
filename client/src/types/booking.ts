import type Show from "./show";
export default interface Booking {
  id: string;
  userId: string;
  showId: string;
  show: Show;
  amount: number;
  bookedSeats: string[];
  isPaid: boolean;

  paymentLink?: string | null;
  createdAt?: string;
  updatedAt?: string;
}
