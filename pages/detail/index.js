"use client";
import Image from "next/image";
import { useSelector } from "react-redux";
import { MapPin, Star, Plus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import AddReviewForm from "@/components/addReview";
import PropertyContactForm from "@/components/PropertyContactForm";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";

export default function PropertyDetail() {
  const property = useSelector((state) => state.counter.property); // Access property data from Redux
  const [imagedisplay, setImageDisplay] = useState();
  const { data: session, status } = useSession();
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    setImageDisplay(property.imgpath[0]);
    if (property.review?.length !== 0) {
      setReviews(property.reviews);
    }
  }, []);

  const Reviewadd = async (rating, comment) => {
    if (status === "unauthenticated") {
      router.push("/");
    }

    const email = session.user.email;
    const review = {
      email,
      rating,
      comment,
    };
    if (reviews) {
      const arr = [...reviews];
      arr.push(review);
      setReviews(arr);
    } else {
      setReviews([review]);
    }

    console.log(reviews);

    let response = await axios.patch(
      `https://are-z-pak-default-rtdb.asia-southeast1.firebasedatabase.app/property/${property.id}.json`,
      { reviews }
    );
    console.log(response.data);
  };

  if (!property) {
    return <div>Loading property details...</div>; // Display loading message if property data is not yet available
  }

  return (
    <div className="container overflow-hidden justify-center mx-0 sm:mx-10  px-4 sm:py-8">
      {/* Hero Section */}
      <div className="flex flex-col md:flex-row mb-8 w-full md:w-11/12 mx-auto">
        {/* Image Container */}
        <div className="relative w-full md:w-2/3 overflow-hidden rounded-xl">
          {/* Rating Badge */}
          <div className="absolute left-4 top-4 z-10 flex items-center gap-2 rounded-full bg-black/50 px-3 py-1 text-white">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span>{property.rating || "N/A"}</span>
          </div>
          {/* Main Image */}
          <div className="relative w-full h-64 sm:h-96 md:h-full">
            <Image
              src={imagedisplay || "/placeholder.svg"}
              alt={property.name}
              className="object-cover"
              fill
              priority
            />
          </div>
          {/* Thumbnail Images */}
          <div className="absolute right-4 bottom-4 z-10 flex flex-wrap gap-2">
            {property.imgpath?.map((imagePath, index) => (
              <Image
                key={index}
                src={imagePath}
                alt={`Image ${index + 1}`}
                width={40} // Thumbnail width
                height={40} // Thumbnail height
                className="rounded-lg"
              />
            ))}
          </div>
        </div>

        {/* Property Contact Form */}
        <div className="w-full md:w-1/3 mt-6 md:mt-0 md:ml-6 flex-shrink-0">
          <PropertyContactForm />
        </div>
      </div>

      {/* Property Info */}
      <div className="grid gap-8 lg:grid-cols-[2fr_0.5fr]">
        <div className="space-y-8">
          {/* Title and Location */}
          <div>
            <h1 className="mb-2 text-3xl font-bold">{property.name}</h1>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{property.location}</span>
            </div>
            <div className="mt-4 text-2xl font-bold">$ {property.price}</div>
          </div>

          {/* Agent Info */}
          <div className="flex flex-col md:flex-row items-around gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage
                src={property.agent?.avatar || "/placeholder.svg"}
                alt={property.agent?.name || "Agent"}
              />
              <AvatarFallback>
                {property.userEmail?.charAt(0) || "A"}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-semibold">
                {property.userEmail || "Unknown Agent"}
              </div>
              <div className="text-sm text-muted-foreground">
                {property.agent?.role || "Real Estate Agent"}
              </div>
            </div>
            <div className="md:ml-auto flex gap-2">
              {property.listingType === "sell" ? (
                <Button variant="outline">Property for selling</Button>
              ) : (
                <Button>Property for Rent</Button>
              )}
            </div>
          </div>

          {/* Location & Facilities */}
          <div>
            <h2 className="mb-4 text-xl font-semibold">
              Location & Public Facilities
            </h2>
            <div className="mb-4">
              <div className="mb-2 font-medium">
                {property.location || "N/A"}
              </div>
              <div className="text-sm text-muted-foreground">
                {property.city || "N/A"}
              </div>
            </div>
            <div className="flex gap-4">
              {property.facilities?.map((value) => {
                return (
                  <Badge key={value} variant="secondary" className="px-4 py-2">
                    {value}
                  </Badge>
                );
              })}
            </div>
          </div>
          <div className="flex gap-4">
            {property?.features && Object.keys(property.features).length > 0 ? (
              Object.entries(property.features).map(([key, value], index) => (
                <Badge key={index} variant="secondary" className="px-4 py-2">
                  {value ? value : "Unknown"}{" "}
                  {key ? key.charAt(0).toUpperCase() + key.slice(1) : "Unknown"}
                </Badge>
              ))
            ) : (
              <div>No features available</div>
            )}
          </div>

          {/* Reviews */}
          <AddReviewForm AddReview={Reviewadd}></AddReviewForm>
          <div>
            <h2 className="mb-4 text-xl font-semibold">Reviews</h2>
            {reviews?.map((review, index) => (
              <Card key={index} className="mb-4">
                <CardContent className="flex items-start gap-4 p-4">
                  <Avatar>
                    <AvatarImage
                      src={review.avatar || "/placeholder.svg"}
                      alt={review.name}
                    />
                    <AvatarFallback>
                      {review.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="mb-2 flex items-center justify-between">
                      <div className="font-semibold">{review.name}</div>
                      <div className="flex">
                        {Array(review.rating)
                          .fill(null)
                          .map((_, i) => (
                            <Star
                              key={i}
                              className="h-4 w-4 fill-yellow-400 text-yellow-400"
                            />
                          ))}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {review.comment}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Nearby Properties */}
            <div>
              <h2 className="mb-4 text-xl font-semibold">
                Nearby From this Location
              </h2>
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  {
                    title: "Wings Tower",
                    price: 220,
                    rating: 4.2,
                  },
                  {
                    title: "Sky Dandelions Apartment",
                    price: 190,
                    rating: 4.3,
                  },
                  {
                    title: "Wings Tower",
                    price: 220,
                    rating: 4.2,
                  },
                ].map((property, index) => (
                  <Card key={index} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="relative h-[120px]">
                        <Image
                          src="/placeholder.svg"
                          alt={property.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold">{property.title}</h3>
                        <div className="mt-2 flex items-center justify-between">
                          <div className="font-bold">${property.price}</div>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm">{property.rating}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
