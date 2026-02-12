import { useAuth } from '../utils/auth-context';
import { Button } from './ui/button';
import { Lock, LogIn } from 'lucide-react';
import { motion } from 'motion/react';

interface AuthRequiredProps {
  children: React.ReactNode;
  onLoginClick: () => void;
}

export function AuthRequired({ children, onLoginClick }: AuthRequiredProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <div className="mb-6 p-6 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto">
            <Lock className="w-12 h-12 text-blue-600" />
          </div>
          <h2 className="mb-4 text-gray-900">로그인이 필요합니다</h2>
          <p className="text-gray-600 mb-8">
            이 기능을 사용하려면 먼저 로그인해주세요.
          </p>
          <Button
            onClick={onLoginClick}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-xl px-8 py-6 rounded-xl"
          >
            <LogIn className="w-5 h-5 mr-2" />
            로그인하기
          </Button>
        </motion.div>
      </div>
    );
  }

  return <>{children}</>;
}
