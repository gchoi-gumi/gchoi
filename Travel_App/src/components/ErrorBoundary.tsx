import React from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
          <Card className="max-w-2xl w-full p-8">
            <h1 className="text-2xl font-bold text-red-600 mb-4">오류가 발생했습니다</h1>
            <p className="text-gray-600 mb-4">
              페이지를 표시하는 중 문제가 발생했습니다.
            </p>
            {this.state.error && (
              <div className="bg-red-50 p-4 rounded mb-4 overflow-auto">
                <code className="text-sm text-red-800">
                  {this.state.error.toString()}
                </code>
              </div>
            )}
            <Button 
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
            >
              페이지 새로고침
            </Button>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
