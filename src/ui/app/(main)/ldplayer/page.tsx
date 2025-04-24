"use client";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/ui/components/ui/table";
import { useEffect, useState } from "react";
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from "@/ui/components/ui/context-menu";

type LDPlayerType = {
    id: string;
    name: string;
};

export default function Page() {
    const [ldplayers, setLDPlayers] = useState<LDPlayerType[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    useEffect(() => {
        window.electron.getLDPlayersDB().then((data) => {
            setLDPlayers(data);
        });
    }, []);

    const handleOpenLDPlayer = (name: string) => {
        window.electron.callLdInstance(name);
    };

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>ลำดับ</TableHead>
                    <TableHead>LDPlayer</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {ldplayers.map((item) => (
                    <ContextMenu key={item.id}>
                        <ContextMenuTrigger asChild>
                            <TableRow
                                onContextMenu={() => setSelectedId(item.name)}
                                className="cursor-context-menu"
                            >
                                <TableCell>{item.id}</TableCell>
                                <TableCell> {item.name}</TableCell>
                            </TableRow>
                        </ContextMenuTrigger>
                        <ContextMenuContent>
                            <ContextMenuItem onClick={() => handleOpenLDPlayer(item.name)}>
                                เปิด LDPlayer
                            </ContextMenuItem>
                        </ContextMenuContent>
                    </ContextMenu>
                ))}
            </TableBody>
        </Table>
    );
}
