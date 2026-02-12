@echo off
chcp 65001 > nul
echo 🚀 배포 전 빌드 테스트를 시작합니다...
echo.

REM Step 1: 의존성 확인
echo 📦 Step 1: 의존성 설치 중...
call npm install
if %errorlevel% neq 0 (
    echo ❌ 의존성 설치 실패
    exit /b 1
)
echo ✅ 의존성 설치 완료
echo.

REM Step 2: 빌드
echo 🔨 Step 2: 프로덕션 빌드 중...
call npm run build
if %errorlevel% neq 0 (
    echo ❌ 빌드 실패
    exit /b 1
)
echo ✅ 빌드 완료
echo.

REM Step 3: 빌드 결과 확인
echo 🔍 Step 3: 빌드 결과 확인 중...
if exist "build" (
    echo ✅ build 폴더 존재
    
    if exist "build\index.html" (
        echo ✅ build\index.html 존재
    ) else (
        echo ❌ build\index.html 없음
        exit /b 1
    )
    
    if exist "build\assets" (
        echo ✅ build\assets 폴더 존재
        dir build /s
    ) else (
        echo ❌ build\assets 폴더 없음
        exit /b 1
    )
) else (
    echo ❌ build 폴더 없음
    exit /b 1
)
echo.

REM Step 4: 완료
echo ✅ 모든 테스트 통과!
echo.
echo 🎉 배포 준비가 완료되었습니다!
echo.
echo 📝 다음 단계:
echo   1. npm run preview - 로컬에서 빌드 결과 미리보기
echo   2. Vercel 또는 Netlify에 배포
echo.
echo 📚 자세한 가이드는 DEPLOY_STEPS.md를 참고하세요
echo.
pause
