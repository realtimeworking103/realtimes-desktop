import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/ui/components/ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useState } from "react";
import { toast } from "sonner";

export const AddMeDialog = ({
  open,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  onCancel: () => void;
  onConfirm: (userId: string, phone: string) => void;
}) => {
  const [userId, setUserId] = useState<string>("");
  const [phone, setPhone] = useState<string>("");

  const handleConfirm = () => {
    if (userId.length > 0 && phone.length > 0) {
      onConfirm(userId, phone);
    } else if (userId.length > 0) {
      onConfirm(userId, "");
    } else if (phone.length > 0) {
      onConfirm("", phone);
    } else {
      toast.error("กรุณากรอกไอดีหรือเบอร์โทรศัพท์");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>เพิ่มเพื่อนหาตัวเอง</DialogTitle>
        </DialogHeader>
        <Label>ใส่ไอดีหรือเบอร์โทรศัพท์</Label>
        <Input
          type="text"
          placeholder="ไอดีหรือเบอร์โทรศัพท์"
          value={userId || ""}
          onChange={(e) => {
            if (e.target.value.length > 0) {
              setUserId(e.target.value);
              setPhone("");
            } else {
              setPhone(e.target.value);
            }
          }}
        />
        <DialogFooter>
          <Button onClick={onCancel}>ยกเลิก</Button>
          <Button onClick={handleConfirm}>ยืนยัน</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
