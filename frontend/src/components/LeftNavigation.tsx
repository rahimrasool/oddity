import { Stack, Tooltip, UnstyledButton } from '@mantine/core';
import {
  IconWorldPin,
  IconShield,
  IconRocket,
  IconNetwork,
  IconTarget,
  IconEye,
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
      icon: <IconNetwork size={24} />,
      label: 'NEXUS',
      description: 'Network Analysis',
    },
    {
      id: 'vanguard',
      icon: <IconTarget size={24} />,
      label: 'VANGUARD',
      description: 'Mission Planning',
    },
    {
      id: 'sentinel',
      icon: <IconEye size={24} />,
      label: 'SENTINEL',
      description: 'Information Operations',
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
