import { Stack, Tooltip, UnstyledButton } from '@mantine/core';
import {
  IconWorldPin,
  IconShield,
  IconRocket,
  IconRoute2,
  IconMessages,
  IconSwords,
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
      label: 'WARGAME',
      description: 'Joint Operations Wargaming',
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
              borderRadius: 8,
              background: activeModule === item.id ? '#2a7fff' : 'transparent',
              color: activeModule === item.id ? '#ffffff' : '#a0a0a0',
              transition: 'all 0.2s ease',
              marginBottom: 4,
            }}
            onMouseEnter={(e) => {
              if (activeModule !== item.id) {
                e.currentTarget.style.background = '#262626';
                e.currentTarget.style.color = '#ffffff';
              }
            }}
            onMouseLeave={(e) => {
              if (activeModule !== item.id) {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = '#a0a0a0';
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
