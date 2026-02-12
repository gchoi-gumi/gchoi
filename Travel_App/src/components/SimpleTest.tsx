import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

export function SimpleTest() {
  const [message, setMessage] = useState("테스트 페이지가 정상 작동합니다!");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-8">
      <Card className="max-w-2xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-4">간단 테스트</h1>
        <p className="text-gray-600 mb-6">{message}</p>
        
        <Button 
          onClick={() => setMessage("버튼 클릭 성공!")}
          className="w-full"
        >
          클릭 테스트
        </Button>

        <div className="mt-8 p-4 bg-gray-100 rounded">
          <h2 className="font-semibold mb-2">환경 정보:</h2>
          <ul className="text-sm space-y-1">
            <li>• React: 정상</li>
            <li>• UI Components: 정상</li>
            <li>• 페이지 렌더링: 성공</li>
          </ul>
        </div>
      </Card>
    </div>
  );
}
