/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['cdn.dummyjson.com'], // ระบุโดเมนของภาพที่ต้องการอนุญาต
  },
  reactStrictMode: true, // ช่วยให้เห็น warning ที่อาจจะเกิดขึ้นใน development
  swcMinify: true, // ใช้ SWC เพื่อ minify โค้ดสำหรับการ build
  output: 'standalone', // สำหรับการ deploy บน Docker หรือแพลตฟอร์ม Serverless
  
  // อนุญาต experimental app directory หากต้องการใช้
  experimental: {
    appDir: true,
  },

  // หากมี dynamic routes ที่ทำให้เกิดปัญหาในการ export
  // คุณสามารถใช้คำสั่งนี้เพื่อตรวจสอบเส้นทางก่อนการ export
  trailingSlash: true,

  // หากต้องการจัดการ environment variables ใน build time
  // env: {
  //   API_URL: 'http://localhost:4000', // กำหนด URL ของ API
  // },
};

export default nextConfig;
