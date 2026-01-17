
export interface Review {
  id?: string | number;
  name: string;
  date: string;
  rating: number;
  text: string;
  created_at?: string;
}

export interface Booking {
  id?: string | number;
  name: string;
  email: string;
  check_in: string;
  check_out: string;
  rv_size: string;
  guests: number;
  created_at?: string;
}

export interface GalleryImage {
  id: string | number;
  url: string;
  title: string;
  category: string;
  created_at?: string;
}

export interface Database {
  public: {
    Tables: {
      reviews: {
        Row: Review;
        Insert: Omit<Review, 'id' | 'created_at'>;
        Update: Partial<Omit<Review, 'id' | 'created_at'>>;
      };
      bookings: {
        Row: Booking;
        Insert: Omit<Booking, 'id' | 'created_at'>;
        Update: Partial<Omit<Booking, 'id' | 'created_at'>>;
      };
      gallery_images: {
        Row: GalleryImage;
        Insert: Omit<GalleryImage, 'id' | 'created_at'>;
        Update: Partial<Omit<GalleryImage, 'id' | 'created_at'>>;
      };
    };
  };
}
