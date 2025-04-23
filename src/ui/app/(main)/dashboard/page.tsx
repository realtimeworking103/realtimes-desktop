import { useEffect } from "react";

export default function Page() {
  useEffect(() => {
    const unsub = window.electron.statistics((stats) => {
      console.log(stats);
    });

    return () => unsub();
  }, []);

  return <div>Dashboard</div>;
}
