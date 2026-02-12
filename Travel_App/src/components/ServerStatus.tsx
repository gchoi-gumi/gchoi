import { useEffect, useState } from 'react';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Badge } from './ui/badge';
import { projectId, publicAnonKey } from '../utils/supabase/info';

export function ServerStatus() {
  const [status, setStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const checkServer = async () => {
      try {
        console.log('[ServerStatus] Checking server health...');
        const url = `https://${projectId}.supabase.co/functions/v1/make-server-a8dd3f70/health`;
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
        
        const response = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (response.ok) {
          const data = await response.json();
          console.log('[ServerStatus] ✅ Server is online:', data);
          setStatus('online');
          setRetryCount(0);
        } else {
          console.warn('[ServerStatus] ⚠️ Server returned error:', response.status);
          setStatus('offline');
        }
      } catch (error) {
        console.error('[ServerStatus] ❌ Server check failed:', error);
        setStatus('offline');
        
        // Retry up to 3 times with exponential backoff
        if (retryCount < 3) {
          const delay = Math.pow(2, retryCount) * 1000; // 1s, 2s, 4s
          console.log(`[ServerStatus] Retrying in ${delay}ms...`);
          setTimeout(() => {
            setRetryCount(prev => prev + 1);
          }, delay);
        }
      }
    };

    checkServer();
  }, [retryCount]);

  if (status === 'checking') {
    return (
      <Badge variant="outline" className="gap-2 bg-blue-50 border-blue-300 text-blue-700">
        <Loader2 className="w-3 h-3 animate-spin" />
        서버 연결 확인 중...
      </Badge>
    );
  }

  if (status === 'online') {
    return (
      <Badge className="gap-2 bg-emerald-500 text-white border-0">
        <CheckCircle className="w-3 h-3" />
        서버 연결됨
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className="gap-2 bg-orange-50 border-orange-300 text-orange-700">
      <AlertCircle className="w-3 h-3" />
      서버 연결 실패
    </Badge>
  );
}
