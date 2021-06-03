import { Stack } from "@chakra-ui/react";
import { RiLogoutBoxLine, RiDashboardLine, RiContactsLine, RiRemoteControl2Line, RiHomeWifiLine } from "react-icons/ri";
import { NavLink } from "./NavLink";
import { NavSection } from "./NavSection";

export function SideBarNav() {
  return (
    <Stack spacing="12" align="flex-start">
      <NavSection title="GERAL">
        <NavLink icon={RiDashboardLine} href="/dashboard">Dashboard</NavLink>
      </NavSection>
      <NavSection title="CONFIGURAÇÃO">
        <NavLink icon={RiContactsLine} href="/users">Users</NavLink>
        <NavLink icon={RiHomeWifiLine} href="/environment">Environment</NavLink>
        <NavLink icon={RiRemoteControl2Line} href="/controller">Controller</NavLink>
        <NavLink icon={RiLogoutBoxLine} href="/logout">Sair</NavLink>
      </NavSection>
    </Stack>
  )
}