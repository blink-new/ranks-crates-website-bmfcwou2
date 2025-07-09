import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'

interface PurchaseModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (ign: string, email: string) => void
  itemName: string
}

export function PurchaseModal({ isOpen, onClose, onSubmit, itemName }: PurchaseModalProps) {
  const [ign, setIgn] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = () => {
    if (!ign.trim()) {
      setError('Please enter your in-game name (IGN).')
      return
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address.')
      return
    }
    setError('')
    onSubmit(ign.trim(), email.trim())
    setIgn('')
    setEmail('')
  }

  const handleClose = () => {
    setError('')
    setIgn('')
    setEmail('')
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && handleClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Purchase {itemName}</DialogTitle>
          <DialogDescription>
            Please enter your in-game name (IGN) and email to complete the purchase.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="ign" className="text-right">
              IGN
            </Label>
            <Input
              id="ign"
              value={ign}
              onChange={e => setIgn(e.target.value)}
              className="col-span-3"
              placeholder="Your Minecraft IGN"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="col-span-3"
              placeholder="you@example.com"
            />
          </div>
          {error && <p className="text-red-500 text-sm col-span-4 text-center">{error}</p>}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose} className="mr-2">
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Confirm Purchase</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
