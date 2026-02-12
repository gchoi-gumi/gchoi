import { useState, useEffect } from "react";
import { Search, Sparkles, Brain, ArrowRight, Map, TrendingUp, Compass, Globe, Zap, Star, Heart, MapPin, Calendar, Users, Award, ChevronRight, Navigation } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { motion } from "motion/react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { ParticlesBackground } from "./ParticlesBackground";

interface HomePageProps {
  isAuthenticated: boolean;
  userEmail?: string;
  onNavigate: (page: string) => void;
  onLocationSelect?: (location: string) => void;
}

export function HomePage({ isAuthenticated, userEmail, onNavigate, onLocationSelect }: HomePageProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    if (searchQuery.trim() && onLocationSelect) {
      onLocationSelect(searchQuery);
    }
    onNavigate("search");
  };

  const handleStartSurvey = () => {
    if (searchQuery.trim() && onLocationSelect) {
      onLocationSelect(searchQuery);
    }
    onNavigate("decision-tree-survey");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-teal-50">
      {/* Particles Background */}
      <ParticlesBackground particleCount={60} />
      
      {/* Header */}
      <Header 
        isAuthenticated={isAuthenticated}
        userEmail={userEmail || ""}
        onNavigate={onNavigate}
        currentPage="home"
      />

      {/* Hero Section - Full Screen */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1678649361912-c73aa0be18a1?w=1920"
            alt="Seoul Night Cityscape"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/50 via-blue-900/40 to-teal-900/50"></div>
          <div className="absolute inset-0 bg-black/20"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl text-center py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-8"
            >
              <span className="inline-flex items-center glass-cyan text-white px-6 py-3 rounded-full shadow-glow hover-glow cursor-default">
                <Sparkles className="w-5 h-5 mr-2 animate-pulse" />
                AI 기반 맞춤형 여행 플래너
              </span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-white mb-6 leading-tight max-w-5xl mx-auto drop-shadow-2xl"
            >
              당신만을 위한<br />
              <span className="text-gradient-animated inline-block">
                특별한 여행
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg sm:text-xl md:text-2xl text-white/90 mb-8 md:mb-12 max-w-3xl mx-auto leading-relaxed"
            >
              AI가 분석한 나의 여행 성향으로 최적의 코스를 추천받으세요
            </motion.p>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="max-w-3xl mx-auto mb-6 md:mb-8 px-2"
            >
              <div className="glass rounded-2xl shadow-premium p-2 md:p-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 md:gap-3 hover-lift">
                <div className="flex items-center flex-1 px-2">
                  <Search className="w-5 h-5 md:w-6 md:h-6 text-cyan-600 mr-3" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="어디로 떠나시나요?"
                    className="border-0 flex-1 text-base md:text-lg placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
                  />
                </div>
                <Button
                  onClick={handleSearch}
                  size="lg"
                  className="gradient-ocean hover:shadow-glow text-white px-6 md:px-8 rounded-xl h-12 md:h-auto transition-all duration-300"
                >
                  검색
                </Button>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center px-4"
            >
              <Button
                size="lg"
                onClick={handleStartSurvey}
                className="group glass hover:shadow-glow text-cyan-600 h-14 md:h-16 px-6 md:px-10 text-base md:text-lg transition-all duration-300 hover:scale-105"
              >
                <Brain className="w-5 h-5 mr-2" />
                <span className="hidden sm:inline">AI 성향 분석 시작</span>
                <span className="sm:hidden">성향 분석 시작</span>
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => onNavigate("attractions")}
                className="h-14 md:h-16 px-6 md:px-10 text-base md:text-lg glass-cyan border-2 border-cyan-400/30 text-white hover:shadow-glow-teal transition-all duration-300"
              >
                <Globe className="w-5 h-5 mr-2" />
                관광지 둘러보기
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="mt-10 md:mt-16 flex flex-wrap justify-center gap-4 md:gap-8 text-white/90 text-sm md:text-base"
            >
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 md:w-5 md:h-5 text-cyan-300" />
                <span>AI 맞춤 추천</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 md:w-5 md:h-5 text-cyan-300" />
                <span>전국 관광지 정보</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 md:w-5 md:h-5 text-cyan-300" />
                <span>100% 무료</span>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2"
          >
            <div className="w-1.5 h-1.5 bg-white/70 rounded-full"></div>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="relative py-24 bg-gradient-to-b from-cyan-50 via-blue-50 to-teal-50 overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-400 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl mb-6">
              <span className="text-gradient-ocean">
                왜 TravelAI 인가요?
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              AI 기술로 당신에게 딱 맞는 여행을 제공합니다
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {[
              {
                icon: Brain,
                title: "AI 성향 분석",
                description: "간단한 질문으로 당신의 여행 스타일을 분석합니다",
                gradient: "from-blue-500 to-cyan-500",
                stat: "95% 정확도"
              },
              {
                icon: Sparkles,
                title: "GPT 맞춤 추천",
                description: "AI가 개인화된 여행 코스를 추천합니다",
                gradient: "from-cyan-500 to-teal-500",
                stat: "10만+ 추천"
              },
              {
                icon: Zap,
                title: "실시간 날씨",
                description: "날씨에 최적화된 여행 일정을 계획합니다",
                gradient: "from-teal-500 to-emerald-500",
                stat: "실시간 업데이트"
              },
              {
                icon: Globe,
                title: "전국 관광지",
                description: "17개 시도 50,000여 관광지 정보를 제공합니다",
                gradient: "from-emerald-500 to-green-500",
                stat: "50,000+ 장소"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group"
              >
                <div className="relative glass p-8 rounded-3xl shadow-premium hover:shadow-glow transition-all duration-300 h-full hover-lift flex flex-col">
                  <div className={`w-16 h-16 mb-6 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl mb-3 text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed mb-6 flex-grow min-h-[4.5rem]">{feature.description}</p>
                  <div className="mt-auto">
                    <div className={`inline-block text-sm px-4 py-2 rounded-full bg-gradient-to-r ${feature.gradient} text-white shadow-lg font-medium`}>
                      {feature.stat}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Actions Section */}
      <section className="py-24 bg-gradient-to-br from-cyan-50 via-blue-50 to-purple-50">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl mb-6">
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                지금 바로 시작하세요
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              간편하게 여행을 계획하세요
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Integrated Travel Planner - MAIN FEATURE */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              onClick={() => onNavigate("decision-tree-survey")}
              className="cursor-pointer group lg:col-span-2"
            >
              <div className="relative bg-gradient-to-br from-purple-500 to-pink-500 p-8 md:p-10 rounded-3xl shadow-2xl hover:shadow-[0_20px_60px_rgba(168,85,247,0.4)] transition-all duration-300 border-2 border-purple-300 h-full">
                <div className="absolute top-4 right-4">
                  <Badge className="bg-white text-purple-600 border-0">
                    ⭐ 올인원
                  </Badge>
                </div>
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="flex gap-4 mb-4 md:mb-0">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <Brain className="w-8 h-8 text-white" />
                    </div>
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 delay-75">
                      <Sparkles className="w-8 h-8 text-white" />
                    </div>
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 delay-100">
                      <Navigation className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <div className="flex-1 text-white">
                    <h3 className="mb-4 text-white">AI 통합 여행 플래너</h3>
                    <p className="text-white/90 mb-6 leading-relaxed">
                      <strong>설문 → AI 추천 → 경로 생성</strong>까지 한번에!<br/>
                      성향 분석 후 맞춤 여행지를 추천하고 최적 경로를 자동 생성합니다
                    </p>
                    <div className="flex flex-wrap gap-2 mb-6">
                      <Badge className="bg-white/20 text-white border-white/30">
                        성향 분석
                      </Badge>
                      <Badge className="bg-white/20 text-white border-white/30">
                        AI 추천
                      </Badge>
                      <Badge className="bg-white/20 text-white border-white/30">
                        경로 최적화
                      </Badge>
                      <Badge className="bg-white/20 text-white border-white/30">
                        자동화
                      </Badge>
                    </div>
                    <div className="flex items-center text-white group-hover:translate-x-2 transition-transform">
                      <span className="mr-2">지금 바로 시작하기</span>
                      <ChevronRight className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Explore Attractions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              onClick={() => onNavigate("attractions")}
              className="cursor-pointer group"
            >
              <div className="relative bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-green-200 hover:border-green-400 h-full flex flex-col">
                <div className="w-16 h-16 mb-6 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Compass className="w-8 h-8 text-white" />
                </div>
                <h3 className="mb-4 text-gray-900">관광지 직접 탐색</h3>
                <p className="text-gray-600 mb-6 leading-relaxed flex-1">
                  전국 50,000여 관광지를 인기장소와 숨은명소로 분류해 제공합니다
                </p>
                <div className="flex items-center text-green-600 group-hover:translate-x-2 transition-transform">
                  <span className="mr-2">탐색하기</span>
                  <ChevronRight className="w-5 h-5" />
                </div>
              </div>
            </motion.div>

            {/* Smart Route Planning */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              onClick={() => onNavigate("smartroute")}
              className="cursor-pointer group"
            >
              <div className="relative bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-blue-200 hover:border-blue-400 h-full flex flex-col">
                <div className="w-16 h-16 mb-6 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Map className="w-8 h-8 text-white" />
                </div>
                <h3 className="mb-4 text-gray-900">직접 경로 만들기</h3>
                <p className="text-gray-600 mb-6 leading-relaxed flex-1">
                  원하는 장소를 선택하여 나만의 여행 경로를 만드세요
                </p>
                <div className="flex items-center text-blue-600 group-hover:translate-x-2 transition-transform">
                  <span className="mr-2">경로 생성</span>
                  <ChevronRight className="w-5 h-5" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Popular Destinations Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl mb-6">
              <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                인기 여행지
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              많은 여행자들이 선택한 대한민국의 아름다운 도시들
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {[
              {
                name: "서울",
                description: "현대와 전통이 공존하는 대한민국의 수도",
                image: "https://images.unsplash.com/photo-1601927589304-f494347d5e16?w=800",
                emoji: "🏙️"
              },
              {
                name: "제주",
                description: "신비로운 자연과 아름다운 해변의 섬",
                image: "https://images.unsplash.com/photo-1681222410531-9d1b1e3012d3?w=800",
                emoji: "🌴"
              },
              {
                name: "부산",
                description: "활기찬 해양도시와 맛있는 해산물",
                image: "https://images.unsplash.com/photo-1717178319504-2519647dfc97?w=800",
                emoji: "🌊"
              }
            ].map((destination, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group cursor-pointer"
                onClick={() => onNavigate("search")}
              >
                <div className="relative overflow-hidden rounded-3xl shadow-xl">
                  <div className="relative h-80">
                    <ImageWithFallback
                      src={destination.image}
                      alt={destination.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                    
                    <div className="absolute inset-0 flex flex-col justify-end p-8">
                      <div className="text-5xl mb-4">{destination.emoji}</div>
                      <h3 className="text-3xl text-white mb-2">{destination.name}</h3>
                      <p className="text-white/80 mb-4">{destination.description}</p>
                      <div className="flex items-center text-white group-hover:text-cyan-300 transition-colors">
                        <span className="mr-2">여행 계획하기</span>
                        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mt-12"
          >
            <Button
              size="lg"
              variant="outline"
              onClick={() => onNavigate("attractions")}
              className="h-14 px-10 text-lg border-2 border-blue-600 text-blue-600 hover:bg-blue-50"
            >
              더 많은 여행지 보기
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-24 bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl mb-6">
              <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                이용 방법
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              3단계로 완성하는 나만의 여행
            </p>
          </motion.div>

          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  step: "1",
                  icon: Brain,
                  title: "성향 분석",
                  description: "간단한 질문으로 여행 스타일을 분석합니다",
                  color: "from-blue-500 to-cyan-500"
                },
                {
                  step: "2",
                  icon: Search,
                  title: "여행지 선택",
                  description: "지역을 검색하거나 AI 추천 장소를 선택하세요",
                  color: "from-cyan-500 to-teal-500"
                },
                {
                  step: "3",
                  icon: Map,
                  title: "코스 생성",
                  description: "날씨와 평점을 고려한 최적 경로를 생성합니다",
                  color: "from-teal-500 to-emerald-500"
                }
              ].map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className="relative"
                >
                  {/* Card Container */}
                  <div className="group bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 h-full flex flex-col items-center text-center hover:-translate-y-2">
                    {/* Step Number Badge */}
                    <div className={`w-16 h-16 mb-6 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center text-white text-2xl shadow-xl group-hover:scale-110 transition-transform duration-300`}>
                      {step.step}
                    </div>
                    
                    {/* Icon */}
                    <div className={`w-20 h-20 mb-6 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform duration-300`}>
                      <step.icon className="w-10 h-10 text-white" />
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-2xl mb-4 text-gray-900">{step.title}</h3>
                    
                    {/* Description */}
                    <p className="text-gray-600 leading-relaxed flex-grow">{step.description}</p>
                  </div>
                  
                  {/* Arrow Connector - only show between cards on desktop */}
                  {index < 2 && (
                    <div className="hidden md:block absolute top-20 -right-4 z-10">
                      <ChevronRight className="w-8 h-8 text-cyan-400" />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 text-white relative overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1648900451337-78cbbbd7383c?w=1920"
            alt="Seoul Sunset"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 via-cyan-600/20 to-teal-600/30"></div>
          <div className="absolute inset-0 bg-black/15"></div>
        </div>
        
        <div className="container mx-auto px-4 md:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <div className="text-7xl mb-8">✨</div>
            <h2 className="text-4xl md:text-5xl lg:text-7xl mb-8 leading-tight">
              지금 바로 시작하세요
            </h2>
            <p className="text-xl md:text-2xl mb-12 opacity-90 leading-relaxed max-w-2xl mx-auto">
              AI가 추천하는 맞춤형 여행 코스로<br />
              잊지 못할 추억을 만들어보세요
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => onNavigate("survey")}
                className="group bg-white text-blue-600 hover:bg-gray-100 h-16 px-12 text-lg shadow-2xl transition-all duration-300 hover:scale-105"
              >
                <Sparkles className="w-6 h-6 mr-2" />
                무료로 시작하기
                <ArrowRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => onNavigate("attractions")}
                className="h-16 px-12 text-lg bg-white/10 backdrop-blur-md border-2 border-white/50 text-white hover:bg-white/20 transition-all duration-300"
              >
                <Globe className="w-6 h-6 mr-2" />
                관광지 둘러보기
              </Button>
            </div>
            <p className="mt-10 text-lg opacity-80">
              ✨ 회원가입 없이 바로 시작 · 완전 무료 · AI 맞춤 추천
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
      
      {/* Developer Tools - Hidden Button */}
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => onNavigate("kakao-map-test")}
          size="sm"
          variant="outline"
          className="opacity-20 hover:opacity-100 transition-opacity bg-white/80 backdrop-blur-sm"
          title="Kakao Map 테스트"
        >
          🗺️ Test
        </Button>
      </div>
    </div>
  );
}