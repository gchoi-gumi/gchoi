import { useState } from "react";
import { Search, MapPin, TrendingUp, ArrowLeft, Compass, Navigation, Loader2, Info, X, Sparkles, Coffee, Building2, Trees, Mountain, Utensils, ShoppingBag, Camera } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { motion, AnimatePresence } from "motion/react";
import { WeatherWidget } from "./WeatherWidget";
import { getCurrentLocationRegion, LocationPermissionError } from "../utils/geolocation";
import { projectId, publicAnonKey } from "../utils/supabase/info";
import { getLocationPermissionInstructions, isMobileBrowser } from "../utils/browser-detector";
import { toast } from "sonner@2.0.3";

interface SearchPageProps {
  onSearch: (location: string) => void;
  onBack: () => void;
  onExploreAttractions?: () => void;
  onPopularHidden?: () => void;
  onPlacesResults?: (location: string) => void;
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

const popularDestinations = [
  { name: "서울", region: "수도권", emoji: "🏙️", color: "from-blue-500 to-indigo-500" },
  { name: "부산", region: "경상남도", emoji: "🌊", color: "from-cyan-500 to-blue-500" },
  { name: "제주", region: "제주특별자치도", emoji: "🌴", color: "from-emerald-500 to-teal-500" },
  { name: "강릉", region: "강원도", emoji: "⛰️", color: "from-slate-500 to-gray-500" },
  { name: "전주", region: "전라북도", emoji: "🏯", color: "from-amber-500 to-orange-500" },
  { name: "경주", region: "경상북도", emoji: "🏛️", color: "from-purple-500 to-pink-500" },
  { name: "여수", region: "전라남도", emoji: "🌅", color: "from-rose-500 to-red-500" },
  { name: "대구", region: "경상북도", emoji: "🌆", color: "from-violet-500 to-purple-500" }
];

const regions = [
  "서울", "부산", "대구", "인천", "광주", "대전", "울산", "세종",
  "경기", "강원", "충북", "충남", "전북", "전남", "경북", "경남", "제주"
];

export function SearchPage(props: SearchPageProps) {
  const { onSearch, onBack, onExploreAttractions, onPopularHidden, onPlacesResults } = props;
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredRegions, setFilteredRegions] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState("서울");
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [showLocationHelp, setShowLocationHelp] = useState(false);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    
    if (value.trim()) {
      const filtered = regions.filter(region => 
        region.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredRegions(filtered);
    } else {
      setFilteredRegions([]);
    }
  };

  const handleSelectLocation = (location: string) => {
    setSelectedCity(location);
    // PlacesResultsPage로 바로 이동하도록 변경
    if (props.onPlacesResults) {
      props.onPlacesResults(location);
    } else {
      onSearch(location);
    }
  };

  const handleDestinationClick = (destination: string) => {
    setSelectedCity(destination);
    // PlacesResultsPage로 바로 이동하도록 변경
    if (props.onPlacesResults) {
      props.onPlacesResults(destination);
    } else {
      onSearch(destination);
    }
  };

  const handleCurrentLocation = async () => {
    setLoadingLocation(true);
    
    let isDevelopment = false;
    try {
      isDevelopment = import.meta?.env?.VITE_USE_DEFAULT_LOCATION === 'true';
    } catch (e) {
      isDevelopment = false;
    }
    const isFigmaPreview = window.location.hostname.includes('figma') || 
                           window.location.hostname.includes('preview');
    
    try {
      if (isDevelopment || isFigmaPreview) {
        toast.info('개발 모드: 기본 위치(서울)를 사용합니다', {
          duration: 3000,
        });
      } else {
        toast.info('현재 위치를 확인하고 있습니다...', {
          duration: 2000,
        });
      }
      
      const locationData = await getCurrentLocationRegion(projectId, publicAnonKey);
      
      const region = locationData.region;
      
      if (isDevelopment || isFigmaPreview) {
        toast.success('개발 모드: 서울 지역으로 설정되었습니다');
      } else {
        toast.success(`현재 위치: ${locationData.fullAddress}`);
      }
      
      setSelectedCity(region);
      onSearch(region);
      
    } catch (error) {
      if (error instanceof LocationPermissionError) {
        if (error.code === 'PERMISSION_DENIED') {
          setShowLocationHelp(true);
          toast.error('위치 권한이 필요합니다', {
            description: '아래 도움말을 확인하세요',
            duration: 4000,
          });
        } else if (error.code === 'TIMEOUT') {
          toast.error('위치 확인 시간 초과', {
            description: '다시 시도하거나 수동으로 지역을 선택하세요',
            duration: 4000,
          });
        } else if (error.code === 'POSITION_UNAVAILABLE') {
          toast.error('위치 정보를 사용할 수 없습니다', {
            description: 'GPS를 켜거나 수동으로 지역을 선택하세요',
            duration: 4000,
          });
        } else if (error.code === 'NOT_SUPPORTED') {
          toast.error('브라우저가 위치 기능을 지원하지 않습니다', {
            description: '수동으로 지역을 선택하세요',
            duration: 4000,
          });
        }
      } else if (error instanceof Error) {
        console.warn('Location error:', error.message);
        toast.error('위치 확인 실패', {
          description: '수동으로 지역을 선택하세요',
          duration: 4000,
        });
      } else {
        toast.error('위치 정보를 가져오는데 실패했습니다.', {
          description: '수동으로 지역을 선택하세요',
          duration: 4000,
        });
      }
    } finally {
      setLoadingLocation(false);
    }
  };



  const renderLocationHelp = () => {
    if (!showLocationHelp) return null;
    
    const browserInfo = getLocationPermissionInstructions();
    const isMobile = isMobileBrowser();
    
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="mb-8 glass bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-6 relative shadow-lg"
      >
        <button
          onClick={() => setShowLocationHelp(false)}
          className="absolute top-4 right-4 p-2 hover:bg-blue-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-blue-600" />
        </button>

        <div className="flex items-start gap-4">
          <div className="p-3 bg-blue-500 rounded-2xl">
            <Info className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 pr-8">
            <h3 className="text-blue-900 mb-4 text-lg font-semibold">위치 권한 설정 방법</h3>
            
            <div className="mb-4">
              <p className="text-sm text-blue-800 mb-3">
                {browserInfo.emoji} <strong>{browserInfo.browser}{isMobile ? ' (모바일)' : ''}</strong>
              </p>
              <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800 ml-2">
                {browserInfo.steps.map((step, index) => (
                  <li key={index} className="leading-relaxed">{step}</li>
                ))}
              </ol>
            </div>

            <div className="p-4 bg-white rounded-xl border border-blue-200">
              <p className="text-sm text-blue-900 mb-2">
                💡 <strong>권한 허용이 어려우신가요?</strong>
              </p>
              <p className="text-sm text-blue-700">
                아래의 "인기 여행지" 또는 "지역별 탐색"에서 직접 선택하실 수 있습니다!
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-indigo-50 via-white to-purple-50">
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-cyan-600 to-teal-600 py-20">
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-6 relative">
          <motion.button 
            onClick={onBack} 
            whileTap={{ scale: 0.9 }}
            className="mb-6 p-3 glass-dark hover:bg-white/20 rounded-2xl transition-all"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </motion.button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="mb-6 glass-dark text-white border-white/30 px-6 py-3 backdrop-blur-xl">
              <Compass className="w-5 h-5 mr-2" />
              여행지 검색
            </Badge>
            <h1 className="text-white mb-6 drop-shadow-2xl text-5xl md:text-6xl">
              어디로 떠나시나요?
            </h1>
            <p className="text-white/90 text-xl mb-10 max-w-2xl">
              원하는 지역을 검색하고 AI가 추천하는 맞춤 여행을 시작하세요
            </p>
            
            <div className="relative max-w-3xl">
              <div className="absolute left-6 top-1/2 transform -translate-y-1/2 z-10">
                <Search className="w-6 h-6 text-gray-400" />
              </div>
              <Input
                type="text"
                placeholder="지역명을 입력하세요 (예: 서울, 부산, 제주)"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-16 pr-6 h-16 rounded-2xl border-0 bg-white shadow-2xl text-lg focus:ring-4 focus:ring-white/30"
              />
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        <AnimatePresence>
          {renderLocationHelp()}
        </AnimatePresence>

        {/* Current Weather */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-gray-800 text-xl">실시간 날씨</h3>
            <Badge variant="outline" className="ml-auto">{selectedCity}</Badge>
          </div>
          <WeatherWidget city={selectedCity} />
        </motion.div>

        {/* Current Location Button */}
        <motion.div 
          whileTap={{ scale: 0.98 }}
          className="mb-12"
        >
          <Button
            onClick={handleCurrentLocation}
            disabled={loadingLocation}
            className="w-full py-8 rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 hover:from-blue-500 hover:via-cyan-500 hover:to-teal-500 text-white shadow-2xl hover:shadow-3xl transition-all text-lg group"
          >
            {loadingLocation ? (
              <>
                <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                위치 확인 중...
              </>
            ) : (
              <>
                <div className="p-2.5 bg-white/20 rounded-xl mr-3">
                  <Navigation className="w-6 h-6" />
                </div>
                <span className="text-xl">현재 위치에서 찾기</span>
                <ArrowLeft className="w-5 h-5 ml-3 rotate-180 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </Button>
        </motion.div>

        {/* Search Results */}
        {filteredRegions.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16"
          >
            <h3 className="mb-6 text-gray-800 text-xl font-semibold flex items-center gap-2">
              <Search className="w-5 h-5" />
              검색 결과
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredRegions.map((region, index) => (
                <motion.button
                  key={region}
                  onClick={() => handleSelectLocation(region)}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  className="p-6 bg-white border-2 border-blue-100 rounded-2xl hover:border-blue-400 hover:shadow-xl transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl">
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-gray-800 text-lg font-medium">{region}</span>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Popular Destinations */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2.5 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-gray-800 text-2xl font-semibold">인기 여행지</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {popularDestinations.map((destination, index) => (
              <motion.button
                key={destination.name}
                onClick={() => handleDestinationClick(destination.name)}
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.05, y: -5 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="relative group"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${destination.color} rounded-3xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity`}></div>
                <div className="relative p-8 bg-white border-2 border-gray-100 rounded-3xl hover:border-transparent hover:shadow-2xl transition-all min-h-[200px] flex flex-col items-center justify-center">
                  <motion.div
                    whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                    transition={{ duration: 0.5 }}
                    className="text-6xl mb-4"
                  >
                    {destination.emoji}
                  </motion.div>
                  <div className="text-xl font-semibold text-gray-900 mb-2">{destination.name}</div>
                  <Badge className={`bg-gradient-to-r ${destination.color} text-white border-0`}>
                    {destination.region}
                  </Badge>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Regions Grid */}
        <div className="mb-16">
          <h3 className="mb-6 text-gray-800 text-xl font-semibold">전국 17개 시도</h3>
          <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-9 gap-3">
            {regions.map((region, index) => (
              <motion.button
                key={region}
                onClick={() => {
                  setSelectedCity(region);
                  handleSelectLocation(region);
                }}
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.02 }}
                className="py-6 border-2 border-gray-200 rounded-2xl hover:border-blue-500 hover:bg-blue-50 hover:shadow-lg transition-all text-center font-medium text-gray-700 hover:text-blue-600"
              >
                {region}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          {onPopularHidden && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                onClick={onPopularHidden}
                className="w-full py-8 rounded-2xl bg-gradient-to-r from-rose-600 via-pink-600 to-red-600 hover:from-rose-500 hover:via-pink-500 hover:to-red-500 text-white shadow-2xl hover:shadow-3xl transition-all text-lg group"
              >
                <div className="p-2.5 bg-white/20 rounded-xl mr-3">
                  <Sparkles className="w-6 h-6" />
                </div>
                <span className="text-xl">인기 & 숨은 명소 AI 분석</span>
                <ArrowLeft className="w-5 h-5 ml-3 rotate-180 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
          )}

          {onExploreAttractions && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                onClick={onExploreAttractions}
                className="w-full py-8 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:via-teal-500 hover:to-cyan-500 text-white shadow-2xl hover:shadow-3xl transition-all text-lg group"
              >
                <div className="p-2.5 bg-white/20 rounded-xl mr-3">
                  <Compass className="w-6 h-6" />
                </div>
                <span className="text-xl">전국 관광지 둘러보기</span>
                <ArrowLeft className="w-5 h-5 ml-3 rotate-180 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
          )}
        </div>

        {/* Info Cards */}
        <div className="mt-12 grid md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-8 glass bg-gradient-to-br from-blue-50 to-cyan-50 rounded-3xl border-2 border-blue-100 shadow-lg"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl">
                <Info className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="text-gray-900 font-semibold mb-2 text-lg">AI 여행 추천</h4>
                <p className="text-sm text-gray-700 leading-relaxed">
                  지역을 선택하면 여행 성향 분석 설문이 시작됩니다.
                  AI가 당신에게 완벽한 여행 코스를 추천해드립니다.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-8 glass bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl border-2 border-amber-100 shadow-lg"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="text-gray-900 font-semibold mb-2 text-lg">위치 기반 추천</h4>
                <p className="text-sm text-gray-700 leading-relaxed">
                  현재 위치 버튼을 사용하면 주변 여행지를 자동으로 찾아드립니다.
                  위치 권한이 필요하며, 수동 선택도 가능합니다.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}