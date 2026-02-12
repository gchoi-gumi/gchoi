import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { MapPin, List, ArrowLeft } from "lucide-react";
import { AttractionsList } from "./AttractionsList";
import { loadKakaoMaps } from "../utils/kakao-loader";
import { motion } from "motion/react";

interface MapPageProps {
  location: string;
  accessToken?: string;
  onBack: () => void;
}

// Kakao Map types
declare global {
  interface Window {
    kakao: any;
  }
}

export function MapPage({ location, accessToken, onBack }: MapPageProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [showAttractions, setShowAttractions] = useState(true);

  useEffect(() => {
    const initializeMap = async () => {
      try {
        // Load Kakao Maps SDK
        await loadKakaoMaps();
        
        // Initialize map
        initMap();
      } catch (error) {
        // Silently fail - will show place list instead
      }
    };

    initializeMap();
  }, [location]);

  const initMap = () => {
    if (!mapRef.current || !window.kakao) return;

    const container = mapRef.current;
    const options = {
      center: new window.kakao.maps.LatLng(37.5665, 126.9780), // Default: Seoul
      level: 5
    };

    const map = new window.kakao.maps.Map(container, options);

    // Search for location
    const geocoder = new window.kakao.maps.services.Geocoder();
    geocoder.addressSearch(location, (result: any, status: any) => {
      if (status === window.kakao.maps.services.Status.OK) {
        const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);
        
        // Add marker
        const marker = new window.kakao.maps.Marker({
          position: coords,
          map: map
        });

        // Move map to location
        map.setCenter(coords);

        // Add info window
        const infowindow = new window.kakao.maps.InfoWindow({
          content: `<div style="padding:5px;font-size:12px;">${location}</div>`
        });
        infowindow.open(map, marker);
      }
    });
  };

  return (
    <div className="w-full min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 py-12 mb-8">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex items-center gap-4 mb-4">
            <motion.button 
              onClick={onBack} 
              whileTap={{ scale: 0.9 }}
              className="p-2.5 hover:bg-white/20 rounded-xl transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-white" />
            </motion.button>
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-white/20 rounded-xl">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-white">{location} 지도</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 pb-12">
        {/* Map Container */}
        <div 
          ref={mapRef} 
          className="w-full h-[500px] rounded-2xl overflow-hidden shadow-2xl mb-8"
          style={{ backgroundColor: "#f0f0f0" }}
        >
          {/* Fallback for map loading */}
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <div className="text-center">
              <MapPin className="w-16 h-16 mx-auto mb-4" />
              <p>지도를 불러오는 중...</p>
              <p className="text-sm mt-2">
                카카오맵 API 키가 필요합니다
              </p>
            </div>
          </div>
        </div>

        {/* Attractions Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Button
            onClick={() => setShowAttractions(!showAttractions)}
            className="w-full md:w-auto mb-6 py-6 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-800 hover:from-indigo-500 hover:to-indigo-700"
          >
            <List className="w-5 h-5 mr-2" />
            {showAttractions ? "목록 숨기기" : "주변 관광지 보기"}
          </Button>

          {showAttractions && (
            <AttractionsList 
              location={location} 
              accessToken={accessToken}
            />
          )}

          <div className="mt-6 p-6 bg-indigo-50 rounded-2xl border-2 border-indigo-100">
            <p className="text-sm text-indigo-900 leading-relaxed">
              💡 <strong>지도 기능 안내:</strong> 카카오맵 API 키를 설정하면 실제 지도가 표시되며, 
              마커 클릭 시 상세 정보와 경로 안내를 제공합니다.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
