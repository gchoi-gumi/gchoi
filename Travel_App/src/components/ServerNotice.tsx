import { AlertCircle, Info, Server } from 'lucide-react';
import { Alert } from './ui/alert';
import { Badge } from './ui/badge';

export function ServerNotice() {
  return (
    <Alert className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
      <div className="flex items-start gap-3">
        <Server className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h4 className="font-semibold text-blue-900">서버 배포 안내</h4>
            <Badge variant="outline" className="bg-white text-xs">선택사항</Badge>
          </div>
          <p className="text-sm text-blue-800 mb-2">
            현재 앱은 <strong>Mock 데이터 모드</strong>로 작동 중입니다. 모든 기능을 사용할 수 있지만, 실시간 API 데이터는 서버 배포 후 이용 가능합니다.
          </p>
          <div className="bg-white/60 rounded-lg p-3 text-sm space-y-1">
            <p className="text-blue-900"><strong>실시간 기능 활성화:</strong></p>
            <ul className="list-disc list-inside text-blue-700 ml-2 space-y-0.5">
              <li>OpenWeather API → 실시간 날씨 정보</li>
              <li>OpenAI GPT → AI 기반 맞춤 추천</li>
              <li>Google Places → 실제 리뷰 및 평점</li>
              <li>카카오 Map → 정확한 위치 정보</li>
            </ul>
            <p className="mt-2 pt-2 border-t border-blue-200 text-blue-900">
              📖 <strong>배포 가이드:</strong> <code className="bg-blue-100 px-2 py-0.5 rounded text-xs">/SERVER_DEPLOY_GUIDE.md</code> 파일 참조
            </p>
          </div>
        </div>
      </div>
    </Alert>
  );
}
