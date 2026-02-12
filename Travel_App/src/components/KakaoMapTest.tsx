import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { CheckCircle2, XCircle, Loader2, RefreshCw, Copy, ExternalLink } from "lucide-react";
import { loadKakaoMapScript } from "../utils/kakao-script-loader";
import { toast } from "sonner@2.0.3";

interface KakaoMapTestProps {
  onBack: () => void;
}

export function KakaoMapTest({ onBack }: KakaoMapTestProps) {
  const [loading, setLoading] = useState(true);
  const [sdkLoaded, setSdkLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mapInitialized, setMapInitialized] = useState(false);
  const [copied, setCopied] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);

  const currentDomain = window.location.origin;

  const copyDomain = () => {
    // Try modern clipboard API first
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(currentDomain)
        .then(() => {
          setCopied(true);
          toast.success('도메인이 복사되었습니다!');
          setTimeout(() => setCopied(false), 2000);
        })
        .catch(() => {
          // Fallback to legacy method
          fallbackCopyTextToClipboard(currentDomain);
        });
    } else {
      // Use fallback method
      fallbackCopyTextToClipboard(currentDomain);
    }
  };

  const fallbackCopyTextToClipboard = (text: string) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.width = "2em";
    textArea.style.height = "2em";
    textArea.style.padding = "0";
    textArea.style.border = "none";
    textArea.style.outline = "none";
    textArea.style.boxShadow = "none";
    textArea.style.background = "transparent";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      const successful = document.execCommand('copy');
      if (successful) {
        setCopied(true);
        toast.success('도메인이 복사되었습니다!');
        setTimeout(() => setCopied(false), 2000);
      } else {
        toast.error('복사 실패. 수동으로 복사해주세요.');
      }
    } catch (err) {
      console.error('Fallback: Oops, unable to copy', err);
      toast.error('복사 실패. 수동으로 복사해주세요.');
    }
    
    document.body.removeChild(textArea);
  };

  const initializeMap = async () => {
    setLoading(true);
    setError(null);
    setMapInitialized(false);
    setSdkLoaded(false);

    try {
      console.log("=== Kakao Map Test Started ===");
      console.log("Current URL:", window.location.href);
      console.log("Current domain:", currentDomain);
      
      // Load SDK
      await loadKakaoMapScript();
      
      console.log("SDK loaded successfully!");
      console.log("window.kakao:", window.kakao);
      console.log("window.kakao.maps:", window.kakao?.maps);
      
      setSdkLoaded(true);

      // Wait a bit for DOM
      await new Promise(resolve => setTimeout(resolve, 100));

      // Initialize map
      if (!mapRef.current) {
        throw new Error("Map container not found");
      }

      if (!window.kakao || !window.kakao.maps) {
        throw new Error("Kakao SDK not available after loading");
      }

      const container = mapRef.current;
      const options = {
        center: new window.kakao.maps.LatLng(37.5665, 126.9780),
        level: 3
      };

      console.log("Creating map with options:", options);
      const map = new window.kakao.maps.Map(container, options);
      
      // Add marker
      const markerPosition = new window.kakao.maps.LatLng(37.5665, 126.9780);
      const marker = new window.kakao.maps.Marker({
        position: markerPosition
      });
      marker.setMap(map);

      console.log("Map initialized successfully!");
      setMapInitialized(true);
      toast.success("🎉 지도가 성공적으로 로드되었습니다!");
    } catch (err: any) {
      console.error("Failed to initialize map:", err);
      setError(err.message || "Unknown error");
      
      // Show helpful error message
      if (err.message && err.message.includes('not loading')) {
        toast.error("도메인이 등록되지 않았습니다. 아래 가이드를 참고하세요.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initializeMap();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 p-4 pb-20">
      <div className="max-w-4xl mx-auto">
        <Button
          onClick={onBack}
          variant="ghost"
          className="mb-4"
        >
          ← 뒤로
        </Button>

        <Card className="p-6 mb-6 backdrop-blur-sm bg-white/80">
          <h1 className="text-2xl mb-4">🗺️ Kakao Map 테스트</h1>
          
          {/* Status */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3">
              <span className="w-32">SDK 로드:</span>
              {loading && !sdkLoaded && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  로딩 중...
                </Badge>
              )}
              {sdkLoaded && (
                <Badge className="bg-green-500 text-white flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  성공
                </Badge>
              )}
              {!loading && !sdkLoaded && (
                <Badge variant="destructive" className="flex items-center gap-1">
                  <XCircle className="w-3 h-3" />
                  실패
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-3">
              <span className="w-32">지도 초기화:</span>
              {loading && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  대기 중...
                </Badge>
              )}
              {mapInitialized && (
                <Badge className="bg-green-500 text-white flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  성공
                </Badge>
              )}
              {!loading && !mapInitialized && error && (
                <Badge variant="destructive" className="flex items-center gap-1">
                  <XCircle className="w-3 h-3" />
                  실패
                </Badge>
              )}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-800 mb-2">❌ 에러 발생:</p>
              <code className="text-sm text-red-600 block bg-red-100 p-2 rounded">
                {error}
              </code>
            </div>
          )}

          {/* Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800 mb-2">📍 현재 설정:</p>
            <div className="space-y-1 text-xs text-blue-700">
              <div><strong>도메인:</strong> {currentDomain} <Button onClick={copyDomain} className="ml-2" size="icon" variant="outline">{copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}</Button></div>
              <div><strong>JavaScript 키:</strong> 94e86b9b6ddf71039ab09c9902d2d79f</div>
            </div>
          </div>

          {/* Retry Button */}
          <Button
            onClick={initializeMap}
            disabled={loading}
            className="w-full mb-6"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            다시 시도
          </Button>

          {/* Map Container */}
          <div className="border-2 border-gray-300 rounded-lg overflow-hidden">
            <div
              ref={mapRef}
              className="w-full h-[400px] bg-gray-100"
            />
          </div>

          {mapInitialized && (
            <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800">
                ✅ 지도가 정상적으로 표시되고 있습니다!
              </p>
            </div>
          )}
        </Card>

        {/* Instructions */}
        <Card className="p-6 backdrop-blur-sm bg-white/80">
          <h2 className="text-lg mb-3">💡 문제 해결 가이드</h2>
          <div className="space-y-2 text-sm text-gray-700">
            <p>1. <strong>SDK 로드 실패</strong> 시:</p>
            <ul className="ml-4 space-y-1 text-xs">
              <li>• Kakao Developers에서 도메인 등록 확인</li>
              <li>• JavaScript 키 확인</li>
              <li>• 브라우저 콘솔에서 상세 로그 확인</li>
            </ul>
            
            <p className="mt-3">2. <strong>도메인 등록 방법</strong>:</p>
            <ul className="ml-4 space-y-1 text-xs">
              <li>• https://developers.kakao.com/ 접속</li>
              <li>• "내 애플리케이션" → 앱 선택</li>
              <li>• "플랫폼" → "Web 플랫폼 등록"</li>
              <li>• 위의 도메인 입력 후 저장</li>
            </ul>

            <p className="mt-3">3. <strong>등록 후에도 실패</strong> 시:</p>
            <ul className="ml-4 space-y-1 text-xs">
              <li>• 도메인 반영까지 최대 5분 소요</li>
              <li>• 페이지 새로고침 후 재시도</li>
              <li>• 브라우저 캐시 삭제 후 재시도</li>
            </ul>
          </div>
        </Card>
      </div>
    </div>
  );
}