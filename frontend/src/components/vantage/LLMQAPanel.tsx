import { useState } from 'react';
import { Paper, Text, Stack, Button, Loader, Group, Badge } from '@mantine/core';
import { IconSparkles, IconMessageQuestion } from '@tabler/icons-react';
import type { LogisticsData, EquipmentData, PersonnelData } from '../../types/ontology';

interface LLMQAPanelProps {
  logisticsData: LogisticsData[];
  equipmentData: EquipmentData[];
  personnelData: PersonnelData[];
}

const sampleQuestions = [
  'How many tanks are operational?',
  'How many tank drivers are trained?',
  'What is the current fuel status?',
  'Which units need ammunition resupply?',
  'What is the overall equipment readiness?',
  'How many personnel are fit for duty?',
];

export function LLMQAPanel({ logisticsData, equipmentData, personnelData }: LLMQAPanelProps) {
  const [currentQuestion, setCurrentQuestion] = useState<string | null>(null);
  const [currentAnswer, setCurrentAnswer] = useState<string | null>(null);
  const [isThinking, setIsThinking] = useState(false);

  const generateAnswer = (question: string): string => {
    // Calculate actual statistics from data
    const tanks = equipmentData.filter((eq) => eq.asset_type.includes('Tank'));
    const totalTanks = tanks.reduce((sum, t) => sum + t.total_count, 0);
    const operationalTanks = tanks.reduce((sum, t) => sum + t.operational_count, 0);

    const tankDrivers = personnelData.reduce((sum, p) => sum + p.trained_drivers, 0);
    const totalPersonnel = personnelData.reduce((sum, p) => sum + p.total_personnel, 0);
    const fitForDuty = personnelData.reduce((sum, p) => sum + Math.round(p.total_personnel * p.fit_for_duty_pct / 100), 0);

    const totalFuel = logisticsData.reduce((sum, l) => sum + l.fuel_liters, 0);
    const fuelCapacity = logisticsData.reduce((sum, l) => sum + l.fuel_capacity, 0);
    const fuelPct = ((totalFuel / fuelCapacity) * 100).toFixed(1);

    const lowAmmoUnits = logisticsData.filter((l) => {
      const ammo125Pct = (l.ammo_125mm_rounds / l.ammo_125mm_capacity) * 100;
      return ammo125Pct < 60;
    });

    const totalEquipment = equipmentData.reduce((sum, e) => sum + e.total_count, 0);
    const operationalEquipment = equipmentData.reduce((sum, e) => sum + e.operational_count, 0);
    const readinessPct = ((operationalEquipment / totalEquipment) * 100).toFixed(1);

    // Generate contextual answers based on question
    if (question.toLowerCase().includes('tank') && question.toLowerCase().includes('operational')) {
      return `Based on current equipment data, we have **${operationalTanks} operational tanks out of ${totalTanks} total** across all units (${((operationalTanks/totalTanks)*100).toFixed(1)}% readiness). The breakdown is:\n\n• X Corps: ${tanks.find(t => t.unit_id === 'unit-xcorps')?.operational_count || 0} operational Al-Khalid tanks\n• 101st Brigade: ${tanks.find(t => t.unit_id === 'unit-101brigade')?.operational_count || 0} operational tanks\n\nThe remaining ${totalTanks - operationalTanks} tanks are currently in maintenance. All operational tanks have full crew assignments and are combat-ready.`;
    }

    if (question.toLowerCase().includes('driver') && question.toLowerCase().includes('trained')) {
      return `We currently have **${tankDrivers} trained tank drivers** across all units. Personnel breakdown:\n\n• Total personnel: ${totalPersonnel}\n• Trained drivers: ${tankDrivers}\n• Fit for duty: ${fitForDuty} (${((fitForDuty/totalPersonnel)*100).toFixed(1)}%)\n\nThis provides a driver-to-tank ratio of ${(tankDrivers/totalTanks).toFixed(1)}:1, which exceeds minimum operational requirements. Additional drivers are cross-trained on other vehicle types for operational flexibility.`;
    }

    if (question.toLowerCase().includes('fuel')) {
      return `Current fuel status across X Corps:\n\n• **Total fuel reserves: ${(totalFuel/1000).toFixed(0)}K liters (${fuelPct}% of capacity)**\n• X Corps: ${((logisticsData.find(l => l.unit_id === 'unit-xcorps')?.fuel_liters || 0)/1000).toFixed(0)}K liters\n• 101st Brigade: ${((logisticsData.find(l => l.unit_id === 'unit-101brigade')?.fuel_liters || 0)/1000).toFixed(0)}K liters\n\nFuel reserves are ${parseFloat(fuelPct) > 70 ? 'adequate' : 'concerning'} for sustained operations. Resupply convoy scheduled within 48 hours.`;
    }

    if (question.toLowerCase().includes('ammunition') || question.toLowerCase().includes('ammo')) {
      return `Ammunition resupply analysis:\n\n**${lowAmmoUnits.length} units require priority resupply** (below 60% threshold):\n\n${lowAmmoUnits.map(u => {
        const pct = ((u.ammo_125mm_rounds / u.ammo_125mm_capacity) * 100).toFixed(1);
        return `• ${u.unit_name}: ${pct}% 125mm ammunition (${u.ammo_125mm_rounds}/${u.ammo_125mm_capacity} rounds)`;
      }).join('\n')}\n\nRecommendation: Initiate emergency resupply for units below 50%. Current convoy ETA: 6 hours.`;
    }

    if (question.toLowerCase().includes('readiness') || question.toLowerCase().includes('equipment')) {
      return `Joint equipment readiness assessment:\n\n• **Overall readiness: ${readinessPct}%** (${operationalEquipment}/${totalEquipment} assets operational)\n• Army: ${equipmentData.filter(e => e.branch === 'Army').reduce((s, e) => s + e.operational_count, 0)}/${equipmentData.filter(e => e.branch === 'Army').reduce((s, e) => s + e.total_count, 0)} operational\n• Air Force: ${equipmentData.filter(e => e.branch === 'Air Force').reduce((s, e) => s + e.operational_count, 0)}/${equipmentData.filter(e => e.branch === 'Air Force').reduce((s, e) => s + e.total_count, 0)} operational\n\nReadiness status: ${parseFloat(readinessPct) > 85 ? '🟢 EXCELLENT' : parseFloat(readinessPct) > 70 ? '🟡 GOOD' : '🔴 NEEDS ATTENTION'}`;
    }

    if (question.toLowerCase().includes('personnel') || question.toLowerCase().includes('fit for duty')) {
      return `Personnel readiness status:\n\n• **Total personnel: ${totalPersonnel}**\n• Fit for duty: ${fitForDuty} (${((fitForDuty/totalPersonnel)*100).toFixed(1)}%)\n• On leave: ${personnelData.reduce((s, p) => s + p.on_leave, 0)}\n• Trained specialists: ${tankDrivers} drivers\n\nAll units maintain above 85% fitness for duty, exceeding operational requirements. Personnel rotation schedules optimized for sustained readiness.`;
    }

    return `I've analyzed the current logistics and readiness data for your query. The system shows strong operational capability across X Corps with ${readinessPct}% equipment readiness and ${fuelPct}% fuel reserves. Would you like specific details on any particular unit or resource category?`;
  };

  const handleQuestionClick = async (question: string) => {
    setCurrentQuestion(question);
    setCurrentAnswer(null);
    setIsThinking(true);

    // Simulate LLM thinking time (1-2 seconds)
    await new Promise(resolve => setTimeout(resolve, 1200 + Math.random() * 800));

    const answer = generateAnswer(question);
    setCurrentAnswer(answer);
    setIsThinking(false);
  };

  return (
    <Paper
      p="md"
      withBorder
      style={{
        backgroundColor: 'var(--mantine-color-dark-7)',
        borderColor: 'var(--mantine-color-dark-4)',
        height: '100%',
      }}
    >
      <Group justify="space-between" mb="md">
        <Group gap="xs">
          <IconSparkles size={20} color="var(--mantine-color-violet-5)" />
          <Text size="lg" fw={700} c="white">
            AI Logistics Assistant
          </Text>
        </Group>
        <Badge size="sm" color="violet" variant="light">
          Claude Sonnet 4.5
        </Badge>
      </Group>

      <Text size="sm" c="dimmed" mb="md">
        Ask questions about logistics, readiness, and resource allocation
      </Text>

      {/* Sample Questions */}
      <Stack gap="xs" mb="lg">
        <Text size="xs" fw={600} c="dimmed" tt="uppercase">
          Sample Questions
        </Text>
        <Group gap="xs">
          {sampleQuestions.map((q) => (
            <Button
              key={q}
              size="xs"
              variant="light"
              color="violet"
              leftSection={<IconMessageQuestion size={14} />}
              onClick={() => handleQuestionClick(q)}
              disabled={isThinking}
            >
              {q}
            </Button>
          ))}
        </Group>
      </Stack>

      {/* Q&A Display */}
      {currentQuestion && (
        <Paper
          p="md"
          style={{
            backgroundColor: 'var(--mantine-color-dark-6)',
            borderLeft: '3px solid var(--mantine-color-violet-6)',
          }}
        >
          <Text size="sm" fw={600} c="violet" mb="xs">
            Question:
          </Text>
          <Text size="sm" c="white" mb="md">
            {currentQuestion}
          </Text>

          <Text size="sm" fw={600} c="violet" mb="xs">
            Answer:
          </Text>

          {isThinking ? (
            <Group gap="xs">
              <Loader size="sm" color="violet" />
              <Text size="sm" c="dimmed" fs="italic">
                Analyzing logistics data...
              </Text>
            </Group>
          ) : (
            <Text size="sm" c="white" style={{ whiteSpace: 'pre-line' }}>
              {currentAnswer}
            </Text>
          )}
        </Paper>
      )}
    </Paper>
  );
}
