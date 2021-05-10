/* eslint-disable no-unused-vars */
import React, { Component, PropsWithChildren } from 'react';

type State = {
  hasError: boolean;
};

// https://reactjs.org/docs/error-boundaries.html
class ErrorBoundary extends Component<PropsWithChildren<unknown>, State> {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // TODO: send to Sentry
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
