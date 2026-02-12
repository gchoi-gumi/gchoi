import { ArrowLeft, User, Calendar, Bookmark, Settings, LogOut, FileText } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { useAuth } from "../utils/auth-context";
import { motion } from "motion/react";

interface ProfilePageProps {
  userId: string;
  userEmail: string;
  onBack: () => void;
  onNavigateToItineraries: () => void;
  onNavigateToBookmarks: () => void;
  onNavigateToReviews?: () => void;
  onLogout: () => void;
}

export function ProfilePage({
  userId,
  userEmail,
  onBack,
  onNavigateToItineraries,
  onNavigateToBookmarks,
  onNavigateToReviews,
  onLogout
}: ProfilePageProps) {
  const { signOut } = useAuth();

  const handleLogout = async () => {
    if (!confirm("로그아웃 하시겠습니까?")) return;

    try {
      await signOut();
      onLogout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const menuItems = [
    {
      icon: Calendar,
      title: "내 여행 일정",
      description: "저장된 여행 계획 보기",
      onClick: onNavigateToItineraries,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      icon: Bookmark,
      title: "북마크",
      description: "저장한 장소 보기",
      onClick: onNavigateToBookmarks,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      icon: FileText,
      title: "여행 후기",
      description: "작성한 후기 보기",
      onClick: onNavigateToReviews || (() => {}),
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    },
    {
      icon: Settings,
      title: "설정",
      description: "앱 설정 및 환경설정",
      onClick: () => {},
      color: "text-gray-600",
      bgColor: "bg-gray-50"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 py-12 mb-8">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex items-center gap-4 mb-6">
            <motion.button 
              onClick={onBack} 
              whileTap={{ scale: 0.9 }}
              className="p-2.5 hover:bg-white/20 rounded-xl transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-white" />
            </motion.button>
            <h1 className="text-white">내 프로필</h1>
          </div>
          
          {/* Profile Header */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card className="p-8 shadow-2xl border-0 bg-white/95 backdrop-blur-xl">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                  <User className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h2 className="mb-2 text-gray-800">환영합니다!</h2>
                  <p className="text-gray-600">{userEmail}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 pb-12">
        {/* Menu Items */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {menuItems.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card 
                className="p-6 hover:shadow-xl cursor-pointer transition-all border-2 border-gray-200 hover:border-indigo-300 h-full"
                onClick={item.onClick}
              >
                <div className="flex flex-col items-center text-center gap-4">
                  <div className={`w-16 h-16 ${item.bgColor} rounded-2xl flex items-center justify-center`}>
                    <item.icon className={`w-8 h-8 ${item.color}`} />
                  </div>
                  <div>
                    <h3 className="mb-2 text-gray-800">{item.title}</h3>
                    <p className="text-sm text-gray-500">{item.description}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* App Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6 bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 mb-6">
            <h3 className="mb-4 text-gray-700">앱 정보</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">버전</span>
                <span className="text-gray-800 bg-gray-100 px-3 py-1 rounded-lg">1.0.0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">사용자 ID</span>
                <span className="text-xs text-gray-800 bg-gray-100 px-3 py-1 rounded-lg font-mono">{userId.slice(0, 8)}...</span>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Logout Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button 
            onClick={handleLogout} 
            variant="destructive"
            className="w-full py-7 rounded-2xl text-base shadow-lg"
          >
            <LogOut className="w-5 h-5 mr-2" />
            로그아웃
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
