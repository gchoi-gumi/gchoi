import { Sparkles, Mail, Github, Twitter, Instagram } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-indigo-950 to-purple-950 text-white mt-20">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  TravelAI
                </h3>
              </div>
            </div>
            <p className="text-gray-300 mb-6 max-w-md leading-relaxed">
              AI 기반 맞춤형 여행 추천 플랫폼. Decision Tree 성향 분석, GPT 연동 추천, 
              실시간 날씨 반영, 전국 관광지 정보를 제공합니다.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors">
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-lg">빠른 링크</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">여행 검색</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">AI 성향 분석</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">관광지 탐색</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">커뮤니티</a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4 text-lg">지원</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">FAQ</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">이용 가이드</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">개인정보 처리방침</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">이용약관</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-400 text-sm">
            © 2024 TravelAI. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <Mail className="w-4 h-4" />
            <a href="mailto:contact@travelai.com" className="hover:text-white transition-colors">
              contact@travelai.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
