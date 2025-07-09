import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card'
import { Badge } from './components/ui/badge'
import { Button } from './components/ui/button'
import { Crown, Package, Star, User, Mail, MapPin } from 'lucide-react'

function App() {
  const [activeTab, setActiveTab] = useState<'ranks' | 'crates'>('ranks')

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-950 via-gray-900 to-black">
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
            </div>
          </div>
        </div>
      </nav>

      {/* Banner Section */}
      <div className="relative h-64 bg-gradient-to-r from-red-900 to-red-700 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 text-center text-white">
          <h2 className="text-5xl font-bold mb-4">Welcome to CrimsonMc</h2>
          <p className="text-xl opacity-90">Premium Ranks & Exclusive Crates</p>
          <div className="mt-6">
            <Badge variant="outline" className="bg-red-600/20 text-red-200 border-red-400">
              <Star className="w-4 h-4 mr-1" />
              Premium Store
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {activeTab === 'ranks' ? (
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
                  <Button className="w-full bg-yellow-600 hover:bg-yellow-700">
                    Purchase VIP
                  </Button>
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
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">
                    Purchase Premium
                  </Button>
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
                  <Button className="w-full bg-red-600 hover:bg-red-700">
                    Purchase Elite
                  </Button>
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
                  <Button className="w-full bg-gray-600 hover:bg-gray-700">
                    Open Crate
                  </Button>
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
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    Open Crate
                  </Button>
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
                  <Button className="w-full bg-amber-600 hover:bg-amber-700">
                    Open Crate
                  </Button>
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
            © 2024 CrimsonMc Store. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App