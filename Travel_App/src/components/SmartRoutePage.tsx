import { useState, useEffect, useRef } from "react";
import { ChevronLeft, Navigation, Clock, MapPin, Star, TrendingUp, RefreshCw, Loader2, Lock, Unlock, Bookmark, Save } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner@2.0.3";
import { WeatherWidget } from "./WeatherWidget";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { projectId, publicAnonKey } from "../utils/supabase/info";
import { createItinerary } from "../utils/itinerary-service";
import { addBookmark } from "../utils/bookmark-service";
import { useAuth } from "../utils/auth-context";

interface SmartRoutePageProps {
  travelStyle: string;
  location: string;
  weather: any;
  onBack: () => void;
  onConfirmRoute: (places: Place[], routeInfo: any, transportMode: string) => void;
  preloadedPlaces?: Place[];
}

interface Place {
  id: string;
  name: string;
  category: string;
  reviewCount: number;
  rating: number;
  description: string;
  address: string;
  isIndoor: boolean;
  isOutdoor: boolean;
  keywords: string[];
  lat: number;
  lng: number;
  locked?: boolean;
  imageUrl?: string;
}

interface RouteSegment {
  from: string;
  to: string;
  distance: number;
  distanceText: string;
  time: number;
  timeText: string;
  transportMode: string;
}

export function SmartRoutePage({ travelStyle, location, weather, onBack, onConfirmRoute, preloadedPlaces }: SmartRoutePageProps) {
  const [loading, setLoading] = useState(!preloadedPlaces);
  const [places, setPlaces] = useState<Place[]>(preloadedPlaces || []);
  const [routeInfo, setRouteInfo] = useState<any>(null);
  const [offset, setOffset] = useState(0);
  const [transportMode, setTransportMode] = useState("TRANSIT");
  const [calculating, setCalculating] = useState(false);
  const [initialLoadDone, setInitialLoadDone] = useState(false);
  const [isRealData, setIsRealData] = useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [itineraryTitle, setItineraryTitle] = useState("");
  const [itineraryDescription, setItineraryDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  
  const { user, accessToken } = useAuth();

  // Fetch places on mount and when offset changes (skip if preloaded)
  useEffect(() => {
    let mounted = true;
    
    const loadPlaces = async () => {
      // Skip fetching if we have preloaded places from GPT
      if (preloadedPlaces && preloadedPlaces.length > 0 && !initialLoadDone) {
        console.log("Using preloaded GPT recommendations:", preloadedPlaces.length, "places");
        console.log("Sample preloaded place:", preloadedPlaces[0]);
        console.log("Preloaded places with imageUrl:", preloadedPlaces.filter(p => p.imageUrl).length);
        setPlaces(preloadedPlaces);
        setInitialLoadDone(true);
        setIsRealData(true);
        return;
      }
      
      if (location && travelStyle && mounted && !preloadedPlaces) {
        console.log("Fetching places with offset:", offset);
        await fetchPlaces();
      }
    };
    
    loadPlaces();
    
    return () => {
      mounted = false;
    };
  }, [offset, preloadedPlaces]);

  // Calculate route when places or transport mode changes
  useEffect(() => {
    let mounted = true;
    
    const loadRoute = async () => {
      if (places.length >= 2 && initialLoadDone && mounted) {
        console.log("Calculating route for", places.length, "places");
        await calculateRoute();
      }
    };
    
    loadRoute();
    
    return () => {
      mounted = false;
    };
  }, [places.length, transportMode, initialLoadDone]);

  const fetchPlaces = async () => {
    try {
      setLoading(true);
      console.log("Starting to fetch places...");
      
      // Define categories based on travel style
      const categories = getCategoriesByStyle(travelStyle);
      console.log("Categories:", categories);
      
      const requestBody = {
        location,
        travelStyle,
        weather,
        categories,
        excludeIds: places.filter(p => p.locked).map(p => p.id),
        offset
      };
      console.log("Request body:", requestBody);
      
      // Add timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-a8dd3f70/select-places`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`
          },
          body: JSON.stringify(requestBody),
          signal: controller.signal
        }
      );
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text().catch(() => "Unknown error");
        console.error("Server error:", errorText);
        throw new Error("Failed to fetch places");
      }

      const data = await response.json();
      
      if (data.error) {
        console.error("API error:", data.error);
        throw new Error(data.error);
      }
      
      if (!data.places || data.places.length === 0) {
        console.warn("No places returned from server", data);
        toast.error("추천할 장소를 찾을 수 없습니다. 다시 시도해주세요.");
        
        // Set empty array to avoid errors
        setPlaces([]);
        return;
      }
      
      console.log(`Received ${data.places.length} places from server`);
      console.log(`Data source: ${data.isMock ? '📝 Mock Data' : '✓ Real Data (Kakao + Google)'}`);
      console.log(`Places with images:`, data.places.filter((p: Place) => p.imageUrl).length);
      console.log(`Sample place:`, data.places[0]);
      
      // Set data source status
      setIsRealData(!data.isMock);
      
      // Show info toast
      if (!data.isMock) {
        toast.success("✓ 실제 장소 데이터를 불러왔습니다!");
      }
      
      // Merge with locked places
      const lockedPlaces = places.filter(p => p.locked);
      const newPlaces = data.places.filter((p: Place) => 
        !lockedPlaces.some(lp => lp.id === p.id)
      );
      
      const finalPlaces = [...lockedPlaces, ...newPlaces.slice(0, 4 - lockedPlaces.length)];
      console.log(`Setting ${finalPlaces.length} places`);
      setPlaces(finalPlaces);
      setInitialLoadDone(true);
    } catch (error) {
      console.error("Error fetching places:", error);
      
      // Check if it's a timeout error
      if (error instanceof Error && error.name === 'AbortError') {
        toast.error("요청 시간이 초과되었습니다. 다시 시도해주세요.");
      } else {
        const errorMessage = error instanceof Error ? error.message : "장소를 불러오는데 실패했습니다";
        toast.error(errorMessage);
      }
      
      // Create mock places as fallback
      const mockPlaces: Place[] = getCategoriesByStyle(travelStyle).map((category, index) => ({
        id: `mock_${index}`,
        name: `${location} ${category} 추천`,
        category,
        reviewCount: Math.floor(Math.random() * 1000) + 100,
        rating: 4.5,
        description: "추천 장소",
        address: `${location}`,
        isIndoor: ["카페", "레스토랑"].includes(category),
        isOutdoor: ["공원", "액티비티"].includes(category),
        keywords: ["추천"],
        lat: 37.5 + Math.random() * 0.1,
        lng: 127.0 + Math.random() * 0.1
      }));
      
      setPlaces(mockPlaces);
      setInitialLoadDone(true);
    } finally {
      console.log("Fetch places completed");
      setLoading(false);
    }
  };

  const calculateRoute = async () => {
    try {
      setCalculating(true);
      
      if (!places || places.length < 2) {
        console.log("Not enough places to calculate route");
        setRouteInfo(null);
        return;
      }
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-a8dd3f70/calculate-route`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`
          },
          body: JSON.stringify({
            places,
            transportMode,
            travelStyle
          })
        }
      );

      if (!response.ok) {
        const errorText = await response.text().catch(() => "Unknown error");
        console.error("Server error:", errorText);
        throw new Error("Failed to calculate route");
      }

      const data = await response.json();
      
      if (data.error) {
        console.error("API error:", data.error);
        throw new Error(data.error);
      }
      
      setRouteInfo(data);
    } catch (error) {
      console.error("Error calculating route:", error);
      // Don't show toast for route calculation errors (non-critical)
    } finally {
      setCalculating(false);
    }
  };

  const getCategoriesByStyle = (style: string): string[] => {
    if (style === "힐링") {
      return ["카페", "공원", "숙박", "레스토랑"];
    } else if (style === "관광") {
      return ["관광명소", "박물관", "레스토랑", "숙박"];
    } else {
      return ["액티비티", "레스토랑", "공원", "숙박"];
    }
  };

  const toggleLock = (placeId: string) => {
    setPlaces(places.map(p => 
      p.id === placeId ? { ...p, locked: !p.locked } : p
    ));
    toast.success(
      places.find(p => p.id === placeId)?.locked 
        ? "장소 고정이 해제되었습니다" 
        : "장소가 고정되었습니다"
    );
  };

  const refreshPlaces = () => {
    const lockedCount = places.filter(p => p.locked).length;
    if (lockedCount === places.length) {
      toast.error("모든 장소가 고정되어 있습니다");
      return;
    }
    
    setOffset(prev => prev + 1);
    toast.success("새로운 장소를 불러옵니다");
  };

  const optimizeRoute = async () => {
    if (places.length < 2) {
      toast.error("최소 2개 이상의 장소가 필요합니다");
      return;
    }

    try {
      setCalculating(true);
      toast.info("최적 경로를 계산하는 중...");

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-a8dd3f70/optimize-route`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            places: places,
            startIndex: 0 // First place as start
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to optimize route");
      }

      const data = await response.json();
      
      if (data.success && data.optimizedPlaces) {
        setPlaces(data.optimizedPlaces);
        toast.success("경로가 최적화되었습니다!");
      } else {
        throw new Error("Invalid response");
      }
    } catch (error) {
      console.error("Route optimization error:", error);
      toast.error("경로 최적화에 실패했습니다");
    } finally {
      setCalculating(false);
    }
  };

  const getPlaceImage = (category: string): string => {
    console.log(`[SmartRoute] Using fallback image for category: ${category}`);
    const images = {
      "카페": "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085",
      "레스토랑": "https://images.unsplash.com/photo-1555939594-58d7cb561ad1",
      "관광명소": "https://images.unsplash.com/photo-1513407030348-c983a97b98d8",
      "박물관": "https://images.unsplash.com/photo-1670915564082-9258f2c326c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNldW0lMjBhcmNoaXRlY3R1cmUlMjBpbnRlcmlvcnxlbnwxfHx8fDE3NjExNTg3NjZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      "공원": "https://images.unsplash.com/photo-1519331379826-f10be5486c6f",
      "쇼핑": "https://images.unsplash.com/photo-1441986300917-64674bd600d8",
      "숙박": "https://images.unsplash.com/photo-1566073771259-6a8506099945",
      "액티비티": "https://images.unsplash.com/photo-1527004013197-933c4bb611b3"
    };
    return images[category] || images["관광명소"];
  };

  const getPopularityBadge = (place: Place) => {
    if (place.reviewCount < 100 && place.rating >= 4.5) {
      return <Badge variant="secondary" className="bg-purple-100 text-purple-700 border-0">숨은명소</Badge>;
    }
    if (place.reviewCount > 1000 && place.rating >= 4.0) {
      return <Badge variant="secondary" className="bg-orange-100 text-orange-700 border-0">인기장소</Badge>;
    }
    if (place.rating >= 4.5) {
      return <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 border-0">고평점</Badge>;
    }
    return null;
  };

  const handleSaveItinerary = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !accessToken) {
      toast.error("로그인이 필요합니다");
      return;
    }

    if (places.length < 2) {
      toast.error("최소 2개 이상의 장소가 필요합니다");
      return;
    }

    try {
      setSaving(true);
      
      const spots = places.map((place, index) => ({
        id: place.id,
        name: place.name,
        category: place.category,
        address: place.address,
        lat: place.lat,
        lng: place.lng,
        rating: place.rating,
        reviewCount: place.reviewCount,
        order: index + 1,
        imageUrl: place.imageUrl
      }));

      await createItinerary(accessToken, {
        title: itineraryTitle,
        description: itineraryDescription,
        location: location,
        startDate: startDate,
        endDate: endDate,
        routes: routeInfo?.routes || [],
        spots: spots,
        travelStyle: travelStyle,
      });

      toast.success("여행 일정이 저장되었습니다!");
      setSaveDialogOpen(false);
      setItineraryTitle("");
      setItineraryDescription("");
      setStartDate("");
      setEndDate("");
    } catch (error) {
      console.error("Save itinerary error:", error);
      toast.error("여행 일정 저장에 실패했습니다");
    } finally {
      setSaving(false);
    }
  };

  const handleAddBookmark = async (place: Place) => {
    if (!user || !accessToken) {
      toast.error("로그인이 필요합니다");
      return;
    }

    try {
      await addBookmark(accessToken, {
        placeId: place.id,
        placeName: place.name,
        address: place.address,
        category: place.category,
        imageUrl: place.imageUrl || "",
        latitude: place.lat,
        longitude: place.lng,
        rating: place.rating,
        reviewCount: place.reviewCount,
        notes: ""
      });

      toast.success(`${place.name}을(를) 북마크했습니다!`);
    } catch (error) {
      console.error("Add bookmark error:", error);
      toast.error("북마크 추가에 실패했습니다");
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-cyan-50 via-blue-50 to-teal-50 overflow-auto z-50">
      {/* Header */}
      <div className="gradient-ocean py-8 shadow-premium sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <button 
            onClick={onBack} 
            className="mb-4 flex items-center text-white/90 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>뒤로</span>
          </button>

          <h1 className="text-white mb-2 drop-shadow-lg">스마트 경로 추천</h1>
          <p className="text-cyan-100 mb-4 drop-shadow">
            {travelStyle}형 · {location}
          </p>
          
          {/* Weather Widget */}
          <div className="mb-4">
            <WeatherWidget city={location} compact />
          </div>

          {/* Transport Mode Selection */}
          <div className="flex gap-2 flex-wrap">
            <Button
              size="sm"
              variant={transportMode === "WALK" ? "default" : "outline"}
              onClick={() => setTransportMode("WALK")}
              className={transportMode === "WALK" 
                ? "glass text-cyan-600 hover:shadow-glow" 
                : "glass-cyan text-white hover:bg-white/30 border-cyan-400/30"
              }
            >
              🚶 도보
            </Button>
            <Button
              size="sm"
              variant={transportMode === "TRANSIT" ? "default" : "outline"}
              onClick={() => setTransportMode("TRANSIT")}
              className={transportMode === "TRANSIT" 
                ? "glass text-cyan-600 hover:shadow-glow" 
                : "glass-cyan text-white hover:bg-white/30 border-cyan-400/30"
              }
            >
              🚇 대중교통
            </Button>
            <Button
              size="sm"
              variant={transportMode === "DRIVE" ? "default" : "outline"}
              onClick={() => setTransportMode("DRIVE")}
              className={transportMode === "DRIVE" 
                ? "glass text-cyan-600 hover:shadow-glow" 
                : "glass-cyan text-white hover:bg-white/30 border-cyan-400/30"
              }
            >
              🚗 자동차
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Route Summary */}
        {routeInfo && !calculating && (
          <Card className="p-5 mb-6 glass-cyan border-cyan-200 shadow-premium hover-lift">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 gradient-ocean rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                <Navigation className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-gray-900 mb-3">경로 정보</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">총 거리:</span>
                    <span className="text-cyan-600">{routeInfo.totalDistanceText}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">이동 시간:</span>
                    <span className="text-cyan-600">{routeInfo.totalTimeText}</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Header with Data Badge */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-gray-900">추천 장소</h2>
            {isRealData && (
              <Badge variant="secondary" className="bg-green-100 text-green-700 border-0">
                ✓ 실제 데이터
              </Badge>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={optimizeRoute}
              disabled={loading || calculating || places.length < 2}
              className="flex items-center gap-2 gradient-ocean text-white hover:shadow-glow border-0"
            >
              <TrendingUp className={`w-4 h-4 ${calculating ? 'animate-pulse' : ''}`} />
              경로 최적화
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={refreshPlaces}
              disabled={loading}
              className="flex items-center gap-2 glass hover:shadow-premium border-cyan-200"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              새로고침
            </Button>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
            <p className="text-sm text-gray-500">장소를 불러오는 중...</p>
          </div>
        ) : places.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <p className="text-gray-600">장소를 찾을 수 없습니다</p>
            <Button onClick={() => setOffset(0)} variant="outline">
              다시 시도
            </Button>
          </div>
        ) : (
          <>
            {/* Places List */}
            <div className="space-y-4">
              {places.map((place, index) => (
                <div key={place.id}>
                  <Card className={`overflow-hidden glass hover:shadow-premium transition-all hover-lift ${
                    place.locked ? 'ring-2 ring-cyan-500 shadow-glow' : ''
                  }`}>
                    <div className="flex gap-4 p-4">
                      {/* Image */}
                      <div className="flex-shrink-0 relative">
                        <ImageWithFallback
                          src={(() => {
                            const imageUrl = place.imageUrl || getPlaceImage(place.category);
                            console.log(`[SmartRoute] Place "${place.name}" image:`, place.imageUrl ? 'Using imageUrl' : 'Using fallback', imageUrl);
                            return imageUrl;
                          })()}
                          alt={place.name}
                          className="w-24 h-24 sm:w-28 sm:h-28 rounded-lg object-cover"
                        />
                        <div className="absolute -top-2 -left-2 w-7 h-7 gradient-ocean text-white rounded-full flex items-center justify-center text-sm shadow-lg">
                          {index + 1}
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1 pr-2">
                            <h3 className="text-gray-900 mb-1 line-clamp-1">{place.name}</h3>
                            <p className="text-sm text-gray-600 mb-2 line-clamp-1">{place.description}</p>
                            {place.address && (
                              <div className="flex items-start gap-1.5 text-xs text-gray-500 mb-2">
                                <MapPin className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                                <span className="line-clamp-1">{place.address}</span>
                              </div>
                            )}
                          </div>
                          <div className="flex gap-1 ml-2">
                            {user && (
                              <button
                                onClick={() => handleAddBookmark(place)}
                                className="p-2 hover:bg-purple-50 rounded-lg transition-colors"
                                title="북마크 추가"
                              >
                                <Bookmark className="w-4 h-4 text-purple-500" />
                              </button>
                            )}
                            <button
                              onClick={() => toggleLock(place.id)}
                              className="p-2 hover:bg-cyan-50 rounded-lg transition-colors"
                            >
                              {place.locked ? (
                                <Lock className="w-4 h-4 text-cyan-500" />
                              ) : (
                                <Unlock className="w-4 h-4 text-gray-400" />
                              )}
                            </button>
                          </div>
                        </div>
                        
                        {/* Badges */}
                        <div className="flex items-center gap-2 mb-3 flex-wrap">
                          <Badge variant="outline" className="text-xs bg-gray-50 border-gray-300">
                            {place.category}
                          </Badge>
                          {getPopularityBadge(place)}
                        </div>
                        
                        {/* Stats */}
                        <div className="flex items-center gap-4 text-xs text-gray-600 mb-2">
                          <div className="flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                            <span className="text-gray-900">{place.rating.toFixed(1)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <TrendingUp className="w-3.5 h-3.5" />
                            <span>리뷰 {place.reviewCount.toLocaleString()}</span>
                          </div>
                        </div>
                        
                        {/* Keywords */}
                        {place.keywords && place.keywords.length > 0 && (
                          <div className="flex gap-1.5 flex-wrap">
                            {place.keywords.slice(0, 3).map((keyword, idx) => (
                              <span 
                                key={idx} 
                                className="text-xs px-2 py-1 bg-indigo-50 text-indigo-700 rounded-md"
                              >
                                #{keyword}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>

                  {/* Route segment info */}
                  {routeInfo && routeInfo.routes[index] && !calculating && (
                    <div className="flex items-center gap-2 py-3 pl-6">
                      <div className="w-0.5 h-8 bg-gray-300 rounded-full"></div>
                      <div className="flex items-center gap-3 text-xs text-gray-600 bg-gray-100 px-3 py-1.5 rounded-full">
                        <div className="flex items-center gap-1">
                          <Navigation className="w-3.5 h-3.5" />
                          <span>{routeInfo.routes[index].distanceText}</span>
                        </div>
                        <span className="text-gray-400">·</span>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{routeInfo.routes[index].timeText}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            {places.length >= 2 && routeInfo && (
              <div className="mt-8 mb-8 space-y-3">
                {user && (
                  <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        className="w-full h-12 bg-green-600 hover:bg-green-700 text-white shadow-lg"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        여행 일정 저장
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>여행 일정 저장</DialogTitle>
                        <DialogDescription>
                          여행 일정을 저장하여 나중에 다시 확인할 수 있습니다
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleSaveItinerary} className="space-y-4">
                        <div>
                          <Label htmlFor="title">일정 제목 *</Label>
                          <Input
                            id="title"
                            value={itineraryTitle}
                            onChange={(e) => setItineraryTitle(e.target.value)}
                            placeholder="예: 제주도 힐링 여행"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="description">설명</Label>
                          <Textarea
                            id="description"
                            value={itineraryDescription}
                            onChange={(e) => setItineraryDescription(e.target.value)}
                            placeholder="여행에 대한 간단한 설명을 입력하세요"
                            rows={3}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label htmlFor="startDate">시작일</Label>
                            <Input
                              id="startDate"
                              type="date"
                              value={startDate}
                              onChange={(e) => setStartDate(e.target.value)}
                            />
                          </div>
                          <div>
                            <Label htmlFor="endDate">종료일</Label>
                            <Input
                              id="endDate"
                              type="date"
                              value={endDate}
                              onChange={(e) => setEndDate(e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            className="flex-1"
                            onClick={() => setSaveDialogOpen(false)}
                          >
                            취소
                          </Button>
                          <Button
                            type="submit"
                            className="flex-1 bg-green-600 hover:bg-green-700"
                            disabled={saving}
                          >
                            {saving ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                저장 중...
                              </>
                            ) : (
                              "저장"
                            )}
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                )}
                
                <Button 
                  className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg"
                  onClick={() => {
                    onConfirmRoute(places, routeInfo, transportMode);
                    toast.success("경로가 확정되었습니다!");
                  }}
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  경로 확정 및 지도 보기
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}