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
import { Input } from "@/ui/components/ui/input";

type TxtFile = { name: string; count: number; path: string; createAt: string };

export default function Page() {
  const [files, setFiles] = useState<TxtFile[]>([]);

  const fetchFiles = async () => {
    const data = await window.electron.getTxtFiles();
    setFiles(data);
  };

  const handleSelectFile = async () => {
    const result = await window.electron.selectTxtFile();
    if (!result) return;

    const { name, path, count } = result;
    console.log("📁 Path จริง:", path);

    const success = await window.electron.saveTxtFile({ name, count, path });
    if (success) {
      fetchFiles();
    }
  };

  const handleDelete = async (fileName: string) => {
    const success = await window.electron.deleteTxtFile(fileName);
    if (success) {
      fetchFiles();
    } else {
      alert("ลบไฟล์ไม่สำเร็จ");
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
        <Input type="file" accept=".txt" onChange={handleSelectFile} />
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
                  <Button onClick={() => handleDelete(file.name)}>ลบ</Button>
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
