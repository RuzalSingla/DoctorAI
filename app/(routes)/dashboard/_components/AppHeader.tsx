import Image from "next/image";
import Link from "next/link"; // ✅ Add this
import { UserButton } from "@clerk/nextjs";

const menuOptions = [
  { id: 1, name: "Home", path: "/" },
  { id: 2, name: "History", path: "/dashboard" },
  { id: 3, name: "Pricing", path: "/dashboard/billing" },
  { id: 4, name: "Profile", path: "/dashboard" },
];


function AppHeader() {
  return (
    
    <div className="flex items-center justify-between p-4 shadow px-10 md:px-20 lg:px-40 ">
      <Image src={"/image.png"} alt="logo" width={180} height={90} className="rounded-full"/>

      <div className="hidden md:flex gap-12 items-center">
        {menuOptions.map((option) => (
          <Link key={option.id} href={option.path}>
            <h2 className="hover:font-bold cursor-pointer transition-all">
              {option.name}
            </h2>
          </Link>
        ))}
      </div>

      <UserButton />
    </div>
  );
}

export default AppHeader;
