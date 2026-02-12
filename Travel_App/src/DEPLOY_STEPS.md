# 🚀 바로 배포하기 - 단계별 가이드

## 현재 프로젝트 정보
- **프로젝트 이름**: 여행 추천 앱 (TravelAI)
- **Supabase Project ID**: `stalcrpbrdwtjqamnenx`
- **Backend URL**: `https://stalcrpbrdwtjqamnenx.supabase.co/functions/v1/make-server-a8dd3f70`

---

## ⚡ 빠른 배포 (Vercel 권장)

### 1️⃣ GitHub에 코드 푸시

```bash
# Git 초기화 (아직 안했다면)
git init

# 모든 파일 추가
git add .

# 커밋
git commit -m "Initial commit - Travel recommendation app"

# GitHub 저장소 생성 후 연결
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# 푸시
git push -u origin main
```

### 2️⃣ Vercel에서 배포

1. **Vercel 접속**: https://vercel.com
2. **로그인**: GitHub 계정으로 로그인
3. **Import Project**:
   - "Add New" → "Project" 클릭
   - GitHub 저장소 선택
   - "Import" 클릭

4. **설정 확인**:
   ```
   Framework Preset: Vite
   Build Command: npm run build
   Output Directory: build
   Install Command: npm install
   ```

5. **환경 변수 추가**:
   ```
   VITE_SUPABASE_URL = https://stalcrpbrdwtjqamnenx.supabase.co
   VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN0YWxjcnBicmR3dGpxYW1uZW54Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyMzM2MTgsImV4cCI6MjA3NzgwOTYxOH0.gWKmg4frUai5DHETrOUqTHcGPzJe6ELfEBXQrrrxAHM
   VITE_KAKAO_JS_KEY = 94e86b9b6ddf71039ab09c9902d2d79f
   ```

6. **Deploy** 버튼 클릭!

7. **대기**: 2-3분 후 배포 완료

8. **URL 확인**: `https://your-app-name.vercel.app`

---

## 🎯 Netlify로 배포

### 1️⃣ Netlify Drop (가장 쉬운 방법)

```bash
# 로컬에서 빌드
npm install
npm run build

# build 폴더를 https://app.netlify.com/drop에 드래그 앤 드롭
```

### 2️⃣ GitHub 연동 배포

1. **Netlify 접속**: https://app.netlify.com
2. **로그인**: GitHub 계정으로 로그인
3. **Import Project**:
   - "Add new site" → "Import an existing project"
   - GitHub 저장소 선택

4. **Build settings**:
   ```
   Build command: npm run build
   Publish directory: build
   ```

5. **환경 변수 추가** (Site settings → Environment variables):
   ```
   VITE_SUPABASE_URL = https://stalcrpbrdwtjqamnenx.supabase.co
   VITE_SUPABASE_ANON_KEY = [위의 키]
   VITE_KAKAO_JS_KEY = 94e86b9b6ddf71039ab09c9902d2d79f
   ```

6. **Deploy site** 클릭!

---

## ✅ 배포 후 체크리스트

### 1. 기본 기능 확인
- [ ] 메인 페이지가 로드됨
- [ ] 검색창이 작동함
- [ ] AI 성향 분석 시작 버튼이 작동함
- [ ] 관광지 둘러보기가 작동함

### 2. API 연결 확인
- [ ] OpenWeather API: 날씨 정보 표시
- [ ] OpenAI API: GPT 추천 작동
- [ ] Kakao REST API: 장소 검색 작동
- [ ] Google Places API: 장소 정보 표시

### 3. 인증 기능 확인
- [ ] 회원가입 작동
- [ ] 로그인 작동
- [ ] 로그아웃 작동
- [ ] 프로필 페이지 접근

### 4. 주요 기능 확인
- [ ] 여행 성향 분석 완료
- [ ] 맞춤형 추천 생성
- [ ] 경로 생성 및 지도 표시
- [ ] 일정 저장 (로그인 필요)
- [ ] 북마크 추가/삭제

---

## 🔧 배포 후 설정

### Kakao Map 도메인 등록
1. https://developers.kakao.com 접속
2. 내 애플리케이션 → 앱 선택
3. 플랫폼 → Web 플랫폼
4. **배포된 도메인 추가**:
   ```
   https://your-app.vercel.app
   또는
   https://your-app.netlify.app
   ```
5. 저장

### Supabase Edge Function 확인
```bash
# Supabase CLI 설치
npm install -g supabase

# 로그인
supabase login

# 프로젝트 연결
supabase link --project-ref stalcrpbrdwtjqamnenx

# Edge Function 상태 확인
supabase functions list

# Edge Function이 없다면 배포
supabase functions deploy make-server-a8dd3f70
```

### Edge Function 환경 변수 설정
```bash
# Supabase 대시보드에서 설정하거나 CLI 사용
supabase secrets set OPENWEATHER_API_KEY=your_key_here
supabase secrets set OPENAI_API_KEY=your_key_here
supabase secrets set KAKAO_REST_API_KEY=your_key_here
supabase secrets set GOOGLE_PLACES_API_KEY=your_key_here
```

---

## 🐛 문제 해결

### "Failed to fetch" 오류
**원인**: Edge Function이 배포되지 않았거나 환경 변수가 없음
**해결**: 
1. Supabase 대시보드 확인
2. Edge Function 재배포
3. 환경 변수 확인

### 빈 화면
**원인**: 환경 변수가 없거나 잘못됨
**해결**:
1. Vercel/Netlify 환경 변수 확인
2. `VITE_` 접두사 확인
3. 재배포

### Kakao Map 오류
**원인**: 도메인이 등록되지 않음
**해결**:
1. Kakao Developers에서 도메인 등록
2. 배포된 URL을 정확히 입력
3. `http://` 또는 `https://` 포함

### API 호출 실패
**원인**: CORS 또는 API 키 문제
**해결**:
1. 브라우저 콘솔에서 오류 확인
2. Supabase Edge Function 로그 확인
3. API 키 유효성 확인

---

## 📊 성능 최적화 (선택사항)

### 이미지 최적화
- Unsplash 이미지는 자동으로 최적화됨
- 추가 이미지는 WebP 포맷 권장

### 코드 스플리팅
- Vite가 자동으로 처리
- 필요시 lazy loading 추가

### PWA 캐싱
- Service Worker가 자동으로 작동
- 오프라인 기능 지원

---

## 🎉 배포 완료!

축하합니다! 앱이 성공적으로 배포되었습니다.

**다음 단계**:
1. 🔗 친구들과 링크 공유
2. 📱 모바일에서 "홈 화면에 추가"
3. 📊 Vercel/Netlify Analytics로 사용량 모니터링
4. 🚀 계속 기능 추가 및 개선

**배포된 URL**:
- Vercel: `https://[your-app-name].vercel.app`
- Netlify: `https://[your-app-name].netlify.app`

---

## 📞 지원이 필요하신가요?

**공식 문서**:
- Vercel: https://vercel.com/docs
- Netlify: https://docs.netlify.com
- Supabase: https://supabase.com/docs
- Vite: https://vitejs.dev

**커뮤니티**:
- Vercel Discord
- Netlify Community
- Supabase Discord

---

**마지막 업데이트**: 2025-11-11  
**프로젝트 버전**: 1.0.0
