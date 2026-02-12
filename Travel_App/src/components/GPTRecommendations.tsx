import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Sparkles, MapPin, Star, Loader2, ArrowLeft, Navigation } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { projectId, publicAnonKey } from "../utils/supabase/info";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface GPTRecommendationsProps {
  onBack: () => void;
  location: string;
  weather?: {
    temperature: number;
    description: string;
    icon: string;
  } | null;
  surveyResult?: {
    travelType: string;
    personality: string;
    preferences: {
      pace: string;
      budget: string;
      activities: string[];
      companion: string;
    };
    recommendations: string[];
  } | null;
  preloadedRecommendations?: any[];
  onCreateRoute?: (places: any[]) => void;
}

interface Recommendation {
  contentid: string;
  title: string;
  addr1: string;
  address?: string;
  rating: number;
  reviewCount: number;
  googlePhoto?: string;
  imageUrl?: string;
  mapx: string;
  mapy: string;
  lat?: number;
  lng?: number;
  gptReason: string;
  description?: string;
  gptCategory: string;
  category?: string;
  gptKeywords: string[];
  isIndoor?: boolean;
}

const travelStyles = [
  { value: "관광", label: "🏛️ 관광", emoji: "🏛️" },
  { value: "휴양", label: "🏖️ 휴양", emoji: "🏖️" },
  { value: "액티비티", label: "🎿 액티비티", emoji: "🎿" },
  { value: "미식", label: "🍜 미식", emoji: "🍜" },
  { value: "쇼핑", label: "🛍️ 쇼핑", emoji: "🛍️" },
  { value: "문화체험", label: "🎨 문화체험", emoji: "🎨" },
];

const companions = [
  { value: "혼자", label: "혼자" },
  { value: "연인", label: "연인" },
  { value: "가족", label: "가족" },
  { value: "친구", label: "친구" },
];

const budgets = [
  { value: "저렴", label: "저렴 (1만원 이하)" },
  { value: "중간", label: "중간 (1-5만원)" },
  { value: "고급", label: "고급 (5만원 이상)" },
];

const activities = [
  "사진촬영", "카페투어", "박물관/미술관", "공연관람", 
  "야외활동", "쇼핑", "맛집탐방", "역사탐방", "자연감상"
];

export function GPTRecommendations({ onBack, location, weather, surveyResult, preloadedRecommendations, onCreateRoute }: GPTRecommendationsProps) {
  // 설문 결과가 있으면 그것을 기본값으로 사용
  const [travelStyle, setTravelStyle] = useState(
    surveyResult?.travelType?.includes("힐링") ? "휴양" :
    surveyResult?.travelType?.includes("모험") ? "액티비티" :
    surveyResult?.travelType?.includes("미식") ? "미식" :
    surveyResult?.travelType?.includes("문화") ? "문화체험" :
    "관광"
  );
  const [companion, setCompanion] = useState(surveyResult?.preferences?.companion || "혼자");
  const [budget, setBudget] = useState(
    surveyResult?.preferences?.budget === "low" ? "저렴" :
    surveyResult?.preferences?.budget === "high" ? "고급" :
    "중간"
  );
  const [selectedActivities, setSelectedActivities] = useState<string[]>(
    surveyResult?.preferences?.activities?.slice(0, 3) || []
  );
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<Recommendation[]>(preloadedRecommendations || []);
  const [summary, setSummary] = useState("");
  const [hasSearched, setHasSearched] = useState(!!preloadedRecommendations);

  const toggleActivity = (activity: string) => {
    if (selectedActivities.includes(activity)) {
      setSelectedActivities(selectedActivities.filter(a => a !== activity));
    } else {
      setSelectedActivities([...selectedActivities, activity]);
    }
  };

  const getRecommendations = async () => {
    setLoading(true);
    setHasSearched(true);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-a8dd3f70/recommend`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            preferences: {
              travelStyle,
              activities: selectedActivities,
              companion,
              budget,
            },
            location,
            weather,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("[GPT] Recommendations received:", data);
        setRecommendations(data.recommendations || []);
        setSummary(data.gptSummary || "");
      } else {
        const errorData = await response.json();
        console.error("[GPT] Error:", errorData);
        alert("추천을 생성하는 중 오류가 발생했습니다.");
      }
    } catch (error) {
      console.error("[GPT] Error:", error);
      alert("추천을 생성하는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const RecommendationCard = ({ rec }: { rec: Recommendation }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl overflow-hidden border-2 border-gray-200 hover:border-cyan-400 hover:shadow-xl transition-all"
    >
      <div className="h-56 bg-gray-100 overflow-hidden relative">
        {(rec.imageUrl || rec.googlePhoto) ? (
          <ImageWithFallback
            src={rec.imageUrl || rec.googlePhoto || ""}
            alt={rec.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
            <MapPin className="w-16 h-16 text-gray-400" />
          </div>
        )}
        <div className="absolute top-3 right-3">
          <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg">
            {rec.gptCategory}
          </Badge>
        </div>
      </div>
      
      <div className="p-6 space-y-4">
        <div>
          <h3 className="mb-2 text-gray-900">{rec.title}</h3>
          <div className="flex items-center gap-2 mb-3">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span className="text-sm text-gray-700">
              {rec.rating.toFixed(1)} ({rec.reviewCount.toLocaleString()} 리뷰)
            </span>
          </div>
        </div>

        {/* GPT 추천 이유 */}
        <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-4 rounded-xl border border-cyan-200">
          <div className="flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-cyan-600 mt-1 flex-shrink-0" />
            <p className="text-sm text-gray-700 leading-relaxed">{rec.gptReason}</p>
          </div>
        </div>

        {/* 키워드 */}
        <div className="flex flex-wrap gap-2">
          {rec.gptKeywords.map((keyword, idx) => (
            <Badge key={idx} variant="outline" className="text-xs">
              {keyword}
            </Badge>
          ))}
        </div>

        {/* 주소 */}
        <div className="flex items-start gap-2 text-sm text-gray-600 pt-2 border-t">
          <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span className="line-clamp-2">{rec.address || rec.addr1}</span>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-pink-50 to-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-lg border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button
            onClick={onBack}
            variant="ghost"
            size="icon"
            className="rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-gray-900">AI 맞춤 추천</h1>
              <p className="text-sm text-gray-600">{location} 여행</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* 설문 결과 정보 */}
        {surveyResult && (
          <Card className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="mb-2 text-gray-900">{surveyResult.travelType}</h3>
                <p className="text-sm text-gray-600 mb-3">{surveyResult.personality}</p>
                <div className="flex flex-wrap gap-2">
                  {surveyResult.preferences.activities.slice(0, 4).map((activity, idx) => (
                    <Badge key={idx} className="bg-purple-100 text-purple-700 border-purple-200">
                      {activity}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* 날씨 정보 */}
        {weather && (
          <Card className="p-6 bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
            <div className="flex items-center gap-3">
              <div className="text-4xl">
                {weather.icon === "01d" || weather.icon === "01n" ? "☀️" :
                 weather.icon === "02d" || weather.icon === "02n" ? "⛅" :
                 weather.icon === "03d" || weather.icon === "03n" ? "☁️" :
                 weather.icon === "04d" || weather.icon === "04n" ? "☁️" :
                 weather.icon.startsWith("09") ? "🌧️" :
                 weather.icon.startsWith("10") ? "🌦️" :
                 weather.icon.startsWith("11") ? "⛈️" :
                 weather.icon.startsWith("13") ? "❄️" : "🌫️"}
              </div>
              <div>
                <p className="text-gray-700">현재 {location} 날씨</p>
                <p className="text-sm text-gray-600">
                  {weather.description} · {weather.temperature}°C
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* 성향 입력 섹션 */}
        <Card className="p-8 space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-gray-900 mb-2">여행 성향을 알려주세요</h2>
            <p className="text-sm text-gray-600">
              AI가 당신에게 딱 맞는 여행지를 추천해드립니다
            </p>
          </div>

          {/* 여행 스타일 */}
          <div>
            <label className="block mb-3 text-gray-700">여행 스타일</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {travelStyles.map((style) => (
                <Button
                  key={style.value}
                  onClick={() => setTravelStyle(style.value)}
                  variant={travelStyle === style.value ? "default" : "outline"}
                  className={`h-auto py-4 ${
                    travelStyle === style.value
                      ? "bg-gradient-to-r from-purple-500 to-pink-500"
                      : ""
                  }`}
                >
                  <span className="text-2xl mr-2">{style.emoji}</span>
                  {style.value}
                </Button>
              ))}
            </div>
          </div>

          {/* 동행자 */}
          <div>
            <label className="block mb-3 text-gray-700">누구와 함께?</label>
            <Select value={companion} onValueChange={setCompanion}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {companions.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 예산 */}
          <div>
            <label className="block mb-3 text-gray-700">예산</label>
            <Select value={budget} onValueChange={setBudget}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {budgets.map((b) => (
                  <SelectItem key={b.value} value={b.value}>
                    {b.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 선호 활동 */}
          <div>
            <label className="block mb-3 text-gray-700">
              선호하는 활동 (복수 선택 가능)
            </label>
            <div className="flex flex-wrap gap-2">
              {activities.map((activity) => (
                <Button
                  key={activity}
                  onClick={() => toggleActivity(activity)}
                  variant={selectedActivities.includes(activity) ? "default" : "outline"}
                  size="sm"
                  className={`rounded-full ${
                    selectedActivities.includes(activity)
                      ? "bg-gradient-to-r from-cyan-500 to-blue-500"
                      : ""
                  }`}
                >
                  {activity}
                </Button>
              ))}
            </div>
          </div>

          {/* 추천 받기 버튼 */}
          <Button
            onClick={getRecommendations}
            disabled={loading}
            className="w-full py-6 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                AI가 추천을 생성하는 중...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                AI 추천 받기
              </>
            )}
          </Button>
        </Card>

        {/* 추천 결과 */}
        {hasSearched && !loading && (
          <>
            {summary && (
              <Card className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-6 h-6 text-purple-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="mb-2 text-gray-900">AI의 추천</h3>
                    <p className="text-gray-700 leading-relaxed">{summary}</p>
                  </div>
                </div>
              </Card>
            )}

            {recommendations.length > 0 ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <h2 className="text-gray-900">맞춤 추천 장소</h2>
                    <Badge className="bg-gradient-to-r from-purple-500 to-pink-500">
                      {recommendations.length}곳
                    </Badge>
                  </div>
                  {onCreateRoute && recommendations.length >= 2 && (
                    <Button
                      onClick={() => {
                        const places = recommendations.map(rec => ({
                          id: rec.contentid,
                          name: rec.title,
                          category: rec.gptCategory || rec.category || "관광지",
                          reviewCount: rec.reviewCount || 0,
                          rating: rec.rating || 4.0,
                          description: rec.gptReason || rec.description || "",
                          address: rec.address || rec.addr1 || "",
                          lat: rec.lat || parseFloat(rec.mapy) || 37.5665,
                          lng: rec.lng || parseFloat(rec.mapx) || 126.9780,
                          imageUrl: rec.imageUrl || rec.googlePhoto,
                          isIndoor: rec.isIndoor || false,
                          isOutdoor: !rec.isIndoor || true,
                          keywords: rec.gptKeywords || [],
                          locked: false
                        }));
                        console.log("[GPTRecommendations] Creating route with places:", places);
                        console.log("[GPTRecommendations] Places with imageUrl:", places.filter(p => p.imageUrl).length);
                        onCreateRoute(places);
                      }}
                      className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                    >
                      <Navigation className="w-4 h-4 mr-2" />
                      경로 만들기
                    </Button>
                  )}
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recommendations.map((rec) => (
                    <RecommendationCard key={rec.contentid} rec={rec} />
                  ))}
                </div>
              </div>
            ) : (
              <Card className="p-12 text-center">
                <p className="text-gray-500">
                  추천 결과가 없습니다. 다른 조건으로 다시 시도해보세요.
                </p>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
}