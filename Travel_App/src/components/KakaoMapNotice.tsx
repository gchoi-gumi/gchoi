import { AlertCircle, CheckCircle2, Globe, Copy, ExternalLink } from "lucide-react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { toast } from "sonner@2.0.3";
import { useState } from "react";

interface KakaoMapNoticeProps {
  currentDomain: string;
}

export function KakaoMapNotice({ currentDomain }: KakaoMapNoticeProps) {
  const isFigmaPreview = currentDomain.includes('figma');
  const isLocalhost = currentDomain.includes('localhost');
  const [copied, setCopied] = useState(false);
  
  const copyDomain = () => {
    // Try modern clipboard API first
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(currentDomain)
        .then(() => {
          setCopied(true);
          toast.success('도메인이 복사되었습니다!');
          setTimeout(() => setCopied(false), 2000);
        })
        .catch(() => {
          // Fallback to legacy method
          fallbackCopyTextToClipboard(currentDomain);
        });
    } else {
      // Use fallback method
      fallbackCopyTextToClipboard(currentDomain);
    }
  };

  const fallbackCopyTextToClipboard = (text: string) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.width = "2em";
    textArea.style.height = "2em";
    textArea.style.padding = "0";
    textArea.style.border = "none";
    textArea.style.outline = "none";
    textArea.style.boxShadow = "none";
    textArea.style.background = "transparent";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      const successful = document.execCommand('copy');
      if (successful) {
        setCopied(true);
        toast.success('도메인이 복사되었습니다!');
        setTimeout(() => setCopied(false), 2000);
      } else {
        toast.error('복사 실패. 수동으로 복사해주세요.');
      }
    } catch (err) {
      console.error('Fallback: Oops, unable to copy', err);
      toast.error('복사 실패. 수동으로 복사해주세요.');
    }
    
    document.body.removeChild(textArea);
  };

  if (!isFigmaPreview && !isLocalhost) {
    // Production - show nothing
    return null;
  }

  return (
    <Card className="p-4 mb-4 border-blue-200 bg-blue-50">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          <AlertCircle className="w-5 h-5 text-blue-600" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold text-blue-900">
              🗺️ Kakao Map 설정 필요
            </h3>
            <Badge variant="outline" className="text-xs border-blue-300 text-blue-700">
              {isFigmaPreview ? 'Figma Make' : 'Localhost'}
            </Badge>
          </div>
          
          <p className="text-sm text-blue-800 mb-3">
            지도 기능을 사용하려면 아래 도메인을 Kakao Developers에 등록하세요.
          </p>

          {/* Current Domain */}
          <div className="bg-white rounded-lg p-3 mb-3 border border-blue-200">
            <p className="text-xs text-blue-700 mb-1.5 font-medium">
              📍 현재 도메인 (클릭하여 복사)
            </p>
            <div 
              onClick={copyDomain}
              className="flex items-center justify-between gap-2 bg-blue-50 p-2.5 rounded cursor-pointer hover:bg-blue-100 transition-colors group"
            >
              <code className="text-xs text-blue-900 break-all flex-1">
                {currentDomain}
              </code>
              <Button
                size="sm"
                variant="ghost"
                className="flex-shrink-0 h-7 px-2 text-blue-600 hover:text-blue-700 hover:bg-blue-200"
              >
                {copied ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Registration Steps */}
          <div className="bg-white/80 rounded-lg p-3 mb-3">
            <p className="text-xs font-medium text-blue-900 mb-2">
              🔧 도메인 등록 방법 (2분 소요)
            </p>
            <ol className="space-y-1.5 text-xs text-blue-800">
              <li className="flex items-start gap-2">
                <span className="font-semibold text-blue-600 flex-shrink-0">1.</span>
                <span>
                  <a 
                    href="https://developers.kakao.com/console/app" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline inline-flex items-center gap-1"
                  >
                    Kakao Developers
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  에 접속하여 로그인
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-semibold text-blue-600 flex-shrink-0">2.</span>
                <span>"내 애플리케이션" → 앱 선택 (또는 새로 생성)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-semibold text-blue-600 flex-shrink-0">3.</span>
                <span>좌측 메뉴 "플랫폼" → "Web 플랫폼 등록" 클릭</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-semibold text-blue-600 flex-shrink-0">4.</span>
                <span>위의 도메인 복사하여 붙여넣기 후 저장</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-semibold text-blue-600 flex-shrink-0">5.</span>
                <span className="font-semibold text-green-700">이 페이지 새로고침! (F5)</span>
              </li>
            </ol>
          </div>

          {/* JavaScript Key Info */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-3">
            <p className="text-xs text-amber-900 mb-1">
              <strong>📝 사용 중인 JavaScript 키:</strong>
            </p>
            <code className="text-xs text-amber-800 block bg-amber-100/50 p-2 rounded">
              94e86b9b6ddf71039ab09c9902d2d79f
            </code>
            <p className="text-xs text-amber-700 mt-2">
              다른 키를 사용하려면 코드 수정이 필요합니다.
            </p>
          </div>

          {/* Success Message */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-green-800">
                <p className="font-semibold mb-1">✅ 등록 완료 후</p>
                <p className="text-green-700">
                  페이지를 새로고침하면 Kakao Map이 정상적으로 표시됩니다!
                  {isFigmaPreview && ' (Figma Make에서 도메인이 변경되면 다시 등록해야 합니다)'}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Action */}
          <div className="mt-3 flex gap-2">
            <Button
              size="sm"
              onClick={copyDomain}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Copy className="w-3.5 h-3.5 mr-1.5" />
              도메인 복사
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => window.location.reload()}
              className="flex-1 border-blue-300 text-blue-700 hover:bg-blue-100"
            >
              새로고침
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}