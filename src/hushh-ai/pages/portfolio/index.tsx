/**
 * Hushh Folio - AI-Powered Portfolio Builder
 * Main wizard page for building free portfolio websites
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Flex,
  Text,
  VStack,
  HStack,
  Button,
  IconButton,
  Progress,
  Spinner,
  useToast,
  Input,
  FormControl,
  FormLabel,
  FormErrorMessage,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { THEME } from '../../core/constants';
import * as service from '../../services/hushhAIService';
import type { BasicInfoState, WizardStep, TemplateId } from '../../../types/portfolio';
import { INTERVIEW_QUESTIONS, WIZARD_STEPS } from '../../../types/portfolio';
import config from '../../../resources/config/config';

// Import enhanced persona-based types and components
import {
  type PersonaId,
  type ExtendedTemplateId,
  type ExtendedWizardStep,
  type CustomStyling,
  EXTENDED_WIZARD_STEPS,
  EXTENDED_TEMPLATES,
  PERSONA_QUESTIONS,
  getQuestionsForPersona,
  getPersonaById,
  DEFAULT_STYLING,
} from '../../../types/portfolioPersonas';
import { PersonaSelectionStep } from '../../../components/portfolio/PersonaSelectionStep';
import { ExtendedTemplateSelectionStep } from '../../../components/portfolio/ExtendedTemplateSelectionStep';
import { CustomStylingStep } from '../../../components/portfolio/CustomStylingStep';

const MotionBox = motion(Box);

// ============================================
// Step Components (Placeholder - To be built)
// ============================================

interface StepProps {
  onNext: () => void;
  onBack: () => void;
  isFirst: boolean;
  isLast: boolean;
}

// Step 1: Welcome & Basic Info
const WelcomeStep = ({ onNext }: StepProps) => (
  <VStack spacing={8} textAlign="center" py={12}>
    <Box
      w={20}
      h={20}
      borderRadius="full"
      bg="linear-gradient(135deg, #F97316 0%, #FB923C 100%)"
      display="flex"
      alignItems="center"
      justifyContent="center"
      boxShadow="0 8px 32px rgba(249, 115, 22, 0.3)"
    >
      <PortfolioIcon size={40} />
    </Box>
    
    <VStack spacing={3}>
      <Text
        fontSize="2xl"
        fontWeight="bold"
        color={THEME.colors.textPrimary}
      >
        Build Your Portfolio
      </Text>
      <Text
        fontSize="md"
        color={THEME.colors.textSecondary}
        maxW="400px"
      >
        Create a stunning portfolio website in minutes. Our AI will ask you a few questions and generate a professional portfolio that tells your story.
      </Text>
    </VStack>

    <VStack spacing={4} w="full" maxW="300px">
      <FeatureItem icon="✨" text="AI-powered content generation" />
      <FeatureItem icon="📸" text="Professional photo enhancement" />
      <FeatureItem icon="🎨" text="5 beautiful templates" />
      <FeatureItem icon="🌐" text="Free hosting included" />
    </VStack>

    <Button
      size="lg"
      bg="linear-gradient(135deg, #F97316 0%, #FB923C 100%)"
      color="white"
      _hover={{
        transform: 'translateY(-2px)',
        boxShadow: '0 8px 25px rgba(249, 115, 22, 0.4)',
      }}
      transition="all 0.2s"
      onClick={onNext}
      px={12}
    >
      Get Started - It's Free
    </Button>

    <Text fontSize="xs" color={THEME.colors.textPlaceholder}>
      Takes about 5 minutes • No credit card required
    </Text>
  </VStack>
);

const FeatureItem = ({ icon, text }: { icon: string; text: string }) => (
  <HStack spacing={3} w="full">
    <Text fontSize="lg">{icon}</Text>
    <Text fontSize="sm" color={THEME.colors.textSecondary}>
      {text}
    </Text>
  </HStack>
);

// ============================================
// Step 2: Basic Information Form
// ============================================

interface BasicInfoStepProps extends StepProps {
  formData: BasicInfoState;
  onFormChange: (data: Partial<BasicInfoState>) => void;
  isSaving: boolean;
}

const BasicInfoStep = ({ onNext, onBack, formData, onFormChange, isSaving }: BasicInfoStepProps) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (formData.linkedinUrl && !formData.linkedinUrl.includes('linkedin.com')) {
      newErrors.linkedinUrl = 'Please enter a valid LinkedIn URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onNext();
    }
  };

  return (
    <VStack spacing={6} py={8} w="full">
      <VStack spacing={2} textAlign="center">
        <Box
          w={14}
          h={14}
          borderRadius="full"
          bg="linear-gradient(135deg, #F97316 0%, #FB923C 100%)"
          display="flex"
          alignItems="center"
          justifyContent="center"
          boxShadow="0 4px 20px rgba(249, 115, 22, 0.25)"
        >
          <UserIcon />
        </Box>
        <Text fontSize="xl" fontWeight="semibold" color={THEME.colors.textPrimary}>
          Let's start with the basics
        </Text>
        <Text fontSize="sm" color={THEME.colors.textSecondary}>
          This information will appear on your portfolio
        </Text>
      </VStack>

      <VStack spacing={4} w="full" maxW="400px">
        {/* Name */}
        <FormControl isInvalid={!!errors.name}>
          <FormLabel fontSize="sm" color={THEME.colors.textSecondary}>
            Full Name *
          </FormLabel>
          <Input
            value={formData.name}
            onChange={(e) => onFormChange({ name: e.target.value })}
            placeholder="John Doe"
            size="lg"
            bg={THEME.colors.surface}
            border={`1px solid ${THEME.colors.border}`}
            borderRadius={THEME.borderRadius.md}
            _focus={{
              borderColor: THEME.colors.accent,
              boxShadow: `0 0 0 1px ${THEME.colors.accent}`,
            }}
            _placeholder={{ color: THEME.colors.textPlaceholder }}
          />
          <FormErrorMessage>{errors.name}</FormErrorMessage>
        </FormControl>

        {/* Email */}
        <FormControl isInvalid={!!errors.email}>
          <FormLabel fontSize="sm" color={THEME.colors.textSecondary}>
            Email Address *
          </FormLabel>
          <InputGroup>
            <InputLeftElement pointerEvents="none" h="full">
              <EmailIcon />
            </InputLeftElement>
            <Input
              value={formData.email}
              onChange={(e) => onFormChange({ email: e.target.value })}
              placeholder="john@example.com"
              type="email"
              size="lg"
              pl={10}
              bg={THEME.colors.surface}
              border={`1px solid ${THEME.colors.border}`}
              borderRadius={THEME.borderRadius.md}
              _focus={{
                borderColor: THEME.colors.accent,
                boxShadow: `0 0 0 1px ${THEME.colors.accent}`,
              }}
              _placeholder={{ color: THEME.colors.textPlaceholder }}
            />
          </InputGroup>
          <FormErrorMessage>{errors.email}</FormErrorMessage>
        </FormControl>

        {/* Phone (Optional) */}
        <FormControl>
          <FormLabel fontSize="sm" color={THEME.colors.textSecondary}>
            Phone Number <Text as="span" color={THEME.colors.textMuted}>(Optional)</Text>
          </FormLabel>
          <InputGroup>
            <InputLeftElement pointerEvents="none" h="full">
              <PhoneIcon />
            </InputLeftElement>
            <Input
              value={formData.phone || ''}
              onChange={(e) => onFormChange({ phone: e.target.value })}
              placeholder="+1 (555) 000-0000"
              type="tel"
              size="lg"
              pl={10}
              bg={THEME.colors.surface}
              border={`1px solid ${THEME.colors.border}`}
              borderRadius={THEME.borderRadius.md}
              _focus={{
                borderColor: THEME.colors.accent,
                boxShadow: `0 0 0 1px ${THEME.colors.accent}`,
              }}
              _placeholder={{ color: THEME.colors.textPlaceholder }}
            />
          </InputGroup>
        </FormControl>

        {/* LinkedIn URL (Optional) */}
        <FormControl isInvalid={!!errors.linkedinUrl}>
          <FormLabel fontSize="sm" color={THEME.colors.textSecondary}>
            LinkedIn URL <Text as="span" color={THEME.colors.textMuted}>(Optional)</Text>
          </FormLabel>
          <InputGroup>
            <InputLeftElement pointerEvents="none" h="full">
              <LinkedInIcon />
            </InputLeftElement>
            <Input
              value={formData.linkedinUrl || ''}
              onChange={(e) => onFormChange({ linkedinUrl: e.target.value })}
              placeholder="linkedin.com/in/johndoe"
              size="lg"
              pl={10}
              bg={THEME.colors.surface}
              border={`1px solid ${THEME.colors.border}`}
              borderRadius={THEME.borderRadius.md}
              _focus={{
                borderColor: THEME.colors.accent,
                boxShadow: `0 0 0 1px ${THEME.colors.accent}`,
              }}
              _placeholder={{ color: THEME.colors.textPlaceholder }}
            />
          </InputGroup>
          <FormErrorMessage>{errors.linkedinUrl}</FormErrorMessage>
        </FormControl>

        {/* Date of Birth (Optional) */}
        <FormControl>
          <FormLabel fontSize="sm" color={THEME.colors.textSecondary}>
            Date of Birth <Text as="span" color={THEME.colors.textMuted}>(Optional)</Text>
          </FormLabel>
          <Input
            value={formData.dob || ''}
            onChange={(e) => onFormChange({ dob: e.target.value })}
            type="date"
            size="lg"
            bg={THEME.colors.surface}
            border={`1px solid ${THEME.colors.border}`}
            borderRadius={THEME.borderRadius.md}
            _focus={{
              borderColor: THEME.colors.accent,
              boxShadow: `0 0 0 1px ${THEME.colors.accent}`,
            }}
          />
        </FormControl>
      </VStack>

      <HStack spacing={4} pt={4}>
        <Button
          variant="outline"
          onClick={onBack}
          borderColor={THEME.colors.border}
          color={THEME.colors.textSecondary}
        >
          Back
        </Button>
        <Button
          bg="linear-gradient(135deg, #F97316 0%, #FB923C 100%)"
          color="white"
          px={8}
          onClick={handleSubmit}
          isLoading={isSaving}
          _hover={{
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 15px rgba(249, 115, 22, 0.4)',
          }}
          transition="all 0.2s"
        >
          Continue
        </Button>
      </HStack>
    </VStack>
  );
};

// ============================================
// Step 3: AI Interview (Agentic Questions)
// ============================================

interface InterviewStepProps extends StepProps {
  answers: Map<number, string>;
  onAnswerChange: (questionId: number, answer: string) => void;
  isSaving: boolean;
  selectedPersona: PersonaId | null;
}

const InterviewStep = ({ onNext, onBack, answers, onAnswerChange, isSaving, selectedPersona }: InterviewStepProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Get persona-based questions or fallback to default
  const questions = selectedPersona ? getQuestionsForPersona(selectedPersona) : INTERVIEW_QUESTIONS;
  const totalQuestions = questions.length;
  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  // Load saved answer if exists
  useEffect(() => {
    const savedAnswer = answers.get(currentQuestion.id);
    setCurrentAnswer(savedAnswer || '');
  }, [currentQuestionIndex, answers, currentQuestion.id]);

  // Simulate AI typing effect when showing question
  useEffect(() => {
    setIsTyping(true);
    const timer = setTimeout(() => setIsTyping(false), 800);
    return () => clearTimeout(timer);
  }, [currentQuestionIndex]);

  const handleSaveAnswer = () => {
    if (currentAnswer.trim()) {
      onAnswerChange(currentQuestion.id, currentAnswer.trim());
    }
  };

  const handleNextQuestion = () => {
    handleSaveAnswer();
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setCurrentAnswer('');
    } else {
      // All questions answered, proceed to next step
      onNext();
    }
  };

  const handlePrevQuestion = () => {
    handleSaveAnswer();
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    } else {
      onBack();
    }
  };

  const handleSkip = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setCurrentAnswer('');
    } else {
      onNext();
    }
  };

  return (
    <VStack spacing={6} py={6} w="full" h="full">
      {/* Progress Header */}
      <VStack spacing={2} w="full" maxW="500px">
        <HStack w="full" justify="space-between" px={2}>
          <Text fontSize="xs" color={THEME.colors.textSecondary}>
            Question {currentQuestionIndex + 1} of {totalQuestions}
          </Text>
          <Text fontSize="xs" color={THEME.colors.accent}>
            {currentQuestion.category}
          </Text>
        </HStack>
        <Progress
          value={progress}
          size="xs"
          w="full"
          colorScheme="orange"
          borderRadius="full"
          bg={THEME.colors.border}
        />
      </VStack>

      {/* Chat Container */}
      <VStack
        flex={1}
        w="full"
        maxW="500px"
        spacing={4}
        align="stretch"
        overflow="auto"
        pb={4}
      >
        {/* AI Message */}
        <HStack align="start" spacing={3}>
          <Box
            w={8}
            h={8}
            borderRadius="full"
            bg="linear-gradient(135deg, #F97316 0%, #FB923C 100%)"
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexShrink={0}
          >
            <AIIcon />
          </Box>
          <Box
            bg={THEME.colors.surface}
            borderRadius={THEME.borderRadius.lg}
            border={`1px solid ${THEME.colors.border}`}
            p={4}
            maxW="85%"
          >
            {isTyping ? (
              <HStack spacing={1}>
                <Box w={2} h={2} borderRadius="full" bg={THEME.colors.textMuted} className="typing-dot" />
                <Box w={2} h={2} borderRadius="full" bg={THEME.colors.textMuted} className="typing-dot" style={{ animationDelay: '0.2s' }} />
                <Box w={2} h={2} borderRadius="full" bg={THEME.colors.textMuted} className="typing-dot" style={{ animationDelay: '0.4s' }} />
              </HStack>
            ) : (
              <Text color={THEME.colors.textPrimary} fontSize="md">
                {currentQuestion.question}
              </Text>
            )}
          </Box>
        </HStack>

        {/* User Answer (if exists) */}
        {answers.get(currentQuestion.id) && (
          <HStack align="start" spacing={3} justify="flex-end">
            <Box
              bg={THEME.colors.userBubble}
              borderRadius={THEME.borderRadius.lg}
              p={4}
              maxW="85%"
            >
              <Text color={THEME.colors.textPrimary} fontSize="md">
                {answers.get(currentQuestion.id)}
              </Text>
            </Box>
          </HStack>
        )}
      </VStack>

      {/* Input Area */}
      <VStack spacing={4} w="full" maxW="500px">
        <Box w="full" position="relative">
          <Input
            as="textarea"
            value={currentAnswer}
            onChange={(e) => setCurrentAnswer(e.target.value)}
            placeholder="Type your answer..."
            size="lg"
            minH="100px"
            py={3}
            bg={THEME.colors.surface}
            border={`1px solid ${THEME.colors.border}`}
            borderRadius={THEME.borderRadius.md}
            _focus={{
              borderColor: THEME.colors.accent,
              boxShadow: `0 0 0 1px ${THEME.colors.accent}`,
            }}
            _placeholder={{ color: THEME.colors.textPlaceholder }}
            resize="none"
            sx={{
              '&::-webkit-scrollbar': { width: '4px' },
              '&::-webkit-scrollbar-thumb': { bg: THEME.colors.border, borderRadius: 'full' },
            }}
          />
        </Box>

        {/* Action Buttons */}
        <HStack w="full" justify="space-between">
          <Button
            variant="ghost"
            size="sm"
            color={THEME.colors.textSecondary}
            onClick={handlePrevQuestion}
          >
            {currentQuestionIndex === 0 ? 'Back' : 'Previous'}
          </Button>

          <HStack spacing={2}>
            <Button
              variant="ghost"
              size="sm"
              color={THEME.colors.textMuted}
              onClick={handleSkip}
            >
              Skip
            </Button>
            <Button
              bg="linear-gradient(135deg, #F97316 0%, #FB923C 100%)"
              color="white"
              size="sm"
              px={6}
              onClick={handleNextQuestion}
              isDisabled={!currentAnswer.trim() && !answers.get(currentQuestion.id)}
              isLoading={isSaving}
              _hover={{
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 12px rgba(249, 115, 22, 0.3)',
              }}
              _disabled={{
                opacity: 0.5,
                cursor: 'not-allowed',
              }}
              transition="all 0.2s"
            >
              {currentQuestionIndex === totalQuestions - 1 ? 'Finish' : 'Next'}
            </Button>
          </HStack>
        </HStack>
      </VStack>

      {/* Quick Tips */}
      <Box w="full" maxW="500px" pt={2}>
        <Text fontSize="xs" color={THEME.colors.textMuted} textAlign="center">
          💡 Be specific! The more details you provide, the better your portfolio will be.
        </Text>
      </Box>
    </VStack>
  );
};

// ============================================
// Step 4: Template Selection
// ============================================

interface TemplateSelectionStepProps extends StepProps {
  selectedTemplate: ExtendedTemplateId;
  onSelectTemplate: (templateId: ExtendedTemplateId) => void;
  isSaving: boolean;
}

// Template data with colors and features
const TEMPLATES_DATA: {
  id: TemplateId;
  name: string;
  description: string;
  colors: { primary: string; secondary: string; background: string };
  features: string[];
  emoji: string;
}[] = [
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Clean, white background with typography-focused design',
    colors: { primary: '#F97316', secondary: '#FB923C', background: '#FFFFFF' },
    features: ['Clean Design', 'Fast Loading', 'Mobile First'],
    emoji: '✨',
  },
  {
    id: 'executive',
    name: 'Executive',
    description: 'Corporate feel with navy and gold accents',
    colors: { primary: '#1E3A5F', secondary: '#C9A227', background: '#F8FAFC' },
    features: ['Testimonials', 'Achievements', 'Corporate Style'],
    emoji: '👔',
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Bold colors and gradients for designers',
    colors: { primary: '#8B5CF6', secondary: '#EC4899', background: '#0F172A' },
    features: ['Gradients', 'Animations', 'Portfolio Gallery'],
    emoji: '🎨',
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'Dark mode with glassmorphism effects',
    colors: { primary: '#10B981', secondary: '#34D399', background: '#111827' },
    features: ['Dark Mode', 'Glassmorphism', 'Smooth Animations'],
    emoji: '🌙',
  },
  {
    id: 'developer',
    name: 'Developer',
    description: 'Terminal-style design for techies',
    colors: { primary: '#22C55E', secondary: '#4ADE80', background: '#0D1117' },
    features: ['Terminal Style', 'GitHub Stats', 'Code Snippets'],
    emoji: '💻',
  },
];

const TemplateSelectionStep = ({
  onNext,
  onBack,
  selectedTemplate,
  onSelectTemplate,
  isSaving,
}: TemplateSelectionStepProps) => {
  return (
    <VStack spacing={6} py={6} w="full">
      <VStack spacing={2} textAlign="center">
        <Box
          w={14}
          h={14}
          borderRadius="full"
          bg="linear-gradient(135deg, #F97316 0%, #FB923C 100%)"
          display="flex"
          alignItems="center"
          justifyContent="center"
          boxShadow="0 4px 20px rgba(249, 115, 22, 0.25)"
        >
          <TemplateIcon />
        </Box>
        <Text fontSize="xl" fontWeight="semibold" color={THEME.colors.textPrimary}>
          Choose Your Style
        </Text>
        <Text fontSize="sm" color={THEME.colors.textSecondary}>
          Select a template that reflects your personality
        </Text>
      </VStack>

      {/* Templates Grid */}
      <VStack spacing={4} w="full" maxW="600px">
        {TEMPLATES_DATA.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            isSelected={selectedTemplate === template.id}
            onSelect={() => onSelectTemplate(template.id)}
          />
        ))}
      </VStack>

      {/* Navigation */}
      <HStack spacing={4} pt={4}>
        <Button
          variant="outline"
          onClick={onBack}
          borderColor={THEME.colors.border}
          color={THEME.colors.textSecondary}
        >
          Back
        </Button>
        <Button
          bg="linear-gradient(135deg, #F97316 0%, #FB923C 100%)"
          color="white"
          px={8}
          onClick={onNext}
          isLoading={isSaving}
          _hover={{
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 15px rgba(249, 115, 22, 0.4)',
          }}
          transition="all 0.2s"
        >
          Continue
        </Button>
      </HStack>
    </VStack>
  );
};

// Template Card Component
interface TemplateCardProps {
  template: typeof TEMPLATES_DATA[0];
  isSelected: boolean;
  onSelect: () => void;
}

const TemplateCard = ({ template, isSelected, onSelect }: TemplateCardProps) => (
  <Box
    as="button"
    w="full"
    p={4}
    borderRadius={THEME.borderRadius.lg}
    border={`2px solid ${isSelected ? THEME.colors.accent : THEME.colors.border}`}
    bg={isSelected ? 'rgba(249, 115, 22, 0.05)' : THEME.colors.surface}
    onClick={onSelect}
    transition="all 0.2s"
    _hover={{
      borderColor: isSelected ? THEME.colors.accent : THEME.colors.textMuted,
      transform: 'translateY(-2px)',
    }}
    textAlign="left"
  >
    <HStack spacing={4} align="start">
      {/* Color Preview */}
      <Box
        w={16}
        h={16}
        borderRadius={THEME.borderRadius.md}
        overflow="hidden"
        flexShrink={0}
        position="relative"
        boxShadow="0 2px 8px rgba(0,0,0,0.1)"
      >
        <Box
          position="absolute"
          inset={0}
          bg={template.colors.background}
        />
        <Box
          position="absolute"
          bottom={0}
          left={0}
          right={0}
          h="40%"
          bg={`linear-gradient(135deg, ${template.colors.primary} 0%, ${template.colors.secondary} 100%)`}
        />
        <Box
          position="absolute"
          top={2}
          left={2}
          w={3}
          h={3}
          borderRadius="full"
          bg={template.colors.primary}
        />
        <Box
          position="absolute"
          top={2}
          left={6}
          w={6}
          h={1.5}
          borderRadius="full"
          bg={template.colors.secondary}
          opacity={0.6}
        />
      </Box>

      {/* Template Info */}
      <VStack align="start" spacing={1} flex={1}>
        <HStack justify="space-between" w="full">
          <HStack spacing={2}>
            <Text fontSize="lg">{template.emoji}</Text>
            <Text fontWeight="semibold" color={THEME.colors.textPrimary}>
              {template.name}
            </Text>
          </HStack>
          {isSelected && (
            <Box
              w={5}
              h={5}
              borderRadius="full"
              bg={THEME.colors.accent}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <CheckIcon />
            </Box>
          )}
        </HStack>
        <Text fontSize="sm" color={THEME.colors.textSecondary}>
          {template.description}
        </Text>
        <HStack spacing={2} pt={1} flexWrap="wrap">
          {template.features.map((feature) => (
            <Text
              key={feature}
              fontSize="xs"
              px={2}
              py={0.5}
              borderRadius="full"
              bg={isSelected ? 'rgba(249, 115, 22, 0.15)' : THEME.colors.backgroundSecondary}
              color={isSelected ? THEME.colors.accent : THEME.colors.textMuted}
            >
              {feature}
            </Text>
          ))}
        </HStack>
      </VStack>
    </HStack>
  </Box>
);

// ============================================
// Step 5: Photo Upload & Enhancement
// ============================================

interface PhotoUploadStepProps extends StepProps {
  photoUrl: string | null;
  enhancedPhotoUrl: string | null;
  onPhotoUpload: (file: File) => void;
  onEnhancePhoto: () => void;
  isEnhancing: boolean;
  isSaving: boolean;
}

const PhotoUploadStep = ({
  onNext,
  onBack,
  photoUrl,
  enhancedPhotoUrl,
  onPhotoUpload,
  onEnhancePhoto,
  isEnhancing,
  isSaving,
}: PhotoUploadStepProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = { current: null as HTMLInputElement | null };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      onPhotoUpload(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onPhotoUpload(file);
    }
  };

  const displayPhoto = enhancedPhotoUrl || photoUrl;

  return (
    <VStack spacing={6} py={6} w="full">
      <VStack spacing={2} textAlign="center">
        <Box
          w={14}
          h={14}
          borderRadius="full"
          bg="linear-gradient(135deg, #F97316 0%, #FB923C 100%)"
          display="flex"
          alignItems="center"
          justifyContent="center"
          boxShadow="0 4px 20px rgba(249, 115, 22, 0.25)"
        >
          <CameraIcon />
        </Box>
        <Text fontSize="xl" fontWeight="semibold" color={THEME.colors.textPrimary}>
          Add Your Photo
        </Text>
        <Text fontSize="sm" color={THEME.colors.textSecondary}>
          Upload a photo and let AI enhance it for a professional look
        </Text>
      </VStack>

      {/* Photo Upload/Preview Area */}
      <Box w="full" maxW="400px">
        {!displayPhoto ? (
          // Upload Dropzone
          <Box
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            cursor="pointer"
            border={`2px dashed ${isDragging ? THEME.colors.accent : THEME.colors.border}`}
            borderRadius={THEME.borderRadius.lg}
            bg={isDragging ? 'rgba(249, 115, 22, 0.05)' : THEME.colors.surface}
            p={12}
            textAlign="center"
            transition="all 0.2s"
            _hover={{
              borderColor: THEME.colors.accent,
              bg: 'rgba(249, 115, 22, 0.02)',
            }}
          >
            <VStack spacing={4}>
              <Box
                w={16}
                h={16}
                borderRadius="full"
                bg={THEME.colors.backgroundSecondary}
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <UploadIcon />
              </Box>
              <VStack spacing={1}>
                <Text fontWeight="medium" color={THEME.colors.textPrimary}>
                  {isDragging ? 'Drop your photo here' : 'Click or drag to upload'}
                </Text>
                <Text fontSize="sm" color={THEME.colors.textMuted}>
                  JPG, PNG, or WEBP (max 10MB)
                </Text>
              </VStack>
            </VStack>
          </Box>
        ) : (
          // Photo Preview
          <VStack spacing={4}>
            <Box
              position="relative"
              borderRadius={THEME.borderRadius.lg}
              overflow="hidden"
              boxShadow="0 4px 20px rgba(0,0,0,0.15)"
            >
              <img
                src={displayPhoto}
                alt="Profile preview"
                style={{
                  width: '100%',
                  maxHeight: '300px',
                  objectFit: 'cover',
                }}
              />
              {enhancedPhotoUrl && (
                <Box
                  position="absolute"
                  bottom={2}
                  left={2}
                  px={2}
                  py={1}
                  borderRadius="full"
                  bg="linear-gradient(135deg, #F97316 0%, #FB923C 100%)"
                  fontSize="xs"
                  color="white"
                  fontWeight="medium"
                >
                  ✨ AI Enhanced
                </Box>
              )}
            </Box>

            {/* Action Buttons for Photo */}
            <HStack spacing={3} w="full">
              <Button
                flex={1}
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                borderColor={THEME.colors.border}
                color={THEME.colors.textSecondary}
              >
                Change Photo
              </Button>
              {!enhancedPhotoUrl && photoUrl && (
                <Button
                  flex={1}
                  size="sm"
                  bg="linear-gradient(135deg, #F97316 0%, #FB923C 100%)"
                  color="white"
                  onClick={onEnhancePhoto}
                  isLoading={isEnhancing}
                  loadingText="Enhancing..."
                  leftIcon={<SparkleIcon />}
                  _hover={{
                    transform: 'translateY(-1px)',
                    boxShadow: '0 4px 12px rgba(249, 115, 22, 0.3)',
                  }}
                >
                  Enhance with AI
                </Button>
              )}
            </HStack>
          </VStack>
        )}

        {/* Hidden file input */}
        <input
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleFileSelect}
          ref={(ref) => (fileInputRef.current = ref)}
        />
      </Box>

      {/* Info Box */}
      <Box
        w="full"
        maxW="400px"
        p={4}
        bg={THEME.colors.backgroundSecondary}
        borderRadius={THEME.borderRadius.md}
      >
        <VStack spacing={2} align="start">
          <Text fontSize="sm" fontWeight="medium" color={THEME.colors.textPrimary}>
            💡 Photo Tips
          </Text>
          <VStack spacing={1} align="start" fontSize="xs" color={THEME.colors.textMuted}>
            <Text>• Use a clear, front-facing photo</Text>
            <Text>• Good lighting makes a difference</Text>
            <Text>• AI enhancement can improve colors and lighting</Text>
          </VStack>
        </VStack>
      </Box>

      {/* Navigation */}
      <HStack spacing={4} pt={4}>
        <Button
          variant="outline"
          onClick={onBack}
          borderColor={THEME.colors.border}
          color={THEME.colors.textSecondary}
        >
          Back
        </Button>
        <Button
          bg="linear-gradient(135deg, #F97316 0%, #FB923C 100%)"
          color="white"
          px={8}
          onClick={onNext}
          isLoading={isSaving}
          isDisabled={!photoUrl}
          _hover={{
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 15px rgba(249, 115, 22, 0.4)',
          }}
          _disabled={{
            opacity: 0.5,
            cursor: 'not-allowed',
          }}
          transition="all 0.2s"
        >
          {photoUrl ? 'Continue' : 'Skip for Now'}
        </Button>
      </HStack>

      {/* Skip Option */}
      {!photoUrl && (
        <Button
          variant="ghost"
          size="sm"
          color={THEME.colors.textMuted}
          onClick={onNext}
        >
          Skip - I'll add a photo later
        </Button>
      )}
    </VStack>
  );
};

// ============================================
// Step 6: Preview & Edit
// ============================================

interface PreviewEditStepProps extends StepProps {
  basicInfo: BasicInfoState;
  interviewAnswers: Map<number, string>;
  selectedTemplate: ExtendedTemplateId;
  photoUrl: string | null;
  enhancedPhotoUrl: string | null;
  generatedContent: {
    headline: string;
    bio: string;
    tagline: string;
  };
  onContentChange: (field: 'headline' | 'bio' | 'tagline', value: string) => void;
  isGenerating: boolean;
  onRegenerate: () => void;
  isSaving: boolean;
}

const PreviewEditStep = ({
  onNext,
  onBack,
  basicInfo,
  selectedTemplate,
  photoUrl,
  enhancedPhotoUrl,
  generatedContent,
  onContentChange,
  isGenerating,
  onRegenerate,
  isSaving,
}: PreviewEditStepProps) => {
  const [editingField, setEditingField] = useState<'headline' | 'bio' | 'tagline' | null>(null);
  const [tempValue, setTempValue] = useState('');
  
  const displayPhoto = enhancedPhotoUrl || photoUrl;
  const templateData = TEMPLATES_DATA.find(t => t.id === selectedTemplate) || TEMPLATES_DATA[0];

  const handleStartEdit = (field: 'headline' | 'bio' | 'tagline') => {
    setEditingField(field);
    setTempValue(generatedContent[field]);
  };

  const handleSaveEdit = () => {
    if (editingField && tempValue.trim()) {
      onContentChange(editingField, tempValue.trim());
    }
    setEditingField(null);
    setTempValue('');
  };

  const handleCancelEdit = () => {
    setEditingField(null);
    setTempValue('');
  };

  if (isGenerating) {
    return (
      <VStack spacing={8} py={12} textAlign="center">
        <Box
          w={20}
          h={20}
          borderRadius="full"
          bg="linear-gradient(135deg, #F97316 0%, #FB923C 100%)"
          display="flex"
          alignItems="center"
          justifyContent="center"
          animation="pulse 2s infinite"
        >
          <SparkleIcon />
        </Box>
        <VStack spacing={2}>
          <Text fontSize="xl" fontWeight="semibold" color={THEME.colors.textPrimary}>
            ✨ AI is crafting your story...
          </Text>
          <Text fontSize="sm" color={THEME.colors.textSecondary}>
            Generating headline, bio, and tagline from your answers
          </Text>
        </VStack>
        <Spinner size="lg" color={THEME.colors.accent} />
      </VStack>
    );
  }

  return (
    <VStack spacing={6} py={4} w="full">
      <VStack spacing={2} textAlign="center">
        <Box
          w={14}
          h={14}
          borderRadius="full"
          bg="linear-gradient(135deg, #F97316 0%, #FB923C 100%)"
          display="flex"
          alignItems="center"
          justifyContent="center"
          boxShadow="0 4px 20px rgba(249, 115, 22, 0.25)"
        >
          <PreviewIcon />
        </Box>
        <Text fontSize="xl" fontWeight="semibold" color={THEME.colors.textPrimary}>
          Preview Your Portfolio
        </Text>
        <Text fontSize="sm" color={THEME.colors.textSecondary}>
          Review and edit your AI-generated content
        </Text>
      </VStack>

      {/* Portfolio Preview Card */}
      <Box
        w="full"
        maxW="500px"
        borderRadius={THEME.borderRadius.lg}
        overflow="hidden"
        border={`1px solid ${THEME.colors.border}`}
        bg={templateData.colors.background}
        boxShadow="0 8px 32px rgba(0,0,0,0.12)"
      >
        {/* Header with gradient */}
        <Box
          h="100px"
          bg={`linear-gradient(135deg, ${templateData.colors.primary} 0%, ${templateData.colors.secondary} 100%)`}
          position="relative"
        />

        {/* Profile Section */}
        <VStack spacing={4} px={6} pb={6} mt="-50px">
          {/* Photo */}
          <Box
            w={24}
            h={24}
            borderRadius="full"
            overflow="hidden"
            border="4px solid white"
            boxShadow="0 4px 12px rgba(0,0,0,0.15)"
            bg={THEME.colors.backgroundSecondary}
          >
            {displayPhoto ? (
              <img
                src={displayPhoto}
                alt={basicInfo.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <Flex w="full" h="full" align="center" justify="center">
                <Text fontSize="3xl" color={THEME.colors.textMuted}>
                  {basicInfo.name?.charAt(0)?.toUpperCase() || '?'}
                </Text>
              </Flex>
            )}
          </Box>

          {/* Name */}
          <Text
            fontSize="xl"
            fontWeight="bold"
            color={selectedTemplate === 'creative' || selectedTemplate === 'modern' || selectedTemplate === 'developer' 
              ? 'white' 
              : THEME.colors.textPrimary}
            textAlign="center"
          >
            {basicInfo.name}
          </Text>

          {/* Editable Headline */}
          <EditableField
            label="Headline"
            value={generatedContent.headline}
            isEditing={editingField === 'headline'}
            tempValue={tempValue}
            onStartEdit={() => handleStartEdit('headline')}
            onTempChange={setTempValue}
            onSave={handleSaveEdit}
            onCancel={handleCancelEdit}
            templateColors={templateData.colors}
            selectedTemplate={selectedTemplate}
          />

          {/* Editable Tagline */}
          <EditableField
            label="Tagline"
            value={generatedContent.tagline}
            isEditing={editingField === 'tagline'}
            tempValue={tempValue}
            onStartEdit={() => handleStartEdit('tagline')}
            onTempChange={setTempValue}
            onSave={handleSaveEdit}
            onCancel={handleCancelEdit}
            templateColors={templateData.colors}
            selectedTemplate={selectedTemplate}
            isSmall
          />

          {/* Editable Bio */}
          <EditableField
            label="Bio"
            value={generatedContent.bio}
            isEditing={editingField === 'bio'}
            tempValue={tempValue}
            onStartEdit={() => handleStartEdit('bio')}
            onTempChange={setTempValue}
            onSave={handleSaveEdit}
            onCancel={handleCancelEdit}
            templateColors={templateData.colors}
            selectedTemplate={selectedTemplate}
            isMultiline
          />

          {/* Contact Info */}
          <HStack spacing={4} pt={2}>
            <HStack spacing={1}>
              <Box as="span" color={templateData.colors.primary}>
                <EmailIcon />
              </Box>
              <Text fontSize="xs" color={THEME.colors.textMuted}>
                {basicInfo.email}
              </Text>
            </HStack>
            {basicInfo.linkedinUrl && (
              <HStack spacing={1}>
                <Box as="span" color={templateData.colors.primary}>
                  <LinkedInIcon />
                </Box>
                <Text fontSize="xs" color={THEME.colors.textMuted}>
                  LinkedIn
                </Text>
              </HStack>
            )}
          </HStack>
        </VStack>
      </Box>

      {/* Regenerate Button */}
      <Button
        variant="ghost"
        size="sm"
        color={THEME.colors.accent}
        leftIcon={<SparkleIcon />}
        onClick={onRegenerate}
        isLoading={isGenerating}
      >
        Regenerate Content with AI
      </Button>

      {/* Template Badge */}
      <HStack spacing={2}>
        <Text fontSize="xs" color={THEME.colors.textMuted}>
          Template:
        </Text>
        <Text
          fontSize="xs"
          px={2}
          py={0.5}
          borderRadius="full"
          bg={`${templateData.colors.primary}20`}
          color={templateData.colors.primary}
          fontWeight="medium"
        >
          {templateData.emoji} {templateData.name}
        </Text>
      </HStack>

      {/* Navigation */}
      <HStack spacing={4} pt={4}>
        <Button
          variant="outline"
          onClick={onBack}
          borderColor={THEME.colors.border}
          color={THEME.colors.textSecondary}
        >
          Back
        </Button>
        <Button
          bg="linear-gradient(135deg, #F97316 0%, #FB923C 100%)"
          color="white"
          px={8}
          onClick={onNext}
          isLoading={isSaving}
          _hover={{
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 15px rgba(249, 115, 22, 0.4)',
          }}
          transition="all 0.2s"
        >
          Continue to Publish
        </Button>
      </HStack>
    </VStack>
  );
};

// Editable Field Component
interface EditableFieldProps {
  label: string;
  value: string;
  isEditing: boolean;
  tempValue: string;
  onStartEdit: () => void;
  onTempChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
  templateColors: { primary: string; secondary: string; background: string };
  selectedTemplate: ExtendedTemplateId;
  isSmall?: boolean;
  isMultiline?: boolean;
}

const EditableField = ({
  label,
  value,
  isEditing,
  tempValue,
  onStartEdit,
  onTempChange,
  onSave,
  onCancel,
  templateColors,
  selectedTemplate,
  isSmall,
  isMultiline,
}: EditableFieldProps) => {
  const isDarkTemplate = selectedTemplate === 'creative' || selectedTemplate === 'modern' || selectedTemplate === 'developer';

  if (isEditing) {
    return (
      <VStack spacing={2} w="full" align="stretch">
        <Text fontSize="xs" color={THEME.colors.textMuted} textTransform="uppercase">
          {label}
        </Text>
        {isMultiline ? (
          <Input
            as="textarea"
            value={tempValue}
            onChange={(e) => onTempChange(e.target.value)}
            size="sm"
            minH="80px"
            bg="white"
            border={`2px solid ${THEME.colors.accent}`}
            borderRadius={THEME.borderRadius.md}
            autoFocus
          />
        ) : (
          <Input
            value={tempValue}
            onChange={(e) => onTempChange(e.target.value)}
            size="sm"
            bg="white"
            border={`2px solid ${THEME.colors.accent}`}
            borderRadius={THEME.borderRadius.md}
            autoFocus
          />
        )}
        <HStack spacing={2}>
          <Button size="xs" colorScheme="orange" onClick={onSave}>
            Save
          </Button>
          <Button size="xs" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        </HStack>
      </VStack>
    );
  }

  return (
    <Box
      w="full"
      p={3}
      borderRadius={THEME.borderRadius.md}
      bg={isDarkTemplate ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)'}
      border={`1px dashed ${isDarkTemplate ? 'rgba(255,255,255,0.1)' : THEME.colors.border}`}
      cursor="pointer"
      onClick={onStartEdit}
      transition="all 0.2s"
      _hover={{
        borderColor: templateColors.primary,
        bg: isDarkTemplate ? 'rgba(255,255,255,0.08)' : 'rgba(249, 115, 22, 0.05)',
      }}
      position="relative"
    >
      <HStack justify="space-between" align="start">
        <VStack align="start" spacing={1} flex={1}>
          <Text fontSize="xs" color={THEME.colors.textMuted} textTransform="uppercase">
            {label}
          </Text>
          <Text
            fontSize={isSmall ? 'sm' : 'md'}
            color={isDarkTemplate ? 'white' : THEME.colors.textPrimary}
            fontWeight={isSmall ? 'normal' : 'medium'}
            lineHeight={isMultiline ? '1.6' : '1.4'}
          >
            {value || `Click to add ${label.toLowerCase()}`}
          </Text>
        </VStack>
        <Box color={THEME.colors.textMuted}>
          <EditIcon />
        </Box>
      </HStack>
    </Box>
  );
};

// ============================================
// Step 7: Publish (Custom Slug & Deploy)
// ============================================

interface PublishStepProps extends StepProps {
  basicInfo: BasicInfoState;
  selectedTemplate: ExtendedTemplateId;
  photoUrl: string | null;
  enhancedPhotoUrl: string | null;
  generatedContent: {
    headline: string;
    bio: string;
    tagline: string;
  };
  portfolioId: string | null;
  onPublish: (customSlug: string) => Promise<boolean>;
  isPublishing: boolean;
  publishedUrl: string | null;
}

const PublishStep = ({
  onBack,
  basicInfo,
  selectedTemplate,
  photoUrl,
  enhancedPhotoUrl,
  generatedContent,
  portfolioId,
  onPublish,
  isPublishing,
  publishedUrl,
}: PublishStepProps) => {
  const [customSlug, setCustomSlug] = useState('');
  const [slugStatus, setSlugStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');
  const [suggestedSlug, setSuggestedSlug] = useState('');
  const toast = useToast();

  const displayPhoto = enhancedPhotoUrl || photoUrl;
  const templateData = TEMPLATES_DATA.find(t => t.id === selectedTemplate) || TEMPLATES_DATA[0];

  // Generate suggested slug from name
  useEffect(() => {
    if (basicInfo.name) {
      const slug = basicInfo.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
        .slice(0, 30);
      setSuggestedSlug(slug);
      if (!customSlug) {
        setCustomSlug(slug);
      }
    }
  }, [basicInfo.name]);

  // Check slug availability with debounce
  useEffect(() => {
    if (!customSlug || customSlug.length < 3) {
      setSlugStatus('idle');
      return;
    }

    const timer = setTimeout(async () => {
      setSlugStatus('checking');
      try {
        // Simulated check - in production, call portfolio-slug-check edge function
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Check reserved slugs (simple client-side check)
        const reservedSlugs = ['admin', 'api', 'hushh', 'portfolio', 'new', 'edit', 'settings'];
        if (reservedSlugs.includes(customSlug.toLowerCase())) {
          setSlugStatus('taken');
        } else {
          setSlugStatus('available');
        }
      } catch {
        setSlugStatus('idle');
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [customSlug]);

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '')
      .slice(0, 30);
    setCustomSlug(value);
  };

  const handlePublish = async () => {
    if (slugStatus !== 'available') {
      toast({
        title: 'Invalid URL',
        description: 'Please choose an available URL slug',
        status: 'warning',
        duration: 3000,
      });
      return;
    }

    const success = await onPublish(customSlug);
    if (success) {
      toast({
        title: '🎉 Portfolio Published!',
        description: 'Your portfolio is now live',
        status: 'success',
        duration: 5000,
      });
    }
  };

  const handleCopyUrl = () => {
    if (publishedUrl) {
      navigator.clipboard.writeText(publishedUrl);
      toast({
        title: 'URL Copied!',
        status: 'success',
        duration: 2000,
      });
    }
  };

  // Success state after publishing
  if (publishedUrl) {
    return (
      <VStack spacing={8} py={8} textAlign="center">
        {/* Celebration Animation */}
        <Box
          w={24}
          h={24}
          borderRadius="full"
          bg="linear-gradient(135deg, #10B981 0%, #34D399 100%)"
          display="flex"
          alignItems="center"
          justifyContent="center"
          boxShadow="0 8px 32px rgba(16, 185, 129, 0.4)"
          animation="pulse 2s infinite"
        >
          <CheckCircleIcon />
        </Box>

        <VStack spacing={2}>
          <Text fontSize="2xl" fontWeight="bold" color={THEME.colors.textPrimary}>
            🎉 You're Live!
          </Text>
          <Text fontSize="md" color={THEME.colors.textSecondary}>
            Your portfolio is now published and ready to share
          </Text>
        </VStack>

        {/* Published URL Card */}
        <Box
          w="full"
          maxW="450px"
          p={4}
          bg={THEME.colors.surface}
          borderRadius={THEME.borderRadius.lg}
          border={`1px solid ${THEME.colors.border}`}
        >
          <VStack spacing={3}>
            <Text fontSize="xs" color={THEME.colors.textMuted} textTransform="uppercase">
              Your Portfolio URL
            </Text>
            <HStack
              w="full"
              p={3}
              bg={THEME.colors.backgroundSecondary}
              borderRadius={THEME.borderRadius.md}
              justify="space-between"
            >
              <Text
                fontSize="sm"
                fontWeight="medium"
                color={THEME.colors.accent}
                noOfLines={1}
              >
                {publishedUrl}
              </Text>
              <IconButton
                aria-label="Copy URL"
                icon={<CopyIcon />}
                size="sm"
                variant="ghost"
                onClick={handleCopyUrl}
              />
            </HStack>

            <HStack spacing={3} w="full">
              <Button
                flex={1}
                size="sm"
                bg="linear-gradient(135deg, #F97316 0%, #FB923C 100%)"
                color="white"
                onClick={() => window.open(publishedUrl, '_blank')}
                leftIcon={<ExternalLinkIcon />}
                _hover={{
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 12px rgba(249, 115, 22, 0.3)',
                }}
              >
                View Portfolio
              </Button>
              <Button
                flex={1}
                size="sm"
                variant="outline"
                onClick={handleCopyUrl}
                borderColor={THEME.colors.border}
              >
                Copy Link
              </Button>
            </HStack>
          </VStack>
        </Box>

        {/* Share Options */}
        <VStack spacing={3} w="full" maxW="450px">
          <Text fontSize="sm" color={THEME.colors.textSecondary}>
            Share your portfolio
          </Text>
          <HStack spacing={4}>
            <ShareButton platform="linkedin" url={publishedUrl} />
            <ShareButton platform="twitter" url={publishedUrl} />
            <ShareButton platform="email" url={publishedUrl} />
          </HStack>
        </VStack>

        {/* Next Steps */}
        <Box
          w="full"
          maxW="450px"
          p={4}
          bg="rgba(249, 115, 22, 0.05)"
          borderRadius={THEME.borderRadius.lg}
          border={`1px solid rgba(249, 115, 22, 0.2)`}
        >
          <VStack spacing={2} align="start">
            <Text fontSize="sm" fontWeight="medium" color={THEME.colors.textPrimary}>
              ✨ What's Next?
            </Text>
            <VStack spacing={1} align="start" fontSize="xs" color={THEME.colors.textSecondary}>
              <Text>• Add your portfolio URL to LinkedIn, resume, and social bios</Text>
              <Text>• Share with recruiters and potential employers</Text>
              <Text>• Come back anytime to edit and update your portfolio</Text>
            </VStack>
          </VStack>
        </Box>
      </VStack>
    );
  }

  return (
    <VStack spacing={6} py={4} w="full">
      <VStack spacing={2} textAlign="center">
        <Box
          w={14}
          h={14}
          borderRadius="full"
          bg="linear-gradient(135deg, #F97316 0%, #FB923C 100%)"
          display="flex"
          alignItems="center"
          justifyContent="center"
          boxShadow="0 4px 20px rgba(249, 115, 22, 0.25)"
        >
          <RocketIcon />
        </Box>
        <Text fontSize="xl" fontWeight="semibold" color={THEME.colors.textPrimary}>
          Publish Your Portfolio
        </Text>
        <Text fontSize="sm" color={THEME.colors.textSecondary}>
          Choose a custom URL and go live!
        </Text>
      </VStack>

      {/* URL Customization */}
      <Box w="full" maxW="450px">
        <VStack spacing={4}>
          <FormControl isInvalid={slugStatus === 'taken'}>
            <FormLabel fontSize="sm" color={THEME.colors.textSecondary}>
              Your Portfolio URL
            </FormLabel>
            <InputGroup>
              <InputLeftElement pointerEvents="none" h="full">
                <Text fontSize="sm" color={THEME.colors.textMuted}>
                  🌐
                </Text>
              </InputLeftElement>
              <Input
                value={customSlug}
                onChange={handleSlugChange}
                placeholder="your-name"
                size="lg"
                pl={10}
                bg={THEME.colors.surface}
                border={`1px solid ${
                  slugStatus === 'available'
                    ? '#10B981'
                    : slugStatus === 'taken'
                    ? '#EF4444'
                    : THEME.colors.border
                }`}
                borderRadius={THEME.borderRadius.md}
                _focus={{
                  borderColor: slugStatus === 'available' ? '#10B981' : THEME.colors.accent,
                  boxShadow: `0 0 0 1px ${
                    slugStatus === 'available' ? '#10B981' : THEME.colors.accent
                  }`,
                }}
              />
              {slugStatus === 'checking' && (
                <Box position="absolute" right={3} top="50%" transform="translateY(-50%)">
                  <Spinner size="sm" color={THEME.colors.accent} />
                </Box>
              )}
              {slugStatus === 'available' && (
                <Box position="absolute" right={3} top="50%" transform="translateY(-50%)">
                  <Box color="#10B981">
                    <CheckIcon />
                  </Box>
                </Box>
              )}
            </InputGroup>
            <HStack mt={2} justify="space-between">
              <Text fontSize="xs" color={THEME.colors.textMuted}>
                hushh-folio.web.app/<Text as="span" color={THEME.colors.accent}>{customSlug || 'your-name'}</Text>
              </Text>
              {slugStatus === 'taken' && (
                <Text fontSize="xs" color="#EF4444">
                  This URL is taken
                </Text>
              )}
              {slugStatus === 'available' && (
                <Text fontSize="xs" color="#10B981">
                  Available! ✓
                </Text>
              )}
            </HStack>
          </FormControl>

          {/* URL Tips */}
          <Box
            w="full"
            p={3}
            bg={THEME.colors.backgroundSecondary}
            borderRadius={THEME.borderRadius.md}
          >
            <VStack spacing={1} align="start" fontSize="xs" color={THEME.colors.textMuted}>
              <Text>💡 Tips for a great URL:</Text>
              <Text>• Use your name or professional brand</Text>
              <Text>• Keep it short and memorable</Text>
              <Text>• Only letters, numbers, and hyphens allowed</Text>
            </VStack>
          </Box>
        </VStack>
      </Box>

      {/* Mini Preview Card */}
      <Box
        w="full"
        maxW="450px"
        p={4}
        bg={THEME.colors.surface}
        borderRadius={THEME.borderRadius.lg}
        border={`1px solid ${THEME.colors.border}`}
      >
        <HStack spacing={4}>
          {/* Photo */}
          <Box
            w={16}
            h={16}
            borderRadius="full"
            overflow="hidden"
            bg={THEME.colors.backgroundSecondary}
            flexShrink={0}
          >
            {displayPhoto ? (
              <img
                src={displayPhoto}
                alt={basicInfo.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <Flex w="full" h="full" align="center" justify="center">
                <Text fontSize="xl" color={THEME.colors.textMuted}>
                  {basicInfo.name?.charAt(0)?.toUpperCase() || '?'}
                </Text>
              </Flex>
            )}
          </Box>

          {/* Info */}
          <VStack align="start" spacing={0} flex={1}>
            <Text fontWeight="semibold" color={THEME.colors.textPrimary} noOfLines={1}>
              {basicInfo.name}
            </Text>
            <Text fontSize="sm" color={THEME.colors.textSecondary} noOfLines={1}>
              {generatedContent.headline || 'Your headline'}
            </Text>
            <HStack spacing={2} pt={1}>
              <Text
                fontSize="xs"
                px={2}
                py={0.5}
                borderRadius="full"
                bg={`${templateData.colors.primary}20`}
                color={templateData.colors.primary}
              >
                {templateData.emoji} {templateData.name}
              </Text>
            </HStack>
          </VStack>
        </HStack>
      </Box>

      {/* Publish Button */}
      <VStack spacing={4} pt={4}>
        <HStack spacing={4}>
          <Button
            variant="outline"
            onClick={onBack}
            borderColor={THEME.colors.border}
            color={THEME.colors.textSecondary}
          >
            Back
          </Button>
          <Button
            size="lg"
            bg="linear-gradient(135deg, #F97316 0%, #FB923C 100%)"
            color="white"
            px={10}
            onClick={handlePublish}
            isLoading={isPublishing}
            loadingText="Publishing..."
            isDisabled={slugStatus !== 'available'}
            leftIcon={<RocketIcon />}
            _hover={{
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 25px rgba(249, 115, 22, 0.4)',
            }}
            _disabled={{
              opacity: 0.5,
              cursor: 'not-allowed',
            }}
            transition="all 0.2s"
          >
            Publish Portfolio
          </Button>
        </HStack>
        <Text fontSize="xs" color={THEME.colors.textMuted}>
          🔒 Free forever • You can edit anytime
        </Text>
      </VStack>
    </VStack>
  );
};

// Share Button Component
interface ShareButtonProps {
  platform: 'linkedin' | 'twitter' | 'email';
  url: string;
}

const ShareButton = ({ platform, url }: ShareButtonProps) => {
  const icons: Record<string, JSX.Element> = {
    linkedin: <LinkedInIcon />,
    twitter: <TwitterIcon />,
    email: <EmailIcon />,
  };

  const handleShare = () => {
    const text = encodeURIComponent('Check out my professional portfolio!');
    const encodedUrl = encodeURIComponent(url);

    const shareUrls: Record<string, string> = {
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      twitter: `https://twitter.com/intent/tweet?text=${text}&url=${encodedUrl}`,
      email: `mailto:?subject=My%20Portfolio&body=${text}%20${encodedUrl}`,
    };

    window.open(shareUrls[platform], '_blank');
  };

  return (
    <IconButton
      aria-label={`Share on ${platform}`}
      icon={icons[platform]}
      size="lg"
      variant="outline"
      borderRadius="full"
      onClick={handleShare}
      borderColor={THEME.colors.border}
      _hover={{
        bg: THEME.colors.backgroundSecondary,
        transform: 'translateY(-2px)',
      }}
    />
  );
};

// ============================================
// Main Portfolio Wizard Component
// ============================================

export default function PortfolioWizardPage() {
  const navigate = useNavigate();
  const toast = useToast();

  // State - Now using 8-step ExtendedWizardStep
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentStep, setCurrentStep] = useState<ExtendedWizardStep>(1);
  const [isSaving, setIsSaving] = useState(false);
  const [portfolioId, setPortfolioId] = useState<string | null>(null);

  // NEW: Persona state
  const [selectedPersona, setSelectedPersona] = useState<PersonaId | null>(null);

  // Form state
  const [basicInfo, setBasicInfo] = useState<BasicInfoState>({
    name: '',
    email: '',
    dob: undefined,
    phone: undefined,
    linkedinUrl: undefined,
  });

  // Interview state
  const [interviewAnswers, setInterviewAnswers] = useState<Map<number, string>>(new Map());

  // Template state - Now using ExtendedTemplateId
  const [selectedTemplate, setSelectedTemplate] = useState<ExtendedTemplateId>('minimal');

  // NEW: Custom styling state
  const [customStyling, setCustomStyling] = useState<CustomStyling>(DEFAULT_STYLING);

  // Photo state
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [enhancedPhotoUrl, setEnhancedPhotoUrl] = useState<string | null>(null);
  const [isEnhancing, setIsEnhancing] = useState(false);

  // Generated content state (AI-generated)
  const [generatedContent, setGeneratedContent] = useState({
    headline: '',
    bio: '',
    tagline: '',
  });
  const [isGeneratingContent, setIsGeneratingContent] = useState(false);

  // Publish state
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishedUrl, setPublishedUrl] = useState<string | null>(null);

  // Generate AI content from interview answers
  const generateAIContent = useCallback(async () => {
    setIsGeneratingContent(true);
    try {
      // Collect all answers into a context string
      const answersContext = Array.from(interviewAnswers.entries())
        .map(([qId, answer]) => {
          const question = INTERVIEW_QUESTIONS.find(q => q.id === qId);
          return question ? `${question.question}\n${answer}` : '';
        })
        .filter(Boolean)
        .join('\n\n');

      // For now, generate placeholder content based on answers
      // In production, this would call a GCP Vertex AI Gemini edge function
      await new Promise(resolve => setTimeout(resolve, 2500)); // Simulate AI processing

      // Extract role from first answer
      const roleAnswer = interviewAnswers.get(1) || 'Professional';
      const skillsAnswer = interviewAnswers.get(3) || '';
      const passionAnswer = interviewAnswers.get(6) || '';
      const uniqueAnswer = interviewAnswers.get(9) || '';

      // Generate content (placeholder - would be AI-generated)
      const headline = `${roleAnswer.split(' ').slice(0, 4).join(' ')} | ${skillsAnswer.split(',')[0]?.trim() || 'Expert'}`;
      const tagline = passionAnswer 
        ? `Passionate about ${passionAnswer.toLowerCase().slice(0, 50)}...`
        : 'Building the future, one project at a time';
      const bio = uniqueAnswer 
        ? `${uniqueAnswer.slice(0, 200)}${uniqueAnswer.length > 200 ? '...' : ''}`
        : `A dedicated professional with expertise in ${skillsAnswer || 'various domains'}. ${passionAnswer ? `Passionate about ${passionAnswer.toLowerCase()}.` : ''} Always striving for excellence and innovation.`;

      setGeneratedContent({
        headline: headline.slice(0, 100),
        tagline: tagline.slice(0, 80),
        bio: bio.slice(0, 300),
      });

      toast({
        title: 'Content generated!',
        description: 'Your portfolio content has been created',
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      console.error('Error generating content:', error);
      toast({
        title: 'Generation failed',
        description: 'Please try again',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setIsGeneratingContent(false);
    }
  }, [interviewAnswers, toast]);

  // Handle content field changes
  const handleContentChange = useCallback((field: 'headline' | 'bio' | 'tagline', value: string) => {
    setGeneratedContent(prev => ({ ...prev, [field]: value }));
  }, []);

  // Trigger AI content generation when entering Step 6
  useEffect(() => {
    if (currentStep === 6 && !generatedContent.headline && !isGeneratingContent) {
      generateAIContent();
    }
  }, [currentStep, generatedContent.headline, isGeneratingContent, generateAIContent]);

  // Check auth on mount and pre-fill email
  useEffect(() => {
    const checkAuth = async () => {
      const authenticated = await service.isAuthenticated();
      if (!authenticated) {
        navigate('/hushh-ai/login');
        return;
      }
      
      // Pre-fill email from user profile
      const profile = await service.getUserProfile();
      if (profile?.email) {
        setBasicInfo(prev => ({ ...prev, email: profile.email }));
      }
      if (profile?.displayName) {
        setBasicInfo(prev => ({ ...prev, name: profile.displayName || '' }));
      }
      
      setIsAuthenticated(true);
      setIsLoading(false);
    };
    checkAuth();
  }, [navigate]);

  // Handle form data changes
  const handleBasicInfoChange = useCallback((data: Partial<BasicInfoState>) => {
    setBasicInfo(prev => ({ ...prev, ...data }));
  }, []);

  // Handle interview answer changes
  const handleInterviewAnswerChange = useCallback((questionId: number, answer: string) => {
    setInterviewAnswers(prev => {
      const newMap = new Map(prev);
      newMap.set(questionId, answer);
      return newMap;
    });
  }, []);

  // Handle photo upload (convert to base64 for local preview)
  const handlePhotoUpload = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      setPhotoUrl(reader.result as string);
      setEnhancedPhotoUrl(null); // Reset enhanced photo when new photo is uploaded
    };
    reader.readAsDataURL(file);
  }, []);

  // Handle AI photo enhancement (placeholder - will call edge function)
  const handleEnhancePhoto = useCallback(async () => {
    if (!photoUrl) return;
    
    setIsEnhancing(true);
    try {
      // TODO: Call portfolio-photo-enhance edge function with GCP Imagen API
      // For now, simulate enhancement with a delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In production, this would return the enhanced photo URL from the edge function
      // For now, just use the same photo (simulating enhancement)
      setEnhancedPhotoUrl(photoUrl);
      
      toast({
        title: 'Photo enhanced!',
        description: 'Your photo has been professionally enhanced',
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      console.error('Error enhancing photo:', error);
      toast({
        title: 'Enhancement failed',
        description: 'Please try again',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setIsEnhancing(false);
    }
  }, [photoUrl, toast]);

  // Save basic info to Supabase and create portfolio
  const saveBasicInfo = async (): Promise<boolean> => {
    if (!config.supabaseClient) return false;
    
    setIsSaving(true);
    try {
      const { data: { user } } = await config.supabaseClient.auth.getUser();
      if (!user) {
        toast({
          title: 'Not authenticated',
          status: 'error',
          duration: 3000,
        });
        return false;
      }

      // Generate slug from name
      const slug = basicInfo.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
        .slice(0, 50);

      // Create or update portfolio
      const portfolioData = {
        user_id: user.id,
        slug: `${slug}-${Date.now().toString(36)}`,
        name: basicInfo.name,
        email: basicInfo.email,
        dob: basicInfo.dob || null,
        phone: basicInfo.phone || null,
        linkedin_url: basicInfo.linkedinUrl || null,
        wizard_step: 2,
      };

      if (portfolioId) {
        // Update existing
        const { error } = await config.supabaseClient
          .from('portfolios')
          .update(portfolioData)
          .eq('id', portfolioId);

        if (error) throw error;
      } else {
        // Create new
        const { data, error } = await config.supabaseClient
          .from('portfolios')
          .insert(portfolioData)
          .select()
          .single();

        if (error) throw error;
        setPortfolioId(data.id);
      }

      return true;
    } catch (error) {
      console.error('Error saving portfolio:', error);
      toast({
        title: 'Failed to save',
        description: 'Please try again',
        status: 'error',
        duration: 3000,
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  // Handlers - Updated for 8-step flow
  const handleNext = async () => {
    // For step 3 (Basic Info), save basic info first
    if (currentStep === 3) {
      const saved = await saveBasicInfo();
      if (!saved) return;
    }
    
    if (currentStep < 8) {
      setCurrentStep((prev) => (prev + 1) as ExtendedWizardStep);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as ExtendedWizardStep);
    } else {
      navigate('/hushh-ai');
    }
  };

  const handleClose = () => {
    navigate('/hushh-ai');
  };

  // Loading state
  if (isLoading) {
    return (
      <Flex h="100vh" bg={THEME.colors.background} align="center" justify="center">
        <VStack spacing={4}>
          <Spinner size="lg" color={THEME.colors.accent} />
          <Text color={THEME.colors.textSecondary}>Loading Portfolio Builder...</Text>
        </VStack>
      </Flex>
    );
  }

  // Get current step info - Using 8-step extended flow
  const stepInfo = EXTENDED_WIZARD_STEPS.find((s) => s.step === currentStep);
  const progress = (currentStep / 8) * 100;

  return (
    <Flex h="100vh" bg={THEME.colors.background} direction="column">
      {/* Header */}
      <HStack
        p={4}
        borderBottom={`1px solid ${THEME.colors.border}`}
        bg={THEME.colors.surface}
        justify="space-between"
      >
        <HStack spacing={4}>
          <IconButton
            aria-label="Back"
            icon={<BackIcon />}
            variant="ghost"
            size="sm"
            onClick={handleBack}
          />
          <VStack align="start" spacing={0}>
            <Text
              fontSize={THEME.fontSizes.lg}
              fontWeight={THEME.fontWeights.semibold}
              color={THEME.colors.textPrimary}
            >
              Hushh Folio
            </Text>
            <Text fontSize={THEME.fontSizes.xs} color={THEME.colors.textSecondary}>
              {stepInfo?.title} - Step {currentStep} of 8
            </Text>
          </VStack>
        </HStack>

        <IconButton
          aria-label="Close"
          icon={<CloseIcon />}
          variant="ghost"
          size="sm"
          onClick={handleClose}
        />
      </HStack>

      {/* Progress Bar */}
      <Progress
        value={progress}
        size="xs"
        colorScheme="orange"
        bg={THEME.colors.border}
      />

      {/* Step Content */}
      <Flex flex={1} overflow="auto" justify="center" align="center" p={6}>
        <Box w="full" maxW="600px">
          <AnimatePresence mode="wait">
            <MotionBox
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {/* Step 1: Persona Selection (NEW) */}
              {currentStep === 1 && (
                <PersonaSelectionStep
                  selectedPersona={selectedPersona}
                  onSelectPersona={setSelectedPersona}
                  onNext={handleNext}
                />
              )}
              
              {/* Step 2: Basic Info */}
              {currentStep === 2 && (
                <BasicInfoStep
                  onNext={handleNext}
                  onBack={handleBack}
                  isFirst={false}
                  isLast={false}
                  formData={basicInfo}
                  onFormChange={handleBasicInfoChange}
                  isSaving={isSaving}
                />
              )}
              
              {/* Step 3: Interview with Persona-Based Questions */}
              {currentStep === 3 && (
                <InterviewStep
                  onNext={handleNext}
                  onBack={handleBack}
                  isFirst={false}
                  isLast={false}
                  answers={interviewAnswers}
                  onAnswerChange={handleInterviewAnswerChange}
                  isSaving={isSaving}
                  selectedPersona={selectedPersona}
                />
              )}
              
              {/* Step 4: Extended Template Selection (NEW - 12 templates) */}
              {currentStep === 4 && (
                <ExtendedTemplateSelectionStep
                  selectedTemplate={selectedTemplate}
                  selectedPersona={selectedPersona}
                  onSelectTemplate={setSelectedTemplate}
                  onNext={handleNext}
                  onBack={handleBack}
                />
              )}
              
              {/* Step 5: Custom Styling (NEW) */}
              {currentStep === 5 && (
                <CustomStylingStep
                  styling={customStyling}
                  selectedTemplate={selectedTemplate}
                  onUpdateStyling={(updates) => setCustomStyling(prev => ({ ...prev, ...updates }))}
                  onNext={handleNext}
                  onBack={handleBack}
                />
              )}
              
              {/* Step 6: Photo Upload */}
              {currentStep === 6 && (
                <PhotoUploadStep
                  onNext={handleNext}
                  onBack={handleBack}
                  isFirst={false}
                  isLast={false}
                  photoUrl={photoUrl}
                  enhancedPhotoUrl={enhancedPhotoUrl}
                  onPhotoUpload={handlePhotoUpload}
                  onEnhancePhoto={handleEnhancePhoto}
                  isEnhancing={isEnhancing}
                  isSaving={isSaving}
                />
              )}
              
              {/* Step 7: Preview & Edit */}
              {currentStep === 7 && (
                <PreviewEditStep
                  onNext={handleNext}
                  onBack={handleBack}
                  isFirst={false}
                  isLast={false}
                  basicInfo={basicInfo}
                  interviewAnswers={interviewAnswers}
                  selectedTemplate={selectedTemplate}
                  photoUrl={photoUrl}
                  enhancedPhotoUrl={enhancedPhotoUrl}
                  generatedContent={generatedContent}
                  onContentChange={handleContentChange}
                  isGenerating={isGeneratingContent}
                  onRegenerate={generateAIContent}
                  isSaving={isSaving}
                />
              )}
              
              {/* Step 8: Publish */}
              {currentStep === 8 && (
                <PublishStep
                  onNext={handleNext}
                  onBack={handleBack}
                  isFirst={false}
                  isLast={true}
                  basicInfo={basicInfo}
                  selectedTemplate={selectedTemplate}
                  photoUrl={photoUrl}
                  enhancedPhotoUrl={enhancedPhotoUrl}
                  generatedContent={generatedContent}
                  portfolioId={portfolioId}
                  onPublish={async (customSlug: string) => {
                    setIsPublishing(true);
                    try {
                      // TODO: Call portfolio-deploy edge function
                      // For now, simulate publishing
                      await new Promise(resolve => setTimeout(resolve, 2000));
                      
                      // Set the published URL
                      setPublishedUrl(`https://hushh-folio.web.app/${customSlug}`);
                      return true;
                    } catch (error) {
                      console.error('Error publishing:', error);
                      toast({
                        title: 'Publish failed',
                        description: 'Please try again',
                        status: 'error',
                        duration: 3000,
                      });
                      return false;
                    } finally {
                      setIsPublishing(false);
                    }
                  }}
                  isPublishing={isPublishing}
                  publishedUrl={publishedUrl}
                />
              )}
            </MotionBox>
          </AnimatePresence>
        </Box>
      </Flex>

      {/* Step Indicators - Using 8-step extended flow */}
      <HStack
        p={4}
        borderTop={`1px solid ${THEME.colors.border}`}
        bg={THEME.colors.surface}
        justify="center"
        spacing={2}
      >
        {EXTENDED_WIZARD_STEPS.map((step) => (
          <Box
            key={step.step}
            w={step.step === currentStep ? '24px' : '8px'}
            h="8px"
            borderRadius="full"
            bg={
              step.step === currentStep
                ? THEME.colors.accent
                : step.step < currentStep
                ? THEME.colors.accent
                : THEME.colors.border
            }
            opacity={step.step <= currentStep ? 1 : 0.5}
            transition="all 0.2s"
          />
        ))}
      </HStack>
    </Flex>
  );
}

// ============================================
// Icons
// ============================================

const PortfolioIcon = ({ size = 24 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="white"
    strokeWidth="2"
  >
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
);

const BackIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M19 12H5M12 19l-7-7 7-7" />
  </svg>
);

const CloseIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const UserIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="white"
    strokeWidth="2"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const EmailIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke={THEME.colors.textMuted}
    strokeWidth="2"
  >
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const PhoneIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke={THEME.colors.textMuted}
    strokeWidth="2"
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const LinkedInIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill={THEME.colors.textMuted}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const AIIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="white"
    strokeWidth="2"
  >
    <path d="M12 2L2 7l10 5 10-5-10-5z" />
    <path d="M2 17l10 5 10-5" />
    <path d="M2 12l10 5 10-5" />
  </svg>
);

const TemplateIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="white"
    strokeWidth="2"
  >
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <line x1="3" y1="9" x2="21" y2="9" />
    <line x1="9" y1="21" x2="9" y2="9" />
  </svg>
);

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

const CameraIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="white"
    strokeWidth="2"
  >
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
    <circle cx="12" cy="13" r="4" />
  </svg>
);

const UploadIcon = () => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    stroke={THEME.colors.textMuted}
    strokeWidth="2"
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

const SparkleIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M12 2L15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2z" />
  </svg>
);

const PreviewIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="white"
    strokeWidth="2"
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EditIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const RocketIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
    <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
    <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg
    width="40"
    height="40"
    viewBox="0 0 24 24"
    fill="none"
    stroke="white"
    strokeWidth="2"
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const CopyIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

const ExternalLinkIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

const TwitterIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill={THEME.colors.textMuted}
  >
    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
  </svg>
);
