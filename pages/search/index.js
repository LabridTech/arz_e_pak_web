import axios from "axios";
import { use, useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import PropertyCard from "@/components/property-card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { useDispatch } from "react-redux";
import { setproperty, clearproperty } from "@/redux/counterSlice";
import { useRouter } from "next/router";

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

export default function PropertyListings({ propertiesData }) {
  const router = useRouter();
  const propertype = router.query.propertyType;
  const [filteredProperties, setFilteredProperties] = useState(propertiesData);
  const [propertyType, setPropertyType] = useState("Any");
  const min = 0;
  const max = 5000000;
  const step = 10000;
  const [priceRange, setPriceRange] = useState([min, max]);
  const [bedrooms, setBedrooms] = useState("Any");
  const [size, setSize] = useState("Any");
  const [location, setLocation] = useState({
    Lahore: false,
    Karachi: false,
    Islamabad: false,
    "Renla Kurd": false,
    Peshawar: false,
  });
  const [features, setFeatures] = useState({
    "Pets allowed": false,
    "Built in wardrobes": false,
    Gas: false,
    "Garden / courtyard": false,
    "Balcony/deck": false,
    "Internal laundry": false,
    Study: false,
    "Swimming pool": false,
    "Air conditioning": false,
  });
  const dispatch = useDispatch();

  const addtoproperty = (p) => {
    dispatch(clearproperty);
    dispatch(setproperty(p));
    router.push("/detail");
  };

  const handleChange = (event, index) => {
    const newValue = [...priceRange];
    newValue[index] = parseInt(event.target.value);
    setPriceRange(newValue);
  };

  useEffect(() => {
    if (propertype) {
      setPropertyType(propertype.toLowerCase());
    }
  }, [propertype]);

  // Reapply filters when propertyType or priceRange changes
  useEffect(() => {
    const applyFilters = () => {
      let filtered = [...propertiesData];

      // Filter by property type
      if (propertyType !== "Any") {
        filtered = filtered.filter(
          (property) => property.propertyType === propertyType
        );
      }

      // Filter by property room
      if (bedrooms !== "Any") {
        const updatedString = bedrooms.replace("+", "");
        filtered = filtered.filter(
          (property) => property.room === updatedString
        );
      }

      // Filter by price range
      filtered = filtered.filter(
        (property) =>
          property.price >= priceRange[0] && property.price <= priceRange[1]
      );

      const requiredFeatures = Object.keys(features).filter(
        (feature) => features[feature] // Only include features set to `true`
      );
      const requiredLocation = Object.keys(location).filter(
        (feature) => location[feature] // Only include features set to `true`
      );
      let nofilter = [];
      if (requiredLocation.length != 0) {
        for (let i = 0; i < requiredLocation.length; i++) {
          nofilter = [
            ...nofilter,
            ...filtered.filter(
              (property) => property.city === requiredLocation[i]
            ),
          ];
        }
        filtered = nofilter;
      }


      setFilteredProperties(filtered);
    };

    applyFilters();
  }, [
    propertyType,
    priceRange,
    features,
    bedrooms,
    location,
    size,
    propertiesData,
  ]);

  return (
    <div>
      <div className="container px-4 py-6">
        <div className="grid gap-6 md:grid-cols-[300px_1fr]">
          {/* Filters */}
          <div className="space-y-6">
            {/* Property Types */}
            <div>
              <h3 className="mb-4 text-lg font-semibold">Property Types</h3>
              <div className="flex flex-wrap gap-2">
                {["House", "Apartment", "Plot"].map(
                  (type) => (
                    <Button
                      key={type}
                      variant={
                        propertyType === type.toLowerCase()
                          ? "default"
                          : "outline"
                      }
                      className="rounded-full"
                      onClick={() => setPropertyType(type.toLowerCase())}
                    >
                      {type}
                    </Button>
                  )
                )}
              </div>
            </div>

            {/* Price Slider */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Price Range</h3>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min={min}
                  max={priceRange[1] - step}
                  step={step}
                  value={priceRange[0]}
                  onChange={(e) => handleChange(e, 0)}
                  className="range-slider"
                />
                <input
                  type="range"
                  min={priceRange[0] + step}
                  max={max}
                  step={step}
                  value={priceRange[1]}
                  onChange={(e) => handleChange(e, 1)}
                  className="range-slider"
                />
              </div>
              <div className="flex justify-between text-sm">
                <span>{formatPKR(priceRange[0])}</span>
                <span>{formatPKR(priceRange[1])}</span>
              </div>
            </div>

            {/* Bedrooms */}
            <div>
              <h3 className="mb-4 text-lg font-semibold">Rooms</h3>
              <div className="flex gap-2">
                {["Any", "1+", "2+", "3+", "4+", "5+"].map((beds) => (
                  <Button
                    key={beds}
                    variant={bedrooms === beds ? "default" : "outline"}
                    size="sm"
                    onClick={() => setBedrooms(beds)}
                  >
                    {beds}
                  </Button>
                ))}
              </div>
            </div>

            {/* Size */}
            <div>
              <h3 className="mb-4 text-lg font-semibold">Size</h3>
              <div className="flex flex-wrap gap-2">
                {[
                  "Any",
                  "5 marla",
                  "10 marla",
                  "15 marla",
                  "1 canal",
                  "2 canal",
                  "4 canal",
                ].map((sizes) => (
                  <Button
                    key={sizes}
                    variant={size === sizes ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSize(sizes)}
                  >
                    {sizes}
                  </Button>
                ))}
              </div>
            </div>

            {/* Features */}
            <div>
              <h3 className="mb-4 text-lg font-semibold">Features</h3>
              <div className="space-y-2">
                {[
                  "Pets allowed",
                  "Built in wardrobes",
                  "Gas",
                  "Garden / courtyard",
                  "Balcony/deck",
                  "Internal laundry",
                  "Study",
                  "Swimming pool",
                  "Air conditioning",
                ].map((feature) => (
                  <div key={feature} className="flex items-center space-x-2">
                    <Checkbox
                      id={feature.toLowerCase()}
                      checked={features[feature]}
                      onCheckedChange={(checked) =>
                        setFeatures({ ...features, [feature]: checked })
                      }
                    />
                    <label
                      htmlFor={feature.toLowerCase()}
                      className="text-sm font-medium leading-none"
                    >
                      {feature}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Location */}
            <div>
              <h3 className="mb-4 text-lg font-semibold">Location</h3>
              <div className="space-y-2">
                {[
                  "Lahore",
                  "Karachi",
                  "Islamabad",
                  "Renla Kurd",
                  "Peshawar",
                ].map((feature) => (
                  <div key={feature} className="flex items-center space-x-2">
                    <Checkbox
                      id={feature.toLowerCase()}
                      checked={location[feature]}
                      onCheckedChange={(checked) =>
                        setLocation({ ...location, [feature]: checked })
                      }
                    />
                    <label
                      htmlFor={feature.toLowerCase()}
                      className="text-sm font-medium leading-none"
                    >
                      {feature}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Listings */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <h2 className="text-2xl font-bold">
                  {filteredProperties.length} Properties
                </h2>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    Sort by: Featured
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Featured</DropdownMenuItem>
                  <DropdownMenuItem>Price: Low to High</DropdownMenuItem>
                  <DropdownMenuItem>Price: High to Low</DropdownMenuItem>
                  <DropdownMenuItem>Newest</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProperties.map((property) => (
                <PropertyCard
                  key={property.id}
                  fun={addtoproperty}
                  property={property}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Static Props: Fetch data at build time
export async function getStaticProps(context) {
  try {
    const response = await axios.get(
      `https://are-z-pak-default-rtdb.asia-southeast1.firebasedatabase.app/property.json`
    );
    const propertiesData = response.data ? Object.values(response.data) : [];
    return {
      props: {
        propertiesData, // Pass data as a prop to the component
      },
    };
  } catch (error) {
    console.error("Error fetching properties:", error);
    return {
      props: {
        propertiesData: [],
      },
    };
  }
}
