import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Star, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

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

export default function PropertyCard(props) {
  console.log(props.property)
  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <CardContent className="p-0">
        <div className="relative">
          <Image
            src={props.property.imgpath[0]}
            alt={props.property.name}
            className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
            width={400}
            height={200}
          />
          <div className="absolute top-3 right-3">
            <Badge variant="secondary" className="bg-white/90 text-gray-800">
              {props.property.propertyType === "sell" ? "For Sale" : "For Rent"}
            </Badge>
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-2">{props.property.name}</h3>
          <div className="flex items-center mb-3">
            <MapPin className="h-4 w-4 text-gray-500 mr-1" />
            <span className="text-sm text-gray-600">Location</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {Array.from({ length: props.property.rating }).map((_, i) => (
                <Star
                  key={i}
                  className="h-4 w-4 fill-yellow-400 text-yellow-400"
                />
              ))}
              <span className="text-sm text-gray-600 ml-1">({props.property.rating})</span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between p-4 pt-0">
        <div className="text-xl font-bold text-green-600">
          PKR {formatPKR(props.property.price)}
          {props.property.propertyType === "sell" && <span className="text-sm text-gray-500">/month</span>}
        </div>
        <Button
          onClick={() => {
            props.fun(props.property)
          }}
          className="bg-green-600 hover:bg-green-700"
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
}
