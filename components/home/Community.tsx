"use client";
import Image from "next/image";
import Link from "next/link";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import LoginComponent from "../global/Login";
import { ArrowRight } from "lucide-react";
import { useRoleStore } from "@/utils/loginStore";

export default function CommunitySection() {
  const { role, setRole } = useRoleStore();
  return (
    <>
      <div className="flex relative justify-between flex-col-reverse sm:flex-row items-center mx-auto max-w-[85%] text-white h-[265px] px-6 sm:px-[50px] rounded-lg bg-[#0d2126] mt-[200px]">
        <div className="flex flex-col items-start justify-center gap-4 max-w-[600px] h-full ">
          <h2 className="text-2xl sm:text-[32px] font-bold max-w-[400px]">
            Onboard best <br /> <span className="text-primary">talent</span>{" "}
            &nbsp;in minutes*
          </h2>
          <p className="font-medium text-sm">
            Hire top talent from our exclusive pool or <br /> evaluate
            candidates instantly with our AI-powered solution.
          </p>
          <div className="flex mt-4">
            <Dialog>
              <DialogTrigger className="z-10">
                <div
                  onClick={() => setRole("recruiter")}
                  className="flex gap-4 z-10 items-center w-[200px] h-[35px] justify-center rounded-lg bg-primary hover:bg-primary-dark text-white text-sm font-semibold md:py-3 pl-4 duration-100 px-2 md:px-3 md:max-w-[300px]"
                >
                  {" "}
                  Recruit in no time
                  <ArrowRight size={24} />
                </div>
              </DialogTrigger>
              <DialogContent className="bg-transparent border-none max-w-3xl shadow-none">
                <LoginComponent />
              </DialogContent>
            </Dialog>
            <Link
              href="/recruit"
              className=" flex gap-4 items-center w-[200px] h-[35px] justify-center border-2 rounded-lg text-sm font-semibold md:py-3 pl-4 md:pl-8 px-2 md:px-3 hover:bg-gray-700 duration-100 md:max-w-[300px] ml-5"
            >
              Know More
              <ArrowRight size={24} />
            </Link>
          </div>
        </div>
        <div className="sm:h-[300px] max-w-[400px] absolute top-0 -translate-y-[60%] right-24">
          <Image
            src="/home/recruit/Recruiter.svg"
            height={300}
            width={500}
            alt="community"
            className="w-full h-auto"
          />
        </div>
      </div>
    </>
  );
}
