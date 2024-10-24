"use client";

import Link from "next/link";
import Image from "next/image";
import { useContext } from "react";
import { useTheme } from "next-themes";
import { usePathname, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { User } from "lucide-react";

import { ModeToggle } from "./modeToggle";
import { UserContext } from "@/context/UserProvider";

export function AppBar() {
  const router = useRouter();
  const pathname = usePathname();

  const { theme } = useTheme();
  const { user, setUser } = useContext(UserContext);

  const isAuthPage = ["login", "signup"].includes(pathname.split("/")[1])
    ? true
    : false;
  return (
    <nav className="fixed inset-x-0 top-0 z-50 bg-white shadow-sm dark:bg-inherit">
      <div className="w-full max-w-7xl mx-auto px-2">
        <div className="flex justify-between h-14 items-center">
          <Link href="/" className="flex items-center" prefetch={false}>
            {theme === "light" || theme === undefined ? (
              <Image src="/isleverse.png" width={150} height={30} />
            ) : (
              <Image src="/isleverseWhite.png" width={150} height={30} />
            )}
          </Link>
          <div className="flex items-center gap-4">
            <ModeToggle />
            {!isAuthPage &&
              (user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="icon" className="rounded-full overflow-hidden">
                      <Image
                        src={user.pic || ""}
                        height={54}
                        width={54}
                        alt="User profile picture"
                      />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => {
                        setUser(null);
                        localStorage.removeItem("accessToken");
                        router.push("/login");
                      }}
                    >
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="icon" className="rounded-full">
                      <User className="h-[1.2rem] w-[1.2rem]" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => {
                        router.push("/login");
                      }}
                    >
                      Sign in
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        router.push("/login");
                      }}
                    >
                      Sign Up
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
