import { useState, useEffect } from "react";
import { AccountType } from "@/ui/types/types";
import { Button } from "@/ui/components/ui/button";
import { Badge } from "@/ui/components/ui/badge";
import { Plus, Trash, Users } from "lucide-react";
import { Switch } from "@/ui/components/ui/switch";
import { Input } from "@/ui/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/ui/components/ui/radio-group";
import { Label } from "@/ui/components/ui/label";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/ui/components/ui/card";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/ui/components/ui/dialog";

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/ui/components/ui/table";
import { toast } from "sonner";

export default function Page() {
  const [account, setAccount] = useState<AccountType[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [mid, setMid] = useState("");
  const [status, setStatus] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const fetchAccount = () => {
    window.electron.getAccount().then((data) => {
      setAccount(data);
    });
  };

  const handleClear = () => {
    setName("");
    setMid("");
    setType("");
    setStatus(true);
  };

  const handleAddAccount = () => {
    if (name === "" || type === "") {
      toast.error("กรุณากรอกข้อมูลให้ครบ");
      return;
    }
    window.electron.addAccount({ type, name, mid, status });
    fetchAccount();
    setOpenDialog(false);
    handleClear();
  };

  const handleDeleteAccount = (name: string) => {
    window.electron.deleteAccount(name);
    fetchAccount();
  };

  const handleChangeStatus = (name: string, status: boolean) => {
    window.electron.updateAccount({
      name: name,
      type: type,
      mid: mid,
      status: !status,
    });
    fetchAccount();
  };

  useEffect(() => {
    fetchAccount();
  }, []);

  return (
    <div className="min-h-svh p-6 select-none">
      <div className="sticky top-0 z-20 mb-4 border-b border-gray-200 bg-white/80 backdrop-blur dark:border-gray-700 dark:bg-gray-900/80">
        <div className="mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <Users className="h-8 w-8" />
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              จัดการบัญชีไลน์
            </h1>
          </div>
          <div className="flex items-center gap-2"></div>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>บัญชีไลน์ทั้งหมด</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-600">
                จำนวนบัญชีไลน์
              </p>
              <p className="text-3xl font-bold text-blue-600">
                {account.length}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>บัญชีไลน์ที่ใช้งานอยู่</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-600">
                บัญชีไลน์ที่ใช้งานอยู่
              </p>
              <p className="text-3xl font-bold text-blue-600">
                {account.filter((account) => account.status).length}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mx-auto space-y-4">
        <Card>
          <CardHeader className="flex items-center justify-between">
            <CardTitle>รายการบัญชีไลน์</CardTitle>
            <Button
              onClick={() => setOpenDialog(true)}
              variant="default"
              size="lg"
              className="bg-blue-500 text-white transition-colors duration-200 hover:bg-blue-600"
            >
              <Plus className="h-4 w-4" />
              เพิ่มรายการ
            </Button>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb:hover]:bg-gray-400 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100">
              <div className="overflow-hidden rounded-lg border border-gray-200">
                <Table className="[&_*]:text-center [&_*]:align-middle">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="bg-gray-50 font-semibold text-gray-700">
                        ลำดับ
                      </TableHead>
                      <TableHead className="bg-gray-50 font-semibold text-gray-700">
                        วันที่สร้าง
                      </TableHead>
                      <TableHead className="bg-gray-50 font-semibold text-gray-700">
                        ประเภท
                      </TableHead>
                      <TableHead className="bg-gray-50 font-semibold text-gray-700">
                        ไอดี
                      </TableHead>
                      <TableHead className="bg-gray-50 font-semibold text-gray-700">
                        MID
                      </TableHead>
                      <TableHead className="bg-gray-50 font-semibold text-gray-700">
                        สถานะ
                      </TableHead>
                      <TableHead className="bg-gray-50 font-semibold text-gray-700">
                        การดำเนินการ
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {account.map((account: AccountType) => (
                      <TableRow key={account.id}>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className="bg-blue-100 text-sm text-blue-800"
                          >
                            {account.id}
                          </Badge>
                        </TableCell>
                        <TableCell>{account.createAt}</TableCell>
                        <TableCell>{account.type}</TableCell>
                        <TableCell>{account.name}</TableCell>
                        <TableCell>{account.mid}</TableCell>
                        <TableCell>
                          <Switch
                            checked={account.status}
                            onCheckedChange={() =>
                              handleChangeStatus(account.name, account.status)
                            }
                            className="data-[state=checked]:bg-blue-500"
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="destructive"
                            onClick={() => {
                              setName(account.name);
                              setConfirmDelete(true);
                            }}
                            size="sm"
                            className="bg-red-500 transition-colors duration-200 hover:bg-red-600"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>เพิ่มบัญชีไลน์</DialogTitle>
          </DialogHeader>
          <DialogDescription className="space-y-4">
            <Input
              type="text"
              placeholder="ชื่อบัญชี"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              type="text"
              placeholder="MID"
              value={mid}
              onChange={(e) => setMid(e.target.value)}
              disabled={true}
            />
            <RadioGroup
              value={type}
              onValueChange={(value) => setType(value)}
              className="flex flex-col gap-2"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="ไลน์บอท" />
                <Label>ไลน์บอท</Label>
                <RadioGroupItem value="ไลน์ส่วนตัว" />
                <Label>ไลน์ส่วนตัว</Label>
              </div>
            </RadioGroup>
            <div className="flex items-center gap-2">
              <Switch
                checked={status}
                onCheckedChange={(value) => {
                  setStatus(value);
                  handleChangeStatus(name, value);
                }}
              />
              <Label>เปิดใช้งาน</Label>
            </div>
          </DialogDescription>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDialog(false)}>
              ยกเลิก
            </Button>
            <Button variant="default" onClick={handleAddAccount}>
              ยืนยัน
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>ยืนยันการลบบัญชีไลน์</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            คุณต้องการลบบัญชีไลน์นี้หรือไม่?
          </DialogDescription>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDelete(false)}>
              ยกเลิก
            </Button>
            <Button
              variant="default"
              onClick={() => {
                handleDeleteAccount(name);
                setConfirmDelete(false);
              }}
            >
              ยืนยัน
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
