import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";

export function LoginSearch({ setSearchQuery }: { setSearchQuery: (query: string) => void }) {
  const [input, setInput] = useState("");

  const handleSearch = () => {
    setSearchQuery(input); // ส่งข้อมูลการค้นหาไปที่ HomePage
    console.log("Search query received:", input);
  };

  return (
    <form
      className="flex items-center space-x-2 justify-center"
      onSubmit={(e) => {
        e.preventDefault();
        handleSearch();
      }}
    >
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Search..."
        className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <Button type="submit" className="mt-2">
        Search
      </Button>
    </form>
  );
}
