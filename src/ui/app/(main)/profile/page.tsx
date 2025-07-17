import { useEffect, useState } from "react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/ui/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/ui/components/ui/table";

import { Input } from "@/ui/components/ui/input";

type ImageProfile = {
  id: number;
  image: string;
  path: string;
  createAt: string;
};

export default function () {
  const [ImageProfile, setImageProfile] = useState<ImageProfile[]>([]);

  const fetchImageProfile = async () => {
    const data = await window.electron.getImageProfile();
    setImageProfile(data);
  };

  useEffect(() => {
    fetchImageProfile();
  }, []);

  const handleSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // สร้าง object metadata
    const metadata = {
      image: file.name,
      size: file.size,
      type: file.type,
      lastModified: new Date(file.lastModified).toISOString(),
      // ถ้าคุณต้องการบันทึก path จริงของไฟล์บนเครื่อง ให้เพิ่ม logic
      path: file.path  // ใน Electron ถ้าเปิดใช้งาน enableRemoteModule หรือใช้ dialog
    };

    console.log(metadata.path);

    // รีโหลดข้อมูลใหม่
    fetchImageProfile();
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>โปรไฟล์</CardTitle>
        </CardHeader>
        <CardContent>
          <Input type="file" accept="image/*" onChange={handleSelect} />
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ลำดับ</TableHead>
                <TableHead>วันที่สร้าง</TableHead>
                <TableHead>รูปภาพ</TableHead>
                <TableHead>ที่อยู่รูปภาพ</TableHead>
                <TableHead>การจัดการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                {ImageProfile.map((profile, idx) => (
                  <TableRow key={profile.id}>
                    <TableCell>{idx + 1}</TableCell>
                    <TableCell>{profile.createAt}</TableCell>
                    <TableCell>{profile.image}</TableCell>
                    <TableCell>{profile.path}</TableCell>
                  </TableRow>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
