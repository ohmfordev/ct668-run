"use client";

import { Header } from "@/components/header";
import { BlogSection } from "@/components/blog-section";
import { LoginSearch } from "@/components/login-search";
import { useState, useEffect } from "react";

export default function HomePage() {
  const [totalItems, setTotalItems] = useState(0);
  const [searchQuery, setSearchQuery] = useState(""); // สร้าง state สำหรับจัดเก็บข้อมูลการค้นหา
  const [userId, setUserId] = useState<string | null>(null);
  useEffect(() => {
    // ดึง userId จาก localStorage
    if (typeof window !== "undefined") {
      const storedUserId = localStorage.getItem("20b6c672f3f1");
      if (!storedUserId) {
        console.error("User ID is null. Redirecting to login...");
        window.location.href = "/login";
      } else {
        setUserId(storedUserId);
      }
    }
  }, []);

  const updateCartCount = async () => {
    if (!userId) return; // ไม่ทำงานถ้า userId ยังไม่มี
    console.log("Call Data");
    try {
      const response = await fetch("http://localhost:4000/cart/" + userId);
      if (!response.ok)
        throw new Error(`Failed to fetch cart data: ${response.statusText}`);
      const data = await response.json();
      const totalQuantity = data.items.reduce(
        (sum: number, item: { quantity: number }) => sum + item.quantity,
        0
      );
      setTotalItems(totalQuantity);
      console.log("totalQuantity cart data:", totalQuantity);
    } catch (error) {
      console.error("Error fetching cart data:", error);
    }
  };

  useEffect(() => {
    if (userId) {
      updateCartCount();
    }
  }, [userId]);

  useEffect(() => {
    console.log("Search query in HomePage:", searchQuery);
  }, [searchQuery]);

  // ถ้า userId ยังไม่มี ให้แสดง Loading UI
  if (!userId) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Header totalItems={totalItems} />
      <LoginSearch setSearchQuery={setSearchQuery} />
      <BlogSection updateCartCount={updateCartCount} searchQuery={searchQuery} />
    </>
  );
}
