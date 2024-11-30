"use client";

import { Header } from "@/components/header";
import { Component } from "@/components/component";
import { useState, useEffect } from "react";

export default function ChartListPage() {
  const [totalItems, setTotalItems] = useState(0);
  const [userId, setUserId] = useState<string | null>(null); // เพิ่ม state สำหรับ userId

  // ฟังก์ชันอัปเดตจำนวนสินค้าในตะกร้า
  const updateCartCount = async () => {
    if (!userId) return; // หยุดทำงานถ้า userId ไม่มี
    try {
      const response = await fetch("http://3.0.50.174:4000/cart/" + userId);
      if (!response.ok)
        throw new Error(`Failed to fetch cart data: ${response.statusText}`);
      const data = await response.json();
      const totalQuantity = data.items.reduce(
        (sum: number, item: { quantity: number }) => sum + item.quantity,
        0
      );
      setTotalItems(totalQuantity);
    } catch (error) {
      console.error("Error fetching cart data:", error);
    }
  };

  // ตรวจสอบ userId และ Redirect ไป Login ถ้าไม่มี
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserId = localStorage.getItem("20b6c672f3f1");
      if (!storedUserId) {
        console.error("User ID not found. Redirecting to login...");
        window.location.href = "/login"; // Redirect ไปหน้า Login
      } else {
        setUserId(storedUserId); // ตั้งค่า userId
      }
    }
  }, []);

  // อัปเดตจำนวนสินค้าในตะกร้าเมื่อ userId พร้อม
  useEffect(() => {
    if (userId) {
      updateCartCount();
    }
  }, [userId]);

  // ถ้า userId ยังไม่มี ให้แสดง Loading UI
  if (!userId) {
    return <div>Loading...</div>;
  }


  
  return (
    <>
      <Header totalItems={totalItems} /> {/* ส่ง totalItems ไปที่ Header */}
      <Component updateCartCount={updateCartCount} />
    </>
  );
}
