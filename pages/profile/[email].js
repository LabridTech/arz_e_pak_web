import Image from "next/image";
import { Bookmark, Grid, Plus, Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import CircularProgress from '@mui/material/CircularProgress';

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

export default function AgentProfile() {
  const [userData, setUserData] = useState(null); // Store user info
  const [properties, setProperties] = useState([]); // Store user properties
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { email } = router.query;

  useEffect(() => {
    // Redirect to home if user email is not in route or if unauthenticated
    if (!email) {
      router.push("/"); // Redirect to home page if email is not available
    }

    if (email) {
      const fetchData = async () => {
        try {
          // Fetch user data from Firebase based on email in route
          const response = await axios.get(
            `https://are-z-pak-default-rtdb.asia-southeast1.firebasedatabase.app/person.json`
          );
          const users = response.data;

          // Find specific user by email from the route
          const user = Object.values(users).find((u) => u.email === email);

          if (user) {
            setUserData(user); // Set user details

            // Fetch properties from Firebase
            const propertiesResponse = await axios.get(
              `https://are-z-pak-default-rtdb.asia-southeast1.firebasedatabase.app/property.json`
            );
            const allProperties = propertiesResponse.data;

            // Filter properties matching the user's email (agentEmail)
            const userProperties = Object.values(allProperties).filter(
              (property) => property.userEmail === email
            );

            setProperties(userProperties);
          } else {
            console.error("User not found in Firebase");
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [email, router]);

  if (loading) {
    return <CircularProgress /> ;
  }

  if (!userData) {
    return <div>User not found.</div>;
  }

  return (
    <div className="mx-10 px-4 py-8">
      <div className="mb-8 space-y-2 flex-col items-center justify-between">
        <div className="flex flex-col w-full justify-center items-center">
          <Avatar className="h-20 w-20">
            <AvatarImage src={userData.imgpath} alt={userData.name} />
            <AvatarFallback>{userData.name?.charAt(0) || "N"}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">{userData.name}</h1>
            <a
              href={`mailto:${userData.email}`}
              className="text-sm text-blue-600 hover:underline"
            >
              {userData.email}
            </a>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-3 gap-4">
          <div className="flex flex-col items-center rounded-lg bg-gray-50 p-4 text-center">
            <div className="text-2xl font-bold">
              {properties.filter((property) => property.status === "unsold")
                .length || 0}
            </div>
            <div className="text-sm text-muted-foreground">Listings</div>
          </div>
          <div className="flex flex-col items-center rounded-lg bg-gray-50 p-4 text-center">
            <div className="text-2xl font-bold">
              {properties.filter((property) => property.status === "sold")
                .length || 0}
            </div>
            <div className="text-sm text-muted-foreground">Sold</div>
          </div>
          <div className="flex flex-col items-center rounded-lg bg-gray-50 p-4 text-center">
            <div className="text-2xl font-bold">
              {userData.stats?.reviews || 0}
            </div>
            <div className="text-sm text-muted-foreground">Reviews</div>
          </div>
        </div>

        {/* Profile */}
        <div className={`flex justify-end gap-2`}>
          <Button variant="outline" size="icon">
            <Grid className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Listings */}
      <Tabs defaultValue="listings" className="space-y-4">
        <TabsList>
          <TabsTrigger value="listings">Listings</TabsTrigger>
          <TabsTrigger value="sold">Sold</TabsTrigger>
        </TabsList>
        <TabsContent value="listings" className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {properties
              .filter((property) => {
                return property.status === "unsold";
              })
              .map((property) => (
                <Card key={property.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="relative">
                      <Image
                        src={property.imgpath[0]}
                        alt={property.name}
                        width={400}
                        height={200}
                        className="h-48 w-full object-cover"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-2 bg-white/80 hover:bg-white/90"
                      >
                        <Bookmark className="h-4 w-4" />
                      </Button>
                      <div className="absolute bottom-2 left-2 rounded bg-white/80 px-2 py-1 text-sm font-semibold">
                        {formatPKR(property.price)}
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold">{property.name}</h3>
                      <div className="mt-1 text-sm text-muted-foreground">
                        {property.location}
                      </div>
                      <div className="mt-2 flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">
                          {property.rating}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
          {properties.filter((property) => property.status === "unsold")
            .length === 0 && (
            <div className="rounded-lg border border-dashed p-8 text-center">
              <p className="text-muted-foreground">No properties to display</p>
            </div>
          )}
        </TabsContent>
        <TabsContent value="sold">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {properties
              .filter((property) => property.status === "sold")
              .map((property) => (
                <Card key={property.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="relative">
                      <Image
                        src={property.imgpath[0]}
                        alt={property.name}
                        width={400}
                        height={200}
                        className="h-48 w-full object-cover"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-2 bg-white/80 hover:bg-white/90"
                      >
                        <Bookmark className="h-4 w-4" />
                      </Button>
                      <div className="absolute bottom-2 left-2 rounded bg-white/80 px-2 py-1 text-sm font-semibold">
                        {formatPKR(property.price)}
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold">{property.name}</h3>
                      <div className="mt-1 text-sm text-muted-foreground">
                        {property.location}
                      </div>
                      <div className="mt-2 flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">
                          {property.rating}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
          {properties.filter((property) => property.status === "sold")
            .length === 0 && (
            <div className="rounded-lg border border-dashed p-8 text-center">
              <p className="text-muted-foreground">
                No sold properties to display
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
