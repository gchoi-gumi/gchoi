# 서버 배포 가이드 📡

## 현재 상태
- ✅ API 키 모두 설정 완료
- ✅ 서버 코드 구현 완료
- ⏳ **서버 배포 필요**

## 서버가 필요한 이유
앱의 다음 기능들이 서버를 통해 작동합니다:
- 🌤️ 실시간 날씨 정보 (OpenWeather API)
- 🤖 GPT 기반 AI 추천 (OpenAI API)
- 🗺️ 장소 검색 및 정보 (Google Places API)
- 📍 위치 정보 변환 (카카오 Map API)

## 배포 방법

### 옵션 1: Supabase CLI 사용 (권장)
```bash
# 1. Supabase CLI 설치
npm install -g supabase

# 2. 프로젝트 초기화
supabase init

# 3. Supabase 로그인
supabase login

# 4. Edge Function 배포
supabase functions deploy server

# 5. 환경 변수 설정 (이미 완료됨)
# - OPENWEATHER_API_KEY
# - OPENAI_API_KEY
# - KAKAO_MAP_API_KEY  
# - GOOGLE_PLACES_API_KEY
```

### 옵션 2: Supabase Dashboard 사용
1. [Supabase Dashboard](https://supabase.com/dashboard) 접속
2. 프로젝트 선택
3. Edge Functions 메뉴로 이동
4. `/supabase/functions/server` 폴더의 코드를 복사하여 새 함수 생성
5. Deploy 버튼 클릭

## 배포 확인
배포가 완료되면 다음 URL에 접속하여 확인:
```
https://[YOUR-PROJECT-ID].supabase.co/functions/v1/make-server-80cc3277/health
```

응답이 `{"status":"ok"}`이면 성공! 🎉

## 배포 전 임시 모드
서버가 배포되기 전까지 앱은 **Mock 데이터 모드**로 작동합니다:
- 날씨: 기본 날씨 데이터 표시
- 추천: Fallback 추천 제공
- 장소: 샘플 장소 표시

모든 핵심 기능은 작동하지만, 실시간 데이터는 서버 배포 후 사용 가능합니다.

## 문제 해결

### "Failed to fetch" 에러
- 서버가 아직 배포되지 않았습니다
- Mock 데이터로 임시 작동 중입니다
- 위의 배포 가이드를 따라주세요

### CORS 에러
- 서버 코드에 CORS 설정이 이미 포함되어 있습니다
- 재배포 후 캐시 클리어를 시도해보세요

### 401 Unauthorized 에러
- API 키가 유효하지 않거나 활성화되지 않았습니다
- OpenWeather 새 키는 활성화에 최대 2시간 소요됩니다

## 참고 문서
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)
- [Supabase CLI](https://supabase.com/docs/guides/cli)
