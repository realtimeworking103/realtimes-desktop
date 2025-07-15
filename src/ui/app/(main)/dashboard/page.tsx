export default function Page() {
    return(
        <div></div>
    )
}

// import MultiSelector from "@/ui/components/multi-selector";
// import { Button } from "@/ui/components/ui/button";

// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/ui/components/ui/dialog";

// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/ui/components/ui/select";
// import { Label } from "@radix-ui/react-label";
// import { useState, useEffect } from "react";

// type LineAccount = {
//   ID: number;
//   lineId: string;
//   type: string;
// };

// export default function Page() {
//   const [accounts, setAccounts] = useState<LineAccount[]>([]);
//   const [selectedOa, setSelectedOa] = useState("");
//   const [selectedPrivate, setSelectedPrivate] = useState("");
//   const [selected, setSelected] = useState<string[]>([]);

//   useEffect(() => {
//     window.electron.getAccountLineId().then(setAccounts);
//   }, []);

//   const oaAccounts = accounts.filter((a) => a.type === "Oa");
//   const privateAccounts = accounts.filter((a) => a.type === "Private");
//   const options = [
//     { value: "1", label: "0962515038" },
//     { value: "2", label: "0962515037" },
//   ];

//   console.log(selected)

//   return (
//     <Dialog>
//       <DialogTrigger>Open</DialogTrigger>
//       <DialogHeader>
//         <DialogContent>
//           <MultiSelector
//             options={options}
//             selected={selected}
//             setSelected={setSelected}
//           />
//           <DialogTitle>สร้างกลุ่ม</DialogTitle>
//           <div className="space-y-3">
//             <Label>ชื่อกลุ่ม</Label>
//             <Select>
//               <SelectTrigger className="w-full">
//                 <SelectValue placeholder="ยังไม่เปิดให้ใช้งาน" />
//               </SelectTrigger>
//             </Select>
//             <Label>รูปภาพกลุ่ม</Label>
//             <Select>
//               <SelectTrigger className="w-full">
//                 <SelectValue placeholder="ยังไม่เปิดให้ใช้งาน" />
//               </SelectTrigger>
//             </Select>
//             <Label>Line Official</Label>
//             <Select value={selectedOa} onValueChange={setSelectedOa}>
//               <SelectTrigger className="w-full">
//                 <SelectValue placeholder="เลือก Oa" />
//               </SelectTrigger>
//               <SelectContent>
//                 {oaAccounts.map((acc) => (
//                   <SelectItem key={acc.ID} value={acc.lineId}>
//                     {acc.lineId}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//             <Label>ไลน์ไก่</Label>
//             <Select value={selectedPrivate} onValueChange={setSelectedPrivate}>
//               <SelectTrigger className="w-full">
//                 <SelectValue placeholder="เลือก Private" />
//               </SelectTrigger>
//               <SelectContent>
//                 {privateAccounts.map((acc) => (
//                   <SelectItem key={acc.ID} value={acc.lineId}>
//                     {acc.lineId}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>
//           <Button>สร้างกลุ่ม</Button>
//         </DialogContent>
//       </DialogHeader>
//     </Dialog>
//   );
// }
