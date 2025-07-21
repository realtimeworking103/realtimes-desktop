import { Button } from "@/ui/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/ui/components/ui/table";
import { useState } from "react";

export default function Page() {
  const [image, setImage] = useState<string | null>(null);

  const handleUploadImage = async () => {
    const result = await window.electron.selectImageFile();
    if (result) {
      setImage(result.path);
    }
  };

  console.log(image);

  return (
    <div>
      <Button onClick={handleUploadImage}>อัปโหลดรูปภาพ</Button>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>รูปภาพ</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>
              {image && <img src={image} alt="profile" className="w-20 h-20" />}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
