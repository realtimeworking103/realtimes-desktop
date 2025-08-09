import React, { useEffect, useState } from "react";

import { Button } from "./ui/button";

import {
  AccountType,
  NameGroupType,
  ProfileType,
  MessageType,
} from "@/ui/types/types";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Card, CardTitle, CardHeader, CardContent } from "./ui/card";
import { toast } from "sonner";

interface CreateGroupDialogProps {
  open: boolean;
  onConfirm: (nameGroup: string, profile: string, message: string) => void;
  onCancel: () => void;
}

export const CreateGroupDialog: React.FC<CreateGroupDialogProps> = ({
  open,
  onConfirm,
  onCancel,
}) => {
  const [nameGroup, setNameGroup] = useState<NameGroupType[]>([]);
  const [profile, setProfile] = useState<ProfileType[]>([]);
  const [account, setAccount] = useState<AccountType[]>([]);
  const [message, setMessage] = useState<MessageType[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<ProfileType>();
  const [selectedNameGroup, setSelectedNameGroup] = useState<string>("");
  const [selectedMessage, setSelectedMessage] = useState<MessageType>();

  useEffect(() => {
    window.electron.getFileNameGroup().then((data) => {
      setNameGroup(data);
    });
  }, []);

  useEffect(() => {
    window.electron.getProfile().then((data) => {
      setProfile(data);
    });
  }, []);

  useEffect(() => {
    window.electron.getAccount().then((data) => {
      setAccount(data);
    });
  }, []);

  useEffect(() => {
    window.electron.getMessage().then((data) => {
      setMessage(data);
    });
  }, []);

  useEffect(() => {
    if (nameGroup.length > 0) {
      setSelectedNameGroup(
        nameGroup[Math.floor(Math.random() * nameGroup.length)].name,
      );
    }
  }, [nameGroup, profile, account]);

  useEffect(() => {
    if (profile.length > 0) {
      setSelectedProfile(profile[Math.floor(Math.random() * profile.length)]);
    }
  }, [profile]);

  useEffect(() => {
    if (account.length > 0) {
    }
  }, [account]);

  useEffect(() => {
    if (message.length > 0) {
      setSelectedMessage(message[Math.floor(Math.random() * message.length)]);
    }
  }, [message]);

  const handleRandomNameGroup = () => {
    const randomNameGroup =
      nameGroup[Math.floor(Math.random() * nameGroup.length)].name;
    setSelectedNameGroup(randomNameGroup);
  };

  const handleRandomProfile = () => {
    const randomProfile = profile[Math.floor(Math.random() * profile.length)];
    setSelectedProfile(randomProfile);
  };

  const handleSelectNameGroup = (value: string) => {
    if (value === "random") {
      handleRandomNameGroup();
    } else {
      setSelectedNameGroup(value);
    }
  };

  const handleSelectProfile = (value: string) => {
    if (value === "random") {
      handleRandomProfile();
    } else {
      setSelectedProfile(profile.find((item) => item.path === value));
    }
  };

  const handleSelectMessage = (value: string) => {
    setSelectedMessage(message.find((item) => item.nameMessage === value));
  };

  const handleConfirm = () => {
    if (
      !selectedNameGroup ||
      !selectedProfile?.path ||
      !selectedMessage?.message
    ) {
      toast.error("กรุณาเลือกข้อมูลให้ครบถ้วน");
      return;
    }
    onConfirm(
      selectedNameGroup,
      selectedProfile?.path || "",
      selectedMessage?.message || "",
    );
  };

  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent className="max-w-md p-4 select-none">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">
            สร้างกลุ่ม
          </DialogTitle>
        </DialogHeader>
        <Card>
          <CardHeader>
            <CardTitle>ชื่อกลุ่ม</CardTitle>
          </CardHeader>
          <CardContent>
            <Select
              value={selectedNameGroup}
              onValueChange={handleSelectNameGroup}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="เลือกชื่อกลุ่ม" />
              </SelectTrigger>
              <SelectContent>
                {nameGroup.map((item) => (
                  <SelectItem key={item.name} value={item.name}>
                    {item.name}
                  </SelectItem>
                ))}
                <SelectItem value="random">สุ่มชื่อกลุ่ม</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>โปรไฟล์</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center">
            <div className="flex h-30 flex-wrap gap-2 overflow-x-auto">
              {profile.map((item) => (
                <img
                  key={item.path}
                  src={`file://${item.path.replace(/\\/g, "/")}`}
                  alt="profile"
                  className={`h-28 w-28 cursor-pointer ${
                    selectedProfile?.name === item.name
                      ? "border-2 border-blue-500"
                      : ""
                  }`}
                  onClick={() => handleSelectProfile(item.path)}
                />
              ))}
            </div>
          </CardContent>
        </Card>
        {/* <Card>
          <CardHeader>
            <CardTitle>บัญชีไลน์</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="เลือกบัญชีไลน์" />
                </SelectTrigger>
                <SelectContent>
                  {account
                    .filter((item) => item.type === "ไลน์บอท")
                    .map((item) => (
                      <SelectItem key={item.name} value={item.name}>
                        {item.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card> */}
        <Card>
          <CardHeader>
            <CardTitle>ข้อความ</CardTitle>
          </CardHeader>
          <CardContent>
            <Select
              value={selectedMessage?.message}
              onValueChange={handleSelectMessage}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="เลือกข้อความ" />
              </SelectTrigger>
              <SelectContent>
                {message.map((item) => (
                  <SelectItem key={item.nameMessage} value={item.nameMessage}>
                    {item.nameMessage}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
        <DialogFooter>
          <Button className="w-full" onClick={handleConfirm}>
            สร้างกลุ่ม
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
