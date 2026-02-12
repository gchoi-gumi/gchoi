/**
 * Wait for Kakao Maps SDK to be ready
 * SDK should be preloaded in index.html
 */
export function loadKakaoMaps(): Promise<void> {
  // Already available
  if (window.kakao && window.kakao.maps) {
    console.log('[KakaoLoader] ✅ SDK already loaded');
    return Promise.resolve();
  }

  console.log('[KakaoLoader] ⏳ Waiting for SDK...');

  return new Promise((resolve, reject) => {
    let attempts = 0;
    const maxAttempts = 50; // 5 seconds
    
    const checkInterval = setInterval(() => {
      attempts++;

      if (window.kakao && window.kakao.maps) {
        clearInterval(checkInterval);
        console.log(`[KakaoLoader] ✅ SDK loaded successfully after ${attempts * 100}ms`);
        resolve();
      } else if (attempts >= maxAttempts) {
        clearInterval(checkInterval);
        
        // Silently fail - REST API fallback will be used
        // Only log in development
        if (window.location.hostname === 'localhost' || window.location.hostname.includes('figma')) {
          console.log('[KakaoLoader] ℹ️ Using REST API fallback (Figma Make domain changes frequently)');
        }
        
        reject(new Error('Kakao Maps SDK not available'));
      }
    }, 100);
  });
}