"use client";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/ui/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/ui/components/ui/table";
import { Button } from "@/ui/components/ui/button";
import { FileText, Trash2 } from "lucide-react";

type TxtFile = { name: string; count: number; path: string; createAt: string };

export default function Page() {
  const [files, setFiles] = useState<TxtFile[]>([]);

  const fetchFiles = async () => {
    const data = await window.electron.getTxtFiles();
    setFiles(data);
  };

  const handleSelectFile = async () => {
    const result = await window.electron.selectTextFile();

    if (!result || !result.path) {
      console.log("ยกเลิกหรือไม่มีไฟล์");
      return;
    }

    const { name, path, count } = result;

    const success = await window.electron.saveTxtFile({ name, count, path });
    if (success) {
      console.log("บันทึกสำเร็จ");
      fetchFiles();
    } else {
      console.log("บันทึกล้มเหลว");
    }
  };

  const handleDelete = async (fileName: string) => {
    const success = await window.electron.deleteTxtFile(fileName);
    if (success) {
      fetchFiles();
    } else {
      console.log("ลบไฟล์ไม่สำเร็จ");
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>ไฟล์รายชื่อ</CardTitle>
      </CardHeader>
      <CardContent>
        <Button onClick={handleSelectFile} className="mb-4" variant="outline">
          <FileText className="mr-2 h-4 w-4" />
          เลือกไฟล์ .txt
        </Button>

        <Table className="mt-4 [&_*]:text-center [&_*]:align-middle">
          <TableCaption>รายการไฟล์ทั้งหมด</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>ลำดับ</TableHead>
              <TableHead>วันที่สร้าง</TableHead>
              <TableHead>ชื่อไฟล์</TableHead>
              <TableHead>จำนวนเบอร์</TableHead>
              <TableHead>การจัดการ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {files.map((file, idx) => (
              <TableRow key={file.name}>
                <TableCell>{idx + 1}</TableCell>
                <TableCell>{file.createAt}</TableCell>
                <TableCell>{file.name}</TableCell>
                <TableCell>{file.count}</TableCell>
                <TableCell>
                  <Button
                    onClick={() => handleDelete(file.name)}
                    variant="destructive"
                    size="sm"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter />
    </Card>
  );
}
