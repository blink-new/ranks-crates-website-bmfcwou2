import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet'
import { Button } from './ui/button'
import { Home, Crown, Package, Eye, User } from 'lucide-react'

interface SidebarProps {
  activeTab: string
  setActiveTab: (tab: 'home' | 'ranks' | 'crates' | 'orders') => void
  isAdmin: boolean
  handleAdminLogout: () => void
  setShowAdminLogin: (show: boolean) => void
  ordersCount: number
}

export function Sidebar({
  activeTab,
  setActiveTab,
  isAdmin,
  handleAdminLogout,
  setShowAdminLogin,
  ordersCount,
}: SidebarProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 bg-gray-900 text-white border-r border-red-800/30">
        <SheetHeader className="mb-8">
          <SheetTitle className="text-2xl font-bold text-white flex items-center">
            <Crown className="w-8 h-8 mr-2 text-red-400" /> CrimsonMC
          </SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col space-y-2">
          <Button
            variant={activeTab === 'home' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('home')}
            className="justify-start text-white hover:bg-red-800/20"
          >
            <Home className="w-4 h-4 mr-2" />
            Home
          </Button>
          <Button
            variant={activeTab === 'ranks' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('ranks')}
            className="justify-start text-white hover:bg-red-800/20"
          >
            <Crown className="w-4 h-4 mr-2" />
            Ranks
          </Button>
          <Button
            variant={activeTab === 'crates' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('crates')}
            className="justify-start text-white hover:bg-red-800/20"
          >
            <Package className="w-4 h-4 mr-2" />
            Crates
          </Button>
          {isAdmin ? (
            <>
              <Button
                variant={activeTab === 'orders' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('orders')}
                className="justify-start text-white hover:bg-red-800/20"
              >
                <Eye className="w-4 h-4 mr-2" />
                View Orders ({ordersCount})
              </Button>
              <Button
                variant="ghost"
                onClick={handleAdminLogout}
                className="justify-start text-red-400 hover:bg-red-800/20"
              >
                Logout
              </Button>
            </>
          ) : (
            <Button
              variant="ghost"
              onClick={() => setShowAdminLogin(true)}
              className="justify-start text-white hover:bg-red-800/20"
            >
              <User className="w-4 h-4 mr-2" />
              Admin
            </Button>
          )}
        </nav>
      </SheetContent>
    </Sheet>
  )
}
