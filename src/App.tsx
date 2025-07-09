import { useState, useEffect } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './components/ui/card'
import { Badge } from './components/ui/badge'
import { Button } from './components/ui/button'
import { Input } from './components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './components/ui/table'
import {
  Crown,
  Package,
  Star,
  User,
  MapPin,
  ShoppingCart,
  Eye,
  Sword,
  Gift,
  Home,
  Heart,
  Globe,
  Shield,
  Zap,
  Flame,
} from 'lucide-react'
import { PurchaseModal } from './components/PurchaseModal'

interface Order {
  id: string
  customerName: string
  customerEmail: string
  itemType: string
  itemName: string
  price: number
  status: string
  createdAt: string
}

interface UserProfile {
  email: string
  nickname: string
  registeredAt: string
  totalSpent: number
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'ranks' | 'crates' | 'orders'>('home')
  const [orders, setOrders] = useState<Order[]>([])
  const [isAdmin, setIsAdmin] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [adminPassword, setAdminPassword] = useState('')
  const [showAdminLogin, setShowAdminLogin] = useState(false)
  const [purchaseModalOpen, setPurchaseModalOpen] = useState(false)
  const [purchaseItem, setPurchaseItem] = useState<{ itemType: string, itemName: string, price: number } | null>(null)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [userProfiles, setUserProfiles] = useState<UserProfile[]>([])
  const [loginEmail, setLoginEmail] = useState('')
  const [loginNickname, setLoginNickname] = useState('')
  const [showNicknameInput, setShowNicknameInput] = useState(false)

  useEffect(() => {
    const savedOrders = localStorage.getItem('crimsonmc-orders')
    if (savedOrders) setOrders(JSON.parse(savedOrders))
    const adminLoggedIn = localStorage.getItem('crimsonmc-admin')
    if (adminLoggedIn === 'true') setIsAdmin(true)
    const savedUserEmail = localStorage.getItem('crimsonmc-user-email')
    if (savedUserEmail) setUserEmail(savedUserEmail)
    const savedUserProfiles = localStorage.getItem('crimsonmc-user-profiles')
    if (savedUserProfiles) setUserProfiles(JSON.parse(savedUserProfiles))
  }, [])

  useEffect(() => {
    if (userEmail) {
      localStorage.setItem('crimsonmc-user-email', userEmail)
    } else {
      localStorage.removeItem('crimsonmc-user-email')
    }
  }, [userEmail])

  useEffect(() => {
    localStorage.setItem('crimsonmc-user-profiles', JSON.stringify(userProfiles))
  }, [userProfiles])

  // Admin helpers
  const handleAdminLogin = () => {
    if (adminPassword === 'admin123') {
      setIsAdmin(true)
      localStorage.setItem('crimsonmc-admin', 'true')
      setShowAdminLogin(false)
      setAdminPassword('')
    } else {
      alert('Invalid admin password')
    }
  }
  const handleAdminLogout = () => {
    setIsAdmin(false)
    localStorage.removeItem('crimsonmc-admin')
    setActiveTab('home')
  }

  // User authentication
  const handleLogin = () => {
    if (!loginEmail || !loginEmail.includes('@')) {
      alert('Please enter a valid email address.')
      return
    }
    const existingUser = userProfiles.find((p) => p.email === loginEmail)
    if (existingUser) {
      setUserEmail(loginEmail)
      setLoginNickname('')
      setShowNicknameInput(false)
      alert(`Welcome back, ${existingUser.nickname}! You are eligible for a discount.`)
    } else {
      setShowNicknameInput(true)
    }
  }
  const handleRegister = () => {
    if (!loginNickname.trim()) {
      alert('Please enter a nickname.')
      return
    }
    const newUser: UserProfile = {
      email: loginEmail,
      nickname: loginNickname.trim(),
      registeredAt: new Date().toISOString(),
      totalSpent: 0,
    }
    setUserProfiles([...userProfiles, newUser])
    setUserEmail(loginEmail)
    setLoginEmail('')
    setLoginNickname('')
    setShowNicknameInput(false)
    alert(`Welcome, ${newUser.nickname}! Your account has been created.`)
  }
  const handleLogout = () => {
    setUserEmail(null)
    alert('You have been logged out.')
  }

  // Purchase helpers
  const openPurchaseModal = (itemType: string, itemName: string, price: number) => {
    setPurchaseItem({ itemType, itemName, price })
    setPurchaseModalOpen(true)
  }
  const handlePurchaseSubmit = (ign: string, email: string) => {
    if (!purchaseItem) return
    let finalPrice = purchaseItem.price
    const currentUserProfile = userProfiles.find((p) => p.email === userEmail)
    if (currentUserProfile && currentUserProfile.email === email) {
      finalPrice = finalPrice * 0.9 // 10% discount
      alert('10% discount applied!')
    }
    const newOrder: Order = {
      id: `order_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      customerName: ign,
      customerEmail: email,
      itemType: purchaseItem.itemType,
      itemName: purchaseItem.itemName,
      price: finalPrice,
      status: 'completed',
      createdAt: new Date().toISOString(),
    }
    const updatedOrders = [newOrder, ...orders]
    setOrders(updatedOrders)
    localStorage.setItem('crimsonmc-orders', JSON.stringify(updatedOrders))
    setUserProfiles((prevProfiles) =>
      prevProfiles.map((p) =>
        p.email === email ? { ...p, totalSpent: p.totalSpent + finalPrice } : p,
      ),
    )
    setPurchaseModalOpen(false)
    setPurchaseItem(null)
    alert(`Order placed successfully! Order ID: ${newOrder.id}`)
  }

  // Filters
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.itemName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || order.status === filterStatus
    return matchesSearch && matchesFilter
  })

  // Small components
  const AdminLoginDialog = () => (
    <Dialog open={showAdminLogin} onOpenChange={setShowAdminLogin}>
      <DialogContent className="bg-gray-900 text-white border-gray-700">
        <DialogHeader>
          <DialogTitle>Admin Login</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            type="password"
            placeholder="Enter admin password"
            value={adminPassword}
            onChange={(e) => setAdminPassword(e.target.value)}
            className="bg-gray-800 border-gray-600"
            onKeyDown={(e) => e.key === 'Enter' && handleAdminLogin()}
          />
          <Button
            onClick={handleAdminLogin}
            className="w-full bg-red-600 hover:bg-red-700"
          >
            Login
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
  const PurchaseButton = ({ itemType, itemName, price }: { itemType: string, itemName: string, price: number }) => (
    <Button
      className={`w-full ${itemType === 'rank' ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}`}
      onClick={() => openPurchaseModal(itemType, itemName, price)}
    >
      <ShoppingCart className="w-4 h-4 mr-2" />
      Purchase {itemName}
    </Button>
  )

  // Top customer logic: only users with totalSpent > 0
  const topCustomer = userProfiles.filter(u => u.totalSpent > 0).length > 0
    ? userProfiles.filter(u => u.totalSpent > 0).reduce((max, current) =>
        max.totalSpent > current.totalSpent ? max : current,
      )
    : null

  // Sidebar login/register UI
  const sidebarLogin = userEmail
    ? (
      <div className="text-center">
        <p className="text-lg font-semibold text-white">Welcome, {userProfiles.find(u => u.email === userEmail)?.nickname || userEmail}</p>
        <Button variant="link" onClick={handleLogout} className="text-red-400">
          Logout
        </Button>
      </div>
    ) : (
      <div className="space-y-2">
        <Input
          type="email"
          placeholder="Your email for login/register"
          value={loginEmail}
          onChange={(e) => setLoginEmail(e.target.value)}
          className="bg-gray-800 border-gray-600 text-white"
          onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
        />
        {showNicknameInput && (
          <Input
            type="text"
            placeholder="Choose a nickname"
            value={loginNickname}
            onChange={(e) => setLoginNickname(e.target.value)}
            className="bg-gray-800 border-gray-600 text-white"
            onKeyDown={(e) => e.key === 'Enter' && handleRegister()}
          />
        )}
        {!showNicknameInput ? (
          <Button onClick={handleLogin} className="w-full bg-red-600 hover:bg-red-700">
            Login / Register
          </Button>
        ) : (
          <Button onClick={handleRegister} className="w-full bg-red-600 hover:bg-red-700">
            Register
          </Button>
        )}
      </div>
    )

  // ...rest of the code remains unchanged, just replace the sidebarLogin and topCustomer logic in the sidebar...

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-red-950 via-gray-900 to-black">
      {/* Dialogs */}
      <AdminLoginDialog />
      <PurchaseModal
        isOpen={purchaseModalOpen}
        onClose={() => {
          setPurchaseModalOpen(false)
          setPurchaseItem(null)
        }}
        onSubmit={handlePurchaseSubmit}
        itemName={purchaseItem?.itemName || ''}
      />

      {/* Permanent Sidebar */}
      <aside className="w-64 bg-black/20 backdrop-blur-sm border-r border-red-800/30 p-4 flex flex-col">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-800 rounded-lg flex items-center justify-center">
            <Crown className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">CrimsonMC</h1>
        </div>
        <div className="flex flex-col space-y-4 flex-grow">
          {sidebarLogin}
          <Button
            variant="ghost"
            onClick={() => setActiveTab('home')}
            className="text-white hover:bg-red-800/20 justify-start"
          >
            <Home className="w-4 h-4 mr-2" />
            Home
          </Button>
          <Button
            variant="ghost"
            onClick={() => setActiveTab('ranks')}
            className="text-white hover:bg-red-800/20 justify-start"
          >
            <Crown className="w-4 h-4 mr-2" />
            Ranks
          </Button>
          <Button
            variant="ghost"
            onClick={() => setActiveTab('crates')}
            className="text-white hover:bg-red-800/20 justify-start"
          >
            <Package className="w-4 h-4 mr-2" />
            Crates
          </Button>
          <Button
            variant="ghost"
            onClick={() => setActiveTab('orders')}
            className="text-white hover:bg-red-800/20 justify-start"
          >
            <Eye className="w-4 h-4 mr-2" />
            Orders
          </Button>
          {/* Top Customer */}
          <div className="mt-8 pt-4 border-t border-gray-700 text-center">
            <h4 className="text-xl font-bold text-white mb-4">Top Customer</h4>
            {topCustomer ? (
              <div className="flex flex-col items-center">
                <img
                  src="/minecraft-skin.png"
                  alt="Top Customer Skin"
                  className="w-24 h-24 object-cover object-left-top mb-2"
                  style={{ clipPath: 'inset(0 50% 0 0)' }}
                />
                <p className="text-lg font-semibold text-red-400">{topCustomer.nickname}</p>
                <p className="text-sm text-gray-400">Total Spent: ${topCustomer.totalSpent.toFixed(2)}</p>
              </div>
            ) : (
              <p className="text-gray-400">No orders currently.</p>
            )}
          </div>
          {/* PayPal Logo */}
          <div className="mt-8 pt-4 border-t border-gray-700 text-center">
            <h4 className="text-xl font-bold text-white mb-4">Payments Powered By</h4>
            <img
              src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_74x46.jpg"
              alt="PayPal Logo"
              className="mx-auto w-24"
            />
          </div>
        </div>
      </aside>
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Navigation (for Admin) */}
        <nav className="bg-black/20 backdrop-blur-sm border-b border-red-800/30 py-4 px-4 flex justify-end">
          {isAdmin ? (
            <>
              <Button
                variant={activeTab === 'orders' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('orders')}
                className="text-white hover:bg-red-800/20"
              >
                <Eye className="w-4 h-4 mr-2" />
                View Orders ({orders.length})
              </Button>
              <Button
                variant="ghost"
                onClick={handleAdminLogout}
                className="text-red-400 hover:bg-red-800/20 ml-4"
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                onClick={() => setActiveTab('ranks')}
                className="text-white hover:bg-red-800/20 justify-start"
              >
                <Crown className="w-4 h-4 mr-2" />
                Ranks
              </Button>
              <Button
                variant="ghost"
                onClick={() => setActiveTab('crates')}
                className="text-white hover:bg-red-800/20 justify-start"
              >
                <Package className="w-4 h-4 mr-2" />
                Crates
              </Button>
              <Button
                variant="ghost"
                onClick={() => setActiveTab('orders')}
                className="text-white hover:bg-red-800/20 justify-start"
              >
                <Eye className="w-4 h-4 mr-2" />
                Orders
              </Button>
              <Button
                variant="ghost"
                onClick={() => setShowAdminLogin(true)}
                className="text-white hover:bg-red-800/20"
              >
                Admin
              </Button>
            </>
          )}
        </nav>

        {/* Banner */}
        <div className="relative">
          <img
            src="/crimsonmc-banner.png"
            alt="CrimsonMC Banner"
            className="w-full h-96 object-cover"
          />
          <div className="absolute inset-0 bg-black/20" />
          <button
            onClick={() => {
              navigator.clipboard.writeText('https://discord.gg/W92rssnj')
              alert('Discord invite link copied to clipboard!')
            }}
            className="absolute top-4 right-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg shadow-lg cursor-pointer select-none"
            title="Copy Discord Invite Link"
          >
            Discord
          </button>
        </div>
        {/* Main Content */}
        <div className="container mx-auto px-4 py-12 space-y-12">
          {/* ...rest of your main content rendering... */}
        </div>
      </div>
    </div>
  )
}