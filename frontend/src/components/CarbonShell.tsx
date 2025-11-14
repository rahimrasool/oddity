import { useState } from 'react';
import { AppShell, Box } from '@mantine/core';
import type { ModuleType } from '../types/ontology';
import { LeftNavigation } from './LeftNavigation';
import { TopBar } from './TopBar';
import { Singularity } from './modules/Singularity';
import { VantagePK } from './modules/VantagePK';
import { TitanPK } from './modules/TitanPK';
import { Oddity } from './modules/Oddity';
import { Argus } from './modules/Argus';

export function CarbonShell() {
  const [activeModule, setActiveModule] = useState<ModuleType>('singularity');

  const renderModule = () => {
    switch (activeModule) {
      case 'singularity':
        return <Singularity />;
      case 'guardian':
        return <VantagePK />;
      case 'prophet':
        return <TitanPK />;
      case 'nexus':
        return <Oddity />;
      case 'vanguard':
        return <Argus />;
      case 'sentinel':
        return <Box p="xl">SENTINEL Module - Coming Soon</Box>;
      case 'oddity':
        return <Oddity />;
      case 'argus':
        return <Argus />;
      default:
        return <Box p="xl">Select a module</Box>;
    }
  };

  return (
    <AppShell
      navbar={{
        width: 60,
        breakpoint: 0,
      }}
      header={{ height: 48 }}
      styles={{
        main: {
          background: '#0a0a0a',
          height: 'calc(100vh - 48px)',
          overflow: 'hidden',
        },
        navbar: {
          background: '#161616',
          borderRight: '1px solid #2a2a2a',
        },
        header: {
          background: '#161616',
          borderBottom: '1px solid #2a2a2a',
        },
      }}
    >
      <AppShell.Header>
        <TopBar />
      </AppShell.Header>

      <AppShell.Navbar>
        <LeftNavigation activeModule={activeModule} onModuleChange={setActiveModule} />
      </AppShell.Navbar>

      <AppShell.Main>
        {renderModule()}
      </AppShell.Main>
    </AppShell>
  );
}
