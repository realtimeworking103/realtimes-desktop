import { useEffect } from "react";
import { Button } from "../components/ui/button";
import { HomeIcon } from "lucide-react";

export default function Home() {
  // useEffect(() => {
  //   const unsub = window.electron.subscribeStatistics((stats) => {
  //     console.log(stats);
  //   });

  //   return () => unsub();
  // }, []);

  useEffect(() => {
    const init = async () => {
      const res = await window.electron.callLdInstance(3);
      console.log(res);
    };

    init();
  }, []);

  return (
    <div className="flex flex-wrap gap-4 p-4">
      <Button className="h-[100px] w-[200px]">
        <HomeIcon className="h-4 w-4" />A
      </Button>
      <Button className="h-[100px] w-[200px]">B</Button>
      <Button className="h-[100px] w-[200px]">C</Button>
      <Button className="h-[100px] w-[200px]">D</Button>
      <Button className="h-[100px] w-[200px]">E</Button>
    </div>
  );
}
