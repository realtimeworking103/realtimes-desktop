import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Label } from "@radix-ui/react-label";
import React from "react";

interface Account {
  id: string;
  lineId: string;
  type: string;
}

interface CreateGroupDialogProps {
  open: boolean;
  oaAccounts: Account[];
  privateAccounts: Account[];
  selectedOa: string;
  setSelectedOa: (v: string) => void;
  selectedPrivate: string;
  setSelectedPrivate: (v: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

export const CreateGroupDialog: React.FC<CreateGroupDialogProps> = ({
  open,
  oaAccounts,
  privateAccounts,
  selectedOa,
  setSelectedOa,
  selectedPrivate,
  setSelectedPrivate,
  onConfirm,
  onCancel,
}) => (
  <Dialog open={open} onOpenChange={onCancel}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>สร้างกลุ่ม</DialogTitle>
      </DialogHeader>
      <div className="space-y-3">
        <Label>ชื่อกลุ่ม</Label>
        <Select>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="ยังไม่เปิดให้ใช้งาน" />
          </SelectTrigger>
        </Select>
        <Label>รูปภาพกลุ่ม</Label>
        <Select>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="ยังไม่เปิดให้ใช้งาน" />
          </SelectTrigger>
        </Select>
        <Label>ไลน์Oa</Label>
        <Select value={selectedOa} onValueChange={setSelectedOa}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="เลือก Oa" />
          </SelectTrigger>
          <SelectContent>
            {oaAccounts.map((acc) => (
              <SelectItem key={acc.id} value={acc.lineId}>
                {acc.lineId}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Label>ไลน์ไก่</Label>
        <Select value={selectedPrivate} onValueChange={setSelectedPrivate}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="เลือก Private" />
          </SelectTrigger>
          <SelectContent>
            {privateAccounts.map((acc) => (
              <SelectItem key={acc.id} value={acc.lineId}>
                {acc.lineId}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>ยกเลิก</Button>
        <Button className="w-full" onClick={onConfirm}>สร้างกลุ่ม</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
); 