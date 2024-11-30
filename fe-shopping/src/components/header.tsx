"use client";


import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MobileNavbar } from "@/components/mobile-navbar";
interface HeaderProps {
  totalItems: number;
}


export function Header({ totalItems }: HeaderProps) {
  // const [totalItems, setTotalItems] = useState(0);

  // const updateCartCount = async () => {
  //   try {
  //     const response = await fetch("http://localhost:4000/cart/1");
  //     if (!response.ok) throw new Error(`Failed to fetch cart data: ${response.statusText}`);
  //     const data = await response.json();

  //     // คำนวณจำนวนสินค้าทั้งหมด
  //     const totalQuantity = data.items.reduce((sum: number, item: { quantity: number }) => sum + item.quantity, 0);
  //     setTotalItems(totalQuantity);
  //   } catch (error) {
  //     console.error("Error fetching cart data:", error);
  //   }
  // };

  // // เรียกฟังก์ชัน updateCartCount เพื่ออัพเดทครั้งแรกเมื่อ component โหลด
  // useEffect(() => {
  //   updateCartCount();
  // }, []);


  return (
    <header className="container flex items-center justify-between gap-10 py-4">
      <Link href="/" className="flex items-center gap-3" />
      <div className="flex items-center gap-10">
        
        <div className="hidden items-center md:flex gap-10">
          
          <a href="/cart-list" className="relative flex md-2 text-red-500">
            <Image
              alt="Image"
              src="/images/istockphoto-1206806317-612x612.jpg"
              width={100}
              height={50}
              blurDataURL="https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.istockphoto.com%2Fphotos%2Fcart&psig=AOvVaw1wMq-VvWybOuaS0Y8AjBUF&ust=1729902561598000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCLjhmq6jqIkDFQAAAAAdAAAAABAE"
              placeholder="blur"
              className="flex justify-end"
            />
            <span>{totalItems}</span>
          </a>
          <Button asChild>
      <Link
        href="/login"
        className="cursor-pointer w-full"
        onClick={() => {
          localStorage.clear(); // Clear localStorage on logout
        }}
      >
        LOGOUT
      </Link>
    </Button>

          <Button asChild>
            <Link href="/" className="cursor-pointer w-full">
              Home
            </Link>
          </Button>
          
        </div>
      </div>
    </header>
  );
}
