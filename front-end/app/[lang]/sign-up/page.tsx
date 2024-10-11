"use client";
import { useState, useEffect } from "react";
import Background from "@/components/Background";
import { Card } from "@/components/ui/card";
import { BsLightningChargeFill } from "react-icons/bs";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { FaArrowsSpin } from "react-icons/fa6";
import { LanguageSwitcher } from "@/components/lang-switcher";

const Page = () => {
  const params = useParams();
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [messageError, setMessageError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userQueryEmail, setUserQueryEmail] = useState<string | null>("");
  const queryParams = useSearchParams();

  useEffect(() => {
    setUserQueryEmail(queryParams.get("email"));
    const token = window.localStorage.getItem("token");
    if (token) {
      router.push(`/${params.lang}/`);
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
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_ROUTE_V2}/auth/signup`, data);
      setMessage(response.data.message);
      window.sessionStorage.setItem("email", response.data.email);
      setLoading(false);
      setTimeout(() => {
        window.location.href = `/${params.lang}/sign-in`;
      }, 300);
    } catch (error: any) {
      setMessageError(true);
      setMessage(error.response.data.message);
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
            <h1 className="text-4xl text-white font-bold mb-2">Sign Up</h1>
            <p className="text-text-gray">
              Already have an account?{" "}
              <Link href={`/${params.lang}/sign-in`} className="text-bright-blue underline">
                Sign in.
              </Link>
            </p>
          </div>

          <form onSubmit={onSubmit} className="mt-7 pb-[20px] md:pb-[40px]">
            <div className="mb-3">
              <label htmlFor="email" className="text-text-gray">
                Email
              </label>
              <Input
                name="email"
                className="bg-white text-black mt-[5px]"
                placeholder="example@gmail.com"
                type="email"
                defaultValue={userQueryEmail ? userQueryEmail : ""}
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
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="email" className="text-text-gray">
                Confirm Password
              </label>
              <Input
                name="confirmPassword"
                placeholder="@#$%"
                className="bg-white text-black mt-[5px]"
                type="password"
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                }}
                required
              />
              {password.length > 0 && confirmPassword.length > 0 && password !== confirmPassword ? (
                <p className={`${confirmPassword !== password ? "text-red-500" : "text-green-500"}  mt-[8px]`}>
                  {confirmPassword !== password ? "passwords must match!" : ""}
                </p>
              ) : (
                <></>
              )}
            </div>
            <Button
              type="submit"
              disabled={loading || password !== confirmPassword}
              className="w-full mt-6 bg-bright-blue text-white font-bold hover:text-black"
            >
              {loading ? (
                <FaArrowsSpin className="animate-spin" style={{ animationDuration: "2s" }} size={15} />
              ) : (
                "Sign Up"
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
