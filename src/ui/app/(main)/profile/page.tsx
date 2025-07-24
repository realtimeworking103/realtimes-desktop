import { useEffect, useState } from "react";

import { Button } from "@/ui/components/ui/button";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/ui/components/ui/card";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/ui/components/ui/dialog";

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/ui/components/ui/table";

import { ProfileType } from "@/ui/types/types";

import { Badge } from "@/ui/components/ui/badge";
import { Image, Plus, Trash } from "lucide-react";
import { toast } from "sonner";

export default function Page() {
  const [profile, setProfile] = useState<ProfileType[]>([]);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");

  const selectImageFile = async () => {
    const result = await window.electron.selectImageFile();
    if (!result) return;
    if (profile.some((item) => item.name === result.name)) {
      toast.error("ไม่สามารถอัปโหลดโปรไฟล์ที่มีชื่อเดียวกันได้");
      return;
    }
    toast.success("อัปโหลดโปรไฟล์สำเร็จ");
    await fetchProfile();
  };

  const fetchProfile = async () => {
    const response = await window.electron.getProfile();
    setProfile(response);
  };

  const confirmDeleteProfile = async (name: string) => {
    const result = await window.electron.deleteProfile(name);
    if (!result) return;
    await fetchProfile();
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <div className="min-h-svh p-6 select-none">
      {/* Header */}
      <div className="sticky top-0 z-20 mb-4 border-b border-gray-200 bg-white/80 backdrop-blur dark:border-gray-700 dark:bg-gray-900/80">
        <div className="mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <Image className="h-8 w-8" />
            <h1 className="text-2xl font-bold text-gray-800">จัดการโปรไฟล์</h1>
          </div>
        </div>
      </div>

      {/* Status Card */}
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>จำนวนโปรไฟล์</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-600">
                จำนวนโปรไฟล์ทั้งหมด
              </p>
              <p className="text-3xl font-bold text-blue-600">
                {profile.length}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content */}
      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>รายการโปรไฟล์</CardTitle>
          <Button
            variant="outline"
            onClick={selectImageFile}
            size="lg"
            className="bg-blue-500 text-white transition-colors duration-200 hover:bg-blue-600"
          >
            <Plus className="h-4 w-4" />
            เพิ่มโปรไฟล์
          </Button>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb:hover]:bg-gray-400 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100">
            <div className="overflow-hidden rounded-lg border border-gray-200">
              <Table className="[&_*]:text-center [&_*]:align-middle">
                <TableHeader className="sticky top-0 z-10 bg-gray-50">
                  <TableRow className="hover:bg-gray-50">
                    <TableHead className="bg-gray-50 text-center font-semibold text-gray-700">
                      ลำดับ
                    </TableHead>
                    <TableHead className="bg-gray-50 text-center font-semibold text-gray-700">
                      วันที่สร้าง
                    </TableHead>
                    <TableHead className="bg-gray-50 text-center font-semibold text-gray-700">
                      ชื่อ
                    </TableHead>
                    <TableHead className="bg-gray-50 text-center font-semibold text-gray-700">
                      รูปโปรไฟล์
                    </TableHead>
                    <TableHead className="bg-gray-50 text-center font-semibold text-gray-700">
                      ที่อยู่
                    </TableHead>
                    <TableHead className="bg-gray-50 text-center font-semibold text-gray-700">
                      การดำเนินการ
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {profile.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className="bg-blue-100 text-sm text-blue-800"
                        >
                          {index + 1}
                        </Badge>
                      </TableCell>
                      <TableCell>{item.createAt}</TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell className="flex justify-center">
                        <img
                          src={`/profile/${item.name}`}
                          alt="profile"
                          className="h-10 w-10 rounded-full"
                        />
                      </TableCell>
                      <TableCell className="text-left">
                        <span className="text-sm text-gray-500">
                          {item.path}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="destructive"
                          onClick={() => {
                            setName(item.name);
                            setOpen(true);
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

      {/* Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>ลบโปรไฟล์</DialogTitle>
          </DialogHeader>
          <DialogDescription>คุณต้องการลบโปรไฟล์นี้หรือไม่?</DialogDescription>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              ยกเลิก
            </Button>
            <Button
              onClick={() => {
                confirmDeleteProfile(name);
                setOpen(false);
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
