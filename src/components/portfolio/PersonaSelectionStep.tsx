/**
 * PersonaSelectionStep - Step 1 of Hushh Folio Wizard
 * Beautiful UI for selecting one of 12 user personas
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
  Input,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { PERSONAS, type PersonaId, type Persona } from '../../types/portfolioPersonas';

const MotionBox = motion(Box);

interface PersonaSelectionStepProps {
  selectedPersona: PersonaId | null;
  onSelectPersona: (personaId: PersonaId) => void;
  onNext: () => void;
}

export const PersonaSelectionStep = ({
  selectedPersona,
  onSelectPersona,
  onNext,
}: PersonaSelectionStepProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter personas based on search
  const filteredPersonas = PERSONAS.filter(
    (persona) =>
      persona.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      persona.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <VStack spacing={6} py={6} w="full" maxW="700px" mx="auto">
      {/* Header */}
      <VStack spacing={3} textAlign="center">
        <Box
          w={16}
          h={16}
          borderRadius="full"
          bg="linear-gradient(135deg, #F97316 0%, #FB923C 100%)"
          display="flex"
          alignItems="center"
          justifyContent="center"
          boxShadow="0 8px 32px rgba(249, 115, 22, 0.3)"
        >
          <Text fontSize="2xl">🎭</Text>
        </Box>
        <Text fontSize="2xl" fontWeight="bold" color="#1A1A1A">
          Who are you?
        </Text>
        <Text fontSize="md" color="#6B7280" maxW="500px">
          Select the persona that best describes you. This helps us ask the right questions and create a perfect portfolio.
        </Text>
      </VStack>

      {/* Search */}
      <InputGroup maxW="400px">
        <InputLeftElement pointerEvents="none" h="full">
          <SearchIcon />
        </InputLeftElement>
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search personas..."
          size="lg"
          pl={10}
          bg="white"
          border="1px solid #E5E7EB"
          borderRadius="12px"
          _focus={{
            borderColor: '#F97316',
            boxShadow: '0 0 0 1px #F97316',
          }}
          _placeholder={{ color: '#9CA3AF' }}
        />
      </InputGroup>

      {/* Personas Grid */}
      <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={4} w="full">
        {filteredPersonas.map((persona, index) => (
          <PersonaCard
            key={persona.id}
            persona={persona}
            isSelected={selectedPersona === persona.id}
            onSelect={() => onSelectPersona(persona.id)}
            index={index}
          />
        ))}
      </SimpleGrid>

      {/* No Results */}
      {filteredPersonas.length === 0 && (
        <Box py={8} textAlign="center">
          <Text color="#6B7280">No personas match your search. Try a different term.</Text>
        </Box>
      )}

      {/* Continue Button */}
      <Box pt={4}>
        <Button
          size="lg"
          bg="linear-gradient(135deg, #F97316 0%, #FB923C 100%)"
          color="white"
          px={12}
          onClick={onNext}
          isDisabled={!selectedPersona}
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
          Continue
        </Button>
      </Box>

      {/* Tip */}
      <Text fontSize="xs" color="#9CA3AF" textAlign="center">
        💡 Not sure? Pick the closest match - you can always adjust later.
      </Text>
    </VStack>
  );
};

// Persona Card Component
interface PersonaCardProps {
  persona: Persona;
  isSelected: boolean;
  onSelect: () => void;
  index: number;
}

const PersonaCard = ({ persona, isSelected, onSelect, index }: PersonaCardProps) => {
  return (
    <MotionBox
      as="button"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      onClick={onSelect}
      p={4}
      borderRadius="16px"
      border={`2px solid ${isSelected ? persona.color : '#E5E7EB'}`}
      bg={isSelected ? `${persona.color}08` : 'white'}
      boxShadow={isSelected ? `0 4px 20px ${persona.color}25` : '0 2px 8px rgba(0,0,0,0.04)'}
      textAlign="left"
      cursor="pointer"
      sx={{
        transition: 'border-color 0.2s, transform 0.2s, box-shadow 0.2s',
      }}
      _hover={{
        borderColor: isSelected ? persona.color : '#D1D5DB',
        transform: 'translateY(-4px)',
        boxShadow: isSelected
          ? `0 8px 30px ${persona.color}35`
          : '0 8px 25px rgba(0,0,0,0.08)',
      }}
      position="relative"
      overflow="hidden"
    >
      {/* Selection Indicator */}
      {isSelected && (
        <Box
          position="absolute"
          top={3}
          right={3}
          w={6}
          h={6}
          borderRadius="full"
          bg={persona.color}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <CheckIcon />
        </Box>
      )}

      <VStack align="start" spacing={2}>
        {/* Emoji + Name */}
        <HStack spacing={2}>
          <Box
            w={10}
            h={10}
            borderRadius="12px"
            bg={`${persona.color}15`}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Text fontSize="xl">{persona.emoji}</Text>
          </Box>
          <Text fontWeight="semibold" color="#1A1A1A" fontSize="md">
            {persona.name}
          </Text>
        </HStack>

        {/* Description */}
        <Text fontSize="sm" color="#6B7280" lineHeight="1.5">
          {persona.description}
        </Text>

        {/* Tagline */}
        <Text
          fontSize="xs"
          color={isSelected ? persona.color : '#9CA3AF'}
          fontWeight="medium"
        >
          {persona.tagline}
        </Text>
      </VStack>

      {/* Decorative Gradient */}
      <Box
        position="absolute"
        bottom={0}
        left={0}
        right={0}
        h="3px"
        bg={`linear-gradient(90deg, ${persona.color} 0%, ${persona.color}40 100%)`}
        opacity={isSelected ? 1 : 0}
        transition="opacity 0.2s"
      />
    </MotionBox>
  );
};

// Icons
const SearchIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#9CA3AF"
    strokeWidth="2"
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
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

export default PersonaSelectionStep;
