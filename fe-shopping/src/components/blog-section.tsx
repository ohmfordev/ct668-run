"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface CardData {
  id: number;
  title: string;
  description: string;
  price: number;
  thumbnail: string;
}

interface BlogSectionProps {
  updateCartCount: () => void;
  searchQuery: string; // เพิ่ม searchQuery ลงใน interface
}

export function BlogSection({ updateCartCount ,searchQuery  }: BlogSectionProps) {
  const [cardData, setCardData] = useState<CardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const userId = localStorage.getItem("20b6c672f3f1");

  const itemsPerPage = 6;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // ตั้งค่าการโหลดข้อมูลเป็น true ก่อนเริ่มดึงข้อมูล
      const queryParam = searchQuery ? `?product=${searchQuery}` : "?product=GetAllData";

      try {
        const response = await fetch(`http://3.0.50.174:4000/products/search${queryParam}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.statusText}`);
        }

        const data: CardData[] = await response.json();
        setCardData(data);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchQuery]);


  useEffect(() => {
    console.log("Search query received in BlogSection:", searchQuery);
  }, [searchQuery]);

  const handleAddToCart = async (productId: number) => {
    try {
      const response = await fetch("http://3.0.50.174:4000/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          productId: productId,
          quantity: 1,
        }),
      });
      if (!response.ok) {
        throw new Error(`Failed to add to cart: ${response.statusText}`);
      }
      updateCartCount();
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  // Pagination logic
  const lastItemIndex = currentPage * itemsPerPage;
  const firstItemIndex = lastItemIndex - itemsPerPage;
  const currentItems = cardData.slice(firstItemIndex, lastItemIndex);

  const totalPages = Math.ceil(cardData.length / itemsPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <section className="container flex flex-col items-center gap-6 py-24 sm:gap-7">
      <div className="flex flex-col gap-3">
        <h2 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl text-center">
          Shopping Lists
        </h2>
      </div>
      <div className="mt-6 grid auto-rows-fr grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
        {currentItems.map((card) => (
          <div key={card.id}>
            <Card className="h-full shadow-lg">
              <CardContent className="flex h-full flex-col items-start gap-5 p-5">
                <div className="relative h-52 w-full">
                  <Image
                    alt={card.description}
                    src={card.thumbnail}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
                <div className="flex flex-1 flex-col gap-4">
                  <h4 className="text-lg font-semibold">{card.title}</h4>
                  <p className="text-lg font-semibold">${Number(card.price).toFixed(2)}</p>
                  <p className="mb-auto text-muted-foreground">{card.description}</p>
                  <div className="flex items-center gap-3 justify-center">
                    <Button onClick={() => handleAddToCart(card.id)}>
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-4 mt-6">
        <Button onClick={prevPage} disabled={currentPage === 1}>
          Previous
        </Button>
        <span>Page {currentPage} of {totalPages}</span>
        <Button onClick={nextPage} disabled={currentPage === totalPages}>
          Next
        </Button>
      </div>
    </section>
  );
}
