/**
 * Calendar Event Card Component
 * Displays calendar event information in a rich card format
 */
import { Box, VStack, HStack, Text, Button, Icon } from '@chakra-ui/react';
import { CalendarEventMetadata } from '../../domain/entities';
import { THEME } from '../../core/constants';

interface CalendarEventCardProps {
  event: CalendarEventMetadata;
}

export function CalendarEventCard({ event }: CalendarEventCardProps) {
  // Validate event data
  try {
    if (!event?.id || !event?.summary) {
      throw new Error('Invalid event data');
    }

    const startDate = new Date(event.startTime);
    const endDate = new Date(event.endTime);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      throw new Error('Invalid date format');
    }
  } catch (error) {
    return (
      <Box p={4} bg="red.50" borderRadius={THEME.borderRadius.md}>
        <Text fontSize={THEME.fontSizes.sm} color="red.600">
          ⚠️ Calendar event data is incomplete or invalid
        </Text>
      </Box>
    );
  }

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTimeOnly = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString('en-IN', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <Box
      p={{ base: 3, md: 4 }}
      bg="blue.50"
      borderLeft="4px solid"
      borderLeftColor="blue.500"
      borderRadius={THEME.borderRadius.md}
      mb={2}
      w="full"
      maxW={{ base: "100%", sm: "380px", md: "400px", lg: "450px" }}
      minW={{ base: "280px", md: "350px" }}
    >
      <VStack align="stretch" spacing={3}>
        {/* Event Title */}
        <HStack spacing={2}>
          <Icon viewBox="0 0 24 24" boxSize={{ base: 5, md: 6 }} color="blue.600">
            <path
              fill="currentColor"
              d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V9h14v10zM7 11h5v5H7v-5z"
            />
          </Icon>
          <VStack align="start" spacing={0} flex={1} minW={0}>
            <Text
              fontWeight="bold"
              fontSize={{ base: THEME.fontSizes.md, md: THEME.fontSizes.lg }}
              color={THEME.colors.textPrimary}
              noOfLines={2}
              wordBreak="break-word"
            >
              {event.summary}
            </Text>
          </VStack>
        </HStack>

        {/* Date and Time */}
        <HStack spacing={2}>
          <Icon viewBox="0 0 24 24" boxSize={4} color="gray.600">
            <path
              fill="currentColor"
              d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.2 3.2.8-1.3-4.5-2.7V7z"
            />
          </Icon>
          <VStack align="start" spacing={0}>
            <Text fontSize={THEME.fontSizes.sm} color={THEME.colors.textSecondary}>
              {formatDate(event.startTime)}
            </Text>
            <Text fontSize={THEME.fontSizes.sm} color={THEME.colors.textSecondary}>
              {formatTimeOnly(event.startTime)} - {formatTimeOnly(event.endTime)}
            </Text>
          </VStack>
        </HStack>

        {/* Description */}
        {event.description && (
          <Text fontSize={THEME.fontSizes.sm} color={THEME.colors.textSecondary}>
            {event.description}
          </Text>
        )}

        {/* Location */}
        {event.location && (
          <HStack spacing={2}>
            <Icon viewBox="0 0 24 24" boxSize={4} color="gray.600">
              <path
                fill="currentColor"
                d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
              />
            </Icon>
            <Text fontSize={THEME.fontSizes.sm} color={THEME.colors.textSecondary}>
              {event.location}
            </Text>
          </HStack>
        )}

        {/* Attendees */}
        {event.attendees && event.attendees.length > 0 && (
          <VStack align="start" spacing={1}>
            <Text fontSize={THEME.fontSizes.xs} color={THEME.colors.textSecondary}>
              Attendees:
            </Text>
            <HStack spacing={1} flexWrap="wrap">
              {event.attendees.slice(0, 3).map((email, i) => (
                <Text
                  key={i}
                  fontSize={THEME.fontSizes.xs}
                  color={THEME.colors.textPrimary}
                  noOfLines={1}
                  maxW={{ base: "120px", md: "200px" }}
                >
                  {email}{i < Math.min(event.attendees!.length, 3) - 1 && ','}
                </Text>
              ))}
              {event.attendees.length > 3 && (
                <Text fontSize={THEME.fontSizes.xs} color={THEME.colors.textSecondary}>
                  +{event.attendees.length - 3} more
                </Text>
              )}
            </HStack>
          </VStack>
        )}

        {/* Action Buttons */}
        <VStack align="stretch" spacing={2}>
          {event.meetLink ? (
            <Button
              as="a"
              href={event.meetLink}
              target="_blank"
              rel="noopener noreferrer"
              size="sm"
              colorScheme="blue"
              leftIcon={
                <Icon viewBox="0 0 24 24" boxSize={4}>
                  <path
                    fill="currentColor"
                    d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"
                  />
                </Icon>
              }
              w="full"
              minH="44px"
            >
              Join Google Meet
            </Button>
          ) : (
            <Box p={2} bg="yellow.50" borderRadius={THEME.borderRadius.sm}>
              <Text fontSize={THEME.fontSizes.xs} color="yellow.800">
                ⚠️ Meet link unavailable - check calendar for details
              </Text>
            </Box>
          )}

          {event.htmlLink && (
            <Button
              as="a"
              href={event.htmlLink}
              target="_blank"
              rel="noopener noreferrer"
              size="sm"
              variant="outline"
              colorScheme="blue"
              minH="44px"
              w="full"
            >
              View in Calendar
            </Button>
          )}
        </VStack>
      </VStack>
    </Box>
  );
}
