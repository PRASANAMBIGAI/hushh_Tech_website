/**
 * ExtendedTemplateSelectionStep - Step 4 of Hushh Folio Wizard
 * 12 beautiful templates with visual previews and recommendations
 */

import { useState, useMemo } from 'react';
import {
  Box,
  Flex,
  Text,
  VStack,
  HStack,
  Button,
  SimpleGrid,
  Badge,
  Tabs,
  TabList,
  Tab,
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  EXTENDED_TEMPLATES,
  type ExtendedTemplateId,
  type ExtendedTemplate,
  type PersonaId,
  getRecommendedTemplates,
} from '../../types/portfolioPersonas';

const MotionBox = motion(Box);

interface ExtendedTemplateSelectionStepProps {
  selectedTemplate: ExtendedTemplateId | null;
  selectedPersona: PersonaId | null;
  onSelectTemplate: (templateId: ExtendedTemplateId) => void;
  onNext: () => void;
  onBack: () => void;
}

export const ExtendedTemplateSelectionStep = ({
  selectedTemplate,
  selectedPersona,
  onSelectTemplate,
  onNext,
  onBack,
}: ExtendedTemplateSelectionStepProps) => {
  const [filter, setFilter] = useState<'all' | 'recommended' | 'free' | 'premium'>('all');

  // Get recommended templates for selected persona
  const recommendedTemplates = useMemo(() => {
    if (!selectedPersona) return [];
    return getRecommendedTemplates(selectedPersona);
  }, [selectedPersona]);

  // Filter templates based on selected filter
  const filteredTemplates = useMemo(() => {
    switch (filter) {
      case 'recommended':
        return recommendedTemplates;
      case 'free':
        return EXTENDED_TEMPLATES.filter((t) => !t.isPremium);
      case 'premium':
        return EXTENDED_TEMPLATES.filter((t) => t.isPremium);
      default:
        return EXTENDED_TEMPLATES;
    }
  }, [filter, recommendedTemplates]);

  return (
    <VStack spacing={6} py={6} w="full" maxW="900px" mx="auto">
      {/* Header */}
      <VStack spacing={3} textAlign="center">
        <Box
          w={16}
          h={16}
          borderRadius="full"
          bg="linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)"
          display="flex"
          alignItems="center"
          justifyContent="center"
          boxShadow="0 8px 32px rgba(139, 92, 246, 0.3)"
        >
          <Text fontSize="2xl">🎨</Text>
        </Box>
        <Text fontSize="2xl" fontWeight="bold" color="#1A1A1A">
          Choose Your Style
        </Text>
        <Text fontSize="md" color="#6B7280" maxW="500px">
          Select a template that reflects your personality. Each template is designed for specific use cases.
        </Text>
      </VStack>

      {/* Filter Tabs */}
      <Tabs
        variant="soft-rounded"
        colorScheme="orange"
        onChange={(index) =>
          setFilter(['all', 'recommended', 'free', 'premium'][index] as typeof filter)
        }
      >
        <TabList bg="#F3F4F6" p={1} borderRadius="full">
          <Tab
            _selected={{ bg: 'white', boxShadow: 'sm' }}
            px={4}
            py={2}
            borderRadius="full"
            fontSize="sm"
          >
            All ({EXTENDED_TEMPLATES.length})
          </Tab>
          <Tab
            _selected={{ bg: 'white', boxShadow: 'sm' }}
            px={4}
            py={2}
            borderRadius="full"
            fontSize="sm"
          >
            ⭐ For You ({recommendedTemplates.length})
          </Tab>
          <Tab
            _selected={{ bg: 'white', boxShadow: 'sm' }}
            px={4}
            py={2}
            borderRadius="full"
            fontSize="sm"
          >
            Free ({EXTENDED_TEMPLATES.filter((t) => !t.isPremium).length})
          </Tab>
          <Tab
            _selected={{ bg: 'white', boxShadow: 'sm' }}
            px={4}
            py={2}
            borderRadius="full"
            fontSize="sm"
          >
            Premium ({EXTENDED_TEMPLATES.filter((t) => t.isPremium).length})
          </Tab>
        </TabList>
      </Tabs>

      {/* Templates Grid */}
      <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} spacing={5} w="full">
        <AnimatePresence mode="popLayout">
          {filteredTemplates.map((template, index) => (
            <TemplateCard
              key={template.id}
              template={template}
              isSelected={selectedTemplate === template.id}
              isRecommended={recommendedTemplates.some((t) => t.id === template.id)}
              onSelect={() => onSelectTemplate(template.id)}
              index={index}
            />
          ))}
        </AnimatePresence>
      </SimpleGrid>

      {/* No Templates Message */}
      {filteredTemplates.length === 0 && (
        <Box py={8} textAlign="center">
          <Text color="#6B7280">No templates match your filter.</Text>
        </Box>
      )}

      {/* Navigation Buttons */}
      <Flex gap={4} pt={4}>
        <Button
          size="lg"
          variant="outline"
          borderColor="#E5E7EB"
          color="#6B7280"
          onClick={onBack}
          _hover={{ borderColor: '#D1D5DB' }}
        >
          Back
        </Button>
        <Button
          size="lg"
          bg="linear-gradient(135deg, #F97316 0%, #FB923C 100%)"
          color="white"
          px={12}
          onClick={onNext}
          isDisabled={!selectedTemplate}
          _hover={{
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 25px rgba(249, 115, 22, 0.4)',
          }}
          _disabled={{
            opacity: 0.5,
            cursor: 'not-allowed',
          }}
          sx={{ transition: 'all 0.2s' }}
        >
          Continue
        </Button>
      </Flex>
    </VStack>
  );
};

// Template Card Component
interface TemplateCardProps {
  template: ExtendedTemplate;
  isSelected: boolean;
  isRecommended: boolean;
  onSelect: () => void;
  index: number;
}

const TemplateCard = ({
  template,
  isSelected,
  isRecommended,
  onSelect,
  index,
}: TemplateCardProps) => {
  return (
    <MotionBox
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      as="button"
      onClick={onSelect}
      borderRadius="20px"
      overflow="hidden"
      border={`2px solid ${isSelected ? template.colors.primary : '#E5E7EB'}`}
      bg="white"
      boxShadow={isSelected ? `0 8px 30px ${template.colors.primary}25` : '0 2px 8px rgba(0,0,0,0.06)'}
      textAlign="left"
      cursor="pointer"
      sx={{
        transition: 'border-color 0.2s, transform 0.2s, box-shadow 0.2s',
      }}
      _hover={{
        borderColor: isSelected ? template.colors.primary : '#D1D5DB',
        transform: 'translateY(-4px)',
        boxShadow: isSelected
          ? `0 12px 40px ${template.colors.primary}30`
          : '0 12px 30px rgba(0,0,0,0.1)',
      }}
      position="relative"
    >
      {/* Template Preview */}
      <Box
        h="120px"
        bg={template.colors.background}
        position="relative"
        overflow="hidden"
      >
        {/* Mini Preview Design */}
        <Box position="absolute" inset={0} p={3}>
          {/* Header bar */}
          <HStack spacing={2} mb={2}>
            <Box w={6} h={6} borderRadius="full" bg={template.colors.primary} />
            <Box flex={1}>
              <Box w="60%" h={2} borderRadius="full" bg={template.colors.text} opacity={0.8} />
              <Box w="40%" h={1.5} mt={1} borderRadius="full" bg={template.colors.text} opacity={0.3} />
            </Box>
          </HStack>
          
          {/* Content blocks */}
          <HStack spacing={2} mt={4}>
            <Box flex={1} h={8} borderRadius="md" bg={template.colors.secondary} opacity={0.3} />
            <Box flex={1} h={8} borderRadius="md" bg={template.colors.primary} opacity={0.4} />
          </HStack>
          
          {/* Footer */}
          <Box w="80%" h={1.5} mt={3} borderRadius="full" bg={template.colors.accent} opacity={0.5} />
        </Box>

        {/* Badges */}
        <Flex position="absolute" top={2} right={2} gap={1}>
          {isRecommended && (
            <Badge
              bg="linear-gradient(135deg, #F97316 0%, #FB923C 100%)"
              color="white"
              fontSize="9px"
              px={2}
              py={0.5}
              borderRadius="full"
            >
              ⭐ For You
            </Badge>
          )}
          {template.isPremium && (
            <Badge
              bg="linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)"
              color="white"
              fontSize="9px"
              px={2}
              py={0.5}
              borderRadius="full"
            >
              PRO
            </Badge>
          )}
        </Flex>

        {/* Selection Indicator */}
        {isSelected && (
          <Box
            position="absolute"
            bottom={2}
            right={2}
            w={6}
            h={6}
            borderRadius="full"
            bg={template.colors.primary}
            display="flex"
            alignItems="center"
            justifyContent="center"
            boxShadow="0 2px 8px rgba(0,0,0,0.2)"
          >
            <CheckIcon />
          </Box>
        )}
      </Box>

      {/* Template Info */}
      <VStack align="start" spacing={2} p={4}>
        <HStack spacing={2}>
          <Text fontSize="lg">{template.emoji}</Text>
          <Text fontWeight="semibold" color="#1A1A1A" fontSize="md">
            {template.name}
          </Text>
        </HStack>

        <Text fontSize="xs" color="#6B7280" lineHeight="1.4" noOfLines={2}>
          {template.description}
        </Text>

        {/* Features */}
        <HStack spacing={1} flexWrap="wrap" pt={1}>
          {template.features.slice(0, 3).map((feature) => (
            <Badge
              key={feature}
              bg="#F3F4F6"
              color="#6B7280"
              fontSize="9px"
              fontWeight="medium"
              px={2}
              py={0.5}
              borderRadius="full"
            >
              {feature}
            </Badge>
          ))}
        </HStack>
      </VStack>

      {/* Accent Line */}
      <Box
        position="absolute"
        bottom={0}
        left={0}
        right={0}
        h="3px"
        bg={`linear-gradient(90deg, ${template.colors.primary} 0%, ${template.colors.secondary} 100%)`}
        opacity={isSelected ? 1 : 0}
        sx={{ transition: 'opacity 0.2s' }}
      />
    </MotionBox>
  );
};

// Check Icon
const CheckIcon = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="white"
    strokeWidth="3"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export default ExtendedTemplateSelectionStep;
