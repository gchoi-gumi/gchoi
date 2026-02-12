import { useState, useEffect } from "react";
import { ArrowLeft, Sparkles, Coffee, Utensils, Camera, Trees, Building2, MapPin, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { motion } from "motion/react";
import { PlaceCard } from "./PlaceCard";
import { projectId } from "../utils/supabase/info";
import { toast } from "sonner@2.0.3";

interface PlacesResultsPageProps {
  location: string;
  onBack: () => void;
  onPlaceSelect?: (place: any) => void;
}

const categories = [
  { name: "전체", icon: Sparkles, color: "bg-blue-500" },
  { name: "카페", icon: Coffee, color: "bg-pink-500" },
  { name: "레스토랑", icon: Utensils, color: "bg-purple-500" },
  { name: "관광명소", icon: Camera, color: "bg-emerald-500" },
  { name: "공원", icon: Trees, color: "bg-green-500" },
  { name: "박물관", icon: Building2, color: "bg-gray-500" },
  { name: "미술관", icon: Camera, color: "bg-red-500" },
];

export function PlacesResultsPage({ location, onBack, onPlaceSelect }: PlacesResultsPageProps) {
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [viewMode, setViewMode] = useState<"popular" | "hidden">("popular");
  const [places, setPlaces] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-a8dd3f70`;

  // Debug: Log location prop
  useEffect(() => {
    console.log('[PlacesResults] Location prop:', location);
    console.log('[PlacesResults] Location is empty?', !location || location.trim() === '');
  }, [location]);

  // Redirect if location is empty
  useEffect(() => {
    if (!location || location.trim() === '') {
      console.error('[PlacesResults] Location is empty, redirecting...');
      toast.error('지역을 선택해주세요');
      setTimeout(() => onBack(), 1000);
    }
  }, [location, onBack]);

  // Fetch places from Google Places API
  useEffect(() => {
    // Don't fetch if location is empty
    if (!location || location.trim() === '') {
      return;
    }

    const fetchPlaces = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log('[PlacesResults] Fetching places for:', location, selectedCategory);
        
        const response = await fetch(`${API_BASE_URL}/google-places/search`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            location,
            category: selectedCategory === "전체" ? undefined : selectedCategory,
          }),
        });

        const data = await response.json();
        
        if (!response.ok || !data.success) {
          throw new Error(data.error || 'Failed to fetch places');
        }

        console.log('[PlacesResults] Received places:', data.places?.length || 0);
        setPlaces(data.places || []);
        
      } catch (err) {
        console.error('[PlacesResults] Error:', err);
        setError(err instanceof Error ? err.message : '장소를 불러오는데 실패했습니다');
        toast.error('장소를 불러오는데 실패했습니다');
      } finally {
        setLoading(false);
      }
    };

    fetchPlaces();
  }, [location, selectedCategory]);

  const filteredPlaces = places.filter(place => {
    if (viewMode === "hidden") {
      return place.isFeatured;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 shadow-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <motion.button 
              onClick={onBack} 
              whileTap={{ scale: 0.9 }}
              className="p-2 hover:bg-white/20 rounded-xl transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-white" />
            </motion.button>
            
            <div className="flex items-center gap-3 flex-1">
              <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-white text-xl font-semibold">{location}</h1>
                <p className="text-white/80 text-sm">AI 가이드 여행 플래너</p>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-white text-sm">실시간 정보</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 bg-white rounded-3xl shadow-xl p-8 border border-gray-100"
        >
          <div className="flex items-center gap-3 mb-6">
            <input
              type="text"
              placeholder={`${location}에서 검색`}
              className="flex-1 px-6 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
            />
            <Button className="px-8 py-4 h-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl shadow-lg">
              검색
            </Button>
          </div>

          {/* Categories */}
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((category) => {
              const Icon = category.icon;
              const isSelected = selectedCategory === category.name;
              
              return (
                <motion.button
                  key={category.name}
                  onClick={() => setSelectedCategory(category.name)}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl border-2 whitespace-nowrap transition-all ${
                    isSelected
                      ? `${category.color} text-white border-transparent shadow-lg`
                      : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:shadow-md'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{category.name}</span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Info Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-2xl p-6 flex items-center gap-4"
        >
          <div className="p-3 bg-emerald-500 rounded-xl">
            <CheckCircle2 className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-emerald-900 font-semibold mb-1">실제 장소 데이터</h3>
            <p className="text-emerald-700 text-sm">
              카카오 REST API 및 Google Places API에서 클라이언트 데이터입니다
            </p>
          </div>
        </motion.div>

        {/* View Mode Tabs */}
        <div className="mb-8 flex gap-4">
          <Button
            onClick={() => setViewMode("popular")}
            variant={viewMode === "popular" ? "default" : "outline"}
            className={`flex-1 py-6 rounded-2xl text-lg ${
              viewMode === "popular"
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
                : "bg-white"
            }`}
          >
            <MapPin className="w-5 h-5 mr-2" />
            인기 장소 ({places.length})
          </Button>
          <Button
            onClick={() => setViewMode("hidden")}
            variant={viewMode === "hidden" ? "default" : "outline"}
            className={`flex-1 py-6 rounded-2xl text-lg ${
              viewMode === "hidden"
                ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                : "bg-white"
            }`}
          >
            <Sparkles className="w-5 h-5 mr-2" />
            숨은 명소 ({places.filter(p => p.isFeatured).length})
          </Button>
        </div>

        {/* Results Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">장소를 검색하고 있습니다...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">⚠️</span>
              </div>
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>다시 시도</Button>
            </div>
          </div>
        ) : filteredPlaces.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-600">해당 카테고리의 장소를 찾을 수 없습니다.</p>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {filteredPlaces.map((place, index) => (
              <motion.div
                key={place.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <PlaceCard
                  title={place.title}
                  address={place.address}
                  phone={place.phone}
                  rating={place.rating}
                  category={place.category}
                  imageUrl={place.imageUrl}
                  isFeatured={place.isFeatured}
                  onClick={() => onPlaceSelect && onPlaceSelect(place)}
                />
              </motion.div>
            ))}
          </div>
        )}

        {/* Load More Button */}
        {!loading && !error && filteredPlaces.length > 0 && (
          <div className="text-center">
            <Button 
              variant="outline"
              className="px-12 py-6 rounded-2xl text-lg hover:bg-blue-50 hover:border-blue-500 hover:text-blue-600"
            >
              더 보기
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}