import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Button, Result } from 'antd';

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('页面渲染错误:', error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <Result
          status="error"
          title="页面加载出错"
          subTitle={this.state.error.message}
          extra={(
            <Button type="primary" onClick={() => window.location.reload()}>
              刷新页面
            </Button>
          )}
        />
      );
    }
    return this.props.children;
  }
}
