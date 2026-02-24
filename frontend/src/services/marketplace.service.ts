import api, { csrf } from "@/lib/api";
import { useMockData } from "@/lib/useMock";
import type {
  Listing,
  Order,
  ListingFilters,
  OrderFilters,
  PaginatedResponse,
} from "@/types";

const delay = (ms = 300) => new Promise<void>((r) => setTimeout(r, ms));

const mockListings: Listing[] = [
  {
    id: "lst_001",
    vendorId: "vnd_skyline",
    title: "3 Bedroom Apartment in Lekki Phase 1",
    description:
      "Luxury 3-bedroom apartment with modern finishes, fitted kitchen, and 24/7 security. Located in the heart of Lekki Phase 1 with easy access to major roads.",
    category: "property",
    price: 45_000_000,
    images: [],
    primaryImage: null,
    location: "Lekki Phase 1, Lagos",
    status: "active",
    featured: true,
    stockQuantity: 1,
    inStock: true,
    metadata: { bedrooms: 3, bathrooms: 3, sqm: 180, property_type: "Apartment" },
    allowInstallment: true,
    minUpfrontPercent: 40,
    installmentMarkup6m: 5,
    installmentMarkup12m: 10,
    vendor: {
      id: "vnd_skyline",
      firstName: "Skyline",
      lastName: "Realty",
      vendorProfile: { businessName: "Skyline Realty Group" },
    },
    createdAt: "2026-02-10T10:00:00Z",
    updatedAt: "2026-02-10T10:00:00Z",
  },
  {
    id: "lst_002",
    vendorId: "vnd_ade",
    title: "Toyota Camry 2024 (Foreign Used)",
    description:
      "Clean foreign used Toyota Camry 2024 with full option. Leather seats, reverse camera, Bluetooth, low mileage.",
    category: "automotive",
    price: 28_000_000,
    images: [],
    primaryImage: null,
    location: "Victoria Island, Lagos",
    status: "active",
    featured: false,
    stockQuantity: 2,
    inStock: true,
    metadata: {
      make: "Toyota",
      model: "Camry",
      year: "2024",
      mileage: "12,000 km",
      condition: "Foreign Used",
      transmission: "Automatic",
    },
    allowInstallment: true,
    minUpfrontPercent: 40,
    installmentMarkup6m: 5,
    installmentMarkup12m: 10,
    vendor: {
      id: "vnd_ade",
      firstName: "Ade",
      lastName: "Motors",
      vendorProfile: { businessName: "Ade Motors" },
    },
    createdAt: "2026-02-12T09:00:00Z",
    updatedAt: "2026-02-12T09:00:00Z",
  },
  {
    id: "lst_003",
    vendorId: "vnd_prime",
    title: "5 Bedroom Duplex in Ikoyi",
    description:
      "Exquisite 5-bedroom fully detached duplex with swimming pool, BQ, and smart home features. Premium Ikoyi location.",
    category: "property",
    price: 120_000_000,
    images: [],
    primaryImage: null,
    location: "Ikoyi, Lagos",
    status: "active",
    featured: true,
    stockQuantity: 1,
    inStock: true,
    metadata: { bedrooms: 5, bathrooms: 6, sqm: 450, property_type: "Duplex" },
    allowInstallment: true,
    minUpfrontPercent: 30,
    installmentMarkup6m: 3,
    installmentMarkup12m: 7,
    vendor: {
      id: "vnd_prime",
      firstName: "Prime",
      lastName: "Estates",
      vendorProfile: { businessName: "Prime Estates Nigeria" },
    },
    createdAt: "2026-02-08T14:00:00Z",
    updatedAt: "2026-02-08T14:00:00Z",
  },
  {
    id: "lst_004",
    vendorId: "vnd_ade",
    title: "Mercedes-Benz C300 2023",
    description:
      "Brand new Mercedes-Benz C300 with AMG package. Full manufacturer warranty, all papers complete.",
    category: "automotive",
    price: 42_000_000,
    images: [],
    primaryImage: null,
    location: "Ikeja, Lagos",
    status: "active",
    featured: false,
    stockQuantity: 1,
    inStock: true,
    metadata: {
      make: "Mercedes-Benz",
      model: "C300",
      year: "2023",
      mileage: "0 km",
      condition: "Brand New",
      transmission: "Automatic",
    },
    allowInstallment: true,
    minUpfrontPercent: 40,
    installmentMarkup6m: 5,
    installmentMarkup12m: 10,
    vendor: {
      id: "vnd_ade",
      firstName: "Ade",
      lastName: "Motors",
      vendorProfile: { businessName: "Ade Motors" },
    },
    createdAt: "2026-02-15T11:00:00Z",
    updatedAt: "2026-02-15T11:00:00Z",
  },
  {
    id: "lst_005",
    vendorId: "vnd_perazim",
    title: "2 Bedroom Flat in Yaba",
    description:
      "Affordable 2-bedroom flat in a gated estate. All rooms en-suite, prepaid meter, good road network.",
    category: "property",
    price: 8_500_000,
    images: [],
    primaryImage: null,
    location: "Yaba, Lagos",
    status: "active",
    featured: false,
    stockQuantity: 3,
    inStock: true,
    metadata: { bedrooms: 2, bathrooms: 2, sqm: 95, property_type: "Flat" },
    allowInstallment: false,
    minUpfrontPercent: 40,
    installmentMarkup6m: 5,
    installmentMarkup12m: 10,
    vendor: {
      id: "vnd_perazim",
      firstName: "Perazim",
      lastName: "Properties",
      vendorProfile: { businessName: "Perazim Properties" },
    },
    createdAt: "2026-02-18T16:00:00Z",
    updatedAt: "2026-02-18T16:00:00Z",
  },
  {
    id: "lst_006",
    vendorId: "vnd_savanna",
    title: "Rice Farming Investment (5 Hectares)",
    description:
      "Direct investment in rice farming. 5 hectares of irrigated farmland in Kebbi State. Includes planting, harvesting, and distribution.",
    category: "agriculture",
    price: 3_500_000,
    images: [],
    primaryImage: null,
    location: "Kebbi State",
    status: "active",
    featured: false,
    stockQuantity: 10,
    inStock: true,
    metadata: { type: "Rice Farming", land_size: "5 Hectares" },
    allowInstallment: false,
    minUpfrontPercent: 40,
    installmentMarkup6m: 5,
    installmentMarkup12m: 10,
    vendor: {
      id: "vnd_savanna",
      firstName: "Savanna",
      lastName: "Farms",
      vendorProfile: { businessName: "Savanna Farms Nigeria" },
    },
    createdAt: "2026-02-20T08:00:00Z",
    updatedAt: "2026-02-20T08:00:00Z",
  },
];

export const marketplaceService = {
  async getListings(
    filters?: ListingFilters,
  ): Promise<PaginatedResponse<Listing>> {
    if (useMockData()) {
      await delay();

      let items = [...mockListings];

      if (filters?.search) {
        const q = filters.search.toLowerCase();
        items = items.filter(
          (l) =>
            l.title.toLowerCase().includes(q) ||
            l.description.toLowerCase().includes(q) ||
            l.location.toLowerCase().includes(q),
        );
      }
      if (filters?.category && filters.category !== "all") {
        items = items.filter((l) => l.category === filters.category);
      }
      if (filters?.installmentOnly) {
        items = items.filter((l) => l.allowInstallment);
      }

      if (filters?.sort === "price_asc")
        items.sort((a, b) => a.price - b.price);
      else if (filters?.sort === "price_desc")
        items.sort((a, b) => b.price - a.price);
      else
        items.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );

      const page = filters?.page || 1;
      const perPage = filters?.perPage || 6;
      const start = (page - 1) * perPage;

      return {
        data: items.slice(start, start + perPage),
        meta: {
          total: items.length,
          page,
          perPage,
          totalPages: Math.ceil(items.length / perPage),
        },
      };
    }

    const params = new URLSearchParams();
    if (filters?.search) params.append("search", filters.search);
    if (filters?.category && filters.category !== "all")
      params.append("category", filters.category);
    if (filters?.minPrice !== undefined)
      params.append("minPrice", String(filters.minPrice));
    if (filters?.maxPrice !== undefined)
      params.append("maxPrice", String(filters.maxPrice));
    if (filters?.sort) params.append("sort", filters.sort);
    if (filters?.page) params.append("page", String(filters.page));
    if (filters?.perPage) params.append("perPage", String(filters.perPage));

    const { data } = await api.get(`/listings?${params.toString()}`);
    return {
      data: data.data as Listing[],
      meta: data.meta,
    };
  },

  async getListingById(id: string): Promise<Listing | null> {
    if (useMockData()) {
      await delay();
      return mockListings.find((l) => l.id === id) ?? null;
    }
    try {
      const { data } = await api.get(`/listings/${id}`);
      return data.listing as Listing;
    } catch {
      return null;
    }
  },

  async purchaseFromWallet(listingId: string): Promise<Order> {
    if (useMockData()) {
      await delay(1500);
      throw new Error("Mock purchases not supported");
    }
    await csrf();
    const { data } = await api.post(`/listings/${listingId}/purchase`);
    return data.order as Order;
  },

  async getUserOrders(
    filters?: OrderFilters,
  ): Promise<PaginatedResponse<Order>> {
    if (useMockData()) {
      await delay();
      return {
        data: [],
        meta: { total: 0, page: 1, perPage: 20, totalPages: 0 },
      };
    }
    const params = new URLSearchParams();
    if (filters?.status) params.append("status", filters.status);
    if (filters?.page) params.append("page", String(filters.page));
    if (filters?.perPage) params.append("perPage", String(filters.perPage));

    const { data } = await api.get(`/orders?${params.toString()}`);
    return {
      data: data.data as Order[],
      meta: data.meta,
    };
  },
};
