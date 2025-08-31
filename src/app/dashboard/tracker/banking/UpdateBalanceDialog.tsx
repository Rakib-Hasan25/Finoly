import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/Tracker-ui/button';
import { Input } from '@/components/Tracker-ui/input';
import { Label } from '@/components/Tracker-ui/label';

interface UpdateBalanceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  accountName: string;
  currentBalance: number;
  onUpdate: (newBalance: number) => void;
}

export function UpdateBalanceDialog({ 
  isOpen, 
  onClose, 
  accountName, 
  currentBalance, 
  onUpdate 
}: UpdateBalanceDialogProps) {
  const [newBalance, setNewBalance] = useState(currentBalance.toString());

  const handleUpdate = () => {
    const amount = parseFloat(newBalance);
    if (!isNaN(amount)) {
      onUpdate(amount);
      onClose();
    }
  };

  const handleClose = () => {
    setNewBalance(currentBalance.toString());
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white">Update Balance</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label className="text-gray-300">Account</Label>
            <p className="text-white font-medium">{accountName}</p>
          </div>
          <div>
            <Label className="text-gray-300">New Balance (৳)</Label>
            <Input
              className="bg-slate-700 border-slate-600 text-white placeholder-gray-400"
              type="number"
              step="0.01"
              value={newBalance}
              onChange={(e) => setNewBalance(e.target.value)}
              placeholder="Enter new balance"
              autoFocus
            />
          </div>
          <div className="flex space-x-2 pt-4">
            <Button 
              variant="outline" 
              onClick={handleClose}
              className="flex-1 bg-transparent border-slate-600 text-gray-300 hover:bg-slate-700"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleUpdate}
              className="flex-1 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700"
            >
              Update Balance
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}