import { AssetCategory, AssetStatus } from "./common";

export interface Asset {
  id: string;
  vendorId: string;
  vendorName: string;
  title: string;
  description: string;
  category: AssetCategory;
  price: number;
  images: string[];
  location: string;
  specifications?: Record<string, string>;
  status: AssetStatus;
  saversCount: number;
  createdAt: string;
}
