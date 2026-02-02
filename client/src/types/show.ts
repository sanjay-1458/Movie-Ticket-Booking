import type Movie from "./movie";


export default interface Show {
  _id: string;        
  movie: Movie;      
  showDateTime: string; 
  showPrice: number;
  totalBookings: number;
  totalRevenue: number;
}
