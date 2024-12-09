"use client";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import Image from "next/image";
import { ChevronDown } from "lucide-react";

export function CommunityComponent() {
  return (
    
    <div className="hover:text-black text-[#697386] flex items-center gap-2 group relative focus:text-black transition-all py-2 px-4 rounded-lg duration-500 hover:transform ">
      <div>Talent</div>
      <ChevronDown className="w-4 h-4 text-[#697386] group-hover:-rotate-180 group-hover:text-black transition-all duration-100" />
      <div className="max-h-0 flex flex-col items-center overflow-hidden opacity-0 scale-75 transition-all duration-500 group-hover:max-h-screen group-focus:max-h-screen group-hover:opacity-100 group-hover:scale-100 group-focus:flex group-focus:opacity-100 group-focus:scale-100 absolute top-[110%] left-0 bg-[#f9f9f9] w-[180px] rounded-xl shadow-[0px_0px_1px_rgba(0,0,0,0.3)] px-2">
        <Link
          href={"/community"}
          className="p-2 hover:bg-primary-foreground w-full text-center duration-400 rounded-lg font-normal mt-2"
        >
          {" "}
          Smart Community
        </Link>
        <div className="grid grid-cols-3 place-items-center w-full mb-2">
          <Link
            href={"https://chat.whatsapp.com/G8sVXPrblUwDkttwTxnb2z"}
            target="_blank"
            className="p-3 rounded-lg hover:bg-primary-foreground duration-400"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="#8c52ff"
              className="bi bi-whatsapp"
              viewBox="0 0 16 16"
            >
              <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232" />
            </svg>
          </Link>
          <Link
            href={"https://t.me/+E95suGL1idQ2ZWRl"}
            target="_blank"
            className="p-3 rounded-lg hover:bg-primary-foreground duration-400"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="#8c52ff"
              className="bi bi-telegram"
              viewBox="0 0 16 16"
            >
              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.287 5.906q-1.168.486-4.666 2.01-.567.225-.595.442c-.03.243.275.339.69.47l.175.055c.408.133.958.288 1.243.294q.39.01.868-.32 3.269-2.206 3.374-2.23c.05-.012.12-.026.166.016s.042.12.037.141c-.03.129-1.227 1.241-1.846 1.817-.193.18-.33.307-.358.336a8 8 0 0 1-.188.186c-.38.366-.664.64.015 1.088.327.216.589.393.85.571.284.194.568.387.936.629q.14.092.27.187c.331.236.63.448.997.414.214-.02.435-.22.547-.82.265-1.417.786-4.486.906-5.751a1.4 1.4 0 0 0-.013-.315.34.34 0 0 0-.114-.217.53.53 0 0 0-.31-.093c-.3.005-.763.166-2.984 1.09" />
            </svg>
          </Link>
          <Link
            href={"https://discord.gg/eaAQr79t"}
            target="_blank"
            className="p-3 rounded-lg hover:bg-primary-foreground duration-400"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="#8c52ff"
              className="bi bi-discord"
              viewBox="0 0 16 16"
            >
              <path d="M13.545 2.907a13.2 13.2 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.2 12.2 0 0 0-3.658 0 8 8 0 0 0-.412-.833.05.05 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.04.04 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032q.003.022.021.037a13.3 13.3 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019q.463-.63.818-1.329a.05.05 0 0 0-.01-.059l-.018-.011a9 9 0 0 1-1.248-.595.05.05 0 0 1-.02-.066l.015-.019q.127-.095.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.05.05 0 0 1 .053.007q.121.1.248.195a.05.05 0 0 1-.004.085 8 8 0 0 1-1.249.594.05.05 0 0 0-.03.03.05.05 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.2 13.2 0 0 0 4.001-2.02.05.05 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.03.03 0 0 0-.02-.019m-8.198 7.307c-.789 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612m5.316 0c-.788 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612" />
            </svg>
          </Link>
          <Link
            href={"https://www.linkedin.com/company/wize-mylamp/"}
            target="_blank"
            className="p-3 rounded-lg hover:bg-primary-foreground duration-400"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="#8c52ff"
              className="bi bi-linkedin"
              viewBox="0 0 16 16"
            >
              <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854zm4.943 12.248V6.169H2.542v7.225zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248S2.4 3.226 2.4 3.934c0 .694.521 1.248 1.327 1.248zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225z" />
            </svg>
          </Link>
          <Link
            href={"https://www.instagram.com/wize.mylamp/"}
            target="_blank"
            className="p-3 rounded-lg hover:bg-primary-foreground duration-400"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="#8c52ff"
              className="bi bi-instagram"
              viewBox="0 0 16 16"
            >
              <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233s.008-2.388.046-3.231c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92m-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217m0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334" />
            </svg>
          </Link>
          <Link
            href={"https://www.youtube.com/@wize-mylamp"}
            target="_blank"
            className="p-3 rounded-lg hover:bg-primary-foreground duration-400"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="#8c52ff"
              className="bi bi-youtube"
              viewBox="0 0 16 16"
            >
              <path d="M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.101.38.172.883.22 1.402l.01.104.022.26.008.104c.065.914.073 1.77.074 1.957v.075c-.001.194-.01 1.108-.082 2.06l-.008.105-.009.104c-.05.572-.124 1.14-.235 1.558a2.01 2.01 0 0 1-1.415 1.42c-1.16.312-5.569.334-6.18.335h-.142c-.309 0-1.587-.006-2.927-.052l-.17-.006-.087-.004-.171-.007-.171-.007c-1.11-.049-2.167-.128-2.654-.26a2.01 2.01 0 0 1-1.415-1.419c-.111-.417-.185-.986-.235-1.558L.09 9.82l-.008-.104A31 31 0 0 1 0 7.68v-.123c.002-.215.01-.958.064-1.778l.007-.103.003-.052.008-.104.022-.26.01-.104c.048-.519.119-1.023.22-1.402a2.01 2.01 0 0 1 1.415-1.42c.487-.13 1.544-.21 2.654-.26l.17-.007.172-.006.086-.003.171-.007A100 100 0 0 1 7.858 2zM6.4 5.209v4.818l4.157-2.408z" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}

export function ResourcesComponent() {
  const [email, setEmail] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/newsletteremails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        toast.success("Subscribed!");
        setEmail("");
      }
    } catch (err) {
      toast.error("Failed");
      console.log(err);
    }
  };

  return (
    <div className="hover:text-black text-[#697386] flex items-center gap-2 group relative focus:text-black transition-all py-2 px-4 rounded-lg duration-500 hover:transform ">
      <div>Recruiter</div>
      <ChevronDown className="w-4 h-4 text-[#697386] group-hover:-rotate-180 group-hover:text-black transition-all duration-100" />
      <div className="max-h-0 group-hover:max-h-screen group-focus:max-h-screen flex flex-col items-center overflow-hidden opacity-0 scale-75 transition-all duration-500 group-hover:height-auto group-hover:opacity-100 group-hover:scale-100 group-focus:flex group-focus:opacity-100 group-focus:scale-100 absolute top-[110%] left-0 bg-[#f9f9f9] w-[180px] rounded-xl shadow-[0px_0px_1px_rgba(0,0,0,0.3)] font-normal px-2">
        <form
          onSubmit={handleSubmit}
          className="flex items-center justify-start w-full overflow-hidden rounded-lg text-sm mb-2 mt-2"
        >
          <input
            placeholder="Join Newsletter"
            type="email"
            name="newsletter"
            className="bg-primary-foreground text-center w-full h-[35px] outline-none border-none p-2 "
            value={email}
            onChange={handleChange}
          />
          <button type="submit">
            <Image
              className="bg-[#8C52FF] h-[35px] w-[40px] p-2"
              src={"/home/arrowInput.svg"}
              height={30}
              width={30}
              alt="arrowInput"
            />
          </button>
        </form>
        <div className="p-2 hover:bg-primary-foreground w-full text-center duration-400 rounded-lg">
          Handbooks
        </div>
        <div className="p-2 hover:bg-primary-foreground w-full text-center duration-400 rounded-lg mb-2">
          Career Blogs
        </div>
      </div>
    </div>
  );
}

export function CompanyComponent() {
  return (
    <div className="hover:text-black text-[#697386] flex items-center gap-2 group relative focus:text-black transition-all py-2 px-4 rounded-lg duration-500 hover:transform ">
      <div>About</div>
      <ChevronDown className="w-4 h-4 text-[#697386] group-hover:-rotate-180 group-hover:text-black transition-all duration-100" />
      <div className="max-h-0 max-w-full group-hover:max-h-screen group-focus:max-h-screen flex flex-col items-center overflow-hidden opacity-0 scale-75 transition-all duration-500 group-hover:height-auto group-hover:opacity-100 group-hover:scale-100 group-focus:flex group-focus:opacity-100 group-focus:scale-100 absolute top-[110%] left-0 bg-[#f9f9f9] rounded-xl shadow-[0px_0px_1px_rgba(0,0,0,0.3)] font-normal px-2">
        <Link
          href={"/aboutus"}
          className="hover:bg-primary-foreground w-full p-2 rounded-lg duration-400 text-center mt-2"
        >
          {" "}
          About Us
        </Link>
        <Link
          href={"/careers"}
          className="hover:bg-primary-foreground w-full p-2 rounded-lg duration-400 text-center"
        >
          {" "}
          Careers
        </Link>
        <Link
          href={"/contactus"}
          className="hover:bg-primary-foreground w-full p-2 rounded-lg duration-400 text-center mb-2"
        >
          {" "}
          Contact Us
        </Link>
      </div>
    </div>
  );
}
