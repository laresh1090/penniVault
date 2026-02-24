export type ListingCategory = "property" | "automotive" | "agriculture" | "other";
export type ListingStatus = "active" | "sold" | "draft" | "archived";
export type OrderStatus = "pending" | "confirmed" | "delivered" | "cancelled" | "refunded";

export interface ListingVendor {
  id: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  vendorProfile?: {
    businessName: string;
    businessType?: string;
    businessLogoUrl?: string;
    isApproved?: boolean;
  };
}

export interface Listing {
  id: string;
  vendorId: string;
  title: string;
  description: string;
  category: ListingCategory;
  price: number;
  images: string[];
  primaryImage: string | null;
  location: string;
  status: ListingStatus;
  featured: boolean;
  stockQuantity: number;
  inStock: boolean;
  metadata: Record<string, unknown> | null;
  allowInstallment: boolean;
  minUpfrontPercent: number;
  installmentMarkup6m: number;
  installmentMarkup12m: number;
  vendor?: ListingVendor;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  buyerId: string;
  listingId: string;
  vendorId: string;
  amount: number;
  commissionAmount: number;
  vendorAmount: number;
  status: OrderStatus;
  reference: string;
  paymentMethod: "full" | "installment";
  metadata: Record<string, unknown> | null;
  listing?: {
    id: string;
    title: string;
    category: string;
    primaryImage: string | null;
  };
  buyer?: {
    id: string;
    firstName: string;
    lastName: string;
  };
  vendor?: {
    id: string;
    firstName: string;
    lastName: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ListingFilters {
  search?: string;
  category?: ListingCategory | "all";
  minPrice?: number;
  maxPrice?: number;
  installmentOnly?: boolean;
  sort?: "newest" | "price_asc" | "price_desc";
  page?: number;
  perPage?: number;
}

export interface OrderFilters {
  status?: OrderStatus;
  page?: number;
  perPage?: number;
}
