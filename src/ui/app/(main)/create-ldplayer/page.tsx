"use client";

import { useEffect, useState } from "react";
import { Button } from "@/ui/components/ui/button";
import { Input } from "@/ui/components/ui/input";
import { Checkbox } from "@/ui/components/ui/checkbox";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/ui/components/ui/table";
import { callLdInstance } from "@/ui/api";
import { CreatedLDPlayerType } from "@/ui/types/types";

export default function Page() {
  const [prefix, setPrefix] = useState("");
  const [count, setCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [ldData, setLdData] = useState<CreatedLDPlayerType[]>([]);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  const toggleRow = (id: string) => {
    setSelectedRows((prev) => {
      const newSet = new Set(prev);
      newSet.has(id) ? newSet.delete(id) : newSet.add(id);
      return newSet;
    });
  };

  const handleCreate = async () => {
    if (!prefix || !count) return;

    setLoading(true);

    try {
      const result = await window.electron.createLDPlayers({ prefix, count });

      console.log("LDPlayer creation result:", result);

      if (result.startsWith("")) {
        const data = await window.electron.getDataCreateLDPlayers();
        setLdData(data);
        console.log("Refreshed LDPlayer data:", data);
      }
    } catch (error) {
      console.error("Error during LDPlayer creation:", error);
    } finally {
      setLoading(false);
      console.log("Done processing LDPlayer creation.");
    }
  };

  const handleOpenLDPlayer = async (name: string) => {
    try {
      await callLdInstance(name);
      console.log(`Opened LDPlayer: ${name}`);
    } catch (error) {
      console.error(`Failed to open LDPlayer ${name}:`, error);
    }
  };

  const handleMoveSelected = async () => {
    if (selectedRows.size === 0) {
      console.log("No rows selected.");
      return;
    }

    const selectedLDNames = ldData
      .filter((item) => selectedRows.has(item.NoDataGridLD))
      .map((item) => item.LDPlayerGridLD);

    try {
      console.log("Moving selected LDPlayers:", selectedLDNames);

      const result =
        await window.electron.moveSelectedLDPlayers(selectedLDNames);
      console.log("Move result:", result);

      // รีโหลดข้อมูลใหม่ (ถ้ามีการอัปเดตฐานข้อมูล)
      const updated = await window.electron.getDataCreateLDPlayers();
      setLdData(updated);
      console.log("Refreshed data after move.");
    } catch (error) {
      console.error("Error moving selected LDPlayers:", error);
    }
  };

  useEffect(() => {
    window.electron.getDataCreateLDPlayers().then((data) => {
      setLdData(data);
      setSelectedRows(new Set(data.map((item) => item.NoDataGridLD)));
    });
  }, []);

  return (
    <div className="w-full space-y-6 p-4">
      {/* Input section */}
      <div className="flex w-full max-w-full items-center space-x-2">
        <Input
          type="text"
          placeholder="Prefix"
          value={prefix}
          onChange={(e) => setPrefix(e.target.value)}
        />
        <Input
          type="number"
          placeholder="จำนวนที่ต้องการสร้าง"
          className="w-[300px]"
          value={count ?? ""}
          onChange={(e) => setCount(Number(e.target.value))}
        />
        <Button
          className="w-[180px]"
          type="button"
          onClick={handleCreate}
          disabled={loading || !prefix || !count}
        >
          {loading ? "กำลังสร้าง" : "สร้าง LDPlayer"}
        </Button>

        <Button onClick={handleMoveSelected}>ย้ายข้อมูลที่เลือก</Button>
      </div>

      {/* Table section */}
      <div className="overflow-auto">
        <Table className="text-center">
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">
                <Checkbox
                  checked={
                    ldData.length > 0 && selectedRows.size === ldData.length
                  }
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedRows(
                        new Set(ldData.map((item) => item.NoDataGridLD)),
                      );
                    } else {
                      setSelectedRows(new Set());
                    }
                  }}
                />
              </TableHead>
              <TableHead className="text-center">ลำดับ</TableHead>
              <TableHead className="text-center">LDPlayer</TableHead>
              <TableHead className="text-center">เวลาที่สร้าง</TableHead>
              <TableHead className="text-center">สถานะการทำงาน</TableHead>
              <TableHead className="text-center">การดำเนินการ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ldData.map((item) => (
              <TableRow key={item.NoDataGridLD}>
                <TableCell>
                  <Checkbox
                    checked={selectedRows.has(item.NoDataGridLD)}
                    onCheckedChange={() => toggleRow(item.NoDataGridLD)}
                  />
                </TableCell>
                <TableCell>{item.NoDataGridLD}</TableCell>
                <TableCell>{item.LDPlayerGridLD}</TableCell>
                <TableCell>{item.DataTimeGridLD}</TableCell>
                <TableCell>{item.StatusGridLD}</TableCell>
                <TableCell className="space-x-2">
                  <Button
                    onClick={() => handleOpenLDPlayer(item.LDPlayerGridLD)}
                  >
                    เปิด LDPlayer
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
