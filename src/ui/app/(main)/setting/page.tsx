"use client";

import { useEffect, useState } from "react";
import { Button } from "@/ui/components/ui/button";
import { Input } from "@/ui/components/ui/input";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/ui/components/ui/card";
import { toast } from "sonner";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/ui/components/ui/table";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/ui/components/ui/dialog";
import { Label } from "@radix-ui/react-label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/components/ui/select";

export default function Page() {
  const [ldplayerPath, setLdplayerPath] = useState("");
  const [showDialog, setShowDialog] = useState(false);

  const [newLineId, setNewLineId] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [accounts, setAccounts] = useState<LineAccount[]>([]);
  const [newType, setNewType] = useState<string>("");

  useEffect(() => {
    window.electron.getLDPlayerPath().then((path) => {
      if (!path) {
        setShowDialog(true);
      } else {
        setLdplayerPath(path);
      }
    });
  }, []);

  const handleSave = async () => {
    if (!ldplayerPath.toLowerCase().endsWith("ldconsole.exe")) {
      toast.error("กรุณาเลือกไฟล์ ldconsole.exe ให้ถูกต้อง");
      return;
    }

    await window.electron.setLDPlayerPath(ldplayerPath);
    setShowDialog(false);
    toast.success("บันทึก PATH LDPlayer เรียบร้อยแล้ว");
  };

  const handleAddLineId = async () => {
    if (!newLineId.trim()) return;

    await window.electron.addAccountLineId({
      lineId: newLineId,
      type: newType,
    });
    const updated = await window.electron.getAccountLineId();

    setAccounts(updated);
    setNewLineId("");
    setNewType("BOT");
    setOpenDialog(false);
  };

  const handleDeleteLineId = async (id: number) => {
    await window.electron.deleteAccountLineId(id);
    const updated = await window.electron.getAccountLineId();
    setAccounts(updated);
  };

  useEffect(() => {
    window.electron.getAccountLineId().then(setAccounts);
  }, []);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>ตั้งค่า</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex w-full space-x-3">
            <Input
              type="text"
              placeholder="PATH LDPlayer"
              value={ldplayerPath}
              onChange={(e) => setLdplayerPath(e.target.value)}
            />
            <Button onClick={handleSave}>บันทึก</Button>
          </div>
        </CardContent>
        <CardFooter></CardFooter>
      </Card>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <Card>
          <CardHeader>
            <CardTitle>ไลน์ไก่</CardTitle>
          </CardHeader>
          <CardContent>
            <CardAction>
              <DialogTrigger asChild>
                <Button>เพิ่มรายการ</Button>
              </DialogTrigger>
            </CardAction>
            <div className="flex w-full space-x-3">
              <Table className="mt-4 [&_*]:text-center [&_*]:align-middle">
                <TableHeader>
                  <TableRow>
                    <TableHead>ลำดับ</TableHead>
                    <TableHead>ประเภท</TableHead>
                    <TableHead>รายการ</TableHead>
                    <TableHead>การจัดการ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {accounts.map((acc, index) => (
                    <TableRow key={acc.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{acc.type}</TableCell>
                      <TableCell>{acc.lineId}</TableCell>
                      <TableCell>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteLineId(acc.id)}
                        >
                          ลบ
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
          <CardFooter></CardFooter>
        </Card>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>เพิ่มรายการ</DialogTitle>
            <div className="space-y-3">
              <div>
                <Label>ประเภท</Label>
                <Select
                  value={newType}
                  onValueChange={(val) => setNewType(val)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="เลือกประเภท" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Oa">OA</SelectItem>
                    <SelectItem value="Private">Private</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>ไอดีไลน์</Label>
                <Input
                  value={newLineId}
                  onChange={(e) => setNewLineId(e.target.value)}
                  placeholder="กรอกไอดีไลน์"
                />
              </div>
            </div>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={handleAddLineId}>ยืนยัน</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {showDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-[400px] space-y-4 rounded-lg bg-white p-6 shadow-lg">
            <h2 className="text-lg font-semibold">กรุณาใส่ PATH LDPlayer</h2>
            <Input
              placeholder="C:\\LDPlayer\\ldconsole.exe"
              value={ldplayerPath}
              onChange={(e) => setLdplayerPath(e.target.value)}
            />
            <div className="flex justify-end space-x-2">
              <Button onClick={handleSave}>บันทึก</Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
