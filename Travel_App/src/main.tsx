import './styles/globals.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

console.log('🚀 [main.tsx] Script loaded');

const init = () => {
  console.log('🚀 [main.tsx] DOM ready, initializing...');
  
  try {
    const rootElement = document.getElementById('root');
    
    if (!rootElement) {
      console.error('❌ Root element not found!');
      return;
    }
    
    console.log('✅ [main.tsx] Root element found');
    
    const root = ReactDOM.createRoot(rootElement);
    console.log('✅ [main.tsx] React root created');
    
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    
    console.log('✅ [main.tsx] App render called - SUCCESS!');
  } catch (error) {
    console.error('❌ [main.tsx] Error:', error);
    
    const rootElement = document.getElementById('root');
    if (rootElement) {
      rootElement.innerHTML = `
        <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #fee2e2; padding: 20px; font-family: system-ui;">
          <div style="background: white; padding: 40px; border-radius: 12px; max-width: 600px; border: 2px solid #dc2626; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
            <h1 style="color: #dc2626; margin: 0 0 16px; font-size: 24px;">❌ 초기화 실패</h1>
            <p style="color: #6b7280; margin-bottom: 16px;">앱을 시작하는 중 오류가 발생했습니다.</p>
            <pre style="background: #f3f4f6; padding: 16px; border-radius: 8px; overflow: auto; font-size: 12px; max-height: 300px;">${error instanceof Error ? error.stack : String(error)}</pre>
            <button onclick="location.reload()" style="margin-top: 16px; padding: 12px 24px; background: #3b82f6; color: white; border: none; border-radius: 8px; cursor: pointer; font-family: system-ui; font-weight: 600;">
              새로고침
            </button>
          </div>
        </div>
      `;
    }
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
