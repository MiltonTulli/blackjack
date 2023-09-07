import React from "react";
import { Card, Skeleton } from "@nextui-org/react";

export function FallbackCard({ idx }: { idx: number }) {
  const style = {
    transform: `translate(-${idx * 80}px, ${idx * 2}px) rotate(${idx * 5}deg)`,
  };
  return (
    <Card style={style} className="w-32 h-48  rounded-lg  space-y-5 p-4">
      <Skeleton className="rounded-lg">
        <div className="h-24 rounded-lg bg-default-300"></div>
      </Skeleton>
      <div className="space-y-3">
        <Skeleton className="w-3/5 rounded-lg">
          <div className="h-3 w-3/5 rounded-lg bg-default-200"></div>
        </Skeleton>
        <Skeleton className="w-4/5 rounded-lg">
          <div className="h-3 w-4/5 rounded-lg bg-default-200"></div>
        </Skeleton>
        <Skeleton className="w-2/5 rounded-lg">
          <div className="h-3 w-2/5 rounded-lg bg-default-300"></div>
        </Skeleton>
      </div>
    </Card>
  );
}
