import { functionA } from "@/ui/api";
import { Button } from "@/ui/components/ui/button";
import { Input } from "@/ui/components/ui/input";
import { useEffect, useState } from "react";

export default function Page() {
  useEffect(() => {
    // const unsub = window.electron.statistics((stats) => {
    //   console.log(stats);
    // });

    const init = async () => {
      const resp = await functionA({ name: "John" });
      console.log(resp);
    };

    init();

    // return () => unsub();
  }, []);

  const [name, setName] = useState("");

  return (
    <div>
      Dashboard
      <Input
        type="text"
        placeholder="Enter name"
        onChange={(e) => setName(e.target.value)}
      />
      <Button onClick={() => window.electron.createLdInstance({ name })}>
        Create LD Instance
      </Button>
    </div>
  );
}