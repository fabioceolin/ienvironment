import { useContext } from 'react';
import { Stack } from '@chakra-ui/react';
import { AuthContext } from 'contexts/AuthContext';
import {
  RiLogoutBoxLine,
  RiDashboardLine,
  RiContactsLine,
  RiRemoteControl2Line,
  RiHomeWifiLine,
  RiUpload2Line,
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
      </NavSection>
      <NavSection title="MEDIA">
        <NavLink icon={RiUpload2Line} href="/image">
          Image
        </NavLink>
      </NavSection>
      <NavSection title="CONFIGURAÇÃO">
        <NavLink icon={RiContactsLine} href="/users">
          Users
        </NavLink>
        <NavLink icon={RiHomeWifiLine} href="/environment">
          Environment
        </NavLink>
        <NavLink icon={RiRemoteControl2Line} href="/controller">
          Controller
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
