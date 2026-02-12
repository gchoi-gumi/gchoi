import { useState } from "react";
import { ArrowLeft, Loader2, Plane, Mail, Lock, User, Server } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { useAuth } from "../utils/auth-context";
import { motion } from "motion/react";
import { BackendHealthCheck } from "./BackendHealthCheck";

interface AuthPageProps {
  onAuthSuccess: (accessToken: string, userId: string) => void;
  onBack: () => void;
}

export function AuthPage({ onAuthSuccess, onBack }: AuthPageProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDebug, setShowDebug] = useState(false);
  
  // Sign up form
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupName, setSignupName] = useState("");
  
  // Sign in form
  const [signinEmail, setSigninEmail] = useState("");
  const [signinPassword, setSigninPassword] = useState("");

  const { signUp, signIn } = useAuth();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await signUp(signupEmail, signupPassword, signupName);
      
      if (!result.success) {
        throw new Error(result.error || "회원가입에 실패했습니다.");
      }

      // Get user ID from localStorage after successful signup/signin
      const user = localStorage.getItem('user');
      const accessToken = localStorage.getItem('accessToken');
      if (user && accessToken) {
        const userData = JSON.parse(user);
        onAuthSuccess(accessToken, userData.id);
      }
    } catch (err) {
      console.error("Sign up error:", err);
      setError(err instanceof Error ? err.message : "회원가입에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await signIn(signinEmail, signinPassword);
      
      if (!result.success) {
        throw new Error(result.error || "로그인에 실패했습니다.");
      }

      // Get user ID from localStorage after successful signin
      const user = localStorage.getItem('user');
      const accessToken = localStorage.getItem('accessToken');
      if (user && accessToken) {
        const userData = JSON.parse(user);
        onAuthSuccess(accessToken, userData.id);
      }
    } catch (err) {
      console.error("Sign in error:", err);
      setError(err instanceof Error ? err.message : "로그인에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 py-12 mb-8">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex items-center gap-4">
            <motion.button 
              onClick={onBack} 
              whileTap={{ scale: 0.9 }}
              className="p-2.5 hover:bg-white/20 rounded-xl transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-white" />
            </motion.button>
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-white/20 backdrop-blur-sm rounded-xl">
                <Plane className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-white">로그인 / 회원가입</h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 p-1.5 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl h-14 shadow-lg">
              <TabsTrigger value="signin" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-xl">
                로그인
              </TabsTrigger>
              <TabsTrigger value="signup" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-xl">
                회원가입
              </TabsTrigger>
            </TabsList>

            {/* Sign In Tab */}
            <TabsContent value="signin">
              <Card className="p-8 shadow-2xl border-0 bg-white/95 backdrop-blur-xl">
                <form onSubmit={handleSignIn} className="space-y-5">
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10" />
                    <input
                      type="email"
                      name="email"
                      placeholder="이메일 주소를 입력하세요"
                      value={signinEmail}
                      onChange={(e) => setSigninEmail(e.target.value)}
                      required
                      autoComplete="off"
                      className="w-full pl-12 pr-4 h-14 rounded-xl border-2 border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all placeholder:text-gray-400"
                      style={{ fontSize: '16px', paddingLeft: '3rem' }}
                    />
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10" />
                    <input
                      type="password"
                      name="password"
                      placeholder="비밀번호를 입력하세요"
                      value={signinPassword}
                      onChange={(e) => setSigninPassword(e.target.value)}
                      required
                      autoComplete="off"
                      className="w-full pl-12 pr-4 h-14 rounded-xl border-2 border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all placeholder:text-gray-400"
                      style={{ fontSize: '16px', paddingLeft: '3rem' }}
                    />
                  </div>
                  
                  {error && (
                    <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
                      <p className="text-sm text-red-800">{error}</p>
                    </div>
                  )}

                  <Button 
                    type="submit" 
                    className="w-full py-7 rounded-xl text-base mt-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-xl" 
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        로그인 중...
                      </>
                    ) : (
                      "로그인"
                    )}
                  </Button>
                </form>
              </Card>
            </TabsContent>

            {/* Sign Up Tab */}
            <TabsContent value="signup">
              <Card className="p-8 shadow-2xl border-0 bg-white/95 backdrop-blur-xl">
                <form onSubmit={handleSignUp} className="space-y-5">
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10" />
                    <input
                      type="text"
                      name="name"
                      placeholder="이름을 입력하세요"
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      required
                      autoComplete="off"
                      className="w-full pl-12 pr-4 h-14 rounded-xl border-2 border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all placeholder:text-gray-400"
                      style={{ fontSize: '16px', paddingLeft: '3rem' }}
                    />
                  </div>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10" />
                    <input
                      type="email"
                      name="signup-email"
                      placeholder="이메일 주소를 입력하세요"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      required
                      autoComplete="off"
                      className="w-full pl-12 pr-4 h-14 rounded-xl border-2 border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all placeholder:text-gray-400"
                      style={{ fontSize: '16px', paddingLeft: '3rem' }}
                    />
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10" />
                    <input
                      type="password"
                      name="signup-password"
                      placeholder="비밀번호 (최소 6자)"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      required
                      minLength={6}
                      autoComplete="off"
                      className="w-full pl-12 pr-4 h-14 rounded-xl border-2 border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all placeholder:text-gray-400"
                      style={{ fontSize: '16px', paddingLeft: '3rem' }}
                    />
                  </div>

                  {error && (
                    <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
                      <p className="text-sm text-red-800">{error}</p>
                    </div>
                  )}

                  <Button 
                    type="submit" 
                    className="w-full py-7 rounded-xl text-base mt-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-xl" 
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        회원가입 중...
                      </>
                    ) : (
                      "회원가입"
                    )}
                  </Button>
                </form>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="mt-8 p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl border-2 border-blue-100 shadow-lg">
            <p className="text-sm text-blue-800 leading-relaxed">
              💡 <strong>안내:</strong> 로그인하면 여행 일정 저장, 북마크, 맞춤 추천 저장 등의 
              기능을 사용할 수 있습니다.
            </p>
          </div>

          {/* Backend Debug Panel */}
          <div className="mt-6">
            <Button
              onClick={() => setShowDebug(!showDebug)}
              variant="outline"
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700"
            >
              <Server className="w-4 h-4 mr-2" />
              {showDebug ? '백엔드 상태 숨기기' : '백엔드 상태 확인'}
            </Button>
            
            {showDebug && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4"
              >
                <BackendHealthCheck />
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}