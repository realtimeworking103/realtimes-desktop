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
import { Button } from "@/ui/components/ui/button";

import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/ui/components/ui/tooltip";

type LDPlayerType = {
  NoDataGridLD: string;
  LDPlayerGridLD: string;
  StatusAccGridLD: string;
  DataTimeGridLD: string;
  StatusGridLD: string;
  NameGridLD: string;
  FriendGridLD: string;
  GroupGridLD: string;
  PhoneGridLD: string;
  TokenGridLD: string;
};

export default function Page() {
  const [ldplayers, setLDPlayers] = useState<LDPlayerType[]>([]);

  const fetchLDPlayers = async () => {
    const data = await window.electron.getLDPlayersDB();
    setLDPlayers(data);
  };

  useEffect(() => {
    fetchLDPlayers();
  }, []);

  const handleOpenLDPlayer = async (ldName: string) => {
    try {
      await window.electron.callLdInstance(ldName);
    } catch (err) {
      console.error("เปิดไม่สำเร็จ:", err);
    }
  };

  const handleDeleteLDPlayer = async (ldName: string) => {
    await window.electron.deleteLdInstance(ldName);
    setTimeout(fetchLDPlayers, 300);
  };

  const handleDeleteRow = async (id: number) => {
    await window.electron.deleteRowFromDB(id);
    setTimeout(fetchLDPlayers, 300);
  };

  const handleGetToken = async (ldName: string) => {
    try {
      await window.electron.pullDBLdInstance(ldName);
    } catch (err) {
      console.error("Pull ไม่สำเร็จ:", err);
    }
  };

  const handlefetchLdInstance = async () => {
    try {
      const result = await window.electron.fetchLdInstance();
      console.log("LDPlayer ที่ดึงมา:", result);
      fetchLDPlayers();
    } catch (err) {
      console.error("ดึง LDPlayer จากเครื่องไม่สำเร็จ:", err);
    }
  };

  return (
    <div className="w-full space-y-6 p-4">
      <div>
        <Button onClick={handlefetchLdInstance}>ดึง LDPlayer</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px] text-center">ลำดับ</TableHead>
            <TableHead className="w-[300px] text-center">LDPlayer</TableHead>
            <TableHead className="w-[300px] text-center">
              สถานะบัญชีไลน์
            </TableHead>
            <TableHead className="w-[300px] text-center">
              ทำงานครั้งล่าสุด
            </TableHead>
            <TableHead className="w-[300px] text-center">
              สถานะการทำงาน
            </TableHead>
            <TableHead className="w-[300px] text-center">ชื่อไลน์</TableHead>
            <TableHead className="w-[300px] text-center">จำนวนเพื่อน</TableHead>
            <TableHead className="w-[300px] text-center">จำนวนกลุ่ม</TableHead>
            <TableHead className="w-[300px] text-center">เบอร์ไลน์</TableHead>
            <TableHead className="w-[300px] text-center">Token</TableHead>
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
                  <TableCell>{ld.NameGridLD}</TableCell>
                  <TableCell>{ld.FriendGridLD}</TableCell>
                  <TableCell>{ld.GroupGridLD}</TableCell>
                  <TableCell>{ld.PhoneGridLD}</TableCell>
                  <TableCell className="max-w-[10px] truncate">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="cursor-pointer">
                          {ld.TokenGridLD
                            ? `${ld.TokenGridLD.slice(0, 20)}...${ld.TokenGridLD.slice(-8)}`
                            : ""}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-[400px] break-all whitespace-pre-wrap">
                          {ld.TokenGridLD ?? "ไม่มีข้อมูล"}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              </ContextMenuTrigger>
              <ContextMenuContent>
                <ContextMenuSub>
                  <ContextMenuSubTrigger inset>ฟังชั่น</ContextMenuSubTrigger>
                  <ContextMenuSubContent>
                    <ContextMenuItem
                      onClick={() => handleGetToken(ld.LDPlayerGridLD)}
                    >
                      เก็บ Token
                    </ContextMenuItem>
                  </ContextMenuSubContent>
                </ContextMenuSub>
                <ContextMenuSub>
                  <ContextMenuSubTrigger inset>LDPlayer</ContextMenuSubTrigger>
                  <ContextMenuSubContent>
                    <ContextMenuItem
                      onClick={() => handleOpenLDPlayer(ld.LDPlayerGridLD)}
                    >
                      เปิด LDPlayer
                    </ContextMenuItem>
                  </ContextMenuSubContent>
                </ContextMenuSub>
                <ContextMenuSub>
                  <ContextMenuSubTrigger inset>Delete</ContextMenuSubTrigger>
                  <ContextMenuSubContent>
                    <ContextMenuItem
                      onClick={() => handleDeleteLDPlayer(ld.LDPlayerGridLD)}
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
    </div>
  );
}
