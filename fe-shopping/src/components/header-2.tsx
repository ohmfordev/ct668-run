import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { MobileNavbar } from "@/components/mobile-navbar";

export function Header2() {
  return (
    <header className="container flex items-center justify-between gap-10 py-4">
      <Link href="/" className="flex items-center gap-3" />
      <div className="flex items-center gap-10">
        <div className="hidden items-center md:flex gap-10">
          <div className="relative flex md-2 text-red-500">
            <Image
              alt="Image"
              src="/images/istockphoto-1206806317-612x612.jpg"
              width={50}
              height={20}
              blurDataURL="https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.istockphoto.com%2Fphotos%2Fcart&psig=AOvVaw1wMq-VvWybOuaS0Y8AjBUF&ust=1729902561598000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCLjhmq6jqIkDFQAAAAAdAAAAABAE"
              placeholder="blur"
              className="flex justify-end"
            />
            <span>1</span>
          </div>
          <Button asChild>
            <Link href="/login" className="cursor-pointer w-full">
              LOGOUT
            </Link>
          </Button>
        </div>
      </div>
      {/* <MobileNavbar>
        <div className="rounded-b-lg bg-background py-4 container text-foreground shadow-xl">
          <nav className="flex flex-col gap-1 pt-2">
            <Link
              href="/about"
              className="flex w-full cursor-pointer items-center rounded-md p-2 font-medium text-muted-foreground hover:text-foreground"
            >
              About
            </Link>
            <Link
              href="/docs"
              className="flex w-full cursor-pointer items-center rounded-md p-2 font-medium text-muted-foreground hover:text-foreground"
            >
              Docs
            </Link>
            <Link
              href="/blog"
              className="flex w-full cursor-pointer items-center rounded-md p-2 font-medium text-muted-foreground hover:text-foreground"
            >
              Blog
            </Link>
            <Link
              href="/pricing"
              className="flex w-full cursor-pointer items-center rounded-md p-2 font-medium text-muted-foreground hover:text-foreground"
            >
              Pricing
            </Link>
            <Button size="lg" asChild className="mt-2 w-full">
              <Link href="#" className="cursor-pointer">
                Get Started
              </Link>
            </Button>
          </nav>
        </div>
      </MobileNavbar> */}
    </header>
  );
}
