/**
 * CustomStylingStep - Step 5 of Hushh Folio Wizard
 * Customize colors, fonts, and visual effects
 */

import { useState } from 'react';
import {
  Box,
  Flex,
  Text,
  VStack,
  HStack,
  Button,
  SimpleGrid,
  Switch,
  Input,
  Divider,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import {
  type CustomStyling,
  type FontFamily,
  type BorderRadius,
  type CardStyle,
  FONT_OPTIONS,
  COLOR_PRESETS,
  DEFAULT_STYLING,
  getTemplateById,
  type ExtendedTemplateId,
} from '../../types/portfolioPersonas';

const MotionBox = motion(Box);

interface CustomStylingStepProps {
  styling: CustomStyling;
  selectedTemplate: ExtendedTemplateId | null;
  onUpdateStyling: (styling: Partial<CustomStyling>) => void;
  onNext: () => void;
  onBack: () => void;
}

export const CustomStylingStep = ({
  styling,
  selectedTemplate,
  onUpdateStyling,
  onNext,
  onBack,
}: CustomStylingStepProps) => {
  const [activeSection, setActiveSection] = useState<'colors' | 'fonts' | 'effects'>('colors');

  // Apply template colors
  const applyTemplateColors = () => {
    if (!selectedTemplate) return;
    const template = getTemplateById(selectedTemplate);
    if (template) {
      onUpdateStyling({
        primaryColor: template.colors.primary,
        secondaryColor: template.colors.secondary,
        backgroundColor: template.colors.background,
        textColor: template.colors.text,
        accentColor: template.colors.accent,
      });
    }
  };

  // Reset to defaults
  const resetToDefaults = () => {
    onUpdateStyling(DEFAULT_STYLING);
  };

  return (
    <VStack spacing={6} py={6} w="full" maxW="800px" mx="auto">
      {/* Header */}
      <VStack spacing={3} textAlign="center">
        <Box
          w={16}
          h={16}
          borderRadius="full"
          bg="linear-gradient(135deg, #EC4899 0%, #F472B6 100%)"
          display="flex"
          alignItems="center"
          justifyContent="center"
          boxShadow="0 8px 32px rgba(236, 72, 153, 0.3)"
        >
          <Text fontSize="2xl">✨</Text>
        </Box>
        <Text fontSize="2xl" fontWeight="bold" color="#1A1A1A">
          Make It Yours
        </Text>
        <Text fontSize="md" color="#6B7280" maxW="500px">
          Customize colors, fonts, and effects to match your personal brand.
        </Text>
      </VStack>

      {/* Section Tabs */}
      <HStack
        bg="#F3F4F6"
        p={1}
        borderRadius="full"
        spacing={0}
      >
        {(['colors', 'fonts', 'effects'] as const).map((section) => (
          <Button
            key={section}
            size="sm"
            variant="ghost"
            bg={activeSection === section ? 'white' : 'transparent'}
            boxShadow={activeSection === section ? 'sm' : 'none'}
            borderRadius="full"
            px={6}
            py={2}
            onClick={() => setActiveSection(section)}
            color={activeSection === section ? '#1A1A1A' : '#6B7280'}
            fontWeight={activeSection === section ? 'semibold' : 'normal'}
            _hover={{ bg: activeSection === section ? 'white' : '#E5E7EB' }}
          >
            {section === 'colors' && '🎨 Colors'}
            {section === 'fonts' && '🔤 Fonts'}
            {section === 'effects' && '✨ Effects'}
          </Button>
        ))}
      </HStack>

      {/* Section Content */}
      <Box w="full" bg="white" borderRadius="20px" p={6} border="1px solid #E5E7EB">
        {activeSection === 'colors' && (
          <ColorsSection styling={styling} onUpdateStyling={onUpdateStyling} />
        )}
        {activeSection === 'fonts' && (
          <FontsSection styling={styling} onUpdateStyling={onUpdateStyling} />
        )}
        {activeSection === 'effects' && (
          <EffectsSection styling={styling} onUpdateStyling={onUpdateStyling} />
        )}
      </Box>

      {/* Quick Actions */}
      <HStack spacing={3}>
        <Button
          size="sm"
          variant="ghost"
          color="#6B7280"
          onClick={applyTemplateColors}
          leftIcon={<Text fontSize="sm">🎯</Text>}
        >
          Use Template Colors
        </Button>
        <Button
          size="sm"
          variant="ghost"
          color="#6B7280"
          onClick={resetToDefaults}
          leftIcon={<Text fontSize="sm">↺</Text>}
        >
          Reset to Defaults
        </Button>
      </HStack>

      {/* Live Preview */}
      <LivePreview styling={styling} />

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
          _hover={{
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 25px rgba(249, 115, 22, 0.4)',
          }}
          sx={{ transition: 'all 0.2s' }}
        >
          Continue
        </Button>
      </Flex>
    </VStack>
  );
};

// Colors Section
const ColorsSection = ({
  styling,
  onUpdateStyling,
}: {
  styling: CustomStyling;
  onUpdateStyling: (s: Partial<CustomStyling>) => void;
}) => (
  <VStack spacing={6} align="stretch">
    {/* Color Presets */}
    <Box>
      <Text fontWeight="semibold" color="#1A1A1A" mb={3}>
        Color Presets
      </Text>
      <SimpleGrid columns={{ base: 2, sm: 4 }} spacing={3}>
        {COLOR_PRESETS.map((preset) => (
          <MotionBox
            key={preset.name}
            as="button"
            onClick={() => onUpdateStyling(preset.colors)}
            p={3}
            borderRadius="12px"
            border="1px solid #E5E7EB"
            bg="white"
            textAlign="center"
            cursor="pointer"
            sx={{ transition: 'all 0.2s' }}
            _hover={{
              borderColor: preset.colors.primaryColor,
              transform: 'translateY(-2px)',
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <HStack spacing={1} justify="center" mb={2}>
              <Box w={4} h={4} borderRadius="full" bg={preset.colors.primaryColor} />
              <Box w={4} h={4} borderRadius="full" bg={preset.colors.secondaryColor} />
              <Box w={4} h={4} borderRadius="full" bg={preset.colors.accentColor} />
            </HStack>
            <Text fontSize="xs" color="#6B7280">
              {preset.name}
            </Text>
          </MotionBox>
        ))}
      </SimpleGrid>
    </Box>

    <Divider />

    {/* Custom Colors */}
    <Box>
      <Text fontWeight="semibold" color="#1A1A1A" mb={3}>
        Custom Colors
      </Text>
      <SimpleGrid columns={{ base: 2, sm: 3 }} spacing={4}>
        <ColorPicker
          label="Primary"
          value={styling.primaryColor}
          onChange={(v) => onUpdateStyling({ primaryColor: v })}
        />
        <ColorPicker
          label="Secondary"
          value={styling.secondaryColor}
          onChange={(v) => onUpdateStyling({ secondaryColor: v })}
        />
        <ColorPicker
          label="Accent"
          value={styling.accentColor}
          onChange={(v) => onUpdateStyling({ accentColor: v })}
        />
        <ColorPicker
          label="Background"
          value={styling.backgroundColor}
          onChange={(v) => onUpdateStyling({ backgroundColor: v })}
        />
        <ColorPicker
          label="Text"
          value={styling.textColor}
          onChange={(v) => onUpdateStyling({ textColor: v })}
        />
      </SimpleGrid>
    </Box>
  </VStack>
);

// Color Picker Component
const ColorPicker = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) => (
  <VStack align="start" spacing={2}>
    <Text fontSize="sm" color="#6B7280">
      {label}
    </Text>
    <HStack spacing={2}>
      <Box
        as="label"
        w={10}
        h={10}
        borderRadius="10px"
        bg={value}
        border="2px solid #E5E7EB"
        cursor="pointer"
        position="relative"
        overflow="hidden"
      >
        <Input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          position="absolute"
          inset={0}
          opacity={0}
          cursor="pointer"
          w="full"
          h="full"
        />
      </Box>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        size="sm"
        w="90px"
        fontFamily="mono"
        fontSize="xs"
        borderRadius="8px"
      />
    </HStack>
  </VStack>
);

// Fonts Section
const FontsSection = ({
  styling,
  onUpdateStyling,
}: {
  styling: CustomStyling;
  onUpdateStyling: (s: Partial<CustomStyling>) => void;
}) => (
  <VStack spacing={6} align="stretch">
    {/* Font Family */}
    <Box>
      <Text fontWeight="semibold" color="#1A1A1A" mb={3}>
        Font Family
      </Text>
      <SimpleGrid columns={{ base: 2, sm: 4 }} spacing={3}>
        {FONT_OPTIONS.map((font) => (
          <MotionBox
            key={font.id}
            as="button"
            onClick={() => onUpdateStyling({ fontFamily: font.id })}
            p={4}
            borderRadius="12px"
            border={`2px solid ${styling.fontFamily === font.id ? '#F97316' : '#E5E7EB'}`}
            bg={styling.fontFamily === font.id ? '#FFF7ED' : 'white'}
            textAlign="center"
            cursor="pointer"
            sx={{ transition: 'all 0.2s' }}
            _hover={{
              borderColor: styling.fontFamily === font.id ? '#F97316' : '#D1D5DB',
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Text
              fontSize="lg"
              fontWeight="semibold"
              color="#1A1A1A"
              fontFamily={getFontStack(font.id)}
            >
              Aa
            </Text>
            <Text fontSize="xs" color="#6B7280" mt={1}>
              {font.name}
            </Text>
            <Text fontSize="10px" color="#9CA3AF">
              {font.preview}
            </Text>
          </MotionBox>
        ))}
      </SimpleGrid>
    </Box>

    <Divider />

    {/* Border Radius */}
    <Box>
      <Text fontWeight="semibold" color="#1A1A1A" mb={3}>
        Corner Style
      </Text>
      <HStack spacing={3}>
        {(['none', 'small', 'medium', 'large', 'full'] as BorderRadius[]).map((radius) => (
          <Button
            key={radius}
            size="sm"
            variant={styling.borderRadius === radius ? 'solid' : 'outline'}
            bg={styling.borderRadius === radius ? '#F97316' : 'white'}
            color={styling.borderRadius === radius ? 'white' : '#6B7280'}
            borderColor="#E5E7EB"
            borderRadius={getBorderRadiusValue(radius)}
            onClick={() => onUpdateStyling({ borderRadius: radius })}
            _hover={{
              bg: styling.borderRadius === radius ? '#EA580C' : '#F3F4F6',
            }}
          >
            {radius.charAt(0).toUpperCase() + radius.slice(1)}
          </Button>
        ))}
      </HStack>
    </Box>

    <Divider />

    {/* Card Style */}
    <Box>
      <Text fontWeight="semibold" color="#1A1A1A" mb={3}>
        Card Style
      </Text>
      <SimpleGrid columns={4} spacing={3}>
        {(['flat', 'elevated', 'bordered', 'glass'] as CardStyle[]).map((style) => (
          <MotionBox
            key={style}
            as="button"
            onClick={() => onUpdateStyling({ cardStyle: style })}
            p={4}
            borderRadius="12px"
            border={`2px solid ${styling.cardStyle === style ? '#F97316' : '#E5E7EB'}`}
            bg={styling.cardStyle === style ? '#FFF7ED' : 'white'}
            boxShadow={getCardStylePreview(style)}
            textAlign="center"
            cursor="pointer"
            sx={{ transition: 'all 0.2s' }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Text fontSize="sm" color="#1A1A1A" fontWeight="medium">
              {style.charAt(0).toUpperCase() + style.slice(1)}
            </Text>
          </MotionBox>
        ))}
      </SimpleGrid>
    </Box>
  </VStack>
);

// Effects Section
const EffectsSection = ({
  styling,
  onUpdateStyling,
}: {
  styling: CustomStyling;
  onUpdateStyling: (s: Partial<CustomStyling>) => void;
}) => (
  <VStack spacing={5} align="stretch">
    <HStack justify="space-between" p={4} bg="#F9FAFB" borderRadius="12px">
      <VStack align="start" spacing={0}>
        <Text fontWeight="medium" color="#1A1A1A">
          Animations
        </Text>
        <Text fontSize="xs" color="#6B7280">
          Enable smooth transitions and hover effects
        </Text>
      </VStack>
      <Switch
        isChecked={styling.enableAnimations}
        onChange={(e) => onUpdateStyling({ enableAnimations: e.target.checked })}
        colorScheme="orange"
        size="lg"
      />
    </HStack>

    <HStack justify="space-between" p={4} bg="#F9FAFB" borderRadius="12px">
      <VStack align="start" spacing={0}>
        <Text fontWeight="medium" color="#1A1A1A">
          Gradients
        </Text>
        <Text fontSize="xs" color="#6B7280">
          Use gradient backgrounds and overlays
        </Text>
      </VStack>
      <Switch
        isChecked={styling.enableGradients}
        onChange={(e) => onUpdateStyling({ enableGradients: e.target.checked })}
        colorScheme="orange"
        size="lg"
      />
    </HStack>

    <HStack justify="space-between" p={4} bg="#F9FAFB" borderRadius="12px">
      <VStack align="start" spacing={0}>
        <Text fontWeight="medium" color="#1A1A1A">
          Shadows
        </Text>
        <Text fontSize="xs" color="#6B7280">
          Add depth with drop shadows
        </Text>
      </VStack>
      <Switch
        isChecked={styling.enableShadows}
        onChange={(e) => onUpdateStyling({ enableShadows: e.target.checked })}
        colorScheme="orange"
        size="lg"
      />
    </HStack>
  </VStack>
);

// Live Preview Component
const LivePreview = ({ styling }: { styling: CustomStyling }) => (
  <Box w="full" p={4} bg="#F9FAFB" borderRadius="16px">
    <Text fontSize="sm" color="#6B7280" mb={3} textAlign="center">
      Live Preview
    </Text>
    <Box
      bg={styling.backgroundColor}
      borderRadius={getBorderRadiusValue(styling.borderRadius)}
      p={5}
      boxShadow={styling.enableShadows ? '0 4px 20px rgba(0,0,0,0.1)' : 'none'}
      border="1px solid #E5E7EB"
    >
      {/* Preview Header */}
      <HStack spacing={3} mb={4}>
        <Box
          w={12}
          h={12}
          borderRadius="full"
          bg={styling.enableGradients
            ? `linear-gradient(135deg, ${styling.primaryColor} 0%, ${styling.secondaryColor} 100%)`
            : styling.primaryColor
          }
        />
        <VStack align="start" spacing={0}>
          <Text
            fontWeight="bold"
            color={styling.textColor}
            fontFamily={getFontStack(styling.fontFamily)}
          >
            John Doe
          </Text>
          <Text fontSize="sm" color={styling.accentColor}>
            Software Engineer
          </Text>
        </VStack>
      </HStack>

      {/* Preview Card */}
      <Box
        p={4}
        borderRadius={getBorderRadiusValue(styling.borderRadius)}
        bg={styling.cardStyle === 'glass' ? `${styling.primaryColor}10` : 'white'}
        boxShadow={
          styling.cardStyle === 'elevated' && styling.enableShadows
            ? '0 2px 8px rgba(0,0,0,0.1)'
            : 'none'
        }
        border={styling.cardStyle === 'bordered' ? `1px solid ${styling.primaryColor}` : 'none'}
        sx={{
          transition: styling.enableAnimations ? 'all 0.2s' : 'none',
        }}
      >
        <Text
          fontSize="sm"
          fontWeight="medium"
          color={styling.textColor}
          fontFamily={getFontStack(styling.fontFamily)}
        >
          Experience
        </Text>
        <Text fontSize="xs" color={styling.textColor} opacity={0.7} mt={1}>
          5+ years building scalable applications
        </Text>
      </Box>

      {/* Preview Button */}
      <Button
        size="sm"
        mt={4}
        bg={styling.enableGradients
          ? `linear-gradient(135deg, ${styling.primaryColor} 0%, ${styling.secondaryColor} 100%)`
          : styling.primaryColor
        }
        color="white"
        borderRadius={getBorderRadiusValue(styling.borderRadius)}
        _hover={{
          transform: styling.enableAnimations ? 'translateY(-2px)' : 'none',
        }}
        sx={{
          transition: styling.enableAnimations ? 'all 0.2s' : 'none',
        }}
      >
        Contact Me
      </Button>
    </Box>
  </Box>
);

// Helper Functions
const getFontStack = (fontFamily: FontFamily): string => {
  const stacks: Record<FontFamily, string> = {
    inter: "'Inter', sans-serif",
    poppins: "'Poppins', sans-serif",
    playfair: "'Playfair Display', serif",
    roboto: "'Roboto', sans-serif",
    montserrat: "'Montserrat', sans-serif",
    merriweather: "'Merriweather', serif",
    source_code: "'Source Code Pro', monospace",
    dm_sans: "'DM Sans', sans-serif",
  };
  return stacks[fontFamily] || stacks.inter;
};

const getBorderRadiusValue = (radius: BorderRadius): string => {
  const values: Record<BorderRadius, string> = {
    none: '0',
    small: '4px',
    medium: '8px',
    large: '16px',
    full: '9999px',
  };
  return values[radius] || values.medium;
};

const getCardStylePreview = (style: CardStyle): string => {
  const shadows: Record<CardStyle, string> = {
    flat: 'none',
    elevated: '0 2px 8px rgba(0,0,0,0.1)',
    bordered: 'none',
    glass: 'none',
  };
  return shadows[style] || 'none';
};

export default CustomStylingStep;
