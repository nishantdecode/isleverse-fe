"use client";

import { USER } from "@/api/apiServices";
import { LoginForm } from "@/components/login-form";
import { UserContext } from "@/context/UserProvider";
import showToast from "@/util/showToast";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";

export default function Page() {
  const router = useRouter();
  const { setUser } = useContext(UserContext);

  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [loading, setLoading] = useState(false);

  const submitHandler = async () => {
    setLoading(true);
    if (!email || !password) {
      showToast("Please Fill all the Fields", "");
      setLoading(false);
      return;
    }
    try {
      const response = await USER.login({ email, password });
      if (response.data) {
        showToast("Login Successful!", "");
        setUser({
          id: response.data._id,
          name: response.data.name,
          email: response.data.email,
          isAdmin: response.data.isAdmin,
          pic: response.data.pic,
        });
        localStorage.setItem(
          "accessToken",
          JSON.stringify(response.data.token)
        );
        setLoading(false);
        router.push("/");
      } else {
        showToast("Error loggin in!", "");
      }
    } catch (error) {
      toast("Error Occured!", "");
      setLoading(false);
    }
  };
  return (
    <div className="flex w-full h-screen items-center justify-center px-4 mt-10">
      <LoginForm
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        submitHandler={submitHandler}
        loading={loading}
      />
    </div>
  );
}
