import type Show from "./show"; // You can keep the import if you use it elsewhere, or remove it if not used

export default interface Booking {
  id: string;
  userId: string;
  showId: string;
  amount: number;
  bookedSeats: string[];
  isPaid: boolean;

  // This fixes the "Property 'user' does not exist" error
  user: {
    name: string;
    email: string;
  };

  // This detailed version allows data.show.movie.title to work
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