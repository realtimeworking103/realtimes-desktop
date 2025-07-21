import { Button } from "@/ui/components/ui/button";
import IconUsers from "@tabler/icons-react/dist/esm/icons/IconUsers";
import { Plus } from "lucide-react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/ui/components/ui/table";

export default function Page() {
  return (
    <div className="sticky top-0 z-20 mb-4 border-b border-gray-200 bg-white/80 backdrop-blur dark:border-gray-700 dark:bg-gray-900/80">
      <div className="mx-auto flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <IconUsers className="h-8 w-8" />
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            จัดการบัญชีไลน์
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => {}} variant="default">
            <Plus className="mr-2 h-4 w-4" />
            เพิ่มบัญชีไลน์
          </Button>
        </div>
      </div>
      <div className="mx-auto max-w-5xl space-y-4">
        <Table className="[&_*]:text-center [&_*]:align-middle">
          <TableHeader>
            <TableRow>
              <TableHead>ลำดับ</TableHead>
              <TableHead>ประเภท</TableHead>
              <TableHead>ไอดี</TableHead>
              <TableHead>สถานะ</TableHead>
              <TableHead>จัดการ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>1</TableCell>
              <TableCell>1234567890</TableCell>
              <TableCell>สถานะ</TableCell>
              <TableCell>
                <Button variant="default">จัดการ</Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
