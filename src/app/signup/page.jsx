"use client";

import { useRouter } from "next/navigation";
import { useContext, useState } from "react";

import { USER } from "@/api/apiServices";
import showToast from "@/util/showToast";
import { SignUpForm } from "@/components/signup-form";
import { UserContext } from "@/context/UserProvider";

export default function Page() {
  const router = useRouter();
  const { setUser } = useContext(UserContext);

  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [confirmpassword, setConfirmpassword] = useState();
  const [password, setPassword] = useState();
  const [pic, setPic] = useState();
  const [loading, setLoading] = useState(false);

  const submitHandler = async () => {
    setLoading(true);
    if (!name || !email || !password || !confirmpassword || !pic) {
      showToast("Please Fill all the Fields", "");
      setLoading(false);
      return;
    }
    if (password !== confirmpassword) {
      showToast("Passwords Do Not Match", "");
      return;
    }
    try {
      const response = await USER.register({
        name,
        email,
        password,
        pic,
      });
      if (response.data) {
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
        showToast("Registration Successful", "");
        setLoading(false);
        router.push("/");
      } else {
        throw response.error;
      }
    } catch (error) {
      showToast("Error Occured!", "");
      setLoading(false);
    }
  };

  const postDetails = (pics) => {
    setLoading(true);
    if (pics === undefined) {
      showToast("Please Select an Image!", "");
      return;
    }
    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "gfdxvyye");
      data.append("cloud_name", "dohnlambm");
      fetch("https://api.cloudinary.com/v1_1/dohnlambm/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    } else {
      toast("Please Select an Image!", "");
      setLoading(false);
      return;
    }
  };
  return (
    <div className="flex w-full h-screen items-center justify-center px-4 mt-10">
      <SignUpForm
        name={name}
        setName={setName}
        email={email}
        setEmail={setEmail}
        confirmpassword={confirmpassword}
        setConfirmpassword={setConfirmpassword}
        password={password}
        setPassword={setPassword}
        submitHandler={submitHandler}
        loading={loading}
        postDetails={postDetails}
      />
    </div>
  );
}
