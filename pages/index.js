import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/router";
import { MapPin, Search, ChevronDown } from "lucide-react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { useDispatch } from "react-redux";
import { setproperty, clearproperty } from "@/redux/counterSlice";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

function formatPKR(amount) {
  if (amount >= 10000000) {
    return (amount / 10000000).toFixed(2).replace(/\.00$/, "") + " crore";
  } else if (amount >= 100000) {
    return (amount / 100000).toFixed(2).replace(/\.00$/, "") + " lac";
  } else if (amount >= 1000) {
    return (amount / 1000).toFixed(2).replace(/\.00$/, "") + " thousand";
  }
  return amount;
}

export async function getStaticProps() {
  try {
    const response = await axios.get(
      "https://are-z-pak-default-rtdb.asia-southeast1.firebasedatabase.app/person.json"
    );
    const responseData = response.data;

    // Convert the response into an array format
    const formattedData = Object.keys(responseData).map((key) => ({
      id: key,
      ...responseData[key],
    }));

    const res = await axios.get(
      "https://are-z-pak-default-rtdb.asia-southeast1.firebasedatabase.app/property.json"
    );
    const resData = res.data;

    // Convert the response into an array format
    const Data = Object.keys(resData).map((key) => ({
      id: key,
      ...resData[key],
    }));

    return {
      props: {
        data: formattedData,
        propertydata: Data,
      },
      revalidate: 60, // Optional: Revalidate the page every 60 seconds
    };
  } catch (err) {
    console.error("Error fetching data:", err);
    return {
      props: {
        data: [],
        error: "Failed to fetch data",
      },
    };
  }
}

export default function Component({ data, propertydata, error }) {
  const route = useRouter();
  const dispatch = useDispatch();
  const [propertyType, setPropertyType] = useState("");
  const [propertySize, setPropertySize] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(null); // Placeholder initially

  const addtoproperty = (p) => {
    dispatch(clearproperty);
    dispatch(setproperty(p));
    route.push("/detail");
  };

  const locations = [
    "Lahore",
    "Karachi",
    "Islamabad",
    "Renla Kurd",
    "Peshawar",
  ]; // Sample locations
  const propertyTypes = ["House", "Apartment", "Plot"];
  const propertySizes = [
    "5 marla",
    "10 marla",
    "15 marla",
    "1 canal",
    "2 canal",
    "4 canal",
  ];

  const handleSearch = () => {
    route.push({
      pathname: "/search", // Target route
      query: {
        propertyType,
        propertySize,
        selectedLocation,
      },
    });
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <main className="flex-1">
        <section className="relative min-h-[600px] flex items-center">
          <div className="absolute inset-0">
            <Image
              alt="City skyline"
              className="h-full w-full object-cover"
              height={600}
              src="/back.jpg"
              width={1200}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70" />
          </div>
          <div className="relative mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-5xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
                Find Your Dream
                <span className="block text-green-400">Property</span>
              </h1>
              <p className="mt-6 text-xl text-gray-300 max-w-2xl mx-auto">
                Discover the perfect home with Pakistan's most trusted real estate platform
              </p>
            </div>
            
            <div className="mt-12 max-w-4xl mx-auto">
              <Card className="overflow-hidden shadow-2xl border-0">
                <CardContent className="p-6">
                  <div className="grid gap-4 sm:grid-cols-3">
                    {/* Property Type Dropdown */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full justify-between">
                          {propertyType || "Property Type"}
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-full">
                        {propertyTypes.map((type) => (
                          <DropdownMenuItem
                            key={type}
                            onClick={() => setPropertyType(type)}
                          >
                            {type}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Location Dropdown */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full justify-between">
                          <MapPin className="mr-2 h-4 w-4" />
                          {selectedLocation || "Location"}
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-full">
                        {locations.map((location) => (
                          <DropdownMenuItem
                            key={location}
                            onClick={() => setSelectedLocation(location)}
                          >
                            {location}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Search Button */}
                    <Button
                      onClick={handleSearch}
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold"
                      size="lg"
                    >
                      <Search className="mr-2 h-5 w-5" />
                      Search Properties
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Properties</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our handpicked selection of premium properties across Pakistan
            </p>
          </div>
          
          <Tabs defaultValue="all" className="mb-8">
            <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto">
              <TabsTrigger value="all">All Properties</TabsTrigger>
              <TabsTrigger value="house">Houses</TabsTrigger>
              <TabsTrigger value="apartment">Apartments</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {propertydata.map((i) => (
              <Card className="group overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer" onClick={()=>{addtoproperty(i)}} key={i}>
                <CardContent className="p-0">
                  <div className="relative">
                    <Image
                      alt="Property"
                      className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      height={200}
                      src={i.imgpath[0]}
                      width={400}
                    />
                    <div className="absolute top-3 right-3">
                      <Badge variant="secondary" className="bg-white/90 text-gray-800">
                        {i.propertyType === "sell" ? "For Sale" : "For Rent"}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{i.name}</h3>
                    <div className="flex items-center mb-3">
                      <MapPin className="h-4 w-4 text-gray-500 mr-1" />
                      <span className="text-sm text-gray-600">Location</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className="h-4 w-4 fill-yellow-400 text-yellow-400"
                          />
                        ))}
                        <span className="text-sm text-gray-600 ml-1">(5.0)</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex items-center justify-between p-4 pt-0">
                  <div className="text-xl font-bold text-green-600">
                    PKR {formatPKR(i.price)}
                    {i.propertyType === "sell" && <span className="text-sm text-gray-500">/month</span>}
                  </div>
                  <Button className="bg-green-600 hover:bg-green-700">
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 bg-gray-50">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Top Estate Agents</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Work with the most trusted and experienced real estate professionals
            </p>
          </div>
          
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {data.map((i) => (
              <Card
                onClick={() => {
                  route.push(`/profile/${i.email}`);
                }}
                key={i.id}
                className="cursor-pointer text-center group hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <CardContent className="pt-8 pb-6">
                  <Avatar className="mx-auto h-20 w-20 mb-4 ring-4 ring-green-100">
                    <AvatarImage alt="Agent" src={i.imgpath} />
                    <AvatarFallback className="bg-green-100 text-green-600 text-xl font-semibold">{i.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{i.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">Real Estate Agent</p>
                  <div className="flex justify-center mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className="h-4 w-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                    <span className="text-sm text-gray-600 ml-1">(5.0)</span>
                  </div>
                  <Button variant="outline" className="w-full group-hover:bg-green-600 group-hover:text-white transition-colors">
                    View Profile
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
