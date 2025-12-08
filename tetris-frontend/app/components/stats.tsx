
export default function Stats({ elapsedTime }: { elapsedTime: number }) {
  return (
    <div className="flex flex-col h-[45vw] w-[20vw] border-2">
      <div className="text-lg"> Time Elapsed: {(elapsedTime / 1000).toFixed(1)}s </div>
    </div>
  );
}