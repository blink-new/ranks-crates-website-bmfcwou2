import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card'
import { Badge } from './components/ui/badge'
import { Button } from './components/ui/button'
import { Input } from './components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './components/ui/table'
import { Crown, Package, Star, User, Mail, MapPin, ShoppingCart, Eye, Search, Filter } from 'lucide-react'

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
  const [activeTab, setActiveTab] = useState<'ranks' | 'crates' | 'orders'>('ranks')
  const [orders, setOrders] = useState<Order[]>([])
  const [isAdmin, setIsAdmin] = useState(false)
  const [customerName, setCustomerName] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [adminPassword, setAdminPassword] = useState('')
  const [showAdminLogin, setShowAdminLogin] = useState(false)

  useEffect(() => {
    // Load orders from localStorage
    const savedOrders = localStorage.getItem('crimsonmc-orders')
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders))
    }
    
    // Check if user is already logged in as admin
    const adminLoggedIn = localStorage.getItem('crimsonmc-admin')
    if (adminLoggedIn === 'true') {
      setIsAdmin(true)
    }
  }, [])

  const handleAdminLogin = () => {
    // Simple admin password check
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
    setActiveTab('ranks')
  }

  const handlePurchase = (itemType: string, itemName: string, price: number) => {
    if (!customerName || !customerEmail) {
      alert('Please enter your name and email address')
      return
    }

    const newOrder: Order = {
      id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      customerName,
      customerEmail,
      itemType,
      itemName,
      price,
      status: 'completed',
      createdAt: new Date().toISOString()
    }

    const updatedOrders = [newOrder, ...orders]
    setOrders(updatedOrders)
    localStorage.setItem('crimsonmc-orders', JSON.stringify(updatedOrders))

    alert(`Order placed successfully! Order ID: ${newOrder.id}`)
    
    // Clear form
    setCustomerName('')
    setCustomerEmail('')
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

  const PurchaseForm = ({ itemType, itemName, price }: { itemType: string, itemName: string, price: number }) => (
    <Dialog>
      <DialogTrigger asChild>
        <Button className={`w-full ${itemType === 'rank' ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}`}>
          <ShoppingCart className="w-4 h-4 mr-2" />
          Purchase {itemName}
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-gray-900 text-white border-gray-700">
        <DialogHeader>
          <DialogTitle>Purchase {itemName}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Your Name</label>
            <Input
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Enter your full name"
              className="bg-gray-800 border-gray-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Email Address</label>
            <Input
              type="email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              placeholder="Enter your email"
              className="bg-gray-800 border-gray-600"
            />
          </div>
          <div className="pt-4 border-t border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold">Total:</span>
              <span className="text-2xl font-bold text-red-400">${price.toFixed(2)}</span>
            </div>
            <Button 
              onClick={() => handlePurchase(itemType, itemName, price)}
              className="w-full bg-red-600 hover:bg-red-700"
            >
              Complete Purchase
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-950 via-gray-900 to-black">
      <AdminLoginDialog />
      
      {/* Navigation */}
      <nav className="bg-black/20 backdrop-blur-sm border-b border-red-800/30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-800 rounded-lg flex items-center justify-center">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">
                CrimsonMc <span className="text-red-400">| Store</span>
              </h1>
            </div>
            <div className="flex items-center space-x-6">
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
      <img
        src="https://storage.googleapis.com/blink-451505.firebasestorage.app/screenshots/3000-igps84ylcc0h46n214bwr-78c549ad.preview-blink.com-1752024666767.webp"
        alt="CrimsonMc Store Banner"
        className="w-full h-64 object-cover"
      />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {activeTab === 'orders' && isAdmin ? (
          <div className="space-y-8">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-white mb-4">Order Management</h3>
              <p className="text-gray-300 max-w-2xl mx-auto">
                View and manage all customer orders in real-time
              </p>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search orders by customer name, email, or item..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-800 border-gray-600 text-white"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="bg-gray-800 border-gray-600 text-white rounded px-3 py-2"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Orders Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="bg-gray-900/50 border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Total Orders</p>
                      <p className="text-2xl font-bold text-white">{orders.length}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-600/20 rounded-full flex items-center justify-center">
                      <Package className="w-6 h-6 text-blue-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-900/50 border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Total Revenue</p>
                      <p className="text-2xl font-bold text-green-400">
                        ${orders.reduce((sum, order) => sum + order.price, 0).toFixed(2)}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-green-600/20 rounded-full flex items-center justify-center">
                      <Star className="w-6 h-6 text-green-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-900/50 border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Completed Orders</p>
                      <p className="text-2xl font-bold text-white">
                        {orders.filter(order => order.status === 'completed').length}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-red-600/20 rounded-full flex items-center justify-center">
                      <Crown className="w-6 h-6 text-red-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Orders Table */}
            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Recent Orders ({filteredOrders.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-700">
                      <TableHead className="text-gray-300">Order ID</TableHead>
                      <TableHead className="text-gray-300">Customer</TableHead>
                      <TableHead className="text-gray-300">Email</TableHead>
                      <TableHead className="text-gray-300">Item</TableHead>
                      <TableHead className="text-gray-300">Price</TableHead>
                      <TableHead className="text-gray-300">Status</TableHead>
                      <TableHead className="text-gray-300">Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.map((order) => (
                      <TableRow key={order.id} className="border-gray-700">
                        <TableCell className="text-white font-mono text-sm">{order.id}</TableCell>
                        <TableCell className="text-white">{order.customerName}</TableCell>
                        <TableCell className="text-gray-300">{order.customerEmail}</TableCell>
                        <TableCell className="text-white">
                          <Badge className={`${order.itemType === 'rank' ? 'bg-red-600' : 'bg-blue-600'}`}>
                            {order.itemName}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-green-400 font-semibold">${order.price.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge variant={order.status === 'completed' ? 'default' : 'secondary'}>
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-300">
                          {new Date(order.createdAt).toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {filteredOrders.length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    No orders found matching your criteria.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
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
                  <CardTitle className="text-yellow-200">VIP Rank</CardTitle>
                  <CardDescription className="text-gray-300">
                    Essential perks for casual players
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
                    <div className="flex items-center text-sm">
                      <Star className="w-4 h-4 mr-2 text-yellow-400" />
                      Special chat colors
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-yellow-200 mb-4">$9.99</div>
                  <PurchaseForm itemType="rank" itemName="VIP Rank" price={9.99} />
                </CardContent>
              </Card>

              {/* Premium Rank */}
              <Card className="bg-gradient-to-br from-purple-900/20 to-purple-800/20 border-purple-600/30">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Crown className="w-8 h-8 text-purple-400" />
                    <Badge className="bg-purple-600/20 text-purple-200">PREMIUM</Badge>
                  </div>
                  <CardTitle className="text-purple-200">Premium Rank</CardTitle>
                  <CardDescription className="text-gray-300">
                    Advanced features for dedicated players
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-gray-300">
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm">
                      <Star className="w-4 h-4 mr-2 text-purple-400" />
                      All VIP perks included
                    </div>
                    <div className="flex items-center text-sm">
                      <Star className="w-4 h-4 mr-2 text-purple-400" />
                      Custom nicknames
                    </div>
                    <div className="flex items-center text-sm">
                      <Star className="w-4 h-4 mr-2 text-purple-400" />
                      Exclusive areas access
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-purple-200 mb-4">$19.99</div>
                  <PurchaseForm itemType="rank" itemName="Premium Rank" price={19.99} />
                </CardContent>
              </Card>

              {/* Elite Rank */}
              <Card className="bg-gradient-to-br from-red-900/20 to-red-800/20 border-red-600/30">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Crown className="w-8 h-8 text-red-400" />
                    <Badge className="bg-red-600/20 text-red-200">ELITE</Badge>
                  </div>
                  <CardTitle className="text-red-200">Elite Rank</CardTitle>
                  <CardDescription className="text-gray-300">
                    Ultimate experience for serious players
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-gray-300">
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm">
                      <Star className="w-4 h-4 mr-2 text-red-400" />
                      All Premium perks included
                    </div>
                    <div className="flex items-center text-sm">
                      <Star className="w-4 h-4 mr-2 text-red-400" />
                      Admin-level commands
                    </div>
                    <div className="flex items-center text-sm">
                      <Star className="w-4 h-4 mr-2 text-red-400" />
                      VIP discord access
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-red-200 mb-4">$39.99</div>
                  <PurchaseForm itemType="rank" itemName="Elite Rank" price={39.99} />
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-white mb-4">Mystery Crates</h3>
              <p className="text-gray-300 max-w-2xl mx-auto">
                Open exciting crates filled with rare items, exclusive cosmetics, and powerful gear.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Common Crate */}
              <Card className="bg-gradient-to-br from-gray-900/20 to-gray-800/20 border-gray-600/30">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Package className="w-8 h-8 text-gray-400" />
                    <Badge className="bg-gray-600/20 text-gray-200">COMMON</Badge>
                  </div>
                  <CardTitle className="text-gray-200">Common Crate</CardTitle>
                  <CardDescription className="text-gray-300">
                    Basic items and materials
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-gray-300">
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm">
                      <Package className="w-4 h-4 mr-2 text-gray-400" />
                      Basic tools & weapons
                    </div>
                    <div className="flex items-center text-sm">
                      <Package className="w-4 h-4 mr-2 text-gray-400" />
                      Common cosmetics
                    </div>
                    <div className="flex items-center text-sm">
                      <Package className="w-4 h-4 mr-2 text-gray-400" />
                      Building materials
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-gray-200 mb-4">$2.99</div>
                  <PurchaseForm itemType="crate" itemName="Common Crate" price={2.99} />
                </CardContent>
              </Card>

              {/* Rare Crate */}
              <Card className="bg-gradient-to-br from-blue-900/20 to-blue-800/20 border-blue-600/30">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Package className="w-8 h-8 text-blue-400" />
                    <Badge className="bg-blue-600/20 text-blue-200">RARE</Badge>
                  </div>
                  <CardTitle className="text-blue-200">Rare Crate</CardTitle>
                  <CardDescription className="text-gray-300">
                    Uncommon items and gear
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-gray-300">
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm">
                      <Package className="w-4 h-4 mr-2 text-blue-400" />
                      Enhanced weapons
                    </div>
                    <div className="flex items-center text-sm">
                      <Package className="w-4 h-4 mr-2 text-blue-400" />
                      Rare cosmetics
                    </div>
                    <div className="flex items-center text-sm">
                      <Package className="w-4 h-4 mr-2 text-blue-400" />
                      Special consumables
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-blue-200 mb-4">$7.99</div>
                  <PurchaseForm itemType="crate" itemName="Rare Crate" price={7.99} />
                </CardContent>
              </Card>

              {/* Legendary Crate */}
              <Card className="bg-gradient-to-br from-amber-900/20 to-amber-800/20 border-amber-600/30">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Package className="w-8 h-8 text-amber-400" />
                    <Badge className="bg-amber-600/20 text-amber-200">LEGENDARY</Badge>
                  </div>
                  <CardTitle className="text-amber-200">Legendary Crate</CardTitle>
                  <CardDescription className="text-gray-300">
                    Exclusive legendary items
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-gray-300">
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm">
                      <Package className="w-4 h-4 mr-2 text-amber-400" />
                      Legendary weapons
                    </div>
                    <div className="flex items-center text-sm">
                      <Package className="w-4 h-4 mr-2 text-amber-400" />
                      Exclusive skins
                    </div>
                    <div className="flex items-center text-sm">
                      <Package className="w-4 h-4 mr-2 text-amber-400" />
                      Rare collectibles
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-amber-200 mb-4">$15.99</div>
                  <PurchaseForm itemType="crate" itemName="Legendary Crate" price={15.99} />
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>

      {/* About Me Section */}
      <div className="bg-black/20 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-3xl font-bold text-white mb-8">About Me</h3>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <div className="flex items-center justify-center md:justify-start space-x-3">
                  <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-left">
                    <h4 className="text-xl font-semibold text-white">Server Owner</h4>
                    <p className="text-gray-400">CrimsonMc Administrator</p>
                  </div>
                </div>
                <p className="text-gray-300 text-left">
                  Welcome to CrimsonMc! I'm passionate about creating the best Minecraft experience 
                  for our community. Our server features custom plugins, exciting events, and a 
                  welcoming environment for players of all skill levels.
                </p>
              </div>
              <div className="space-y-4">
                <Card className="bg-red-900/20 border-red-600/30">
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <div className="flex items-center text-gray-300">
                        <Mail className="w-5 h-5 mr-3 text-red-400" />
                        <span>admin@crimsonmc.com</span>
                      </div>
                      <div className="flex items-center text-gray-300">
                        <MapPin className="w-5 h-5 mr-3 text-red-400" />
                        <span>Server: play.crimsonmc.com</span>
                      </div>
                      <div className="flex items-center text-gray-300">
                        <Star className="w-5 h-5 mr-3 text-red-400" />
                        <span>Est. 2024 • 24/7 Support</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black/40 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">
            &copy; 2024 CrimsonMc Store. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App