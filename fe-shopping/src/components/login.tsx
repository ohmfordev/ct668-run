"use client";

import { motion } from "framer-motion";
import Link from "next/link";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Swal from "sweetalert2";
import { useState } from "react";

export function Login() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");


  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await fetch("http://localhost:4000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.status == 200) {
        // แสดงข้อความสำเร็จ
        Swal.fire({
          icon: "success",
          title: "ล็อกอินสำเร็จ",
          text: data.message,
          showConfirmButton: true,
          // timer: 1500,
        }).then((result) => {
          if (result.isConfirmed) {
            localStorage.setItem("95c0c5912b84", data.body.token);
            localStorage.setItem("20b6c672f3f1", data.body.userId);
            console.log("Search query login call ", data.body.token);
            window.location.href = "/"; // Redirect ไปหน้า Home หลังจากกดปุ่ม OK
          }
        });
        // เก็บ token ใน Local Storage
      
        // Redirect ไปหน้า Home
        // router.push("/");
      } else {
        Swal.fire({
          icon: "error",
          title: "ข้อผิดพลาด",
          text: data.message || "ล็อกอินไม่สำเร็จ กรุณาลองอีกครั้ง",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "ข้อผิดพลาด",
        text: "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้",
      });
    }
  };


  return (
    <section className="relative z-0 flex min-h-[80vh] w-full flex-col items-center justify-center overflow-hidden rounded-md bg-background">
      <div className="absolute top-0 isolate z-0 flex w-full flex-1 items-start justify-center">
        <div className="absolute top-0 z-50 h-48 w-full bg-transparent opacity-10 backdrop-blur-md" />
        <div className="absolute inset-auto z-50 h-36 w-[28rem] -translate-y-[-30%] rounded-full bg-primary/60 opacity-80 blur-3xl" />
        <motion.div
          initial={{ width: "8rem" }}
          viewport={{ once: true }}
          transition={{ ease: "easeInOut", delay: 0.3, duration: 0.8 }}
          whileInView={{ width: "16rem" }}
          className="absolute top-0 z-30 h-36 w-64 -translate-y-[20%] rounded-full bg-primary/60 blur-2xl"
        />
        <motion.div
          initial={{ width: "15rem" }}
          viewport={{ once: true }}
          transition={{ ease: "easeInOut", delay: 0.3, duration: 0.8 }}
          whileInView={{ width: "30rem" }}
          className="absolute inset-auto z-50 h-0.5 w-[30rem] -translate-y-[-10%] bg-primary/60"
        />
      </div>
      <motion.div
        initial={{ y: 100, opacity: 0.5 }}
        viewport={{ once: true }}
        transition={{ ease: "easeInOut", delay: 0.3, duration: 0.8 }}
        whileInView={{ y: 0, opacity: 1 }}
        className="relative z-50 flex container justify-center flex-1 flex-col px-5 md:px-10 gap-4"
      >
        <form className="flex flex-col gap-2" onSubmit={handleLogin}>
          <h3 className="font-bold text-xl flex justify-center">Login Page</h3>
          <div>
            <Label>Username</Label>
            <Input value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>
          <div>
            <Label>Password</Label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <Button className="mt-2" type="submit">Login</Button>
          <Button className="mt-2">
            <Link href="/signup" className="w-full h-full">
              <span className="block w-full h-full text-center flex items-center justify-center">
                Regiser
              </span>
            </Link>
          </Button>
        </form>
      </motion.div>
    </section>
  );
}
