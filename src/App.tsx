// ...imports and state remain unchanged...
import { toast } from './components/ui/sonner'

// ...all state and logic remain unchanged...

export default function App() {
  // ...all hooks and logic remain unchanged...

  // ...all logic for cart, purchase, etc. remain unchanged...

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-red-950 via-gray-900 to-black">
      <AdminLoginDialog />
      <PurchaseModal
        isOpen={purchaseModalOpen}
        onClose={() => {
          setPurchaseModalOpen(false)
          setPurchaseItem(null)
        }}
        onSubmit={(ign, email) => handlePurchaseSubmit(ign, email)}
        itemName={purchaseItem?.itemName || ''}
      />
      <aside className="w-64 bg-black/20 backdrop-blur-sm border-r border-red-800/30 p-4 flex flex-col">
        {/* Sidebar content including login, navigation, cart, top customer, leaderboard, PayPal logo */}
        {sidebarLogin}
        {/* Navigation buttons */}
        <Button
          variant={activeTab === 'home' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('home')}
          className="text-white hover:bg-red-800/20 justify-start"
        >
          <Home className="w-4 h-4 mr-2" />
          Home
        </Button>
        <Button
          variant={activeTab === 'ranks' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('ranks')}
          className="text-white hover:bg-red-800/20 justify-start"
        >
          <Crown className="w-4 h-4 mr-2" />
          Ranks
        </Button>
        <Button
          variant={activeTab === 'crates' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('crates')}
          className="text-white hover:bg-red-800/20 justify-start"
        >
          <Package className="w-4 h-4 mr-2" />
          Crates
        </Button>
        {/* Cart icon button in sidebar */}
        <CartIconButton />
        {/* Cart summary */}
        <div className="mt-8 pt-4 border-t border-gray-700 text-center">
          <h4 className="text-xl font-bold text-white mb-4">Cart</h4>
          {cartItems.length === 0 ? (
            <p className="text-gray-400">Your cart is empty.</p>
          ) : (
            <ul className="space-y-3">
              {cartItems.map(({ itemType, itemName, price, quantity }) => (
                <li key={itemName} className="flex items-center gap-3 justify-center">
                  <span className="text-lg font-bold text-white">{itemName}</span>
                  <span className="text-sm text-gray-400">${price.toFixed(2)} x {quantity}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
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
        {/* Leaderboard */}
        <div className="mt-8 pt-4 border-t border-gray-700 text-center">
          <h4 className="text-xl font-bold text-white mb-4">Leaderboard</h4>
          {userProfiles.filter(u => u.totalSpent > 0).length === 0 ? (
            <p className="text-gray-400">No leaderboard yet.</p>
          ) : (
            <ul className="space-y-3">
              {userProfiles
                .filter(u => u.totalSpent > 0)
                .sort((a, b) => b.totalSpent - a.totalSpent)
                .slice(0, 5)
                .map((u, i) => (
                  <li key={u.email} className="flex items-center gap-3 justify-center">
                    <span className={`text-lg font-bold ${i === 0 ? 'text-amber-400' : 'text-white'}`}>{i + 1}.</span>
                    <img src="/skin-head.png" alt="User Head" className="w-8 h-8 rounded" style={{objectFit:'cover',objectPosition:'top'}} />
                    <span className="font-semibold text-white">{u.nickname}</span>
                    <span className="ml-2 text-sm text-gray-400">${u.totalSpent.toFixed(2)}</span>
                  </li>
                ))}
            </ul>
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
          <div className="flex items-center space-x-6">
            <CartIconButton />
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
              window.open('https://discord.gg/A4mZvAWE', '_blank')
            }}
            className="absolute top-4 right-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg shadow-lg cursor-pointer select-none"
            title="Join Discord Server"
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
      {showCart && <CartView />}
    </div>
  )
}
