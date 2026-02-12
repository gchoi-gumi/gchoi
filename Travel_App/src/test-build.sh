#!/bin/bash

# 배포 전 빌드 테스트 스크립트

echo "🚀 배포 전 빌드 테스트를 시작합니다..."
echo ""

# Step 1: 의존성 확인
echo "📦 Step 1: 의존성 설치 중..."
if npm install; then
    echo "✅ 의존성 설치 완료"
else
    echo "❌ 의존성 설치 실패"
    exit 1
fi
echo ""

# Step 2: 빌드
echo "🔨 Step 2: 프로덕션 빌드 중..."
if npm run build; then
    echo "✅ 빌드 완료"
else
    echo "❌ 빌드 실패"
    exit 1
fi
echo ""

# Step 3: 빌드 결과 확인
echo "🔍 Step 3: 빌드 결과 확인 중..."
if [ -d "build" ]; then
    echo "✅ build 폴더 존재"
    
    if [ -f "build/index.html" ]; then
        echo "✅ build/index.html 존재"
    else
        echo "❌ build/index.html 없음"
        exit 1
    fi
    
    if [ -d "build/assets" ]; then
        echo "✅ build/assets 폴더 존재"
        echo "📊 빌드 크기:"
        du -sh build
        echo "📁 파일 수:"
        find build -type f | wc -l
    else
        echo "❌ build/assets 폴더 없음"
        exit 1
    fi
else
    echo "❌ build 폴더 없음"
    exit 1
fi
echo ""

# Step 4: 미리보기 서버 시작 안내
echo "✅ 모든 테스트 통과!"
echo ""
echo "🎉 배포 준비가 완료되었습니다!"
echo ""
echo "📝 다음 단계:"
echo "  1. npm run preview - 로컬에서 빌드 결과 미리보기"
echo "  2. Vercel 또는 Netlify에 배포"
echo ""
echo "📚 자세한 가이드는 DEPLOY_STEPS.md를 참고하세요"
