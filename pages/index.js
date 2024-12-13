import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/router";
import { MapPin, Search } from "lucide-react";
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
        <section className="relative">
          <div className="absolute inset-0">
            <Image
              alt="City skyline"
              className="h-full w-full object-cover"
              height={600}
              src="/back.jpg"
              width={1200}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900/50 to-gray-900/50" />
          </div>
          <div className="relative mx-auto max-w-5xl px-4 py-24 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                The <span className="text-blue-600">#1</span> site real estate
                <br />
                professionals trust
              </h1>
            </div>
            <div className="mt-10">
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="grid gap-4 p-4 sm:grid-cols-2 ">
                    {/* Property Type Dropdown */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full">
                          {propertyType || "Select Property Type"}{" "}
                          {/* Show placeholder if null */}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
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

                    {/* Property Size Dropdown */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full">
                          {propertySize || "Select Property Size"}{" "}
                          {/* Show placeholder if null */}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        {propertySizes.map((size) => (
                          <DropdownMenuItem
                            key={size}
                            onClick={() => setPropertySize(size)}
                          >
                            {size}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
                <CardFooter className="flex  bg-muted/50 px-4 py-3">
                  <div className="flex w-full items-center space-x-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full text-left">
                          {selectedLocation || "Select Location"}{" "}
                          {/* Show placeholder if null */}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
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
                  </div>
                  <Button
                    onClick={handleSearch}
                    className="ml-4 bg-green-500 hover:bg-green-600"
                  >
                    <Search className="mr-2 h-4 w-4" />
                    Find Property
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>
        <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="house">House</TabsTrigger>
              <TabsTrigger value="apartment">Apartment</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="mt-8">
            <h2 className="text-2xl font-bold">Featured Estates</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {propertydata.map((i) => (
                <Card className="cursor-pointer" onClick={()=>{addtoproperty(i)}} key={i}>
                  <CardContent className="p-0">
                    <Image
                      alt="Property"
                      className="h-48 w-full object-cover"
                      height={200}
                      src={i.imgpath[0]}
                      width={400}
                    />
                    <div className="p-4">
                      <h3 className="font-semibold">{i.name}</h3>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-lg font-bold">{i.price}</span>
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg
                              key={star}
                              className="h-4 w-4 fill-current text-yellow-500"
                              viewBox="0 0 24 24"
                            >
                              <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold">Top Estate Agents</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-3 lg:grid-cols-4">
            {data.map((i) => (
              <Card
                onClick={() => {
                  route.push(`/profile/${i.email}`);
                }}
                key={i.id}
                className="cursor-pointer text-center"
              >
                <CardContent className="pt-6">
                  <Avatar className="mx-auto h-20 w-20">
                    <AvatarImage alt="Agent" src={i.imgpath} />
                    <AvatarFallback>{i.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <h3 className="mt-4 font-semibold">{i.name}</h3>
                  <div className="mt-2 flex justify-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        className="h-4 w-4 fill-current text-yellow-500"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" />
                      </svg>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
