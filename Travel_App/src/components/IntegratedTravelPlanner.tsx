import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, MapPin, Navigation, Check, Loader2, Brain, TrendingUp } from "lucide-react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { projectId, publicAnonKey } from "../utils/supabase/info";

interface IntegratedTravelPlannerProps {
  onBack: () => void;
  onComplete: (result: any) => void;
  location: string;
  surveyResult: any;
  weather: any;
}

type Step = "analyzing" | "generating" | "planning-route" | "complete";

export function IntegratedTravelPlanner({ onBack, onComplete, location, surveyResult, weather }: IntegratedTravelPlannerProps) {
  const [currentStep, setCurrentStep] = useState<Step>("analyzing");
  const [progress, setProgress] = useState(0);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const steps = [
    {
      id: "analyzing",
      title: "여행 성향 분석 중",
      description: "당신의 답변을 AI가 분석하고 있습니다",
      icon: Brain,
      color: "from-purple-500 to-pink-500"
    },
    {
      id: "generating",
      title: "맞춤 여행지 생성 중",
      description: "GPT가 최적의 여행 코스를 만들고 있습니다",
      icon: Sparkles,
      color: "from-cyan-500 to-blue-500"
    },
    {
      id: "planning-route",
      title: "경로 최적화 중",
      description: "카카오맵 기반으로 효율적인 동선을 계획합니다",
      icon: Navigation,
      color: "from-green-500 to-emerald-500"
    },
    {
      id: "complete",
      title: "완료!",
      description: "당신만의 완벽한 여행 계획이 준비되었습니다",
      icon: Check,
      color: "from-blue-500 to-purple-500"
    }
  ];

  const currentStepInfo = steps.find(s => s.id === currentStep) || steps[0];
  const currentStepIndex = steps.findIndex(s => s.id === currentStep);

  // 자동 진행 프로세스
  useEffect(() => {
    const runIntegratedProcess = async () => {
      try {
        // Step 1: 성향 분석 (2초)
        setCurrentStep("analyzing");
        setProgress(0);
        const analyzeInterval = setInterval(() => {
          setProgress(prev => Math.min(prev + 20, 100));
        }, 400);
        
        await new Promise(resolve => setTimeout(resolve, 2000));
        clearInterval(analyzeInterval);
        setProgress(100);

        // Step 2: GPT 추천 생성 (실제 API 호출)
        setCurrentStep("generating");
        setProgress(0);
        const generateInterval = setInterval(() => {
          setProgress(prev => Math.min(prev + 10, 90));
        }, 1500);

        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-a8dd3f70/recommend`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${publicAnonKey}`,
            },
            body: JSON.stringify({
              location,
              preferences: {
                travelStyle: surveyResult?.travelType || "관광",
                companion: surveyResult?.preferences?.companion || "혼자",
                budget: surveyResult?.preferences?.budget || "medium",
                activities: surveyResult?.preferences?.activities || [],
                pace: surveyResult?.preferences?.pace || "medium"
              },
              weather: weather ? {
                temperature: weather.temperature,
                condition: weather.description
              } : null
            }),
          }
        );

        if (!response.ok) {
          throw new Error("GPT 추천 생성 실패");
        }

        const data = await response.json();
        console.log("🔍 [Frontend] GPT Recommendation Response:", data);
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        
        if (data.debug) {
          console.log("🐛 [Debug Info]:", data.debug);
          console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
          
          if (data.debug.logs && data.debug.logs.length > 0) {
            console.log("📋 [Server Logs]:");
            console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
            data.debug.logs.forEach((log: string) => console.log(`  ${log}`));
            console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
          }
          
          if (data.debug.source === "fallback") {
            console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
            console.error("❌❌❌ WARNING: Using FALLBACK data instead of real places!");
            console.error("❌ Reason:", data.debug.reason);
            console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
          } else {
            console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
            console.log("✅✅✅ Real data source:", data.debug.source);
            if (data.debug.totalKakaoPlaces) {
              console.log(`✅ Total Kakao places found: ${data.debug.totalKakaoPlaces}`);
            }
            if (data.debug.source === "kakao_without_gpt") {
              console.warn("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
              console.warn("⚠️⚠️⚠️ GPT FILTERING FAILED ⚠️⚠️⚠️");
              console.warn("⚠️ OpenAI API failed but using real Kakao places");
              console.warn("⚠️ Reason:", data.debug.reason);
              if (data.debug.errorDetails) {
                console.warn("⚠️ Error details:", data.debug.errorDetails);
              }
              console.warn("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
            }
            if (data.debug.source === "kakao_with_gpt") {
              console.log("✅✅✅ PERFECT! Using real Kakao data WITH GPT filtering!");
            }
            console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
          }
        }
        
        if (data.recommendations && data.recommendations.length > 0) {
          console.log("📍 Place names:", data.recommendations.map((p: any) => p.name).join(', '));
          console.log("📷 Image URLs in recommendations:");
          data.recommendations.forEach((p: any, idx: number) => {
            console.log(`  [${idx}] ${p.name}: imageUrl=${p.imageUrl || 'NULL'}, googlePhoto=${p.googlePhoto || 'NULL'}`);
          });
        }
        
        console.log("📊 Summary:");
        console.log("  • isMock:", data.isMock);
        console.log("  • Recommendations count:", data.recommendations?.length || 0);
        console.log("  • Data source:", data.debug?.source || 'unknown');
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        
        setRecommendations(data.recommendations || []);
        
        clearInterval(generateInterval);
        setProgress(100);

        // Step 3: 경로 최적화 (3초)
        setCurrentStep("planning-route");
        setProgress(0);
        const routeInterval = setInterval(() => {
          setProgress(prev => Math.min(prev + 15, 100));
        }, 450);

        await new Promise(resolve => setTimeout(resolve, 3000));
        clearInterval(routeInterval);
        setProgress(100);

        // Step 4: 완료
        setCurrentStep("complete");

      } catch (err: any) {
        console.error("Integrated process error:", err);
        setError(err.message);
        setCurrentStep("complete");
      }
    };

    runIntegratedProcess();
  }, [location, surveyResult, weather]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full p-8 md:p-12 bg-white/90 backdrop-blur-lg border-2 border-purple-200 shadow-2xl">
        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-center mb-6">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                {/* Step Circle */}
                <div className="relative flex items-center justify-center">
                  <motion.div 
                    className={`
                      w-12 h-12 rounded-full flex items-center justify-center
                      transition-all duration-500 shadow-lg relative z-10
                      ${index <= currentStepIndex 
                        ? 'bg-gradient-to-r ' + step.color + ' text-white' 
                        : 'bg-gray-200 text-gray-500'}
                    `}
                    animate={index === currentStepIndex ? {
                      scale: [1, 1.1, 1],
                      boxShadow: [
                        '0 4px 6px rgba(0,0,0,0.1)',
                        '0 8px 16px rgba(0,0,0,0.2)',
                        '0 4px 6px rgba(0,0,0,0.1)'
                      ]
                    } : {}}
                    transition={{
                      duration: 2,
                      repeat: index === currentStepIndex ? Infinity : 0
                    }}
                  >
                    {index < currentStepIndex ? (
                      <Check className="w-6 h-6" />
                    ) : (
                      <span className="text-lg font-semibold">{index + 1}</span>
                    )}
                  </motion.div>
                </div>
                
                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="relative flex items-center mx-2">
                    <div className="w-16 md:w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full bg-gradient-to-r ${step.color}`}
                        initial={{ width: "0%" }}
                        animate={{ 
                          width: index < currentStepIndex ? "100%" : 
                                 index === currentStepIndex ? `${progress}%` : "0%" 
                        }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {/* Step Labels */}
          <div className="flex items-center justify-center">
            {steps.map((step, index) => (
              <div key={step.id + '-label'} className="flex items-center">
                <div className="w-12 text-center">
                  <p className={`text-xs transition-colors duration-300 ${
                    index <= currentStepIndex ? 'text-gray-700 font-medium' : 'text-gray-400'
                  }`}>
                    {index === 0 ? '분석' : index === 1 ? '생성' : index === 2 ? '최적화' : '완료'}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className="w-16 md:w-24 mx-2"></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Current Step Animation */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            {/* Icon */}
            <motion.div
              animate={{ 
                scale: currentStep !== "complete" ? [1, 1.1, 1] : 1,
                rotate: currentStep !== "complete" ? [0, 5, -5, 0] : 0
              }}
              transition={{ 
                duration: 2,
                repeat: currentStep !== "complete" ? Infinity : 0
              }}
              className={`
                w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center
                bg-gradient-to-br ${currentStepInfo.color}
                shadow-2xl
              `}
            >
              <currentStepInfo.icon className="w-12 h-12 text-white" />
            </motion.div>

            {/* Loading Spinner */}
            {currentStep !== "complete" && (
              <Loader2 className="w-8 h-8 animate-spin text-purple-600 mx-auto mb-6" />
            )}

            {/* Title & Description */}
            <h2 className="mb-3 text-gray-900">
              {currentStepInfo.title}
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              {currentStepInfo.description}
            </p>

            {/* Progress Info */}
            <div className="flex items-center justify-center gap-2 mb-6">
              <Badge className={`bg-gradient-to-r ${currentStepInfo.color} text-white`}>
                {location}
              </Badge>
              <Badge variant="outline" className="border-purple-300 text-purple-700">
                {currentStepIndex + 1} / {steps.length}
              </Badge>
            </div>

            {/* Estimated Time */}
            {currentStep !== "complete" && (
              <p className="text-sm text-gray-500">
                예상 소요 시간: {
                  currentStep === "analyzing" ? "약 5초" :
                  currentStep === "generating" ? "약 15초" :
                  "약 10초"
                }
              </p>
            )}

            {/* Complete Button */}
            {currentStep === "complete" && !error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Button
                  onClick={() => onComplete({ recommendations })}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-6"
                  size="lg"
                >
                  <Navigation className="w-5 h-5 mr-2" />
                  경로 설정하기
                </Button>
              </motion.div>
            )}

            {/* Error State */}
            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-6"
              >
                <div className="p-4 bg-red-50 rounded-xl border border-red-200 mb-4">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
                <Button
                  onClick={onBack}
                  variant="outline"
                  className="w-full"
                >
                  홈으로 돌아가기
                </Button>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Tips */}
        {currentStep !== "complete" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-200"
          >
            <p className="text-sm text-blue-800 text-center">
              💡 {
                currentStep === "analyzing" ? "AI가 8가지 여행 스타일을 기반으로 분석합니다" :
                currentStep === "generating" ? "실시간 날씨와 인기도를 반영하여 추천합니다" :
                "최단 거리와 교통편을 고려한 최적 경로를 생성합니다"
              }
            </p>
          </motion.div>
        )}

        {/* Cancel Button */}
        {currentStep === "analyzing" && (
          <div className="mt-6 text-center">
            <Button
              onClick={onBack}
              variant="ghost"
              className="text-gray-500"
            >
              취소
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
