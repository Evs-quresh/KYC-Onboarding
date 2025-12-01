import { Bell, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useAppStore } from '@/store/useAppStore'

export function Topbar() {
  const user = useAppStore((state) => state.user)
  const logout = useAppStore((state) => state.logout)
  const initials = user?.name
    ? user.name
        .split(' ')
        .map((char) => char[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'UX'

  return (
    <header className="flex items-center justify-between border-b bg-background px-6 py-4">
      <div className="relative w-full max-w-xl">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search requests, clients, vendors..." className="pl-9" />
      </div>
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-emerald-500" />
        </Button>
        <div className="flex items-center gap-2 rounded-full border px-3 py-1">
          <Avatar className="h-8 w-8">
            <AvatarFallback>
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="text-left">
            <p className="text-sm font-semibold">{user?.name ?? 'Guest'}</p>
            <p className="text-xs text-muted-foreground">{user?.role ?? 'Viewer'}</p>
          </div>
          {user && (
            <Button size="sm" variant="ghost" onClick={logout}>
              Logout
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}

