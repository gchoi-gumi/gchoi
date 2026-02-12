import { useState, useEffect } from "react";
import { Users } from "lucide-react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { HomePage } from "./HomePage";
import { SearchPage } from "./SearchPage";
import { RecommendationPage } from "./RecommendationPage";
import { RoutesPage } from "./RoutesPage";
import { SmartRoutePage } from "./SmartRoutePage";
import { MapPage } from "./MapPage";
import { RouteMapPage } from "./RouteMapPage";
import { AuthPage } from "./AuthPage";
import { ProfilePage } from "./ProfilePage";
import { ItineraryPage } from "./ItineraryPage";
import { BookmarkPage } from "./BookmarkPage";
import { AttractionsExplore } from "./AttractionsExplore";
import { AttractionDetail } from "./AttractionDetail";
import { PopularHiddenPlacesPage } from "./PopularHiddenPlacesPage";
import { WeatherTestPage } from "./WeatherTestPage";
import { KakaoDebugPage } from "./KakaoDebugPage";
import { KakaoRestApiTest } from "./KakaoRestApiTest";
import { KakaoMapTest } from "./KakaoMapTest";
import { GPTRecommendations } from "./GPTRecommendations";
import { DecisionTreeSurvey } from "./DecisionTreeSurvey";
import { SurveyResultPage } from "./SurveyResultPage";
import { IntegratedTravelPlanner } from "./IntegratedTravelPlanner";
import { ReviewsPage } from "./ReviewsPage";
import { PlacesResultsPage } from "./PlacesResultsPage";
import DeploymentCheckPage from "./DeploymentCheckPage";
import { Toaster } from "./ui/sonner";
import { useAuth } from "../utils/auth-context";
import { motion } from "motion/react";
import { loadKakaoMapScript } from "../utils/kakao-script-loader";

type Page = "home" | "search" | "survey" | "recommendation" | "routes" | "smartroute" | "routemap" | "map" | "community" | "menu" | "auth" | "profile" | "itineraries" | "bookmarks" | "reviews" | "attractions" | "attraction-detail" | "popular-hidden" | "weather-test" | "kakao-debug" | "kakao-rest-test" | "kakao-map-test" | "gpt-recommend" | "decision-tree-survey" | "survey-result" | "integrated-planner" | "deployment-check" | "places-results";

export function AppContent() {
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [selectedLocation, setSelectedLocation] = useState("서울"); // 기본값 설정
  const [travelStyle, setTravelStyle] = useState("");
  const [surveyAnswers, setSurveyAnswers] = useState<number[]>([]);
  const [currentWeather, setCurrentWeather] = useState<any>(null);
  const [confirmedPlaces, setConfirmedPlaces] = useState<any[]>([]);
  const [confirmedRouteInfo, setConfirmedRouteInfo] = useState<any>(null);
  const [confirmedTransportMode, setConfirmedTransportMode] = useState("");
  const [selectedAttractionId, setSelectedAttractionId] = useState("");
  const [surveyResult, setSurveyResult] = useState<any>(null);
  const [gptRecommendations, setGptRecommendations] = useState<any[]>([]);
  
  // Scroll to top whenever page changes
  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [currentPage]);
  
  console.log('[AppContent] Rendering, about to call useAuth...');
  
  // Use auth context
  const { user, accessToken, signOut, isLoading } = useAuth();
  
  console.log('[AppContent] useAuth successful, user:', user?.email || 'not logged in', 'isLoading:', isLoading);
  const isAuthenticated = !!user;
  const userId = user?.id || "";
  const userEmail = user?.email || "";

  // Check for existing session on mount - MUST BE BEFORE ANY CONDITIONAL RETURNS
  useEffect(() => {
    // Check URL hash for direct navigation
    if (window.location.hash === '#kakao-debug') {
      setCurrentPage('kakao-debug');
    } else if (window.location.hash === '#deployment-check') {
      setCurrentPage('deployment-check');
    }
    
    // Load Kakao Maps SDK dynamically (silently fails if domain not registered)
    loadKakaoMapScript().catch(() => {
      // Silently fail - app will use REST API fallback automatically
    });
    
    // Add PWA meta tags
    try {
      // Manifest link
      if (!document.querySelector('link[rel="manifest"]')) {
        const link = document.createElement('link');
        link.rel = 'manifest';
        link.href = '/manifest.json';
        document.head.appendChild(link);
      }
      
      // Theme color meta tag - matching icon theme
      if (!document.querySelector('meta[name="theme-color"]')) {
        const themeColor = document.createElement('meta');
        themeColor.name = 'theme-color';
        themeColor.content = '#6366F1';
        document.head.appendChild(themeColor);
      }
      
      // Apple touch icon
      if (!document.querySelector('link[rel="apple-touch-icon"]')) {
        const appleIcon = document.createElement('link');
        appleIcon.rel = 'apple-touch-icon';
        appleIcon.href = '/icon-192.png';
        document.head.appendChild(appleIcon);
      }
    } catch (error) {
      console.log('PWA meta tags setup skipped in preview');
    }
  }, []);

  const handleAuthSuccess = (token: string, uid: string) => {
    // Auth context handles the state, just navigate
    setCurrentPage("home");
  };

  const handleLogout = async () => {
    await signOut();
    setCurrentPage("home");
  };

  const handleSearch = (location: string) => {
    setSelectedLocation(location);
    // If travel style is already determined, go to recommendation
    // Otherwise, need to do survey first
    if (travelStyle) {
      setCurrentPage("recommendation");
    } else {
      // If no travel style yet, go to survey first
      setCurrentPage("survey");
    }
  };

  const handleSurveyComplete = (style: string, answers: number[]) => {
    setTravelStyle(style);
    setSurveyAnswers(answers);
    // After survey, go to search page to select location
    setCurrentPage("search");
  };

  const handleNavigate = (page: string) => {
    console.log("Navigating to:", page);
    // If navigating to menu and authenticated, go to profile instead
    if (page === "menu" && isAuthenticated) {
      setCurrentPage("profile");
    } else if (page === "menu" && !isAuthenticated) {
      setCurrentPage("auth");
    } else {
      setCurrentPage(page as Page);
    }
  };

  // Debug: Log current page
  console.log("Current page:", currentPage);
  console.log("Is authenticated:", isAuthenticated);

  // Show loading state while auth is initializing - AFTER ALL HOOKS
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  // Render current page
  if (currentPage === "auth") {
    return (
      <>
        <div className="min-h-screen bg-white">
          <Header 
            isAuthenticated={isAuthenticated}
            userEmail={userEmail}
            onNavigate={handleNavigate}
            currentPage={currentPage}
          />
          <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-4xl py-12">
            <AuthPage
              onAuthSuccess={handleAuthSuccess}
              onBack={() => setCurrentPage("home")}
            />
          </div>
          <Footer />
        </div>
        <Toaster />
      </>
    );
  }

  if (currentPage === "profile") {
    return (
      <>
        <div className="min-h-screen bg-white">
          <Header 
            isAuthenticated={isAuthenticated}
            userEmail={userEmail}
            onNavigate={handleNavigate}
            currentPage={currentPage}
          />
          <div className="container mx-auto px-4 md:px-6 lg:px-8 py-12">
            <ProfilePage
              userId={userId}
              userEmail={userEmail}
              onBack={() => setCurrentPage("home")}
              onNavigateToItineraries={() => setCurrentPage("itineraries")}
              onNavigateToBookmarks={() => setCurrentPage("bookmarks")}
              onLogout={handleLogout}
            />
          </div>
          <Footer />
        </div>
        <Toaster />
      </>
    );
  }

  if (currentPage === "itineraries") {
    return (
      <>
        <div className="min-h-screen bg-white">
          <Header 
            isAuthenticated={isAuthenticated}
            userEmail={userEmail}
            onNavigate={handleNavigate}
            currentPage={currentPage}
          />
          <div className="container mx-auto px-4 md:px-6 lg:px-8 py-12">
            <ItineraryPage
              userId={userId}
              accessToken={accessToken || ""}
              onBack={() => setCurrentPage("profile")}
            />
          </div>
          <Footer />
        </div>
        <Toaster />
      </>
    );
  }

  if (currentPage === "bookmarks") {
    return (
      <>
        <div className="min-h-screen bg-white">
          <Header 
            isAuthenticated={isAuthenticated}
            userEmail={userEmail}
            onNavigate={handleNavigate}
            currentPage={currentPage}
          />
          <div className="container mx-auto px-4 md:px-6 lg:px-8 py-12">
            <BookmarkPage
              userId={userId}
              accessToken={accessToken || ""}
              onBack={() => setCurrentPage("profile")}
            />
          </div>
          <Footer />
        </div>
        <Toaster />
      </>
    );
  }

  if (currentPage === "search") {
    return (
      <>
        <div className="min-h-screen bg-white">
          <Header 
            isAuthenticated={isAuthenticated}
            userEmail={userEmail}
            onNavigate={handleNavigate}
            currentPage={currentPage}
          />
          <div className="container mx-auto px-4 md:px-6 lg:px-8 py-12">
            <SearchPage 
              onSearch={(location) => {
                setSelectedLocation(location);
                setCurrentPage("places-results");
              }}
              onPlacesResults={(location) => {
                setSelectedLocation(location);
                setCurrentPage("places-results");
              }}
              onBack={() => setCurrentPage("home")}
              onExploreAttractions={() => setCurrentPage("attractions")}
              onPopularHidden={() => setCurrentPage("popular-hidden")}
            />
          </div>
          <Footer />
        </div>
        <Toaster />
      </>
    );
  }

  if (currentPage === "survey") {
    return (
      <>
        <DecisionTreeSurvey
          onBack={() => setCurrentPage("home")}
          location={selectedLocation}
          onComplete={(result) => {
            setSurveyResult(result);
            // 성향 분석 완료 후 통합 플래너로 이동
            setCurrentPage("integrated-planner");
          }}
        />
        <Toaster />
      </>
    );
  }

  if (currentPage === "recommendation") {
    // Redirect to search if no location selected
    if (!selectedLocation || selectedLocation.trim() === "") {
      setTimeout(() => setCurrentPage("search"), 0);
      return null;
    }

    return (
      <>
        <div className="min-h-screen bg-white">
          <Header 
            isAuthenticated={isAuthenticated}
            userEmail={userEmail}
            onNavigate={handleNavigate}
            currentPage={currentPage}
          />
          <div className="container mx-auto px-4 md:px-6 lg:px-8 py-12">
            <RecommendationPage
              travelStyle={travelStyle || "모험가"}
              location={selectedLocation}
              accessToken={accessToken || ""}
              onBack={() => setCurrentPage("search")}
              onShowMap={() => setCurrentPage("map")}
              onShowRoutes={() => setCurrentPage("routes")}
              onShowSmartRoute={(weather) => {
                setCurrentWeather(weather);
                setCurrentPage("smartroute");
              }}
              onSaveItinerary={isAuthenticated ? () => setCurrentPage("itineraries") : undefined}
              onRetakeSurvey={() => setCurrentPage("survey")}
            />
          </div>
          <Footer />
        </div>
        <Toaster />
      </>
    );
  }

  if (currentPage === "routes") {
    // Redirect to search if no location selected
    if (!selectedLocation || selectedLocation.trim() === "") {
      setTimeout(() => setCurrentPage("search"), 0);
      return null;
    }

    return (
      <>
        <div className="min-h-screen bg-white">
          <Header 
            isAuthenticated={isAuthenticated}
            userEmail={userEmail}
            onNavigate={handleNavigate}
            currentPage={currentPage}
          />
          <div className="container mx-auto px-4 md:px-6 lg:px-8 py-12">
            <RoutesPage
              travelStyle={travelStyle || "모험가"}
              location={selectedLocation}
              onBack={() => setCurrentPage("recommendation")}
            />
          </div>
          <Footer />
        </div>
        <Toaster />
      </>
    );
  }

  if (currentPage === "smartroute") {
    // Redirect to search if no location selected
    if (!selectedLocation || selectedLocation.trim() === "") {
      setTimeout(() => setCurrentPage("search"), 0);
      return null;
    }

    return (
      <>
        <SmartRoutePage
          travelStyle={travelStyle || "모험가"}
          location={selectedLocation}
          weather={currentWeather}
          onBack={() => setCurrentPage("recommendation")}
          onConfirmRoute={(places, routeInfo, transportMode) => {
            setConfirmedPlaces(places);
            setConfirmedRouteInfo(routeInfo);
            setConfirmedTransportMode(transportMode);
            setCurrentPage("routemap");
          }}
          preloadedPlaces={gptRecommendations.length > 0 ? gptRecommendations : undefined}
        />
        <Toaster />
      </>
    );
  }

  if (currentPage === "routemap") {
    // Redirect if no route info
    if (!confirmedRouteInfo || !confirmedPlaces || confirmedPlaces.length === 0) {
      setTimeout(() => setCurrentPage("home"), 0);
      return null;
    }

    return (
      <>
        <div className="min-h-screen bg-white">
          <Header 
            isAuthenticated={isAuthenticated}
            userEmail={userEmail}
            onNavigate={handleNavigate}
            currentPage={currentPage}
          />
          <div className="w-full" style={{ height: 'calc(100vh - 5rem)' }}>
            <RouteMapPage
              places={confirmedPlaces}
              routeInfo={confirmedRouteInfo}
              transportMode={confirmedTransportMode}
              onBack={() => setCurrentPage("smartroute")}
            />
          </div>
        </div>
        <Toaster />
      </>
    );
  }

  if (currentPage === "map") {
    // Redirect to search if no location selected
    if (!selectedLocation || selectedLocation.trim() === "") {
      setTimeout(() => setCurrentPage("search"), 0);
      return null;
    }

    return (
      <>
        <div className="min-h-screen bg-white">
          <Header 
            isAuthenticated={isAuthenticated}
            userEmail={userEmail}
            onNavigate={handleNavigate}
            currentPage={currentPage}
          />
          <div className="w-full" style={{ height: 'calc(100vh - 5rem)' }}>
            <MapPage
              location={selectedLocation}
              accessToken={accessToken || ""}
              onBack={() => setCurrentPage("recommendation")}
            />
          </div>
        </div>
        <Toaster />
      </>
    );
  }

  if (currentPage === "attractions") {
    return (
      <>
        <div className="min-h-screen bg-white">
          <Header 
            isAuthenticated={isAuthenticated}
            userEmail={userEmail}
            onNavigate={handleNavigate}
            currentPage={currentPage}
          />
          <div className="container mx-auto px-4 md:px-6 lg:px-8 py-12">
            <AttractionsExplore
              onBack={() => setCurrentPage("home")}
              onSelectAttraction={(attraction) => {
                setSelectedAttractionId(attraction.contentid);
                setCurrentPage("attraction-detail");
              }}
            />
          </div>
          <Footer />
        </div>
        <Toaster />
      </>
    );
  }

  if (currentPage === "attraction-detail") {
    return (
      <>
        <div className="min-h-screen bg-white">
          <Header 
            isAuthenticated={isAuthenticated}
            userEmail={userEmail}
            onNavigate={handleNavigate}
            currentPage={currentPage}
          />
          <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-6xl py-12">
            <AttractionDetail
              contentId={selectedAttractionId}
              onBack={() => setCurrentPage("attractions")}
            />
          </div>
          <Footer />
        </div>
        <Toaster />
      </>
    );
  }

  if (currentPage === "popular-hidden") {
    return (
      <>
        <div className="min-h-screen bg-white">
          <Header 
            isAuthenticated={isAuthenticated}
            userEmail={userEmail}
            onNavigate={handleNavigate}
            currentPage={currentPage}
          />
          <div className="container mx-auto px-4 md:px-6 lg:px-8 py-12">
            <PopularHiddenPlacesPage
              location={selectedLocation}
              onBack={() => setCurrentPage("home")}
            />
          </div>
          <Footer />
        </div>
        <Toaster />
      </>
    );
  }

  if (currentPage === "weather-test") {
    return (
      <>
        <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
          <Header 
            isAuthenticated={isAuthenticated}
            userEmail={userEmail}
            onNavigate={handleNavigate}
            currentPage={currentPage}
          />
          <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-4xl py-12">
            <WeatherTestPage />
          </div>
          <Footer />
        </div>
        <Toaster />
      </>
    );
  }

  if (currentPage === "kakao-debug") {
    return (
      <>
        <KakaoDebugPage />
        <Toaster />
      </>
    );
  }

  if (currentPage === "kakao-rest-test") {
    return (
      <>
        <div className="min-h-screen bg-white flex justify-center">
          <div className="w-full max-w-[412px] bg-white min-h-screen shadow-xl">
            <KakaoRestApiTest onBack={() => setCurrentPage("home")} />
          </div>
        </div>
        <Toaster />
      </>
    );
  }

  if (currentPage === "kakao-map-test") {
    return (
      <>
        <div className="min-h-screen bg-white flex justify-center">
          <div className="w-full max-w-[412px] bg-white min-h-screen shadow-xl">
            <KakaoMapTest onBack={() => setCurrentPage("home")} />
          </div>
        </div>
        <Toaster />
      </>
    );
  }

  if (currentPage === "gpt-recommend") {
    return (
      <>
        <GPTRecommendations
          onBack={() => setCurrentPage("home")}
          location={selectedLocation}
          weather={currentWeather}
          surveyResult={surveyResult}
          preloadedRecommendations={gptRecommendations.length > 0 ? gptRecommendations : undefined}
          onCreateRoute={(places) => {
            setConfirmedPlaces(places);
            // SmartRoutePage로 이동하여 경로 생성
            setCurrentPage("smartroute");
          }}
        />
        <Toaster />
      </>
    );
  }

  if (currentPage === "decision-tree-survey") {
    return (
      <>
        <DecisionTreeSurvey
          onBack={() => setCurrentPage("home")}
          location={selectedLocation}
          onLocationChange={(location) => setSelectedLocation(location)}
          onComplete={(result) => {
            setSurveyResult(result);
            // 통합 플래너로 이동하여 자동 처리
            setCurrentPage("integrated-planner");
          }}
        />
        <Toaster />
      </>
    );
  }

  if (currentPage === "integrated-planner") {
    return (
      <>
        <IntegratedTravelPlanner
          onBack={() => setCurrentPage("home")}
          location={selectedLocation}
          surveyResult={surveyResult}
          weather={currentWeather}
          onComplete={(result) => {
            // GPT 추천 결과를 저장하고 바로 경로 설정으로 이동
            if (result.recommendations && result.recommendations.length > 0) {
              // 백엔드 데이터를 SmartRoutePage 형식으로 변환
              const transformedPlaces = result.recommendations.map((rec: any) => ({
                id: rec.id || `place_${Date.now()}_${Math.random()}`,
                name: rec.name,
                category: rec.category || "관광지",
                reviewCount: rec.reviewCount || 0,
                rating: rec.rating || 4.0,
                description: rec.description || rec.gptReason || "",
                address: rec.address || "",
                lat: rec.lat || 37.5665,
                lng: rec.lng || 126.9780,
                imageUrl: rec.imageUrl || rec.googlePhoto, // Use imageUrl or googlePhoto
                isIndoor: rec.isIndoor || false,
                isOutdoor: rec.isOutdoor || true,
                keywords: rec.keywords || [],
                locked: false
              }));
              console.log("[AppContent] Transformed places for SmartRoute:", transformedPlaces);
              console.log("[AppContent] Places with imageUrl:", transformedPlaces.filter(p => p.imageUrl).length);
              setGptRecommendations(transformedPlaces);
            }
            // 경로 설정 페이지로 바로 이동
            setCurrentPage("smartroute");
          }}
        />
        <Toaster />
      </>
    );
  }

  if (currentPage === "survey-result") {
    return (
      <>
        <SurveyResultPage
          result={surveyResult}
          location={selectedLocation}
          onGetRecommendations={() => setCurrentPage("gpt-recommend")}
          onRetakeSurvey={() => setCurrentPage("decision-tree-survey")}
          onBack={() => setCurrentPage("home")}
        />
        <Toaster />
      </>
    );
  }

  if (currentPage === "deployment-check") {
    return (
      <>
        <DeploymentCheckPage />
        <Toaster />
      </>
    );
  }

  if (currentPage === "community") {
    return (
      <>
        <div className="min-h-screen bg-white">
          <Header 
            isAuthenticated={isAuthenticated}
            userEmail={userEmail}
            onNavigate={handleNavigate}
            currentPage={currentPage}
          />
          <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-6xl py-12">
            <div className="bg-white/80 backdrop-blur-xl min-h-[60vh] rounded-xl shadow-2xl flex flex-col">
              <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 px-6 py-8 mb-6 rounded-t-xl">
                <h1 className="text-2xl text-white font-semibold">커뮤니티</h1>
                <p className="text-gray-300 text-sm mt-2">여행 후기와 일정을 공유하세요</p>
              </div>
              <div className="px-6 flex-1 flex items-center justify-center">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center"
                >
                  <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-indigo-100 to-purple-200 rounded-3xl flex items-center justify-center">
                    <Users className="w-12 h-12 text-indigo-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">곧 만나요!</h3>
                  <p className="text-gray-600 mb-2">커뮤니티 기능은 곧 제공될 예정입니다.</p>
                  <p className="text-sm text-gray-500">다른 여행자들과 소통하고 정보를 나눠보세요</p>
                </motion.div>
              </div>
            </div>
          </div>
          <Footer />
        </div>
        <Toaster />
      </>
    );
  }

  if (currentPage === "places-results") {
    return (
      <>
        <PlacesResultsPage
          location={selectedLocation}
          onBack={() => setCurrentPage("search")}
        />
        <Toaster />
      </>
    );
  }

  // Home page
  return (
    <>
      <HomePage 
        isAuthenticated={isAuthenticated} 
        userEmail={userEmail} 
        onNavigate={handleNavigate}
        onLocationSelect={(location) => setSelectedLocation(location)}
      />
      <Toaster />
    </>
  );
}