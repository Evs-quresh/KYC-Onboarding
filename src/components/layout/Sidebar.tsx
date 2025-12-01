import { Menu, PanelsTopLeft } from 'lucide-react'
import { NavLink, useNavigate } from 'react-router-dom'
import logo from '@/assets/logo.svg'
import { NAV_LINKS } from '@/utils/constants'
import { Button } from '@/components/ui/button'
import { useAppStore } from '@/store/useAppStore'
import { cn } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function Sidebar() {
  const collapsed = useAppStore((state) => state.sidebarCollapsed)
  const toggle = useAppStore((state) => state.toggleSidebar)
  const navigate = useNavigate()

  return (
    <aside
      className={cn(
        'flex h-full flex-col border-r bg-card transition-all duration-300',
        collapsed ? 'w-[72px]' : 'w-64',
      )}
    >
      <div className="flex items-center justify-between px-4 py-4">
        <div className="flex items-center gap-2">
          <img src={logo} alt="KYC" className="h-8 w-8" />
          {!collapsed && (
            <div>
              <p className="text-sm font-semibold">Universal KYC</p>
              <p className="text-xs text-muted-foreground">Orchestration</p>
            </div>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground"
          onClick={toggle}
        >
          <PanelsTopLeft className="h-4 w-4" />
        </Button>
      </div>
      <nav className="flex-1 space-y-1 px-3">
        {NAV_LINKS.map(({ label, path, icon: Icon }) => (
          <NavLink
            to={path}
            key={path}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground',
                isActive ? 'bg-primary/10 text-primary' : '',
                collapsed && 'justify-center',
              )
            }
          >
            <Icon className="h-4 w-4" />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>
      <div className="border-t px-4 py-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" className="w-full justify-center gap-2">
              <Menu className="h-4 w-4" />
              {!collapsed && <span>Quick Switch</span>}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            <DropdownMenuLabel>Jump To</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {NAV_LINKS.map((link) => (
              <DropdownMenuItem
                key={link.path}
                onSelect={() => navigate(link.path)}
                className="cursor-pointer"
              >
                {link.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  )
}

