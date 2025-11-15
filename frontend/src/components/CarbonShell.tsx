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
import { Chakravyuh } from './modules/Chakravyuh';
import { Sovereign } from './modules/Sovereign';

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
        return <Chakravyuh />;
      case 'oddity':
        return <Oddity />;
      case 'argus':
        return <Argus />;
      case 'chakravyuh':
        return <Chakravyuh />;
      case 'sovereign':
        return <Sovereign />;
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
          background: 'transparent',
          height: 'calc(100vh - 48px)',
          overflow: 'auto',
        },
        navbar: {
          background: 'rgba(8, 52, 69, 0.6)',
          borderRight: '1px solid rgba(0, 217, 255, 0.2)',
          backdropFilter: 'blur(10px)',
        },
        header: {
          background: 'rgba(8, 52, 69, 0.8)',
          borderBottom: '2px solid rgba(0, 217, 255, 0.3)',
          backdropFilter: 'blur(10px)',
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
