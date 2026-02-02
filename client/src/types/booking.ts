export default interface Booking {
  id: string;
  userId: string;
  showId: string;
  amount: number;
  bookedSeats: string[];
  isPaid: boolean;

  user: {
    name: string;
    email: string;
  };

  show: {
    showDateTime: string;
    movie: {
      title: string;
      poster_path: string;
      runtime: number;
    };
  };

  paymentLink?: string | null;
  createdAt?: string;
  updatedAt?: string;
}
