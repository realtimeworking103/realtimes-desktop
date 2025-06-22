import { Button } from "@/ui/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/ui/components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/components/ui/select";
import { Label } from "@radix-ui/react-label";

export default function Page() {
  return (
    <Dialog>
      <DialogTrigger>Open</DialogTrigger>
      <DialogHeader>
        <DialogContent>
          <DialogTitle>สร้างกลุ่ม</DialogTitle>
          <div className="space-y-6">
            <Label>ชื่อกลุ่ม</Label>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
            <Label>ไลน์ไก่</Label>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button>สร้างกลุ่ม</Button>
        </DialogContent>
      </DialogHeader>
    </Dialog>
  );
}