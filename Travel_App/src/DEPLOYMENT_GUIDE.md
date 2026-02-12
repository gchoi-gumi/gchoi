# 🚀 배포 가이드

이 문서는 여행 추천 앱을 Vercel 또는 Netlify에 배포하는 완전한 가이드입니다.

## 📋 배포 전 체크리스트

### 1. Supabase Edge Function 배포 확인
```bash
# Supabase CLI 설치 확인
supabase --version

# 로그인
supabase login

# 프로젝트 연결 (프로젝트 ID 필요)
supabase link --project-ref [YOUR_PROJECT_ID]

# Edge Function 배포
supabase functions deploy make-server-a8dd3f70

# Edge Function 환경 변수 설정
supabase secrets set OPENWEATHER_API_KEY=your_key_here
supabase secrets set OPENAI_API_KEY=your_key_here
supabase secrets set KAKAO_REST_API_KEY=your_key_here
supabase secrets set GOOGLE_PLACES_API_KEY=your_key_here
```

### 2. 필요한 환경 변수 확인
이미 설정된 환경 변수:
- ✅ SUPABASE_URL
- ✅ SUPABASE_ANON_KEY
- ✅ SUPABASE_SERVICE_ROLE_KEY
- ✅ SUPABASE_DB_URL
- ✅ OPENWEATHER_API_KEY
- ✅ OPENAI_API_KEY
- ✅ KAKAO_MAP_API_KEY
- ✅ KAKAO_REST_API_KEY
- ✅ GOOGLE_PLACES_API_KEY

---

## 🌐 Vercel 배포 (권장)

### 단계 1: Vercel 계정 준비
1. https://vercel.com 접속
2. GitHub 계정으로 로그인
3. 프로젝트를 GitHub 저장소에 푸시

### 단계 2: 프로젝트 import
1. Vercel 대시보드에서 "Add New" → "Project" 클릭
2. GitHub 저장소 선택
3. Framework Preset: **Vite** 선택
4. Build Command: `npm run build`
5. Output Directory: `build`

### 단계 3: 환경 변수 설정
**Environment Variables** 섹션에서 다음 변수들을 추가:

```env
# Supabase (프론트엔드용 - 공개 가능)
VITE_SUPABASE_URL=https://[YOUR_PROJECT_ID].supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here

# Kakao Map (프론트엔드용 - 공개 가능)
VITE_KAKAO_JS_KEY=94e86b9b6ddf71039ab09c9902d2d79f
```

**⚠️ 중요**: 
- 프론트엔드 환경 변수는 `VITE_` 접두사가 필요합니다
- `SUPABASE_SERVICE_ROLE_KEY`는 절대 프론트엔드에 노출하지 마세요
- API 키들은 이미 Supabase Edge Function에 설정되어 있습니다

### 단계 4: 배포
1. "Deploy" 버튼 클릭
2. 빌드 완료 대기 (약 2-3분)
3. 배포 완료 후 URL 확인

### 단계 5: 도메인 설정 (선택사항)
1. Vercel 프로젝트 설정 → Domains
2. 커스텀 도메인 추가
3. DNS 설정 (Vercel 가이드 참조)

---

## 🎯 Netlify 배포

### 단계 1: Netlify 계정 준비
1. https://www.netlify.com 접속
2. GitHub 계정으로 로그인

### 단계 2: 프로젝트 연결
1. "Add new site" → "Import an existing project" 클릭
2. GitHub 저장소 선택
3. Build settings:
   - Build command: `npm run build`
   - Publish directory: `build`

### 단계 3: 환경 변수 설정
Site settings → Environment variables:

```env
VITE_SUPABASE_URL=https://[YOUR_PROJECT_ID].supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
VITE_KAKAO_JS_KEY=94e86b9b6ddf71039ab09c9902d2d79f
```

### 단계 4: 배포
1. "Deploy site" 클릭
2. 빌드 완료 대기
3. 배포 완료 후 URL 확인

---

## 🔧 로컬 빌드 테스트

배포 전에 로컬에서 빌드를 테스트하세요:

```bash
# 의존성 설치
npm install

# 프로덕션 빌드
npm run build

# 빌드 결과 미리보기
npm run preview
```

빌드 성공 확인:
- ✅ `build` 폴더 생성
- ✅ `build/index.html` 존재
- ✅ `build/assets` 폴더에 JS/CSS 파일들 존재
- ✅ 미리보기에서 앱이 정상 작동

---

## 🐛 배포 후 문제 해결

### 문제 1: 빈 화면이 나타남
**해결**:
1. 브라우저 콘솔에서 오류 확인
2. Supabase URL/Key 환경 변수 확인
3. `vite.config.ts`의 `base: './'` 설정 확인

### 문제 2: API 호출 실패
**해결**:
1. Supabase Edge Function이 배포되었는지 확인
2. Edge Function URL이 올바른지 확인: `https://[PROJECT_ID].supabase.co/functions/v1/make-server-a8dd3f70`
3. CORS 설정 확인

### 문제 3: 환경 변수 문제
**해결**:
1. Vercel/Netlify에서 환경 변수 재확인
2. `VITE_` 접두사 확인
3. 재배포 (환경 변수 변경 시 필요)

### 문제 4: Kakao Map이 표시되지 않음
**해결**:
1. Kakao Developers에서 도메인 등록
2. 배포된 도메인을 Web 플랫폼에 추가
3. 예: `https://your-app.vercel.app`

---

## 📱 PWA 설정 확인

배포 후 PWA 기능 작동 확인:
1. HTTPS 연결 확인 (Vercel/Netlify는 자동 제공)
2. `/manifest.json` 접근 가능 확인
3. Chrome DevTools → Application → Service Workers 확인
4. "홈 화면에 추가" 기능 테스트

---

## 🔐 보안 체크리스트

배포 전 보안 확인:
- ✅ `SUPABASE_SERVICE_ROLE_KEY`가 프론트엔드에 노출되지 않음
- ✅ API 키들이 Edge Function에만 저장됨
- ✅ CORS 설정이 올바름
- ✅ 환경 변수가 안전하게 관리됨

---

## 📊 배포 후 모니터링

### Vercel
1. Analytics 탭에서 트래픽 확인
2. Logs 탭에서 오류 모니터링
3. Speed Insights로 성능 확인

### Netlify
1. Analytics에서 사용량 확인
2. Deploy logs에서 빌드 로그 확인
3. Functions logs에서 Edge Function 모니터링

### Supabase
1. Dashboard → Logs에서 Edge Function 로그 확인
2. Database → Tables에서 데이터 확인
3. Auth → Users에서 사용자 관리

---

## 🎉 배포 완료!

배포가 완료되었다면:
1. ✅ 메인 페이지가 정상적으로 로드됨
2. ✅ AI 성향 분석이 작동함
3. ✅ 여행지 추천이 작동함
4. ✅ 카카오 맵이 표시됨
5. ✅ 로그인/회원가입이 작동함
6. ✅ 여행 일정 저장이 작동함

모든 기능을 테스트하고, 문제가 있다면 위의 문제 해결 섹션을 참조하세요.

---

## 📞 추가 지원

- Vercel 문서: https://vercel.com/docs
- Netlify 문서: https://docs.netlify.com
- Supabase 문서: https://supabase.com/docs
- Vite 문서: https://vitejs.dev

---

**마지막 업데이트**: 2025-11-11
