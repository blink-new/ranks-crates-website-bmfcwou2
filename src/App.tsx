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
  ShoppingCart,
  Eye,
  Sword,
  Gift,
  Home,
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

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.itemName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || order.status === filterStatus
    return matchesSearch && matchesFilter
  })

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

  const topCustomer = userProfiles.filter(u => u.totalSpent > 0).length > 0
    ? userProfiles.filter(u => u.totalSpent > 0).reduce((max, current) =>
        max.totalSpent > current.totalSpent ? max : current,
      )
    : null

  const sidebarLogin = (
    userEmail ? (
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
  )

  const renderHome = () => (
    <div className="space-y-12">
      <section className="text-center space-y-8">
        <div className="space-y-6">
          <h2 className="text-4xl font-bold text-white flex items-center justify-center gap-3">
            <span className="text-3xl">🔥</span>
            About CrimsonMC
          </h2>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Welcome to CrimsonMC, a next-level Minecraft server built for true
            warriors. Whether you're here to dominate in intense PvP, rise
            through the lifesteal ranks, or grind your way to greatness with
            custom crates and epic events, we've got it all.
          </p>
        </div>
        <div className="space-y-6">
          <h3 className="text-3xl font-bold text-white flex items-center justify-center gap-3">
            <Globe className="w-8 h-8 text-red-400" />
            What Makes Us Unique?
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <Card className="bg-red-900/20 border-red-600/30">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center mb-4">
                  <Sword className="w-8 h-8 text-red-400" />
                </div>
                <h4 className="text-xl font-semibold text-white mb-2">Lifesteal PvP</h4>
                <p className="text-gray-300">Defeat players and steal their hearts. Every fight matters.</p>
              </CardContent>
            </Card>
            <Card className="bg-red-900/20 border-red-600/30">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center mb-4">
                  <Gift className="w-8 h-8 text-red-400" />
                </div>
                <h4 className="text-xl font-semibold text-white mb-2">Custom Crates</h4>
                <p className="text-gray-300">Win powerful gear, rare loot, and server exclusives.</p>
              </CardContent>
            </Card>
            <Card className="bg-red-900/20 border-red-600/30">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center mb-4">
                  <Crown className="w-8 h-8 text-red-400" />
                </div>
                <h4 className="text-xl font-semibold text-white mb-2">Unique Ranks</h4>
                <p className="text-gray-300">Progress through a dynamic rank system with perks and flair.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )

  const renderRanks = () => (
    <section className="space-y-8">
      <header className="text-center mb-12">
        <h3 className="text-3xl font-bold text-white mb-4">Server Ranks</h3>
        <p className="text-gray-300 max-w-2xl mx-auto">
          Unlock exclusive perks, commands, and privileges with our premium rank
          system.
        </p>
      </header>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-yellow-900/20 to-yellow-800/20 border-yellow-600/30">
          <CardHeader>
            <div className="flex items-center justify-between">
              <Crown className="w-8 h-8 text-yellow-400" />
              <Badge className="bg-yellow-600/20 text-yellow-200">VIP</Badge>
            </div>
            <CardTitle className="text-yellow-200">VIP</CardTitle>
            <CardDescription className="text-gray-300">
              Entry-level perks for new warriors.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-gray-300">
            <ul className="space-y-2 mb-4 text-sm">
              <li className="flex items-center">
                <Star className="w-4 h-4 mr-2 text-yellow-400" /> Priority join
                access
              </li>
              <li className="flex items-center">
                <Star className="w-4 h-4 mr-2 text-yellow-400" /> Exclusive
                commands
              </li>
            </ul>
            <div className="text-2xl font-bold text-yellow-200 mb-4">$3.00</div>
            <PurchaseButton itemType="rank" itemName="VIP" price={3} />
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-900/20 to-blue-800/20 border-blue-600/30">
          <CardHeader>
            <div className="flex items-center justify-between">
              <Shield className="w-8 h-8 text-blue-400" />
              <Badge className="bg-blue-600/20 text-blue-200">KNIGHT</Badge>
            </div>
            <CardTitle className="text-blue-200">Knight</CardTitle>
            <CardDescription className="text-gray-300">
              Brave defenders with extra perks.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-gray-300">
            <ul className="space-y-2 mb-4 text-sm">
              <li className="flex items-center">
                <Star className="w-4 h-4 mr-2 text-blue-400" /> All VIP perks
                included
              </li>
              <li className="flex items-center">
                <Star className="w-4 h-4 mr-2 text-blue-400" /> Custom
                nicknames
              </li>
            </ul>
            <div className="text-2xl font-bold text-blue-200 mb-4">$5.00</div>
            <PurchaseButton itemType="rank" itemName="Knight" price={5} />
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-900/20 to-purple-800/20 border-purple-600/30">
          <CardHeader>
            <div className="flex items-center justify-between">
              <Zap className="w-8 h-8 text-purple-400" />
              <Badge className="bg-purple-600/20 text-purple-200">TITAN</Badge>
            </div>
            <CardTitle className="text-purple-200">Titan</CardTitle>
            <CardDescription className="text-gray-300">
              Mighty warriors with advanced features.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-gray-300">
            <ul className="space-y-2 mb-4 text-sm">
              <li className="flex items-center">
                <Star className="w-4 h-4 mr-2 text-purple-400" /> All Knight
                perks included
              </li>
              <li className="flex items-center">
                <Star className="w-4 h-4 mr-2 text-purple-400" /> Access to
                Titan-only areas
              </li>
            </ul>
            <div className="text-2xl font-bold text-purple-200 mb-4">$7.00</div>
            <PurchaseButton itemType="rank" itemName="Titan" price={7} />
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-sky-900/20 to-sky-800/20 border-sky-600/30">
          <CardHeader>
            <div className="flex items-center justify-between">
              <Flame className="w-8 h-8 text-sky-400" />
              <Badge className="bg-sky-600/20 text-sky-200">ZEUS</Badge>
            </div>
            <CardTitle className="text-sky-200">Zeus</CardTitle>
            <CardDescription className="text-gray-300">
              Godlike powers and exclusive commands.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-gray-300">
            <ul className="space-y-2 mb-4 text-sm">
              <li className="flex items-center">
                <Star className="w-4 h-4 mr-2 text-sky-400" /> All Titan perks
                included
              </li>
              <li className="flex items-center">
                <Star className="w-4 h-4 mr-2 text-sky-400" /> Zeus-only kits
              </li>
            </ul>
            <div className="text-2xl font-bold text-sky-200 mb-4">$9.00</div>
            <PurchaseButton itemType="rank" itemName="Zeus" price={9} />
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-red-900/20 to-black border-red-700/30">
          <CardHeader>
            <div className="flex items-center justify-between">
              <Flame className="w-8 h-8 text-red-500" />
              <Badge className="bg-red-700/20 text-red-300">DEVIL</Badge>
            </div>
            <CardTitle className="text-red-300">Devil</CardTitle>
            <CardDescription className="text-gray-300">
              The ultimate rank for the most feared.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-gray-300">
            <ul className="space-y-2 mb-4 text-sm">
              <li className="flex items-center">
                <Star className="w-4 h-4 mr-2 text-red-500" /> All Zeus perks
                included
              </li>
              <li className="flex items-center">
                <Star className="w-4 h-4 mr-2 text-red-500" /> Devil-exclusive
                commands
              </li>
            </ul>
            <div className="text-2xl font-bold text-red-300 mb-4">$11.00</div>
            <PurchaseButton itemType="rank" itemName="Devil" price={11} />
          </CardContent>
        </Card>
      </div>
    </section>
  )

  const renderOrders = () => (
    <section>
      <header className="mb-6 flex items-center gap-4">
        <Input
          placeholder="Search orders..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-xs"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="bg-gray-800 border-gray-700 text-white rounded-md px-3 py-2"
        >
          <option value="all">All statuses</option>
          <option value="completed">Completed</option>
        </select>
      </header>
      {filteredOrders.length === 0 ? (
        <p className="text-gray-400">No orders found.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>IGN</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Item</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map((o) => (
              <TableRow key={o.id}>
                <TableCell className="font-mono text-xs text-gray-300">
                  {o.id.slice(0, 8)}...
                </TableCell>
                <TableCell>{o.customerName}</TableCell>
                <TableCell>{o.customerEmail}</TableCell>
                <TableCell>{o.itemName}</TableCell>
                <TableCell>${o.price.toFixed(2)}</TableCell>
                <TableCell>{o.status}</TableCell>
                <TableCell>
                  {new Date(o.createdAt).toLocaleDateString()}{' '}
                  {new Date(o.createdAt).toLocaleTimeString()}
                </TableCell>
                <TableCell>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteOrder(o.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </section>
  )

  const handleDeleteOrder = (orderId: string) => {
    const updatedOrders = orders.filter((order) => order.id !== orderId)
    setOrders(updatedOrders)
    localStorage.setItem('crimsonmc-orders', JSON.stringify(updatedOrders))
    alert('Order deleted successfully!')
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-red-950 via-gray-900 to-black">
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
      <aside className="w-64 bg-black/20 backdrop-blur-sm border-r border-red-800/30 p-4 flex flex-col">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-800 rounded-lg flex items-center justify-center">
            <Crown className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">CrimsonMC</h1>
        </div>
        <div className="flex flex-col space-y-4 flex-grow">
          {sidebarLogin}
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
      <div className="flex-1 flex flex-col">
        <nav className="bg-black/20 backdrop-blur-sm border-b border-red-800/30 py-4 px-4 flex justify-between items-center">
            <div className="flex items-center space-x-6">
                <Button
                    variant={activeTab === 'home' ? 'default' : 'ghost'}
                    onClick={() => setActiveTab('home')}
                    className="text-white hover:bg-red-800/20"
                >
                    <Home className="w-4 h-4 mr-2" />
                    Home
                </Button>
                <Button
                    variant={activeTab === 'ranks' ? 'default' : 'ghost'}
                    onClick={() => setActiveTab('ranks')}
                    className="text-white hover:bg-red-800/20"
                >
                    <Crown className="w-4 h-4 mr-2" />
                    Ranks
                </Button>
                <Button
                    variant={activeTab === 'crates' ? 'default' : 'ghost'}
                    onClick={() => setActiveTab('crates')}
                    className="text-white hover:bg-red-800/20"
                >
                    <Package className="w-4 h-4 mr-2" />
                    Crates
                </Button>
            </div>
            <div>
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
            <Button
              variant="ghost"
              onClick={() => setShowAdminLogin(true)}
              className="text-white hover:bg-red-800/20"
            >
              Admin
            </Button>
          )}
          </div>
        </nav>
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
        <div className="container mx-auto px-4 py-12 space-y-12">
          {activeTab === 'home' && renderHome()}
          {activeTab === 'ranks' && renderRanks()}
          {activeTab === 'orders' && isAdmin && renderOrders()}
          {activeTab === 'crates' && (
            <div className="text-center">
                <h3 className="text-3xl font-bold text-white mb-4">No crates yet.</h3>
                <p className="text-gray-400">Check back soon for exciting new crates!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
