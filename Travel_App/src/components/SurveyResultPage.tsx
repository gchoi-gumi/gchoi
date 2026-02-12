import { motion } from "motion/react";
import { Sparkles, TrendingUp, MapPin, ArrowRight, Check } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";

interface SurveyResultPageProps {
  result: {
    travelType: string;
    personality: string;
    preferences: {
      pace: string;
      budget: string;
      activities: string[];
      companion: string;
    };
    recommendations: string[];
  };
  location: string;
  onGetRecommendations: () => void;
  onRetakeSurvey: () => void;
  onBack: () => void;
}

export function SurveyResultPage({
  result,
  location,
  onGetRecommendations,
  onRetakeSurvey,
  onBack
}: SurveyResultPageProps) {
  const paceLabels: { [key: string]: { label: string; emoji: string } } = {
    fast: { label: "빠른 페이스", emoji: "🏃" },
    medium: { label: "적당한 페이스", emoji: "🚶‍♂️" },
    slow: { label: "여유로운 페이스", emoji: "🚶" }
  };

  const budgetLabels: { [key: string]: { label: string; emoji: string } } = {
    low: { label: "알뜰 여행", emoji: "🪙" },
    medium: { label: "적당한 예산", emoji: "💵" },
    high: { label: "럭셔리 여행", emoji: "💎" }
  };

  const companionLabels: { [key: string]: { label: string; emoji: string } } = {
    solo: { label: "나홀로 여행", emoji: "🧍" },
    couple: { label: "커플 여행", emoji: "💑" },
    family: { label: "가족 여행", emoji: "👨‍👩‍👧‍👦" },
    friends: { label: "친구와 함께", emoji: "👯" }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="text-center">
            <div className="inline-flex items-center bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 px-4 py-2 rounded-full border border-purple-200 mb-4">
              <Sparkles className="w-4 h-4 mr-2" />
              분석 완료
            </div>
            <h1 className="text-gray-900">당신의 여행 성향</h1>
            <p className="text-sm text-gray-600 mt-2">{location} 여행 맞춤 분석 결과</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Main Result Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="p-8 bg-gradient-to-br from-white to-purple-50 border-2 border-purple-200 shadow-2xl">
            <div className="text-center mb-6">
              <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                <Sparkles className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-gray-900 mb-3">
                {result.travelType}
              </h2>
              <p className="text-gray-700 leading-relaxed max-w-2xl mx-auto">
                {result.personality}
              </p>
            </div>

            {/* Activities Tags */}
            <div className="flex flex-wrap gap-2 justify-center mb-6">
              {result.preferences.activities.map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                    {activity}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Preferences Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-3 gap-4"
        >
          {/* Pace */}
          <Card className="p-6 bg-white/90 backdrop-blur-lg border-2 border-cyan-200">
            <div className="text-center">
              <div className="text-4xl mb-2">
                {paceLabels[result.preferences.pace]?.emoji || "🚶"}
              </div>
              <p className="text-sm text-gray-600 mb-1">여행 속도</p>
              <p className="text-gray-900">
                {paceLabels[result.preferences.pace]?.label || "적당한 페이스"}
              </p>
            </div>
          </Card>

          {/* Budget */}
          <Card className="p-6 bg-white/90 backdrop-blur-lg border-2 border-blue-200">
            <div className="text-center">
              <div className="text-4xl mb-2">
                {budgetLabels[result.preferences.budget]?.emoji || "💵"}
              </div>
              <p className="text-sm text-gray-600 mb-1">예산 스타일</p>
              <p className="text-gray-900">
                {budgetLabels[result.preferences.budget]?.label || "적당한 예산"}
              </p>
            </div>
          </Card>

          {/* Companion */}
          <Card className="p-6 bg-white/90 backdrop-blur-lg border-2 border-teal-200">
            <div className="text-center">
              <div className="text-4xl mb-2">
                {companionLabels[result.preferences.companion]?.emoji || "🧍"}
              </div>
              <p className="text-sm text-gray-600 mb-1">여행 동행</p>
              <p className="text-gray-900">
                {companionLabels[result.preferences.companion]?.label || "나홀로 여행"}
              </p>
            </div>
          </Card>
        </motion.div>

        {/* Recommended Keywords */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6 bg-white/90 backdrop-blur-lg border-2 border-green-200">
            <h3 className="mb-4 text-gray-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              추천 키워드
            </h3>
            <div className="flex flex-wrap gap-2">
              {result.recommendations.map((keyword, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                >
                  <Badge variant="outline" className="text-sm border-green-300 text-green-700">
                    <Check className="w-3 h-3 mr-1" />
                    {keyword}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-4"
        >
          <Button
            onClick={onGetRecommendations}
            className="w-full py-6 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            size="lg"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            AI 맞춤 여행지 추천 받기
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>

          <div className="grid md:grid-cols-2 gap-4">
            <Button
              onClick={onRetakeSurvey}
              variant="outline"
              className="py-6"
            >
              설문 다시하기
            </Button>
            <Button
              onClick={onBack}
              variant="outline"
              className="py-6"
            >
              홈으로 돌아가기
            </Button>
          </div>
        </motion.div>

        {/* Info */}
        <div className="text-center">
          <p className="text-sm text-gray-500">
            💡 이 분석 결과는 AI가 당신의 여행 성향을 바탕으로<br />
            최적의 여행지를 추천하는데 활용됩니다
          </p>
        </div>
      </div>
    </div>
  );
}
