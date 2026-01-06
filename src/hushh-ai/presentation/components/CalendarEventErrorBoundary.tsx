/**
 * Error Boundary for Calendar Event Card
 * Prevents calendar card errors from crashing the entire message list
 */

import { Component, ReactNode } from 'react';
import { Box, Text } from '@chakra-ui/react';
import { THEME } from '../../core/constants';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class CalendarEventErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('CalendarEventCard error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <Box
          p={4}
          bg="red.50"
          borderRadius={THEME.borderRadius.md}
          borderLeft="4px solid"
          borderLeftColor="red.500"
        >
          <Text fontSize={THEME.fontSizes.sm} color="red.600">
            ⚠️ Failed to display calendar event
          </Text>
        </Box>
      );
    }

    return this.props.children;
  }
}
