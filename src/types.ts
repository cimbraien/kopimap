import { Database } from "./components/lib/database.types";

type Attribute = {
  name: string;
  options: string[];
  icon: any;
};

export type CategoryAttributes = {
  color:
    | "orange"
    | "blue"
    | "emerald"
    | "purple"
    | "fuchsia"
    | "zinc"
    | "cyan"
    | "green"
    | "indigo"
    | "lime"
    | "pink"
    | "red"
    | "teal"
    | "violet"
    | "yellow"
    | "amber"
    | "sky"
    | "rose"
    | undefined;
  category: string;
  attributes: Attribute[];
};

export type CafeDetailedInfo =
  Database["public"]["Views"]["cafe_location_view"]["Row"];

export type MeiliSearchCafe = {
  id: string;
  name: string;
  gmaps_rating: number;
  address: string;
  _geo: {
    lat: number;
    lng: number;
  };
  _geoDistance: number;
  avg_rating: number;
} & CafeAttributes;

export type Cafe = {
  id: string;
  name: string;
  gmaps_featured_image: string;
  gmaps_ratings: string;
  latitude: number;
  longitude: number;
  distance: number;
} & CafeAttributes;

export type CafeAttributes = {
  restroom_quality_mode: string;
  cleanliness_mode: string;
  coffee_quality_mode: string;
  food_options_mode: string;
  instagram_worthiness_mode: string;
  non_coffee_options_mode: string;
  outdoor_seating_mode: string;
  parking_options_mode: string;
  pet_friendly_mode: string;
  outlet_availability_mode: string;
  comfort_level_mode: string;
  price_quality_ratio_mode: string;
  wifi_quality_mode: string;
  work_suitability_mode: string;
  accessibility_mode: string;
};

export type SearchFilters = {
  minRating: number;
  query: string;
} & CafeAttributes;
