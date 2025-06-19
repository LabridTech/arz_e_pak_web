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
import { MapPin, Facebook, Twitter, Instagram, Menu, X } from "lucide-react";

export default function Layout(props) {
  const route = useRouter();
  const { data: session } = useSession(); // Get session from next-auth
  const [user, setUser] = useState(null); // User state
  const [address, setAddress] = useState(null); // Address state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // Mobile menu state

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
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 lg:px-8">
          <div onClick={()=>{event.preventDefault() , route.push('/')}} className="flex cursor-pointer items-center space-x-2">
            <Image alt="logo" width={50} height={50} src={"/logo2.png"} className="rounded-lg" />
            <h1 className="text-2xl font-bold text-green-600">Arz-e-Pak</h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              className={`text-sm font-medium transition-colors ${route.pathname === '/' ? 'text-green-600' : 'text-gray-700 hover:text-green-600'}`}
              href="/"
            >
              Home
            </Link>
            <Link 
              className={`text-sm font-medium transition-colors ${route.asPath.startsWith('/search?propertyType=House') ? 'text-green-600' : 'text-gray-700 hover:text-green-600'}`}
              href="/search?propertyType=House"
            >
              Houses
            </Link>
            <Link 
              className={`text-sm font-medium transition-colors ${route.asPath.startsWith('/search?propertyType=Plot') ? 'text-green-600' : 'text-gray-700 hover:text-green-600'}`}
              href="/search?propertyType=Plot"
            >
              Plots
            </Link>
            <Link 
              className={`text-sm font-medium transition-colors ${route.asPath.startsWith('/search?propertyType=Apartment') ? 'text-green-600' : 'text-gray-700 hover:text-green-600'}`}
              href="/search?propertyType=Apartment"
            >
              Apartments
            </Link>
          </nav>

          {/* Desktop User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="outline">
              <MapPin className="mr-2 h-4 w-4" />
              {address ? address : "Select Location"}
            </Button>
            <Avatar className="cursor-pointer h-8 w-8" onClick={changeLink}>
              <AvatarImage alt="User" src="/placeholder-user.jpg" />
              <AvatarFallback className="bg-green-100 text-green-600">{user ? user[0] : "N"}</AvatarFallback>
            </Avatar>
            <LogoutButton/>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-green-600 hover:bg-gray-100"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t bg-white">
            <div className="px-4 py-6 space-y-4">
              <nav className="flex flex-col space-y-4">
                <Link 
                  className={`text-sm font-medium transition-colors ${route.pathname === '/' ? 'text-green-600' : 'text-gray-700 hover:text-green-600'}`}
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </Link>
                <Link 
                  className={`text-sm font-medium transition-colors ${route.asPath.startsWith('/search?propertyType=House') ? 'text-green-600' : 'text-gray-700 hover:text-green-600'}`}
                  href="/search?propertyType=House"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Houses
                </Link>
                <Link 
                  className={`text-sm font-medium transition-colors ${route.asPath.startsWith('/search?propertyType=Plot') ? 'text-green-600' : 'text-gray-700 hover:text-green-600'}`}
                  href="/search?propertyType=Plot"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Plots
                </Link>
                <Link 
                  className={`text-sm font-medium transition-colors ${route.asPath.startsWith('/search?propertyType=Apartment') ? 'text-green-600' : 'text-gray-700 hover:text-green-600'}`}
                  href="/search?propertyType=Apartment"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Apartments
                </Link>
              </nav>
              <div className="flex flex-col space-y-4 pt-4 border-t">
                <Button variant="outline" className="w-full justify-start">
                  <MapPin className="mr-2 h-4 w-4" />
                  {address ? address : "Select Location"}
                </Button>
                <div className="flex items-center space-x-4">
                  <Avatar className="cursor-pointer h-8 w-8" onClick={changeLink}>
                    <AvatarImage alt="User" src="/placeholder-user.jpg" />
                    <AvatarFallback className="bg-green-100 text-green-600">{user ? user[0] : "N"}</AvatarFallback>
                  </Avatar>
                  <LogoutButton/>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {props.children}

      <footer className="border-t bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">About Arz-e-Pak</h3>
              <p className="text-sm text-gray-600 mb-4">
                Pakistan's leading real estate platform connecting buyers, sellers, and agents.
              </p>
              <div className="flex space-x-4">
                <Link href="#" className="text-gray-400 hover:text-green-600">
                  <Facebook className="h-5 w-5" />
                </Link>
                <Link href="#" className="text-gray-400 hover:text-green-600">
                  <Twitter className="h-5 w-5" />
                </Link>
                <Link href="#" className="text-gray-400 hover:text-green-600">
                  <Instagram className="h-5 w-5" />
                </Link>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h4>
              <ul className="space-y-3">
                <li>
                  <Link className="text-sm text-gray-600 hover:text-green-600 transition-colors" href="/">
                    Home
                  </Link>
                </li>
                <li>
                  <Link className="text-sm text-gray-600 hover:text-green-600 transition-colors" href="/about">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link className="text-sm text-gray-600 hover:text-green-600 transition-colors" href="/properties">
                    Properties
                  </Link>
                </li>
                <li>
                  <Link className="text-sm text-gray-600 hover:text-green-600 transition-colors" href="/contact">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Types</h3>
              <ul className="space-y-3">
                <li>
                  <Link className="text-sm text-gray-600 hover:text-green-600 transition-colors" href="/search?propertyType=House">
                    Houses
                  </Link>
                </li>
                <li>
                  <Link className="text-sm text-gray-600 hover:text-green-600 transition-colors" href="/search?propertyType=Apartment">
                    Apartments
                  </Link>
                </li>
                <li>
                  <Link className="text-sm text-gray-600 hover:text-green-600 transition-colors" href="/search?propertyType=Plot">
                    Plots
                  </Link>
                </li>
                <li>
                  <Link className="text-sm text-gray-600 hover:text-green-600 transition-colors" href="/search?propertyType=Commercial">
                    Commercial
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Newsletter</h3>
              <p className="text-sm text-gray-600 mb-4">
                Stay updated with the latest properties and market trends.
              </p>
              <form className="space-y-3">
                <Input 
                  placeholder="Enter your email" 
                  type="email" 
                  className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                />
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  Subscribe
                </Button>
              </form>
            </div>
          </div>
          
          <div className="mt-12 border-t pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm text-gray-600">
                © 2024 Arz-e-Pak. All Rights Reserved.
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <Link className="text-sm text-gray-600 hover:text-green-600" href="/privacy">
                  Privacy Policy
                </Link>
                <Link className="text-sm text-gray-600 hover:text-green-600" href="/terms">
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

