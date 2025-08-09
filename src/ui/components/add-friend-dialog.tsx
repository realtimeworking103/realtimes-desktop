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
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";

interface AddFriendDialogProps {
  open: boolean;
  value: string;
  onChange: (v: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
  privatePhone: string;
  onChangePrivatePhone: (v: string) => void;
}

export const AddFriendDialog: React.FC<AddFriendDialogProps> = ({
  open,
  value,
  onChange,
  onConfirm,
  onCancel,
  privatePhone,
  onChangePrivatePhone,
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
      <Label>เบอร์โทรส่วนตัว</Label>
      <Textarea
        value={privatePhone}
        onChange={(e) => onChangePrivatePhone(e.target.value)}
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
