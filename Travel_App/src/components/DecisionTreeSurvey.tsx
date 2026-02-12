import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, ArrowRight, Check, Sparkles, Loader2, MapPin } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Input } from "./ui/input";

interface DecisionTreeSurveyProps {
  onBack: () => void;
  onComplete: (result: SurveyResult) => void;
  location: string;
  onLocationChange?: (location: string) => void;
}

interface SurveyResult {
  travelType: string;
  personality: string;
  preferences: {
    pace: string;
    budget: string;
    activities: string[];
    companion: string;
  };
  recommendations: string[];
}

interface Question {
  id: string;
  question: string;
  emoji: string;
  options: {
    text: string;
    emoji: string;
    value: string;
    nextId?: string; // 다음 질문 ID (없으면 종료)
    score?: { [key: string]: number }; // 여행 타입별 점수
  }[];
}

// Decision Tree 질문 구조
const questions: { [key: string]: Question } = {
  start: {
    id: "start",
    question: "여행에서 가장 중요한 것은?",
    emoji: "🎯",
    options: [
      {
        text: "힐링과 휴식",
        emoji: "🧘",
        value: "healing",
        nextId: "healing_depth",
        score: { healing: 3, nature: 2 }
      },
      {
        text: "새로운 경험과 모험",
        emoji: "🏔️",
        value: "adventure",
        nextId: "adventure_type",
        score: { adventure: 3, active: 2 }
      },
      {
        text: "맛집과 음식",
        emoji: "🍜",
        value: "food",
        nextId: "food_style",
        score: { foodie: 3, culture: 1 }
      },
      {
        text: "문화와 역사 탐방",
        emoji: "🏛️",
        value: "culture",
        nextId: "culture_depth",
        score: { culture: 3, learning: 2 }
      }
    ]
  },
  
  healing_depth: {
    id: "healing_depth",
    question: "어떤 방식으로 힐링하고 싶나요?",
    emoji: "🌿",
    options: [
      {
        text: "자연 속에서 조용히",
        emoji: "🏞️",
        value: "nature",
        nextId: "pace",
        score: { nature: 3, healing: 2 }
      },
      {
        text: "스파/온천에서",
        emoji: "♨️",
        value: "spa",
        nextId: "pace",
        score: { healing: 3, luxury: 2 }
      },
      {
        text: "카페 투어",
        emoji: "☕",
        value: "cafe",
        nextId: "pace",
        score: { healing: 2, culture: 1, foodie: 1 }
      },
      {
        text: "해변에서 여유롭게",
        emoji: "🏖️",
        value: "beach",
        nextId: "pace",
        score: { healing: 2, nature: 2 }
      }
    ]
  },

  adventure_type: {
    id: "adventure_type",
    question: "어떤 모험을 원하시나요?",
    emoji: "⚡",
    options: [
      {
        text: "등산/트레킹",
        emoji: "🥾",
        value: "hiking",
        nextId: "pace",
        score: { adventure: 3, active: 3, nature: 2 }
      },
      {
        text: "수상 액티비티",
        emoji: "🏄",
        value: "water",
        nextId: "pace",
        score: { adventure: 3, active: 3 }
      },
      {
        text: "익스트림 스포츠",
        emoji: "🪂",
        value: "extreme",
        nextId: "pace",
        score: { adventure: 4, active: 4 }
      },
      {
        text: "도심 탐험",
        emoji: "🏙️",
        value: "urban",
        nextId: "pace",
        score: { adventure: 2, culture: 2 }
      }
    ]
  },

  food_style: {
    id: "food_style",
    question: "어떤 음식 여행을 원하시나요?",
    emoji: "🍽️",
    options: [
      {
        text: "현지 전통 음식",
        emoji: "🥘",
        value: "traditional",
        nextId: "pace",
        score: { foodie: 3, culture: 2 }
      },
      {
        text: "파인다이닝",
        emoji: "🍷",
        value: "fine_dining",
        nextId: "pace",
        score: { foodie: 3, luxury: 3 }
      },
      {
        text: "길거리 음식",
        emoji: "🌮",
        value: "street_food",
        nextId: "pace",
        score: { foodie: 3, adventure: 1 }
      },
      {
        text: "카페/디저트",
        emoji: "🍰",
        value: "dessert",
        nextId: "pace",
        score: { foodie: 2, healing: 1 }
      }
    ]
  },

  culture_depth: {
    id: "culture_depth",
    question: "문화 탐방 스타일은?",
    emoji: "🎨",
    options: [
      {
        text: "박물관/미술관 집중",
        emoji: "🖼️",
        value: "museum",
        nextId: "pace",
        score: { culture: 3, learning: 3 }
      },
      {
        text: "역사 유적지 탐방",
        emoji: "🏯",
        value: "historical",
        nextId: "pace",
        score: { culture: 3, learning: 2 }
      },
      {
        text: "현지 공연/축제",
        emoji: "🎭",
        value: "performance",
        nextId: "pace",
        score: { culture: 3, adventure: 1 }
      },
      {
        text: "전통 마을 체험",
        emoji: "🏘️",
        value: "village",
        nextId: "pace",
        score: { culture: 3, healing: 1 }
      }
    ]
  },

  pace: {
    id: "pace",
    question: "여행 일정 스타일은?",
    emoji: "⏰",
    options: [
      {
        text: "빡빡하게 많이 다니기",
        emoji: "🏃",
        value: "fast",
        nextId: "budget",
        score: { active: 2 }
      },
      {
        text: "여유롭게 천천히",
        emoji: "🚶",
        value: "slow",
        nextId: "budget",
        score: { healing: 2 }
      },
      {
        text: "중간 정도",
        emoji: "🚶‍♂️",
        value: "medium",
        nextId: "budget",
        score: {}
      }
    ]
  },

  budget: {
    id: "budget",
    question: "하루 예산은 얼마인가요?",
    emoji: "💰",
    options: [
      {
        text: "5만원 이하 (알뜰)",
        emoji: "🪙",
        value: "low",
        nextId: "companion",
        score: {}
      },
      {
        text: "5~15만원 (적당)",
        emoji: "💵",
        value: "medium",
        nextId: "companion",
        score: {}
      },
      {
        text: "15만원 이상 (럭셔리)",
        emoji: "💎",
        value: "high",
        nextId: "companion",
        score: { luxury: 2 }
      }
    ]
  },

  companion: {
    id: "companion",
    question: "누구와 여행하시나요?",
    emoji: "👥",
    options: [
      {
        text: "혼자 (나홀로)",
        emoji: "🧍",
        value: "solo",
        nextId: "photo",
        score: { healing: 1 }
      },
      {
        text: "연인/배우자",
        emoji: "💑",
        value: "couple",
        nextId: "photo",
        score: {}
      },
      {
        text: "가족",
        emoji: "👨‍👩‍👧‍👦",
        value: "family",
        nextId: "photo",
        score: {}
      },
      {
        text: "친구",
        emoji: "👯",
        value: "friends",
        nextId: "photo",
        score: { active: 1 }
      }
    ]
  },

  photo: {
    id: "photo",
    question: "사진 촬영에 관심이 있나요?",
    emoji: "📸",
    options: [
      {
        text: "매우 중요! 인생샷 필수",
        emoji: "📷",
        value: "important",
        nextId: "time_preference",
        score: { culture: 1 }
      },
      {
        text: "그냥 간단히만",
        emoji: "📱",
        value: "casual",
        nextId: "time_preference",
        score: {}
      },
      {
        text: "별로 안 찍음",
        emoji: "🙅",
        value: "not_important",
        nextId: "time_preference",
        score: { healing: 1 }
      }
    ]
  },

  time_preference: {
    id: "time_preference",
    question: "선호하는 여행 시간대는?",
    emoji: "🕐",
    options: [
      {
        text: "이른 아침 시작",
        emoji: "🌅",
        value: "morning",
        nextId: "weather_priority",
        score: { active: 2, nature: 1 }
      },
      {
        text: "여유있는 오전~오후",
        emoji: "☀️",
        value: "daytime",
        nextId: "weather_priority",
        score: {}
      },
      {
        text: "저녁~밤 분위기",
        emoji: "🌃",
        value: "night",
        nextId: "weather_priority",
        score: { culture: 1, foodie: 1 }
      },
      {
        text: "상관없음",
        emoji: "🔄",
        value: "flexible",
        nextId: "weather_priority",
        score: {}
      }
    ]
  },

  weather_priority: {
    id: "weather_priority",
    question: "날씨가 여행 계획에 얼마나 중요한가요?",
    emoji: "⛅",
    options: [
      {
        text: "매우 중요 (맑은 날만)",
        emoji: "☀️",
        value: "very_important",
        score: { nature: 1 }
      },
      {
        text: "비만 안 오면 됨",
        emoji: "🌤️",
        value: "moderate",
        score: {}
      },
      {
        text: "별로 중요하지 않음",
        emoji: "🌦️",
        value: "not_important",
        score: { adventure: 1 }
      }
    ]
  }
};

export function DecisionTreeSurvey({ onBack, onComplete, location, onLocationChange }: DecisionTreeSurveyProps) {
  const [showIntro, setShowIntro] = useState(true);
  const [editingLocation, setEditingLocation] = useState(location || "");
  const [currentQuestionId, setCurrentQuestionId] = useState("start");
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [scores, setScores] = useState<{ [key: string]: number }>({
    healing: 0,
    adventure: 0,
    foodie: 0,
    culture: 0,
    nature: 0,
    active: 0,
    luxury: 0,
    learning: 0
  });
  const [history, setHistory] = useState<string[]>(["start"]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const currentQuestion = questions[currentQuestionId];
  const progress = (Object.keys(answers).length / 8) * 100; // 총 8개 질문 기준

  const handleAnswer = (option: typeof currentQuestion.options[0]) => {
    // 답변 저장
    const newAnswers = { ...answers, [currentQuestionId]: option.value };
    setAnswers(newAnswers);

    // 점수 업데이트
    if (option.score) {
      const newScores = { ...scores };
      Object.entries(option.score).forEach(([key, value]) => {
        newScores[key] = (newScores[key] || 0) + value;
      });
      setScores(newScores);
    }

    // 다음 질문으로 이동 또는 결과 분석
    if (option.nextId && questions[option.nextId]) {
      setHistory([...history, option.nextId]);
      setCurrentQuestionId(option.nextId);
    } else {
      // 설문 완료 - 결과 분석
      analyzeResults(newAnswers, { ...scores, ...option.score });
    }
  };

  const handleBack = () => {
    if (history.length > 1) {
      const newHistory = [...history];
      newHistory.pop();
      const prevQuestionId = newHistory[newHistory.length - 1];
      
      setCurrentQuestionId(prevQuestionId);
      setHistory(newHistory);
      
      // 이전 답변 제거
      const newAnswers = { ...answers };
      delete newAnswers[currentQuestionId];
      setAnswers(newAnswers);
    } else {
      onBack();
    }
  };

  const analyzeResults = (finalAnswers: typeof answers, finalScores: typeof scores) => {
    setIsAnalyzing(true);

    // 가장 높은 점수의 여행 타입 찾기
    const sortedTypes = Object.entries(finalScores)
      .sort(([, a], [, b]) => b - a);
    
    const primaryType = sortedTypes[0][0];
    const secondaryType = sortedTypes[1]?.[0] || "";

    // 여행 타입별 설명
    const typeDescriptions: { [key: string]: { name: string; description: string; keywords: string[] } } = {
      healing: {
        name: "힐링 여행자",
        description: "여유로운 휴식과 재충전을 추구하는 당신! 자연과 평온함 속에서 진정한 쉼을 찾습니다.",
        keywords: ["휴식", "자연", "카페", "온천", "여유"]
      },
      adventure: {
        name: "모험 여행자",
        description: "스릴과 새로운 경험을 즐기는 당신! 도전과 모험이 가득한 여행을 선호합니다.",
        keywords: ["액티비티", "등산", "익스트림", "탐험", "도전"]
      },
      foodie: {
        name: "미식 여행자",
        description: "음식이 여행의 중심인 당신! 맛집 탐방과 현지 음식 체험을 가장 중요하게 생각합니다.",
        keywords: ["맛집", "현지음식", "미식", "요리", "카페"]
      },
      culture: {
        name: "문화 탐방자",
        description: "역사와 문화를 깊이 이해하고 싶은 당신! 박물관, 유적지 탐방을 즐깁니다.",
        keywords: ["박물관", "역사", "전통", "문화재", "예술"]
      },
      nature: {
        name: "자연 애호가",
        description: "자연 속에서 평화를 찾는 당신! 산, 바다, 숲 등 자연 경관을 최우선으로 합니다.",
        keywords: ["자연", "트레킹", "해변", "국립공원", "풍경"]
      },
      active: {
        name: "액티브 여행자",
        description: "활동적이고 에너제틱한 당신! 많은 곳을 다니며 다양한 활동을 즐깁니다.",
        keywords: ["활동적", "스포츠", "다이나믹", "체험", "운동"]
      },
      luxury: {
        name: "럭셔리 여행자",
        description: "품격 있고 특별한 경험을 원하는 당신! 프리미엄 여행을 선호합니다.",
        keywords: ["럭셔리", "프리미엄", "파인다이닝", "호텔", "특별한경험"]
      },
      learning: {
        name: "학습형 여행자",
        description: "여행을 통해 배우고 성장하는 당신! 교육적이고 의미있는 경험을 추구합니다.",
        keywords: ["학습", "교육", "체험", "워크샵", "전문가투어"]
      }
    };

    const result: SurveyResult = {
      travelType: typeDescriptions[primaryType]?.name || "균형잡힌 여행자",
      personality: typeDescriptions[primaryType]?.description || "",
      preferences: {
        pace: finalAnswers.pace || "medium",
        budget: finalAnswers.budget || "medium",
        activities: typeDescriptions[primaryType]?.keywords || [],
        companion: finalAnswers.companion || "solo"
      },
      recommendations: [
        ...typeDescriptions[primaryType]?.keywords || [],
        ...typeDescriptions[secondaryType]?.keywords || []
      ].slice(0, 5)
    };

    setTimeout(() => {
      setIsAnalyzing(false);
      onComplete(result);
    }, 2000);
  };

  if (showIntro) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 flex items-center justify-center p-4">
        <Card className="p-8 md:p-12 max-w-2xl w-full text-center bg-white/80 backdrop-blur-lg border-2 border-cyan-200">
          <div className="mb-8">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center mb-4">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-gray-900 mb-3">AI 여행 성향 분석</h2>
            <p className="text-gray-600 mb-6">
              8개의 질문으로 당신의 여행 스타일을 분석하고<br />
              최적의 여행지를 추천해드립니다
            </p>
          </div>

          {/* 여행지 입력 */}
          <div className="mb-8">
            <label className="block text-sm text-gray-700 mb-3 text-left">
              <MapPin className="w-4 h-4 inline mr-2" />
              어디로 여행가시나요?
            </label>
            <Input
              value={editingLocation}
              onChange={(e) => setEditingLocation(e.target.value)}
              placeholder="예: 서울, 부산, 제주도"
              className="text-lg py-6"
            />
            {!editingLocation && (
              <p className="text-sm text-red-500 mt-2 text-left">여행지를 입력해주세요</p>
            )}
          </div>

          {/* 안내 사항 */}
          <div className="bg-cyan-50 border border-cyan-200 rounded-xl p-4 mb-8 text-left">
            <h4 className="text-sm text-gray-900 mb-2">📋 설문 안내</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• 소요 시간: 약 2-3분</li>
              <li>• 총 8개의 질문</li>
              <li>• 정답은 없습니다. 편하게 선택해주세요</li>
            </ul>
          </div>

          {/* 버튼 */}
          <div className="flex gap-3">
            <Button
              onClick={onBack}
              variant="outline"
              size="lg"
              className="flex-1"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              돌아가기
            </Button>
            <Button
              onClick={() => {
                if (editingLocation.trim()) {
                  if (onLocationChange) {
                    onLocationChange(editingLocation);
                  }
                  setShowIntro(false);
                }
              }}
              disabled={!editingLocation.trim()}
              size="lg"
              className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
            >
              설문 시작하기
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (isAnalyzing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 flex items-center justify-center">
        <Card className="p-12 max-w-md mx-4 text-center bg-white/80 backdrop-blur-lg border-2 border-cyan-200">
          <div className="mb-6">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center mb-4">
              <Sparkles className="w-10 h-10 text-white animate-pulse" />
            </div>
            <Loader2 className="w-8 h-8 animate-spin text-cyan-600 mx-auto mb-4" />
          </div>
          <h3 className="mb-2 text-gray-900">AI가 분석 중...</h3>
          <p className="text-sm text-gray-600">
            당신의 여행 성향을 분석하고 있습니다
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-lg border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <Button
              onClick={handleBack}
              variant="ghost"
              size="icon"
              className="rounded-full"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                {Object.keys(answers).length} / 8
              </span>
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* Question */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionId}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            {/* Question Card */}
            <Card className="p-8 mb-8 bg-white/90 backdrop-blur-lg border-2 border-cyan-200 shadow-xl">
              <div className="text-center mb-8">
                <div className="text-6xl mb-4">{currentQuestion.emoji}</div>
                <h2 className="text-gray-900 mb-2">
                  {currentQuestion.question}
                </h2>
                <p className="text-sm text-gray-600">
                  {location}에서의 여행을 위한 맞춤 설문
                </p>
              </div>

              {/* Options */}
              <div className="grid gap-4">
                {currentQuestion.options.map((option, index) => (
                  <motion.div
                    key={option.value}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Button
                      onClick={() => handleAnswer(option)}
                      variant="outline"
                      className="w-full h-auto py-6 px-6 text-left justify-start hover:bg-gradient-to-r hover:from-cyan-50 hover:to-blue-50 hover:border-cyan-400 transition-all group"
                    >
                      <div className="flex items-center gap-4 w-full">
                        <div className="text-4xl flex-shrink-0">{option.emoji}</div>
                        <div className="flex-1">
                          <span className="text-gray-900 group-hover:text-cyan-700 transition-colors">
                            {option.text}
                          </span>
                        </div>
                        <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-cyan-600 group-hover:translate-x-1 transition-all" />
                      </div>
                    </Button>
                  </motion.div>
                ))}
              </div>
            </Card>

            {/* Progress Info */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                💡 각 질문의 답변에 따라 최적의 여행 스타일을 분석합니다
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
