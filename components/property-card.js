import { Card, CardContent, CardFooter } from "@/components/ui/card";
import Image from "next/image";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PropertyCard(props) {
  console.log(props.property)
  return (
    <Card key={props.property.title}>
      <CardContent className="p-0">
        <Image
          src={props.property.imgpath[0]}
          alt={props.property.name}
          className="h-48 w-full object-cover"
          width={400}
          height={200}
        />
        <div className="p-4">
          <h3 className="font-semibold">{props.property.name}</h3>
          <div className="mt-2 flex items-center">
            {Array.from({ length: props.property.rating }).map((_, i) => (
              <Star
                key={i}
                className="h-4 w-4 fill-yellow-400 text-yellow-400"
              />
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        {props.property.propertyType === "sell" ? (
          <div className="text-lg font-bold">PKR {props.property.price}/month</div>
        ) : (
          <div className="text-lg font-bold">PKR {props.property.price}</div>
        )}

        <Button
          onClick={() => {
           props.fun(props.property)
          }}
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
}
