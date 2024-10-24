"use client";

import { usePathname, useRouter } from "next/navigation";
import React, { createContext, useEffect, useState } from "react";

import showToast from "@/util/showToast";
import { USER } from "@/api/apiServices";

const noAuthPrefixes = ["login", "signup", "forgetPassword"];

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const page = pathname.split("/");

  const [user, setUser] = useState(null);

  let accessToken = null;
  if (typeof window !== "undefined" && window.localStorage) {
    accessToken = JSON.parse(localStorage.getItem("accessToken"));
  }

  const verifyUser = async () => {
    try {
      if (accessToken) {
        const response = await USER.verify();
        console.log(response);
        if (response.data) {
          setUser({
            id: response.data._id,
            name: response.data.name,
            email: response.data.email,
            isAdmin: response.data.isAdmin,
            pic: response.data.pic,
          });
          localStorage.setItem("accessToken", JSON.stringify(response.data.token));
        } else {
          throw response.error;
        }
      } else {
        showToast("Logged out!", "Please Login again.");
        router.push("/login");
      }
    } catch (err) {
      showToast("Token Expired!", "Please Login again.");
      router.push("/login");
    }
  };

  useEffect(() => {
    if (!noAuthPrefixes.includes(page[page.length - 1])) {
      verifyUser();
    }
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
export { UserContext };
