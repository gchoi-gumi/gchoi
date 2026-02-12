import { useState, useEffect } from 'react';
import { projectId } from '../utils/supabase/info';
import { Card } from './ui/card';
import { Button } from './ui/button';

export function BackendHealthCheck() {
  const [health, setHealth] = useState<any>(null);
  const [envStatus, setEnvStatus] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-a8dd3f70`;

  const checkHealth = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      const data = await response.json();
      setHealth(data);
      console.log('[Health Check]', data);
    } catch (err) {
      console.error('[Health Check Error]', err);
      setError(err instanceof Error ? err.message : 'Failed to check health');
    } finally {
      setLoading(false);
    }
  };

  const checkEnv = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/debug/env`);
      const data = await response.json();
      setEnvStatus(data);
      console.log('[Environment Check]', data);
    } catch (err) {
      console.error('[Environment Check Error]', err);
      setError(err instanceof Error ? err.message : 'Failed to check environment');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkHealth();
    checkEnv();
  }, []);

  return (
    <Card className="p-6 bg-white/10 backdrop-blur-sm border-white/20">
      <h2 className="text-xl mb-4">백엔드 상태 확인</h2>
      
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold mb-2">API Base URL:</h3>
          <p className="text-sm text-white/70 break-all">{API_BASE_URL}</p>
        </div>

        {error && (
          <div className="p-3 bg-red-500/20 border border-red-500/50 rounded">
            <p className="text-red-200">{error}</p>
          </div>
        )}

        <div>
          <h3 className="font-semibold mb-2">Health Check:</h3>
          {health ? (
            <pre className="p-3 bg-black/20 rounded text-sm overflow-auto">
              {JSON.stringify(health, null, 2)}
            </pre>
          ) : (
            <p className="text-white/50">Loading...</p>
          )}
        </div>

        <div>
          <h3 className="font-semibold mb-2">Environment Variables:</h3>
          {envStatus ? (
            <div className="space-y-2">
              {Object.entries(envStatus).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between p-2 bg-black/20 rounded">
                  <span className="text-sm">{key}:</span>
                  <span className={`text-sm font-semibold ${
                    value === 'SET' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {value === 'SET' ? '✓ SET' : '✗ MISSING'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-white/50">Loading...</p>
          )}
        </div>

        <div className="flex gap-2">
          <Button 
            onClick={checkHealth} 
            disabled={loading}
            variant="outline"
            className="bg-white/10 hover:bg-white/20"
          >
            Refresh Health
          </Button>
          <Button 
            onClick={checkEnv} 
            disabled={loading}
            variant="outline"
            className="bg-white/10 hover:bg-white/20"
          >
            Refresh Env
          </Button>
        </div>
      </div>
    </Card>
  );
}
