import { useState } from 'react';
import { Box } from '@mantine/core';
import { DetectAndTask } from '../titan/DetectAndTask';
import { ProcessAndExploit } from '../titan/ProcessAndExploit';
import { DecisionAndEffector } from '../titan/DecisionAndEffector';
import { Disseminate } from '../titan/Disseminate';

export function TitanPK() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedEffector, setSelectedEffector] = useState<'army' | 'airforce' | null>(null);

  const handleNextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 4));
  };

  const handleConfirmTarget = () => {
    handleNextStep();
  };

  const handleSelectEffector = (effector: 'army' | 'airforce') => {
    setSelectedEffector(effector);
    handleNextStep();
  };

  const handleReset = () => {
    setCurrentStep(1);
    setSelectedEffector(null);
  };

  return (
    <Box
      style={{
        width: '100%',
        height: '100%',
        background: '#0a0a0a',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {currentStep === 1 && <DetectAndTask onNext={handleNextStep} />}
      {currentStep === 2 && <ProcessAndExploit onConfirm={handleConfirmTarget} />}
      {currentStep === 3 && <DecisionAndEffector onSelect={handleSelectEffector} />}
      {currentStep === 4 && (
        <Disseminate selectedEffector={selectedEffector} onReset={handleReset} />
      )}
    </Box>
  );
}
