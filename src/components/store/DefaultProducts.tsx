
import { Product } from "@/components/shop/ProductCard";

export const getDefaultProducts = (storeId: string | undefined): Product[] => [
  {
    id: "default1",
    name: "Proizvod 1",
    price: 9900,
    image: "https://via.placeholder.com/300",
    slug: "proizvod-1",
    storeId: storeId,
    category: "furniture"
  },
  {
    id: "default2",
    name: "Proizvod 2",
    price: 12900,
    image: "https://via.placeholder.com/300",
    slug: "proizvod-2",
    storeId: storeId,
    category: "furniture"
  },
  {
    id: "default3",
    name: "Proizvod 3",
    price: 7900,
    image: "https://via.placeholder.com/300",
    slug: "proizvod-3",
    storeId: storeId,
    category: "kitchen"
  },
  {
    id: "default4",
    name: "Proizvod 4",
    price: 15900,
    image: "https://via.placeholder.com/300",
    slug: "proizvod-4",
    storeId: storeId,
    category: "lighting"
  }
];
