import { useState } from 'react';

export default function AppSimpleTest() {
  const [count, setCount] = useState(0);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '24px',
        padding: '48px',
        maxWidth: '600px',
        width: '100%',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        textAlign: 'center'
      }}>
        <div style={{
          width: '80px',
          height: '80px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyCenter: 'center',
          margin: '0 auto 24px',
          fontSize: '40px'
        }}>
          ✨
        </div>
        
        <h1 style={{
          fontSize: '32px',
          marginBottom: '16px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          TravelAI 앱 테스트
        </h1>
        
        <p style={{
          color: '#4a5568',
          fontSize: '16px',
          marginBottom: '32px',
          lineHeight: '1.6'
        }}>
          React가 정상적으로 작동하고 있습니다!
        </p>
        
        <div style={{
          background: '#f7fafc',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '24px'
        }}>
          <p style={{ color: '#2d3748', marginBottom: '16px', fontSize: '18px', fontWeight: '600' }}>
            카운터: {count}
          </p>
          <button
            onClick={() => setCount(count + 1)}
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              padding: '12px 32px',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'transform 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            클릭하기
          </button>
        </div>
        
        <div style={{
          marginTop: '24px',
          paddingTop: '24px',
          borderTop: '1px solid #e2e8f0'
        }}>
          <p style={{ color: '#718096', fontSize: '14px', marginBottom: '12px' }}>
            ✅ React 정상 작동<br/>
            ✅ State 관리 정상<br/>
            ✅ 이벤트 핸들링 정상
          </p>
          
          <div style={{ marginTop: '16px' }}>
            <a href="/index.html" style={{
              color: '#667eea',
              textDecoration: 'none',
              margin: '0 12px',
              fontSize: '14px'
            }}>
              메인 앱으로 이동
            </a>
            <a href="/test-simple.html" style={{
              color: '#667eea',
              textDecoration: 'none',
              margin: '0 12px',
              fontSize: '14px'
            }}>
              상태 확인 페이지
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
