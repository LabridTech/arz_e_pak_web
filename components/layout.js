import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import LogoutButton from "./logout";

export default function Layout(props) {
  const route = useRouter();
  const { data: session } = useSession(); // Get session from next-auth
  const [user, setUser] = useState(null); // User state
  const [address, setAddress] = useState(null); // Address state

  function changeLink(){
    if(user){
      route.push('/profile')
    }else{
      route.push('/signin')
    }
  }

  useEffect(() => {
    // Fetch user details from Firebase when session changes
    const fetchUser = async () => {
      if (session && session.user) {
        try {
          const response = await axios.get(
            "https://are-z-pak-default-rtdb.asia-southeast1.firebasedatabase.app/person.json"
          );
          const users = response.data;

          // Find user from Firebase by email
          const firebaseUser = Object.values(users).find(
            (u) => u.email === session.user.email
          );

          if (firebaseUser) {
            setUser(firebaseUser.name || session.user.name); // Set user name
            setAddress(firebaseUser.address || "Address not found"); // Set address
          } else {
            setUser(session.user.name); // Default to session name
            setAddress("No Address Found");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        setUser(null); // Clear user if not authenticated
        setAddress(null);
      }
    };

    fetchUser();
  }, [session]);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex h-16 items-center justify-around px-4 lg:px-8">
        <div onClick={()=>{event.preventDefault() , route.push('/')}} className="flex cursor-pointer items-center space-x-4">
          <Image alt="logo" width={100} height={100} src={"/logo2.png"}></Image>
          <h1 className="text-4xl text-green-600">-e-pak</h1>
        </div>

        <nav className="flex items-center space-x-6">
          <Link className="text-muted-foreground hover:font-semibold" href="/">
            Home
          </Link>
          <Link className="text-muted-foreground hover:font-semibold" href="/search?propertyType=House">
            House
          </Link>
          <Link className="text-muted-foreground hover:font-semibold" href="/search?propertyType=Plot">
            Plots
          </Link>
          <Link className="text-muted-foreground hover:font-semibold" href="/search?propertyType=Plot">
            Apartment
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          <Avatar className="cursor-pointer" onClick={changeLink}>
            <AvatarImage alt="User" src="/placeholder-user.jpg" />
            <AvatarFallback>{user ? user[0] : "N"}</AvatarFallback>
          </Avatar>

          <Button variant="outline">{address ? address : "----, -----"}</Button>
          <LogoutButton/>
        </div>
      </header>

      {props.children}

      <footer className="border-t bg-gray-50">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <h3 className="font-semibold">About Us</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link
                    className="text-sm text-muted-foreground hover:text-primary"
                    href="#"
                  >
                    Our Story
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-sm text-muted-foreground hover:text-primary"
                    href="#"
                  >
                    Our Team
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-sm text-muted-foreground hover:text-primary"
                    href="#"
                  >
                    Our Clients
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-semibold">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    className="text-sm text-gray-500 hover:text-gray-900"
                    href="/"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-sm text-gray-500 hover:text-gray-900"
                    href="#"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-sm text-gray-500 hover:text-gray-900"
                    href="#"
                  >
                    Properties
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold">Services</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link
                    className="text-sm text-muted-foreground hover:text-primary"
                    href="#"
                  >
                    Plots
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-sm text-muted-foreground hover:text-primary"
                    href="#"
                  >
                    House
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold">Newsletter</h3>
              <form className="mt-4">
                <Input placeholder="Enter your email" type="email" />
                <Button className="mt-2 w-full">Subscribe</Button>
              </form>
            </div>
          </div>
          <div className="mt-8 border-t pt-8">
            <p className="text-center text-sm text-muted-foreground">
              © 2023 Arezpak. All Rights Reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

