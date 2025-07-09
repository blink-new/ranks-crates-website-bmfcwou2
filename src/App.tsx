import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card'
import { Badge } from './components/ui/badge'
import { Button } from './components/ui/button'
import { Input } from './components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './components/ui/table'
import { Crown, Package, Star, User, Mail, MapPin, ShoppingCart, Eye, Search, Filter, Sword, Gift, Home, Heart, Globe, Shield, Zap, Flame } from 'lucide-react'
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

function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'ranks' | 'crates' | 'orders'>('home')
  const [orders, setOrders] = useState<Order[]>([])
  const [isAdmin, setIsAdmin] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [adminPassword, setAdminPassword] = useState('')
  const [showAdminLogin, setShowAdminLogin] = useState(false)
  const [purchaseModalOpen, setPurchaseModalOpen] = useState(false)
  const [purchaseItem, setPurchaseItem] = useState<{ itemType: string, itemName: string, price: number } | null>(null)

  useEffect(() => {
    const savedOrders = localStorage.getItem('crimsonmc-orders')
    if (savedOrders) setOrders(JSON.parse(savedOrders))
    const adminLoggedIn = localStorage.getItem('crimsonmc-admin')
    if (adminLoggedIn === 'true') setIsAdmin(true)
  }, [])

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
  const openPurchaseModal = (itemType: string, itemName: string, price: number) => {
    setPurchaseItem({ itemType, itemName, price })
    setPurchaseModalOpen(true)
  }
  const handlePurchaseSubmit = (ign: string, email: string) => {
    if (!purchaseItem) return
    const newOrder: Order = {
      id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      customerName: ign,
      customerEmail: email,
      itemType: purchaseItem.itemType,
      itemName: purchaseItem.itemName,
      price: purchaseItem.price,
      status: 'completed',
      createdAt: new Date().toISOString()
    }
    const updatedOrders = [newOrder, ...orders]
    setOrders(updatedOrders)
    localStorage.setItem('crimsonmc-orders', JSON.stringify(updatedOrders))
    setPurchaseModalOpen(false)
    setPurchaseItem(null)
    alert(`Order placed successfully! Order ID: ${newOrder.id}`)
  }
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
            onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()}
          />
          <Button onClick={handleAdminLogin} className="w-full bg-red-600 hover:bg-red-700">
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
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-950 via-gray-900 to-black">
      <AdminLoginDialog />
      <PurchaseModal
        isOpen={purchaseModalOpen}
        onClose={() => { setPurchaseModalOpen(false); setPurchaseItem(null) }}
        onSubmit={handlePurchaseSubmit}
        itemName={purchaseItem?.itemName || ''}
      />
      {/* Navigation */}
      <nav className="bg-black/20 backdrop-blur-sm border-b border-red-800/30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-800 rounded-lg flex items-center justify-center">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">
                CrimsonMC
              </h1>
            </div>
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
                    className="text-red-400 hover:bg-red-800/20"
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
          </div>
        </div>
      </nav>
      {/* Banner Section */}
      <div className="relative">
        <img
          src="/crimsonmc-banner.png"
          alt="CrimsonMC Banner"
          className="w-full h-96 object-cover"
        />
        <div className="absolute inset-0 bg-black/20"></div>
      </div>
      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {activeTab === 'home' ? (
          <div className="space-y-12">
            {/* ... home section unchanged ... */}
          </div>
        ) : activeTab === 'orders' && isAdmin ? (
          // ... orders section unchanged ...
          <></>
        ) : activeTab === 'ranks' ? (
          <div className="space-y-8">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-white mb-4">Server Ranks</h3>
              <p className="text-gray-300 max-w-2xl mx-auto">
                Unlock exclusive perks, commands, and privileges with our premium rank system.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* VIP Rank */}
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
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm">
                      <Star className="w-4 h-4 mr-2 text-yellow-400" />
                      Priority join access
                    </div>
                    <div className="flex items-center text-sm">
                      <Star className="w-4 h-4 mr-2 text-yellow-400" />
                      Exclusive commands
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-yellow-200 mb-4">$3.00</div>
                  <PurchaseButton itemType="rank" itemName="VIP" price={3.00} />
                </CardContent>
              </Card>
              {/* Knight Rank */}
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
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm">
                      <Star className="w-4 h-4 mr-2 text-blue-400" />
                      All VIP perks included
                    </div>
                    <div className="flex items-center text-sm">
                      <Star className="w-4 h-4 mr-2 text-blue-400" />
                      Custom nicknames
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-blue-200 mb-4">$5.00</div>
                  <PurchaseButton itemType="rank" itemName="Knight" price={5.00} />
                </CardContent>
              </Card>
              {/* Titan Rank */}
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
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm">
                      <Star className="w-4 h-4 mr-2 text-purple-400" />
                      All Knight perks included
                    </div>
                    <div className="flex items-center text-sm">
                      <Star className="w-4 h-4 mr-2 text-purple-400" />
                      Access to Titan-only areas
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-purple-200 mb-4">$7.00</div>
                  <PurchaseButton itemType="rank" itemName="Titan" price={7.00} />
                </CardContent>
              </Card>
              {/* Zeus Rank */}
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
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm">
                      <Star className="w-4 h-4 mr-2 text-sky-400" />
                      All Titan perks included
                    </div>
                    <div className="flex items-center text-sm">
                      <Star className="w-4 h-4 mr-2 text-sky-400" />
                      Zeus-only kits
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-sky-200 mb-4">$9.00</div>
                  <PurchaseButton itemType="rank" itemName="Zeus" price={9.00} />
                </CardContent>
              </Card>
              {/* Devil Rank */}
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
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm">
                      <Star className="w-4 h-4 mr-2 text-red-500" />
                      All Zeus perks included
                    </div>
                    <div className="flex items-center text-sm">
                      <Star className="w-4 h-4 mr-2 text-red-500" />
                      Devil-exclusive commands
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-red-300 mb-4">$11.00</div>
                  <PurchaseButton itemType="rank" itemName="Devil" price={11.00} />
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          // ... crates section unchanged ...
          <></>
        )}
      </div>
      {/* About Me Section and Footer unchanged */}
    </div>
  )
}

export default App