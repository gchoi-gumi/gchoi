import { useState, useEffect } from "react";
import { ArrowLeft, Star, MessageCircle, MapPin, TrendingUp, Gem, Search, Sparkles, ExternalLink } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Input } from "./ui/input";
import { projectId, publicAnonKey } from "../utils/supabase/info";
import { motion } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface Place {
  id: string;
  name: string;
  category: string;
  address: string;
  roadAddress: string;
  phone: string;
  x: number;
  y: number;
  placeUrl: string;
  imageUrl?: string;
  reviewCount: number;
  rating: number;
  keywords: string[];
}

interface PopularHiddenPlacesPageProps {
  location?: string;
  onBack: () => void;
}

export function PopularHiddenPlacesPage({ location = "서울", onBack }: PopularHiddenPlacesPageProps) {
  const [popularPlaces, setPopularPlaces] = useState<Place[]>([]);
  const [hiddenGems, setHiddenGems] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchLocation, setSearchLocation] = useState(location);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [activeTab, setActiveTab] = useState("popular");
  const [isRealData, setIsRealData] = useState(false);

  const categories = [
    { id: "", label: "전체", icon: "🌟" },
    { id: "카페", label: "카페", icon: "☕" },
    { id: "레스토랑", label: "레스토랑", icon: "🍽️" },
    { id: "관광명소", label: "관광명소", icon: "🏛️" },
    { id: "공원", label: "공원", icon: "🌳" },
    { id: "박물관", label: "박물관", icon: "🏛️" },
    { id: "미술관", label: "미술관", icon: "🎨" }
  ];

  useEffect(() => {
    analyzePlaces();
  }, [searchLocation, selectedCategory]);

  const analyzePlaces = async () => {
    setLoading(true);
    setError("");

    try {
      console.log(`[PopularHiddenPlaces] Analyzing: ${searchLocation}, category: ${selectedCategory}`);

      const url = `https://${projectId}.supabase.co/functions/v1/make-server-a8dd3f70/analyze-places`;
      
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({
          location: searchLocation,
          category: selectedCategory
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      
      console.log(`[PopularHiddenPlaces] Popular: ${data.popularPlaces.length}, Hidden: ${data.hiddenGems.length}`);
      console.log(`[PopularHiddenPlaces] Data source: ${data.isMock ? '📝 Mock' : '✓ Real (Kakao + Google)'}`);
      
      // Set data source status
      setIsRealData(!data.isMock);
      
      setPopularPlaces(data.popularPlaces);
      setHiddenGems(data.hiddenGems);
      
    } catch (err) {
      console.error("[PopularHiddenPlaces] Error:", err);
      setError("장소 분석 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    analyzePlaces();
  };

  const getCategoryFallbackImage = (category: string, placeId: string) => {
    const hashCode = placeId.split('').reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);
    const imageIndex = Math.abs(hashCode) % 5;

    const imagesByCategory: { [key: string]: string[] } = {
      "카페": [
        "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=800&h=600&fit=crop"
      ],
      "레스토랑": [
        "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=800&h=600&fit=crop"
      ],
      "관광명소": [
        "https://images.unsplash.com/photo-1548013146-72479768bada?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1513407030348-c983a97b98d8?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1610349633888-c6058d7393e9?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1578894381163-e72c17f2d45f?w=800&h=600&fit=crop"
      ],
      "공원": [
        "https://images.unsplash.com/photo-1519331379826-f10be5486c6f?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=800&h=600&fit=crop"
      ],
      "박물관": [
        "https://images.unsplash.com/photo-1670915564082-9258f2c326c4?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1565532188831-10b210d85d80?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1554907984-15263bfd63bd?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1568322445389-f64ac2515020?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=800&h=600&fit=crop"
      ],
      "미술관": [
        "https://images.unsplash.com/photo-1578301978018-3005759f48f7?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1536924940846-227afb31e2a5?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1577083552792-a0d461cb1dd6?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=800&h=600&fit=crop"
      ]
    };

    const categoryImages = imagesByCategory[category] || [
      "https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&h=600&fit=crop"
    ];

    return categoryImages[imageIndex];
  };

  const getPlaceImage = (place: Place) => {
    return place.imageUrl || getCategoryFallbackImage(place.category, place.id);
  };

  const PlaceCard = ({ place, isHidden }: { place: Place; isHidden: boolean }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 border-gray-200">
        <div className="relative h-64">
          <ImageWithFallback
            src={getPlaceImage(place)}
            alt={place.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
          
          <div className="absolute top-4 left-4 flex gap-2">
            <Badge className="bg-white/95 text-gray-900 border-0">
              {place.category}
            </Badge>
            {isHidden && (
              <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
                <Gem className="w-3 h-3 mr-1" />
                숨은 명소
              </Badge>
            )}
            {!isHidden && (
              <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0">
                <TrendingUp className="w-3 h-3 mr-1" />
                인기
              </Badge>
            )}
          </div>

          <div className="absolute bottom-4 left-4 right-4">
            <h3 className="text-white font-semibold text-xl mb-2 drop-shadow-lg">
              {place.name}
            </h3>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="text-white text-sm font-medium">{place.rating}</span>
              </div>
              <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                <MessageCircle className="w-4 h-4 text-white" />
                <span className="text-white text-sm">{place.reviewCount.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-start gap-2 text-gray-600 text-sm mb-3">
            <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="line-clamp-1">{place.address}</p>
              {place.roadAddress && place.roadAddress !== place.address && (
                <p className="text-gray-400 text-xs mt-1 line-clamp-1">{place.roadAddress}</p>
              )}
            </div>
          </div>

          {place.keywords && place.keywords.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {place.keywords.map((keyword, idx) => (
                <Badge key={idx} variant="outline" className="text-xs">
                  #{keyword}
                </Badge>
              ))}
            </div>
          )}

          {place.phone && (
            <p className="text-gray-500 text-sm mb-4">📞 {place.phone}</p>
          )}

          <div className="flex items-center gap-3">
            <a
              href={place.placeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
            >
              카카오맵에서 보기
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </Card>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 py-12 mb-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-4 mb-6">
            <motion.button
              onClick={onBack}
              whileTap={{ scale: 0.9 }}
              className="p-2.5 hover:bg-white/20 rounded-xl transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-white" />
            </motion.button>
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-white/20 backdrop-blur-sm rounded-xl">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-white mb-1">인기 & 숨은 명소</h1>
                <p className="text-indigo-100 text-sm">AI 기반 장소 분석</p>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <Card className="p-6 border-0 shadow-2xl bg-white/95 backdrop-blur-xl">
            <div className="flex gap-3 mb-6">
              <Input
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                placeholder="지역명 입력 (예: 서울, 부산)"
                className="flex-1 h-12 rounded-xl"
              />
              <Button onClick={handleSearch} className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 h-12 px-8 rounded-xl">
                <Search className="w-5 h-5 mr-2" />
                검색
              </Button>
            </div>

            {/* Category Filter */}
            <div className="flex gap-3 overflow-x-auto pb-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl whitespace-nowrap transition-all ${
                    selectedCategory === cat.id
                      ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <span className="text-lg">{cat.icon}</span>
                  <span className="font-medium">{cat.label}</span>
                </button>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-12">
        {/* Loading State */}
        {loading && (
          <div className="text-center py-20">
            <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">장소를 분석하는 중...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <Card className="p-8 text-center border-red-200 bg-red-50">
            <p className="text-red-600 text-lg mb-4">{error}</p>
            <Button onClick={analyzePlaces} variant="outline">
              다시 시도
            </Button>
          </Card>
        )}

        {/* Results */}
        {!loading && !error && (
          <>
            {isRealData && (
              <div className="mb-6 p-4 bg-green-50 border-2 border-green-200 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white">
                    ✓
                  </div>
                  <div>
                    <p className="font-semibold text-green-900">실제 장소 데이터</p>
                    <p className="text-sm text-green-700">카카오 REST API 및 Google Places API에서 불러온 실제 데이터입니다</p>
                  </div>
                </div>
              </div>
            )}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full md:w-auto grid-cols-2 mb-8 h-14">
                <TabsTrigger value="popular" className="flex items-center gap-2 data-[state=active]:bg-orange-500 data-[state=active]:text-white">
                  <TrendingUp className="w-5 h-5" />
                  인기 장소 ({popularPlaces.length})
                </TabsTrigger>
                <TabsTrigger value="hidden" className="flex items-center gap-2 data-[state=active]:bg-purple-500 data-[state=active]:text-white">
                  <Gem className="w-5 h-5" />
                  숨은 명소 ({hiddenGems.length})
                </TabsTrigger>
              </TabsList>

            <TabsContent value="popular">
              {popularPlaces.length === 0 ? (
                <Card className="p-20 text-center">
                  <TrendingUp className="w-20 h-20 mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-500 text-lg">인기 장소를 찾지 못했습니다.</p>
                  <p className="text-sm text-gray-400 mt-2">다른 지역이나 카테고리를 시도해보세요.</p>
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {popularPlaces.map((place) => (
                    <PlaceCard key={place.id} place={place} isHidden={false} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="hidden">
              {hiddenGems.length === 0 ? (
                <Card className="p-20 text-center">
                  <Gem className="w-20 h-20 mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-500 text-lg">숨은 명소를 찾지 못했습니다.</p>
                  <p className="text-sm text-gray-400 mt-2">다른 지역이나 카테고리를 시도해보세요.</p>
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {hiddenGems.map((place) => (
                    <PlaceCard key={place.id} place={place} isHidden={true} />
                  ))}
                </div>
              )}
            </TabsContent>
            </Tabs>
          </>
        )}

        {/* Info Card */}
        {!loading && !error && (
          <Card className="p-6 mt-8 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-100">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 mb-3">AI 분석 기준</p>
                <p className="text-gray-700 mb-2">
                  <strong>인기 장소:</strong> 리뷰 수 상위 30% + 평점 4.0 이상
                </p>
                <p className="text-gray-700">
                  <strong>숨은 명소:</strong> 리뷰 수 하위 30% + 평점 4.5 이상 + 특별 키워드
                </p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
