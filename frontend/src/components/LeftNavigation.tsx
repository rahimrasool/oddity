import { Stack, Tooltip, UnstyledButton } from '@mantine/core';
import {
  IconWorldPin,
  IconShield,
  IconRocket,
  IconRoute2,
  IconMessages,
  IconSwords,
  IconRobot,
} from '@tabler/icons-react';
import type { ModuleType } from '../types/ontology';

interface LeftNavigationProps {
  activeModule: ModuleType;
  onModuleChange: (module: ModuleType) => void;
}

interface NavItem {
  id: ModuleType;
  icon: React.ReactNode;
  label: string;
  description: string;
}

export function LeftNavigation({ activeModule, onModuleChange }: LeftNavigationProps) {
  const navItems: NavItem[] = [
    {
      id: 'singularity',
      icon: <IconWorldPin size={24} />,
      label: 'SINGULARITY',
      description: 'All-Domain Common Operating Picture',
    },
    {
      id: 'guardian',
      icon: <IconShield size={24} />,
      label: 'VANTAGE-PK',
      description: 'Joint Readiness & Logistics Command',
    },
    {
      id: 'prophet',
      icon: <IconRocket size={24} />,
      label: 'TITAN-PK',
      description: 'Sensor-to-Shooter Targeting Workflow',
    },
    {
      id: 'nexus',
      icon: <IconRoute2 size={24} />,
      label: 'ODDITY',
      description: 'Predictive Threat & Ambush Modeling',
    },
    {
      id: 'vanguard',
      icon: <IconMessages size={24} />,
      label: 'ARGUS',
      description: 'Narrative Warfare Monitor',
    },
    {
      id: 'sentinel',
      icon: <IconSwords size={24} />,
      label: 'GAME ZONE',
      description: 'Joint Operations Wargaming',
    },
    {
      id: 'sovereign',
      icon: <IconRobot size={24} />,
      label: 'SOVEREIGN',
      description: 'AI Agent Builder',
    },
  ];

  return (
    <Stack gap={0} h="100%" justify="flex-start" p={8}>
      {navItems.map((item) => (
        <Tooltip
          key={item.id}
          label={
            <div>
              <div style={{ fontWeight: 600 }}>{item.label}</div>
              <div style={{ fontSize: '0.85em', opacity: 0.8 }}>{item.description}</div>
            </div>
          }
          position="right"
          withArrow
        >
          <UnstyledButton
            onClick={() => onModuleChange(item.id)}
            style={{
              width: 44,
              height: 44,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 6,
              background: activeModule === item.id
                ? 'linear-gradient(135deg, rgba(0, 217, 255, 0.2), rgba(255, 107, 53, 0.15))'
                : 'transparent',
              color: activeModule === item.id ? '#00D9FF' : '#7CA5B8',
              border: activeModule === item.id ? '1px solid rgba(0, 217, 255, 0.4)' : '1px solid transparent',
              boxShadow: activeModule === item.id ? '0 0 15px rgba(0, 217, 255, 0.2)' : 'none',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              marginBottom: 6,
            }}
            onMouseEnter={(e) => {
              if (activeModule !== item.id) {
                e.currentTarget.style.background = 'rgba(0, 217, 255, 0.08)';
                e.currentTarget.style.color = '#00D9FF';
                e.currentTarget.style.border = '1px solid rgba(0, 217, 255, 0.2)';
                e.currentTarget.style.transform = 'scale(1.05)';
              }
            }}
            onMouseLeave={(e) => {
              if (activeModule !== item.id) {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = '#7CA5B8';
                e.currentTarget.style.border = '1px solid transparent';
                e.currentTarget.style.transform = 'scale(1)';
              }
            }}
          >
            {item.icon}
          </UnstyledButton>
        </Tooltip>
      ))}
    </Stack>
  );
}
