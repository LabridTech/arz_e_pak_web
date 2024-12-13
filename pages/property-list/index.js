import * as React from "react";
import Image from "next/image";
import { Home, Minus, Plus, Upload } from "lucide-react";
import path from "path";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Delete } from "lucide-react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";

export default function PropertyListingForm() {
  const dispatch = useDispatch();
  const property = useSelector((state) => state.counter.property);
  const { data: session, status } = useSession(); // Get the logged-in user's session
  const router = useRouter(); // Router for redirection
  const [images, setImages] = React.useState([]);
  const [listingType, setListingType] = React.useState("rent");
  const [propertyType, setPropertyType] = React.useState("house");
  const [pstatus, setPstatus] = React.useState("unsold");
  const [features, setFeatures] = React.useState({
    bedrooms: 2,
    bathrooms: 2,
    balconies: 2,
  });
  const [room, setRooms] = React.useState("2");
  const [facilities, setFacilities] = React.useState([]);
  const [name, setName] = React.useState("");
  const [price, setPrice] = React.useState();
  const [location, setLocation] = React.useState(""); // Location state
  const [city, setCity] = React.useState(""); // Location state
  const [propertySize, setPropertySize] = React.useState(""); // Property size state
  const [imagePreviews, setImagePreviews] = React.useState([]); // For showing preview images
  const [isOpen, setIsOpen] = React.useState(false);
  const [isOpenSize, setIsOpenSize] = React.useState(false);
  const filteredCities = ["Karachi", "Lahore", "Islamabad"];

  const toggleDropdownSize = () => setIsOpenSize(!isOpen);
  const selectSize = (selectedCity) => {
    setPropertySize(selectedCity);
    setIsOpenSize(false); // Close the dropdown after selection
  };

  const toggleDropdown = () => setIsOpen(!isOpen);
  const selectCity = (selectedCity) => {
    setCity(selectedCity);
    setIsOpen(false); // Close the dropdown after selection
  };

  const deleteImagePreview = (indexToDelete) => {
    setImagePreviews(
      imagePreviews.filter((_, index) => index !== indexToDelete)
    );
  };

  const deleteImagepath = (indexToDelete) => {
    setImagePreviews(
      property.imgpath.filter((_, index) => index !== indexToDelete)
    );
  };

  const handleAddFacility = (newFacility) => {
    setFacilities([...facilities, newFacility]);
  };

  React.useEffect(() => {
    // Redirect to home if user is not authenticated
    if (status === "unauthenticated") {
      router.push("/"); // Redirect to the home page
    }

    if (Object.keys(property).length !== 0) {
      // Map Redux property data to component fields
      setListingType(property.listingType);
      setPropertyType(property.propertyType);
      setFeatures(property.features);
      setRooms(property.room);
      setFacilities(property.facilities);
      setName(property.name);
      setPrice(property.price);
      setLocation(property.location);
      setCity(property.city);
      setPropertySize(property.propertySize);
    }
  }, [status, router, property]);

  const handleproperty = (value) => {
    if (value === "plot") {
      setFeatures({
        bedrooms: 0,
        bathrooms: 0,
        balconies: 0,
      });
      setRooms("0");
    }
    setPropertyType(value);
  };

  const updateFeature = (key, value) => {
    setFeatures((previousFeatures) => ({
      ...previousFeatures,
      [key]: value,
    }));
  };

  // Handle multiple image selection and preview
  const handleImageChange = (event) => {
    const files = event.target.files;
    const fileArray = Array.from(files);
    setImages((prevImages) => [...prevImages, files[0]]);

    // Create file previews for displaying them before upload
    const previews = fileArray.map((file) => URL.createObjectURL(file));
    setImagePreviews((prevPreviews) => [...prevPreviews, ...previews]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    if (!session?.user?.email) {
      alert("You must be logged in to list a property.");
      return;
    }

    try {
      // Upload images
      const imgpath = [];
      if (imagePreviews.length > 0) {
        for (let i = 0; i < images.length; i++) {
          const fd = new FormData();
          fd.append("file", images[i]);
          const res = await fetch("/api/upload", {
            method: "POST",
            body: fd,
          });
          const receivedData = await res.json();
          const uploadedImagePath = path.join("/uploads", images[i].name);
          imgpath.push(uploadedImagePath);
        }
      }
      if (Object.keys(property).length !== 0) {
        imgpath.push(...property.imgpath);
      }
      const reviews = []    
      // Prepare data to send to Firebase
      const firebaseURL =
        "https://are-z-pak-default-rtdb.asia-southeast1.firebasedatabase.app/property.json";
      const data = {
        userEmail: session.user.email, // Logged-in user's email
        name,
        price,
        listingType,
        propertyType,
        location,
        city,
        propertySize,
        room,
        facilities,
        features,
        imgpath,
        status: pstatus,
        reviews,
      };

      let response;
      // Send data to Firebase
      if (Object.keys(property).length !== 0) {
        response = await axios.patch(
          `https://are-z-pak-default-rtdb.asia-southeast1.firebasedatabase.app/property/${property.id}.json`,
          data
        );
      } else {
        response = await axios.post(firebaseURL, data);
      }

      console.log("Data successfully sent to Firebase:", response.data);

      if (response) {
        router.push("/profile");
      }

      // Clear form after submission
      setName("");
      setPrice("");
      setListingType("rent");
      setPropertyType("house");
      setImages([]);
      setImagePreviews([]);
      setCity("");
      setPstatus("unsold");
      setFeatures({
        bedrooms: 2,
        bathrooms: 2,
        balconies: 2,
      });
      setRooms("2");
      setFacilities("Parking Lot");
      setLocation("");
      setPropertySize("");
    } catch (error) {
      console.error("Error sending data to Firebase:", error);
    }
  };

  return (
    <div className="container mx-auto max-w-2xl  py-8">
      <div className="mb-8 space-y-2">
        <h1 className="text-2xl font-bold">
          Hi, {session?.user?.name || "User"}
        </h1>
        <p className="text-muted-foreground">
          Fill detail of your <span className="text-primary">real estate</span>
        </p>
      </div>

      <form className="space-y-8">
        <div className="space-y-4">
          <Input
            placeholder="The Lodge House"
            onChange={() => {
              setName(event.target.value);
            }}
            value={name}
          />
        </div>

        <div className="space-y-4">
          <Label>Location</Label>
          <Input
            placeholder="Enter property Society"
            onChange={(e) => setLocation(e.target.value)}
            value={location}
          />
        </div>

        <div className="relative space-y-4">
          <Label>City</Label>

          {/* Dropdown Button */}
          <div
            className="cursor-pointer border p-2 rounded-md"
            onClick={toggleDropdown}
          >
            {city || "Select a city"}
          </div>

          {/* Dropdown Menu */}
          {isOpen && (
            <ul className="absolute bg-white border rounded-md shadow-md w-full z-10">
              {filteredCities.map((cityOption) => (
                <li
                  key={cityOption}
                  className="p-2 hover:bg-gray-200 cursor-pointer"
                  onClick={() => selectCity(cityOption)}
                >
                  {cityOption}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="space-y-4">
          <Label>Property Size (Marla)</Label>
          {/* Dropdown Button */}
          <div
            className="cursor-pointer border p-2 rounded-md"
            onClick={toggleDropdownSize}
          >
            {propertySize || "Select a Size"}
          </div>

          {/* Dropdown Menu */}
          {isOpenSize && (
            <ul className="absolute bg-white border rounded-md shadow-md w-1/3 z-10">
              {[
                "5 marla",
                "10 marla",
                "15 marla",
                "1 canal",
                "2 canal",
                "4 canal",
              ].map((cityOption) => (
                <li
                  key={cityOption}
                  className="p-2 hover:bg-gray-200 cursor-pointer"
                  onClick={() => selectSize(cityOption)}
                >
                  {cityOption}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="space-y-4">
          <Label>Property Status</Label>
          <div className="flex items-center space-x-4">
            <label>
              <input
                type="radio"
                name="status"
                value="unsold"
                checked={pstatus === "unsold"}
                onChange={() => setPstatus("unsold")}
              />
              Unsold
            </label>
            <label>
              <input
                type="radio"
                name="status"
                value="sold"
                checked={pstatus === "sold"}
                onChange={() => setPstatus("sold")}
              />
              Sold
            </label>
          </div>
        </div>

        <div className="space-y-4">
          <Label>Property Category</Label>
          <div className="flex flex-wrap gap-2">
            {["House", "Apartment", "Plot"].map((category) => (
              <div
                key={category}
                onClick={() => handleproperty(category.toLowerCase())}
                className={`flex w-24 items-center px-6 justify-center rounded-full border-2 h-12  ${
                  propertyType === category.toLowerCase()
                    ? "text-white  bg-black "
                    : " "
                }}  `}
              >
                {category}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <Label>Listing Type</Label>
          <div className="flex gap-2">
            {["Rent", "Sell"].map((type) => (
              <div
                key={type}
                onClick={() => setListingType(type.toLowerCase())}
                className={`flex w-16 items-center justify-center rounded-full border-2 h-12  ${
                  listingType === type.toLowerCase()
                    ? "text-white  bg-black "
                    : " "
                }  `}
              >
                {type}
              </div>
            ))}
          </div>
        </div>

        {listingType === "sell" && (
          <div className="space-y-4">
            <Label>Sell Price</Label>
            <div className="flex items-center gap-2">
              <span className="text-xl">$</span>
              <Input
                type="number"
                value={price}
                onChange={() => {
                  setPrice(event.target.value);
                }}
                placeholder="180,000"
              />
            </div>
          </div>
        )}

        {listingType === "rent" && (
          <div className="space-y-4">
            <Label>Rent Price</Label>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-xl">$</span>
                <Input
                  type="number"
                  placeholder="315"
                  onChange={() => {
                    setPrice(event.target.value);
                  }}
                  value={price}
                />
                <span className="text-muted-foreground">/month</span>
              </div>
              <div className="flex gap-2 hidden">
                <Button variant="default">Monthly</Button>
                <Button variant="outline">Yearly</Button>
              </div>
            </div>
          </div>
        )}

        <div className={`space-y-4 ${propertyType === "plot" && "hidden"}`}>
          <Label>Property Features</Label>
          <div className="grid gap-4 sm:grid-cols-3">
            {Object.entries(features).map(([key, value]) => (
              <Card key={key} className="p-4 w-56">
                <div className="flex items-center justify-between">
                  <span className="capitalize">{key}</span>
                  <div className="flex items-center gap-1">
                    <div className="border-2 p-2 rounded-md">
                      <Minus
                        onClick={() => updateFeature(key, value - 1)}
                        className="h-4 w-4"
                      />
                    </div>
                    <span className="w-8 text-center">{value}</span>
                    <div div className="border-2 p-2 rounded-md">
                      <Plus
                        onClick={() => updateFeature(key, value + 1)}
                        className="h-4 w-4"
                      />
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div className={`space-y-4 ${propertyType === "plot" && "hidden"}`}>
          <Label>Total Rooms</Label>
          <div className="flex gap-2">
            {["2", "3", "4", "5", "6", "+ 6"].map((rooms) => (
              <div
                key={rooms}
                onClick={() => setRooms(rooms)}
                className={`flex w-16 items-center justify-center rounded-full border-2 h-12  ${
                  room === rooms ? "text-white  bg-black " : " "
                }}  `}
              >
                {rooms}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <Label>Environment / Facilities</Label>
          <div className="flex flex-wrap gap-2">
            {[
              "Parking Lot",
              "Pet Allowed",
              "Garden",
              "Gym",
              "Park",
              "Home Theatre",
              "Kids Friendly",
            ].map((facility) => (
              <div
                key={facility}
                onClick={() => handleAddFacility(facility)}
                className={`flex w-40 items-center px-6 justify-center rounded-full border-2 h-12  ${
                  facilities.includes(facility) ? "text-white  bg-black " : " "
                }}  `}
              >
                {facility}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <Label>Property Images</Label>
          <div className="grid gap-4 sm:grid-cols-3">
            {property.imgpath?.map((image, index) => {
              return (
                <div
                  key={index}
                  className="relative aspect-square overflow-hidden rounded-lg"
                >
                  <Image
                    src={image}
                    alt={`Property ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              );
            })}
            {imagePreviews?.map((image, index) => {
              return (
                <div
                  key={index}
                  className="relative aspect-square overflow-hidden rounded-lg"
                >
                  <Image
                    src={image}
                    alt={`Property ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      deleteImagePreview(index);
                    }}
                    className="absolute right-2 top-2 bg-white/80 hover:bg-white/90"
                  >
                    <Delete className="h-4 w-4" />
                  </Button>
                </div>
              );
            })}
            <label className="flex aspect-square cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-200 hover:bg-gray-50">
              <div className="text-center">
                <Upload className="mx-auto h-8 w-8 text-gray-400" />
                <span className="mt-2 block text-sm text-gray-400">
                  Upload Image
                </span>
              </div>
              <input
                type="file"
                className="hidden"
                onChange={handleImageChange}
                accept="image/*"
                multiple
              />
            </label>
          </div>
        </div>

        <Button onClick={handleSubmit} className="w-full" size="lg">
          Next
        </Button>
      </form>
    </div>
  );
}
