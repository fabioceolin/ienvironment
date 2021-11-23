import { useContext } from 'react';
import { Stack } from '@chakra-ui/react';
import { AuthContext } from 'contexts/AuthContext';
import {
  RiLogoutBoxLine,
  RiDashboardLine,
  RiPlayList2Fill,
  RiContactsLine,
  RiRemoteControl2Line,
  RiHomeWifiLine,
  RiUpload2Line,
  RiHistoryFill,
} from 'react-icons/ri';
import { NavLink } from './NavLink';
import { NavSection } from './NavSection';

export function SideBarNav() {
  const { signOut } = useContext(AuthContext);
  return (
    <Stack spacing="12" align="flex-start">
      <NavSection title="GERAL">
        <NavLink icon={RiDashboardLine} href="/dashboard">
          Dashboard
        </NavLink>
        <NavLink icon={RiPlayList2Fill} href="/events">
          Evento
        </NavLink>
        <NavLink
          icon={RiHistoryFill}
          href="https://charts.mongodb.com/charts-project-0-fkdcx/embed/charts?id=f6252a88-6958-405f-b774-30e1cf49e7bf&maxDataAge=60&theme=dark&autoRefresh=false"
          target="_blank"
          rel="noopener noreferrer"
        >
          Histórico
        </NavLink>
      </NavSection>
      <NavSection title="MEDIA">
        <NavLink icon={RiUpload2Line} href="/image">
          Imagem
        </NavLink>
      </NavSection>
      <NavSection title="CONFIGURAÇÃO">
        <NavLink icon={RiContactsLine} href="/users">
          Usuários
        </NavLink>
        <NavLink icon={RiHomeWifiLine} href="/environment">
          Ambientes
        </NavLink>
        <NavLink icon={RiRemoteControl2Line} href="/controller">
          Controlador
        </NavLink>
        <NavLink
          icon={RiLogoutBoxLine}
          onClick={signOut}
          shouldMatchExactHref
          href="/"
        >
          Sair
        </NavLink>
      </NavSection>
    </Stack>
  );
}
