"use client";
import { useEffect, useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/ui/components/ui/table";
import { Button } from "@/ui/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/ui/components/ui/card";
import { Badge } from "@/ui/components/ui/badge";
import { FileText, Trash, Plus } from "lucide-react";
import { toast } from "sonner";
import {
  DialogHeader,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/ui/components/ui/dialog";

type TxtFile = {
  id: number;
  name: string;
  count: number;
  path: string;
  createAt: string;
};

export default function Page() {
  const [files, setFiles] = useState<TxtFile[]>([]);
  const [open, setOpen] = useState(false);
  const [id, setId] = useState(0);

  const fetchFiles = async () => {
    try {
      const data = await window.electron.getTxtFiles();
      setFiles(data);
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  };

  const handleSelectFile = async () => {
    const result = await window.electron.selectTextFile();

    if (!result || !result.path) {
      console.log("ยกเลิกหรือไม่มีไฟล์");
      return;
    }

    if (files.some((file) => file.name === result.name)) {
      toast.error("ไฟล์นี้มีอยู่ในระบบแล้ว");
      return;
    }

    const { name, count, path } = result;

    const success = await window.electron.saveTxtFile({ name, count, path });
    if (success) {
      console.log("บันทึกสำเร็จ");
      fetchFiles();
    } else {
      console.log("บันทึกล้มเหลว");
    }
  };

  const handleConfirmDelete = async (id: number) => {
    const success = await window.electron.deleteTxtFile(id);
    if (success) {
      fetchFiles();
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const totalFiles = files.length;
  const totalNumbers = files.reduce((sum, file) => sum + file.count, 0);

  return (
    <div className="min-h-svh p-6 select-none">
      {/* Header Section */}
      <div className="sticky top-0 z-20 mb-4 border-b border-gray-200 bg-white/80 backdrop-blur dark:border-gray-700 dark:bg-gray-900/80">
        <div className="mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <FileText className="mr-2 h-8 w-8" />
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              จัดการไฟล์
            </h1>
          </div>
          <div className="flex items-center gap-2"></div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>จำนวนไฟล์</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-600">
                จำนวนไฟล์ทั้งหมด
              </p>
              <div className="flex items-center gap-2"></div>
              <p className="text-3xl font-bold text-blue-600">{totalFiles}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>จำนวนเบอร์</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-600">
                จำนวนเบอร์ทั้งหมด
              </p>
              <p className="text-3xl font-bold text-blue-600">
                {totalNumbers.toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>ไฟล์ล่าสุด</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-600">ไฟล์ล่าสุด</p>
              <p className="text-3xl font-bold text-blue-600">
                {files.length > 0 ? files[0].name : "ไม่มีไฟล์"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Files Table */}
      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>รายการไฟล์</CardTitle>
          <Button
            onClick={handleSelectFile}
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
                <TableHeader className="sticky top-0 z-10 bg-gray-50">
                  <TableRow className="hover:bg-gray-50">
                    <TableHead className="bg-gray-50 text-center font-semibold text-gray-700">
                      ลำดับ
                    </TableHead>
                    <TableHead className="bg-gray-50 text-center font-semibold text-gray-700">
                      วันที่สร้าง
                    </TableHead>
                    <TableHead className="bg-gray-50 text-center font-semibold text-gray-700">
                      ชื่อไฟล์
                    </TableHead>
                    <TableHead className="bg-gray-50 text-center font-semibold text-gray-700">
                      จำนวนเบอร์
                    </TableHead>
                    <TableHead className="bg-gray-50 text-center font-semibold text-gray-700">
                      การจัดการ
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {files.map((file, idx) => (
                    <TableRow
                      key={file.id}
                      className="transition-colors duration-200 hover:bg-blue-50/50"
                    >
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className="bg-blue-100 text-blue-800"
                        >
                          {idx + 1}
                        </Badge>
                      </TableCell>
                      <TableCell>{file.createAt}</TableCell>
                      <TableCell>{file.name}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="border-green-200 bg-green-50 text-green-700"
                        >
                          {file.count.toLocaleString()} เบอร์
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          onClick={() => {
                            setOpen(true);
                            setId(file.id);
                          }}
                          variant="destructive"
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
            <DialogTitle>ลบไฟล์</DialogTitle>
          </DialogHeader>
          <DialogDescription>คุณต้องการลบไฟล์นี้หรือไม่?</DialogDescription>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              ยกเลิก
            </Button>
            <Button
              variant="default"
              onClick={() => {
                handleConfirmDelete(id);
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
