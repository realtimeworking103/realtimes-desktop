import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import React from "react";

interface AddFriendDialogProps {
  open: boolean;
  value: string;
  onChange: (v: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

export const AddFriendDialog: React.FC<AddFriendDialogProps> = ({
  open,
  value,
  onChange,
  onConfirm,
  onCancel,
}) => (
  <Dialog open={open} onOpenChange={onCancel}>
    <DialogContent className="max-w-md p-4 select-none">
      <DialogHeader>
        <DialogTitle>เพิ่มเพื่อน</DialogTitle>
        <DialogDescription>ใส่จำนวนเพื่อนที่ต้องการ</DialogDescription>
      </DialogHeader>
      <Input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>
          ยกเลิก
        </Button>
        <Button onClick={onConfirm}>ยืนยัน</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);
