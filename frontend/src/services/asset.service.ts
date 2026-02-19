import { Asset, PaginatedResponse, AssetCategory } from "@/types";
import { mockAssets } from "@/data";

const delay = (ms = 300) => new Promise<void>((r) => setTimeout(r, ms));

interface AssetFilters {
  category?: AssetCategory;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  page?: number;
  perPage?: number;
}

export const assetService = {
  async getAssets(filters?: AssetFilters): Promise<PaginatedResponse<Asset>> {
    await delay();
    let filtered = [...mockAssets];

    if (filters?.category) {
      filtered = filtered.filter((a) => a.category === filters.category);
    }
    if (filters?.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(
        (a) =>
          a.title.toLowerCase().includes(search) ||
          a.description.toLowerCase().includes(search) ||
          a.location.toLowerCase().includes(search),
      );
    }
    if (filters?.minPrice !== undefined) {
      filtered = filtered.filter((a) => a.price >= filters.minPrice!);
    }
    if (filters?.maxPrice !== undefined) {
      filtered = filtered.filter((a) => a.price <= filters.maxPrice!);
    }
    if (filters?.location) {
      filtered = filtered.filter((a) =>
        a.location.toLowerCase().includes(filters.location!.toLowerCase()),
      );
    }

    filtered.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    const page = filters?.page || 1;
    const perPage = filters?.perPage || 12;
    const start = (page - 1) * perPage;
    const data = filtered.slice(start, start + perPage);

    return {
      data,
      meta: {
        total: filtered.length,
        page,
        perPage,
        totalPages: Math.ceil(filtered.length / perPage),
      },
    };
  },

  async getAssetById(id: string): Promise<Asset | null> {
    await delay();
    return mockAssets.find((a) => a.id === id) || null;
  },

  async getVendorAssets(vendorId: string): Promise<Asset[]> {
    await delay();
    return mockAssets.filter((a) => a.vendorId === vendorId);
  },
};
