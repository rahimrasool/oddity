import { Paper, Text, Progress, Alert, ActionIcon, Badge } from '@mantine/core';
import { IconX, IconAlertTriangle, IconShieldCheck } from '@tabler/icons-react';

interface RiskAssessmentProps {
  riskScore: number;
  justification: string;
  onClose: () => void;
}

export function RiskAssessment({ riskScore, justification, onClose }: RiskAssessmentProps) {
  const getRiskLevel = () => {
    if (riskScore >= 70) return { label: 'High', color: 'red' };
    if (riskScore >= 40) return { label: 'Medium', color: 'yellow' };
    if (riskScore >= 20) return { label: 'Low', color: 'blue' };
    return { label: 'Minimal', color: 'green' };
  };

  const risk = getRiskLevel();
  const isHighRisk = riskScore >= 70;

  return (
    <Paper
      p="lg"
      style={{
        position: 'absolute',
        bottom: 20,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '90%',
        maxWidth: 700,
        background: 'rgba(22, 22, 22, 0.98)',
        border: `2px solid ${isHighRisk ? '#ff4444' : '#2a7fff'}`,
        zIndex: 1000,
      }}
    >
      {/* Close Button */}
      <ActionIcon
        onClick={onClose}
        style={{
          position: 'absolute',
          top: 12,
          right: 12,
        }}
        variant="subtle"
        color="gray"
      >
        <IconX size={20} />
      </ActionIcon>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        {isHighRisk ? (
          <IconAlertTriangle size={32} color="#ff4444" />
        ) : (
          <IconShieldCheck size={32} color="#2a7fff" />
        )}
        <div>
          <Text size="xl" fw={700}>
            Route Risk Assessment
          </Text>
          <Text size="sm" c="dimmed">
            Predictive Threat Analysis
          </Text>
        </div>
      </div>

      {/* Risk Score */}
      <div style={{ marginBottom: 16 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 8,
          }}
        >
          <Text size="sm" c="dimmed">
            Risk Level
          </Text>
          <Badge size="xl" color={risk.color} variant="filled">
            {risk.label} - {riskScore}%
          </Badge>
        </div>
        <Progress
          value={riskScore}
          color={risk.color}
          size="xl"
          striped={isHighRisk}
          animated={isHighRisk}
        />
      </div>

      {/* Justification Alert */}
      <Alert
        icon={isHighRisk ? <IconAlertTriangle size={20} /> : undefined}
        color={risk.color}
        variant={isHighRisk ? 'filled' : 'light'}
        title={isHighRisk ? 'High Risk Route Detected' : 'Risk Analysis Complete'}
      >
        <Text size="sm" style={{ whiteSpace: 'pre-wrap' }}>
          {justification}
        </Text>
      </Alert>

      {/* Recommendations */}
      {isHighRisk && (
        <div
          style={{
            marginTop: 16,
            padding: 12,
            background: '#1a0a0a',
            borderRadius: 8,
            border: '1px solid #ff4444',
          }}
        >
          <Text size="sm" fw={600} mb={8}>
            Recommended Actions:
          </Text>
          <Text size="xs" mb={4}>
            • Consider alternate route with lower incident history
          </Text>
          <Text size="xs" mb={4}>
            • Deploy mine-resistant vehicles (MRAPs) if route is unavoidable
          </Text>
          <Text size="xs" mb={4}>
            • Coordinate with EOD team for route clearance
          </Text>
          <Text size="xs">• Request ISR coverage during transit</Text>
        </div>
      )}
    </Paper>
  );
}
