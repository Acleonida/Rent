// User Types
export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  phoneNumber?: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  location?: GeoPoint;
  address?: string;
  city?: string;
  province: string; // Davao del Sur
  isVerified: boolean;
  rating: number;
  totalReviews: number;
}

export enum UserRole {
  RENTER = 'renter',
  LESSOR = 'lessor',
  ADMIN = 'admin'
}

// Item Types
export interface Item {
  id: string;
  title: string;
  description: string;
  category: ItemCategory;
  subcategory?: string;
  price: number;
  priceType: PriceType;
  images: string[];
  location: GeoPoint;
  address: string;
  city: string;
  province: string; // Davao del Sur
  lessorId: string;
  lessor: User;
  isAvailable: boolean;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  specifications?: Record<string, any>;
  deposit?: number;
  minimumRentalPeriod?: number; // in days
  maximumRentalPeriod?: number; // in days
  rating: number;
  totalReviews: number;
  viewCount: number;
}

export enum ItemCategory {
  ELECTRONICS = 'electronics',
  TOOLS = 'tools',
  FURNITURE = 'furniture',
  VEHICLES = 'vehicles',
  SPORTS = 'sports',
  PARTY_EQUIPMENT = 'party_equipment',
  GARDENING = 'gardening',
  CONSTRUCTION = 'construction',
  OTHER = 'other'
}

export enum PriceType {
  PER_DAY = 'per_day',
  PER_WEEK = 'per_week',
  PER_MONTH = 'per_month',
  FIXED = 'fixed'
}

// Rental Types
export interface Rental {
  id: string;
  itemId: string;
  item: Item;
  renterId: string;
  renter: User;
  lessorId: string;
  lessor: User;
  startDate: Date;
  endDate: Date;
  totalAmount: number;
  deposit: number;
  status: RentalStatus;
  createdAt: Date;
  updatedAt: Date;
  pickupLocation?: string;
  returnLocation?: string;
  specialRequests?: string;
  cancellationReason?: string;
  cancelledAt?: Date;
  cancelledBy?: string;
}

export enum RentalStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  DISPUTED = 'disputed'
}

// Review Types
export interface Review {
  id: string;
  rentalId: string;
  reviewerId: string;
  reviewer: User;
  reviewedId: string; // User being reviewed
  reviewed: User;
  itemId?: string;
  item?: Item;
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
  isVerified: boolean;
}

// Message Types
export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  sender: User;
  content: string;
  messageType: MessageType;
  createdAt: Date;
  readAt?: Date;
  attachments?: string[];
}

export enum MessageType {
  TEXT = 'text',
  IMAGE = 'image',
  LOCATION = 'location'
}

export interface Conversation {
  id: string;
  participants: string[];
  participantsData: User[];
  lastMessage?: Message;
  createdAt: Date;
  updatedAt: Date;
  itemId?: string;
  item?: Item;
  rentalId?: string;
  rental?: Rental;
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  title: string;
  body: string;
  type: NotificationType;
  data?: Record<string, any>;
  isRead: boolean;
  createdAt: Date;
  readAt?: Date;
}

export enum NotificationType {
  RENTAL_REQUEST = 'rental_request',
  RENTAL_CONFIRMED = 'rental_confirmed',
  RENTAL_CANCELLED = 'rental_cancelled',
  NEW_MESSAGE = 'new_message',
  NEW_REVIEW = 'new_review',
  PAYMENT_RECEIVED = 'payment_received',
  ITEM_VERIFIED = 'item_verified',
  SYSTEM = 'system'
}

// Geospatial Types
export interface GeoPoint {
  latitude: number;
  longitude: number;
}

export interface LocationSearch {
  query: string;
  location?: GeoPoint;
  radius?: number; // in kilometers
  province?: string;
  city?: string;
}

// Search and Filter Types
export interface ItemSearchFilters {
  category?: ItemCategory;
  subcategory?: string;
  priceRange?: {
    min: number;
    max: number;
  };
  location?: GeoPoint;
  radius?: number;
  availability?: boolean;
  rating?: number;
  tags?: string[];
  sortBy?: SortOption;
  sortOrder?: 'asc' | 'desc';
}

export enum SortOption {
  PRICE_LOW_TO_HIGH = 'price_low_to_high',
  PRICE_HIGH_TO_LOW = 'price_high_to_low',
  RATING = 'rating',
  DISTANCE = 'distance',
  NEWEST = 'newest',
  OLDEST = 'oldest',
  POPULARITY = 'popularity'
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Form Types
export interface LoginForm {
  email: string;
  password: string;
}

export interface SignupForm {
  email: string;
  password: string;
  displayName: string;
  phoneNumber?: string;
  role: UserRole;
}

export interface ItemForm {
  title: string;
  description: string;
  category: ItemCategory;
  subcategory?: string;
  price: number;
  priceType: PriceType;
  images: File[];
  location: GeoPoint;
  address: string;
  city: string;
  tags: string[];
  specifications?: Record<string, any>;
  deposit?: number;
  minimumRentalPeriod?: number;
  maximumRentalPeriod?: number;
}

export interface RentalRequestForm {
  startDate: Date;
  endDate: Date;
  pickupLocation?: string;
  returnLocation?: string;
  specialRequests?: string;
}

// Error Types
export interface AppError {
  code: string;
  message: string;
  details?: any;
}

// Constants
export const PROVINCES = {
  DAVAO_DEL_SUR: 'Davao del Sur'
} as const;

export const CITIES_DAVAO_DEL_SUR = [
  'Digos City',
  'Davao City',
  'Tagum City',
  'Panabo City',
  'Island Garden City of Samal',
  'Mati City',
  'Malita',
  'Santa Cruz',
  'Bansalan',
  'Hagonoy',
  'Kiblawan',
  'Magsaysay',
  'Malalag',
  'Padada',
  'Sulop'
] as const; 