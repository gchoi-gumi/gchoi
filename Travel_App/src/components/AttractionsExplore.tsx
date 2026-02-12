import { useState, useEffect } from "react";
import { ArrowLeft, MapPin, Star, Loader2, Search, TrendingUp, Compass, Clock, Phone, Globe, ExternalLink } from "lucide-react";
import { motion } from "motion/react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { projectId, publicAnonKey } from "../utils/supabase/info";

interface Place {
  place_id: string;
  name: string;
  vicinity: string;
  rating?: number;
  user_ratings_total?: number;
  photos?: Array<{ photo_reference: string }>;
  photoUrl?: string; // Add photoUrl field from backend
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  types?: string[];
  opening_hours?: {
    open_now?: boolean;
  };
}

interface PlaceDetails extends Place {
  formatted_address?: string;
  formatted_phone_number?: string;
  website?: string;
  opening_hours?: {
    open_now?: boolean;
    weekday_text?: string[];
  };
}

interface AttractionsExploreProps {
  onBack: () => void;
  onSelectAttraction?: (attraction: any) => void;
}

const regionData = [
  { name: "서울", lat: 37.5665, lng: 126.9780, emoji: "🏙️" },
  { name: "부산", lat: 35.1796, lng: 129.0756, emoji: "🌊" },
  { name: "제주", lat: 33.4996, lng: 126.5312, emoji: "🌴" },
  { name: "강릉", lat: 37.7519, lng: 128.8761, emoji: "⛰️" },
  { name: "전주", lat: 35.8242, lng: 127.1480, emoji: "🏯" },
  { name: "경주", lat: 35.8562, lng: 129.2247, emoji: "🏛️" },
  { name: "여수", lat: 34.7604, lng: 127.6622, emoji: "🌅" },
  { name: "대구", lat: 35.8714, lng: 128.6014, emoji: "🌆" },
  { name: "인천", lat: 37.4563, lng: 126.7052, emoji: "✈️" },
  { name: "수원", lat: 37.2636, lng: 127.0286, emoji: "🏘️" },
  { name: "대전", lat: 36.3504, lng: 127.3845, emoji: "🏫" },
  { name: "광주", lat: 35.1595, lng: 126.8526, emoji: "🎨" },
];

const categoryData = [
  { type: "tourist_attraction", label: "관광명소", emoji: "🗼", color: "from-blue-500 to-cyan-500" },
  { type: "museum", label: "박물관", emoji: "🏛️", color: "from-purple-500 to-pink-500" },
  { type: "park", label: "공원", emoji: "🌳", color: "from-green-500 to-emerald-500" },
  { type: "art_gallery", label: "미술관", emoji: "🎨", color: "from-orange-500 to-red-500" },
  { type: "amusement_park", label: "테마파크", emoji: "🎢", color: "from-pink-500 to-rose-500" },
  { type: "shopping_mall", label: "쇼핑", emoji: "🛍️", color: "from-indigo-500 to-blue-500" },
];

export function AttractionsExplore({ onBack, onSelectAttraction }: AttractionsExploreProps) {
  const [selectedRegion, setSelectedRegion] = useState(regionData[0]);
  const [selectedCategory, setSelectedCategory] = useState(categoryData[0]);
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchResults, setSearchResults] = useState<Place[]>([]);
  const [searching, setSearching] = useState(false);
  const [activeTab, setActiveTab] = useState("explore");
  const [selectedPlace, setSelectedPlace] = useState<PlaceDetails | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (activeTab === "explore") {
      fetchPlaces();
    }
  }, [selectedRegion, selectedCategory, activeTab]);

  const fetchPlaces = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-a8dd3f70/places/nearby?` +
        `lat=${selectedRegion.lat}&` +
        `lng=${selectedRegion.lng}&` +
        `type=${selectedCategory.type}&` +
        `radius=10000`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.places) {
          setPlaces(data.places);
        }
      }
    } catch (error) {
      console.error("Error fetching places:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchKeyword.trim()) return;

    setSearching(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-a8dd3f70/places/search?` +
        `query=${encodeURIComponent(searchKeyword)}`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.places) {
          setSearchResults(data.places);
        }
      }
    } catch (error) {
      console.error("Error searching places:", error);
    } finally {
      setSearching(false);
    }
  };

  const PlaceCard = ({ place }: { place: Place }) => {
    const isPopular = (place.rating || 0) >= 4.5 && (place.user_ratings_total || 0) >= 100;
    const isHidden = (place.rating || 0) >= 4.3 && (place.user_ratings_total || 0) < 100;
    
    return (
      <motion.div
        whileTap={{ scale: 0.98 }}
        whileHover={{ scale: 1.02 }}
        onClick={() => onSelectAttraction?.(place)}
        className="bg-white border-2 border-gray-200 rounded-2xl overflow-hidden hover:border-indigo-400 hover:shadow-xl transition-all cursor-pointer h-full flex flex-col"
      >
        <div className="h-64 bg-gray-100 overflow-hidden relative flex-shrink-0">
          {place.photoUrl ? (
            <ImageWithFallback
              src={place.photoUrl}
              alt={place.name}
              className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
              <MapPin className="w-20 h-20 text-gray-400" />
            </div>
          )}
          
          {/* Badge overlays */}
          <div className="absolute top-3 right-3 flex gap-2">
            {isPopular && (
              <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg">
                🔥 인기
              </Badge>
            )}
            {isHidden && (
              <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg">
                💎 숨은명소
              </Badge>
            )}
          </div>

          {/* Rating overlay */}
          {place.rating && (
            <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold text-sm">{place.rating.toFixed(1)}</span>
              {place.user_ratings_total && (
                <span className="text-xs text-gray-500">({place.user_ratings_total})</span>
              )}
            </div>
          )}
        </div>
        
        <div className="p-6 flex-1 flex flex-col">
          <h3 className="mb-3 text-gray-900 line-clamp-2 min-h-[3.5rem]">{place.name}</h3>
          <div className="space-y-3 flex-grow">
            {place.vicinity && (
              <div className="flex items-start gap-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-green-600" />
                <span className="line-clamp-2">{place.vicinity}</span>
              </div>
            )}
            {place.opening_hours?.open_now !== undefined && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 flex-shrink-0 text-blue-600" />
                <Badge className={place.opening_hours.open_now ? "bg-green-500" : "bg-gray-500"}>
                  {place.opening_hours.open_now ? "영업 중" : "영업 종료"}
                </Badge>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-700 py-12 mb-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-4">
            <motion.button
              onClick={onBack}
              whileTap={{ scale: 0.9 }}
              className="p-2.5 hover:bg-white/20 rounded-xl transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-white" />
            </motion.button>
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-white/20 backdrop-blur-sm rounded-xl">
                <Compass className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-white">관광지 탐색</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-12">
        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full md:w-auto grid-cols-2 h-14 bg-white shadow-lg">
            <TabsTrigger value="explore" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">
              지역별 탐색
            </TabsTrigger>
            <TabsTrigger value="search" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">
              검색
            </TabsTrigger>
          </TabsList>

          {/* Explore Tab */}
          <TabsContent value="explore" className="mt-8 space-y-8">
            {/* Region Selection */}
            <div>
              <h3 className="mb-4 text-gray-700">지역 선택</h3>
              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {regionData.map((region) => (
                  <motion.button
                    key={region.name}
                    onClick={() => setSelectedRegion(region)}
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ scale: 1.05 }}
                    className={`py-6 px-3 border-2 rounded-2xl transition-all shadow-lg flex flex-col items-center justify-center ${
                      selectedRegion.name === region.name
                        ? "border-green-500 bg-green-50"
                        : "border-gray-200 hover:border-green-300 bg-white"
                    }`}
                  >
                    <div className="text-4xl mb-2">{region.emoji}</div>
                    <div className="text-sm text-gray-700">{region.name}</div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Category Selection */}
            <div>
              <h3 className="mb-4 text-gray-700">카테고리 선택</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {categoryData.map((category) => (
                  <motion.button
                    key={category.type}
                    onClick={() => setSelectedCategory(category)}
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ scale: 1.05 }}
                    className={`py-4 px-3 border-2 rounded-2xl transition-all shadow-lg flex flex-col items-center justify-center ${
                      selectedCategory.type === category.type
                        ? `border-green-500 bg-gradient-to-r ${category.color} text-white`
                        : "border-gray-200 hover:border-green-300 bg-white"
                    }`}
                  >
                    <div className="text-3xl mb-1">{category.emoji}</div>
                    <div className="text-sm font-medium">{category.label}</div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Places List */}
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-10 h-10 animate-spin text-green-600" />
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                  <h3 className="text-gray-800">
                    {selectedRegion.name} {selectedCategory.label}
                  </h3>
                  <Badge className="ml-auto bg-green-500">
                    {places.length}개
                  </Badge>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {places.map((place) => (
                    <PlaceCard key={place.place_id} place={place} />
                  ))}
                </div>
                {places.length === 0 && (
                  <div className="text-center py-20 text-gray-500">
                    검색 결과가 없습니다
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          {/* Search Tab */}
          <TabsContent value="search" className="mt-8 space-y-8">
            <div className="space-y-4">
              <h3 className="text-gray-700">관광지 검색</h3>
              <div className="flex gap-3">
                <div className="relative flex-1 max-w-2xl">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="예: 경복궁, 해운대, 성산일출봉"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    className="pl-12 py-6 rounded-xl border-2"
                  />
                </div>
                <Button
                  onClick={handleSearch}
                  disabled={searching || !searchKeyword.trim()}
                  className="px-8 py-6 rounded-xl bg-green-600 hover:bg-green-700"
                >
                  {searching ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    "검색"
                  )}
                </Button>
              </div>
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <h3 className="text-gray-700">검색 결과</h3>
                  <Badge className="bg-green-500">{searchResults.length}개</Badge>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {searchResults.map((place) => (
                    <PlaceCard key={place.place_id} place={place} />
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Info Box */}
        <div className="p-6 bg-green-50 rounded-2xl border-2 border-green-100">
          <p className="text-sm text-green-800 leading-relaxed">
            Google Places API로 실시간 관광지 정보를 제공합니다. 평점, 리뷰, 영업시간 등 최신 정보를 확인하세요.
          </p>
        </div>
      </div>
    </div>
  );
}