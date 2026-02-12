import { Sparkles, Search, User, LogIn, Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";

interface HeaderProps {
  isAuthenticated: boolean;
  userEmail?: string;
  onNavigate: (page: string) => void;
  currentPage: string;
}

export function Header({ isAuthenticated, userEmail, onNavigate, currentPage }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: "home", label: "홈" },
    { id: "search", label: "여행 검색" },
    { id: "attractions", label: "관광지 탐색" },
    { id: "community", label: "커뮤니티" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <motion.div 
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => onNavigate("home")}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
                TravelAI
              </h1>
              <p className="text-xs text-gray-500 hidden md:block">AI 기반 여행 플래너</p>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-2">
            {navItems.map((item) => (
              <Button
                key={item.id}
                variant={currentPage === item.id ? "default" : "ghost"}
                onClick={() => onNavigate(item.id)}
                className={currentPage === item.id ? "bg-indigo-600 hover:bg-indigo-700" : ""}
              >
                {item.label}
              </Button>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            {/* Search Button - Desktop */}
            <Button
              variant="ghost"
              size="icon"
              className="hidden md:flex"
              onClick={() => onNavigate("search")}
            >
              <Search className="w-5 h-5" />
            </Button>

            {/* User Menu */}
            {isAuthenticated ? (
              <Button
                variant="outline"
                onClick={() => onNavigate("profile")}
                className="hidden md:flex items-center gap-2"
              >
                <User className="w-4 h-4" />
                <span className="hidden lg:inline">{userEmail?.split('@')[0] || "프로필"}</span>
              </Button>
            ) : (
              <Button
                onClick={() => onNavigate("auth")}
                className="hidden md:flex bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
              >
                <LogIn className="w-4 h-4 mr-2" />
                로그인
              </Button>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-gray-100 bg-white"
          >
            <div className="container mx-auto px-4 py-4 space-y-2">
              {navItems.map((item) => (
                <Button
                  key={item.id}
                  variant={currentPage === item.id ? "default" : "ghost"}
                  onClick={() => {
                    onNavigate(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full justify-start ${
                    currentPage === item.id ? "bg-indigo-600 hover:bg-indigo-700" : ""
                  }`}
                >
                  {item.label}
                </Button>
              ))}
              <div className="pt-2 border-t border-gray-100">
                {isAuthenticated ? (
                  <Button
                    variant="outline"
                    onClick={() => {
                      onNavigate("profile");
                      setMobileMenuOpen(false);
                    }}
                    className="w-full justify-start"
                  >
                    <User className="w-4 h-4 mr-2" />
                    프로필
                  </Button>
                ) : (
                  <Button
                    onClick={() => {
                      onNavigate("auth");
                      setMobileMenuOpen(false);
                    }}
                    className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
                  >
                    <LogIn className="w-4 h-4 mr-2" />
                    로그인
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
