import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    const unsub = window.electron.subscribeStatistics((stats) => {
      console.log(stats);
    });

    return () => unsub();
  }, []);

  return (
    <div>
      <h1>Home</h1>
      <div className="flex flex-col gap-4"></div>
    </div>
  );
}
