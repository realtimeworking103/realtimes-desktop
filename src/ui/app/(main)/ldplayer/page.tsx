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

import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSub,
  ContextMenuSubTrigger,
  ContextMenuSubContent,
} from "@/ui/components/ui/context-menu";

type LDPlayerType = {
  NoDataGridLD: string;
  LDPlayerGridLD: string;
  StatusAccGridLD: string;
  DataTimeGridLD: string;
  StatusGridLD: string;
};

export default function Page() {
  const [ldplayers, setLDPlayers] = useState<LDPlayerType[]>([]);

  useEffect(() => {
    window.electron.getLDPlayersDB().then((data: LDPlayerType[]) => {
      setLDPlayers(data);
    });
  }, []);

  const handleOpen = async (name: string) => {
    try {
      await window.electron.callLdInstance(name);
    } catch (err) {
      console.error("เปิดไม่สำเร็จ:", err);
    }
  };

  const handleDelete = async (name: string) => {
    await window.electron.deleteLdInstance(name);

    setTimeout(async () => {
      const updated = await window.electron.getLDPlayersDB();
      console.log("Updated LDPlayers:", updated);
      setLDPlayers(updated);
    }, 300);
  };

  const handleDeleteRow = async (id: number) => {
    await window.electron.deleteRowFromLDPlayers(id);

    setTimeout(async () => {
      const updated = await window.electron.getLDPlayersDB();
      setLDPlayers(updated);
    }, 300);
  };

  const handlePullDataBase = async (name: string) => {
    try {
      await window.electron.pullDataBase(name);
    } catch (err) {
      console.error("Pull ไม่สำเร็จ:", err);
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-center">ลำดับ</TableHead>
          <TableHead className="text-center">LDPlayer</TableHead>
          <TableHead className="text-center">สถานะบัญชีไลน์</TableHead>
          <TableHead className="text-center">ทำงานครั้งล่าสุด</TableHead>
          <TableHead className="text-center">สถานะการทำงาน</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="text-center">
        {ldplayers.map((ld) => (
          <ContextMenu key={ld.NoDataGridLD}>
            <ContextMenuTrigger asChild>
              <TableRow>
                <TableCell>{ld.NoDataGridLD}</TableCell>
                <TableCell>{ld.LDPlayerGridLD}</TableCell>
                <TableCell>{ld.StatusAccGridLD}</TableCell>
                <TableCell>{ld.DataTimeGridLD}</TableCell>
                <TableCell>{ld.StatusGridLD}</TableCell>
              </TableRow>
            </ContextMenuTrigger>
            <ContextMenuContent>
              <ContextMenuSub>
                <ContextMenuSubTrigger inset>ฟังชั่น</ContextMenuSubTrigger>
                <ContextMenuSubContent>
                  <ContextMenuItem
                    onClick={() => handlePullDataBase(ld.LDPlayerGridLD)}
                  >
                    เก็บ Token
                  </ContextMenuItem>
                </ContextMenuSubContent>
              </ContextMenuSub>
              <ContextMenuSub>
                <ContextMenuSubTrigger inset>LDPlayer</ContextMenuSubTrigger>
                <ContextMenuSubContent>
                  <ContextMenuItem
                    onClick={() => handleOpen(ld.LDPlayerGridLD)}
                  >
                    เปิด LDPlayer
                  </ContextMenuItem>
                </ContextMenuSubContent>
              </ContextMenuSub>
              <ContextMenuSub>
                <ContextMenuSubTrigger inset>Delete</ContextMenuSubTrigger>
                <ContextMenuSubContent>
                  <ContextMenuItem
                    onClick={() => handleDelete(ld.LDPlayerGridLD)}
                  >
                    ลบ LDPlayer
                  </ContextMenuItem>
                  <ContextMenuItem
                    onClick={() => handleDeleteRow(Number(ld.NoDataGridLD))}
                  >
                    ลบแถว
                  </ContextMenuItem>
                </ContextMenuSubContent>
              </ContextMenuSub>
            </ContextMenuContent>
          </ContextMenu>
        ))}
      </TableBody>
    </Table>
  );
}
