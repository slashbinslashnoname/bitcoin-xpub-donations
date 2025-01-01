import { Button } from '@/components/ui/button';
import React from 'react';

interface PreviousStepProps {
  handlePrevious: () => void;
}

const PreviousStep: React.FC<PreviousStepProps> = ({ handlePrevious }) => {
  return (
    <Button onClick={handlePrevious} variant="outline">
      Go Back
    </Button>
  );
};

export { PreviousStep };
