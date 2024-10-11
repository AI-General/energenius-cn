"use client";
import { useState, useRef, useEffect } from "react";
import Background from "@/components/Background";
import { Card } from "@/components/ui/card";
import { BsLightningChargeFill } from "react-icons/bs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { FaArrowsSpin } from "react-icons/fa6";
import { LanguageSwitcher } from "@/components/lang-switcher";

const Page = () => {
  const params = useParams();
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [messageError, setMessageError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState<any>(null);

  useEffect(() => {
    const token = window.localStorage.getItem("token");
    const email = window.sessionStorage.getItem("email");
    if (email) {
      setEmail(email);
    }
    if (token) {
      router.push(`/${params.lang}/dashboard`);
    }
  }, []);

  const onSubmit = async (e: any) => {
    setLoading(true);
    setMessage("");
    setMessageError(false);
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      email: formData.get("email"),
      password: formData.get("password"),
    };
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_ROUTE_V2}/auth/signin`, data);
      setMessage(response.data.message);
      window.localStorage.setItem("token", response.data.token);
      window.localStorage.setItem("user", JSON.stringify(response.data.user));
      setLoading(false);
      setTimeout(() => {
        window.location.href = `/${params.lang}/dashboard`;
      }, 300);
    } catch (error: any) {
      setMessageError(true);
      setMessage(error.response?.data.message);
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center w-[100vw] h-[100vh] relative">
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>
      <Background />
      <Card className="bg-dark-blue border-2 border-[#5E5E5E] p-4 md:p-8 w-[95%] md:w-[35%] min-h-[50%] md:min-h-[70%]">
        <div onClick={() => router.push(`/${params.lang}/`)} className="flex items-center cursor-pointer float-right">
          <div className="w-6 h-6 mr-2 rounded-full bg-bright-blue flex items-center justify-center text-dark-blue">
            <BsLightningChargeFill />
          </div>
          <h1 className="text-[1.1rem] md:text-[1.3rem] font-bold">Energenius</h1>
        </div>
        <div className="pt-[10%]">
          <div>
            <h1 className="text-4xl text-white font-bold mb-2">Sign in</h1>
            <p className="text-text-gray">
              Don&apos;t have an account?{" "}
              <Link href={`/${params.lang}/sign-up`} className="text-bright-blue underline">
                Sign up.
              </Link>
            </p>
          </div>

          <form onSubmit={onSubmit} className="mt-7">
            <div className="mb-3">
              <label htmlFor="email" className="text-text-gray">
                Email
              </label>
              <Input
                name="email"
                className="bg-white text-black mt-[5px]"
                placeholder="example@gmail.com"
                type="email"
                defaultValue={email ? email : ""}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="text-text-gray">
                Password
              </label>
              <Input
                name="password"
                placeholder="@#$%"
                className="bg-white text-black mt-[5px]"
                type="password"
                required
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full mt-6 bg-bright-blue text-white font-bold hover:text-black"
            >
              {loading ? (
                <FaArrowsSpin className="animate-spin" style={{ animationDuration: "2s" }} size={15} />
              ) : (
                "Sign In"
              )}
            </Button>
            {message.length > 0 && (
              <p className={`${messageError ? "text-red-500" : "text-green-500"} mt-4 text-center`}>{message}</p>
            )}
          </form>
        </div>
      </Card>
    </div>
  );
};

export default Page;
