"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import Swal from "sweetalert2";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async  (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
   

    try {
      const response = await fetch("http://3.0.50.174:4000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.status === 201) {
        Swal.fire({
          icon: "success",
          title: "สมัครสำเร็จ",
          text: data.message,
          showConfirmButton: true,
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.href = "/login"; // Redirect ไปหน้า Home หลังจากกดปุ่ม OK
          }
        });
      } else if (data.status === 409) {
        Swal.fire({
          icon: "error",
          title: "ข้อมูลซ้ำ",
          text: data.error,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "ข้อผิดพลาด",
          text: "เกิดข้อผิดพลาดในการสมัครสมาชิก กรุณาลองอีกครั้ง",
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
        <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
          <h3 className="font-bold text-xl flex justify-center">Signup</h3>
          <div>
            <Label>Username</Label>
            <Input value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>
          <div>
            <Label>Password</Label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <Button className="mt-2" type="submit">SUMMIT</Button>
          <Button className="mt-2">
            <Link href="/login" className="w-full h-full">
              <span className="block w-full h-full text-center flex items-center justify-center">
                LOGIN
              </span>
            </Link>
          </Button>
        </form>
      </motion.div>
    </section>
  );
}
