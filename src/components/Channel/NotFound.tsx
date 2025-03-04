import monk from "@/images/space_monk.png";

export function ChannelNotFound() {
  return (
    <div className="flex h-full items-center justify-center p-4">
      <div className="w-full max-w-md rounded-lg border bg-secondary p-6 text-center">
        <div className="mb-6">
          <img
            src={monk}
            alt="Astronaut monkey illustration"
            className="mx-auto h-[200px]"
          />
        </div>
        <h1 className="mb-3 text-2xl font-semibold text-white">
          This Channel doesn&apos;t exist
        </h1>
        <p className="text-sm leading-relaxed text-zinc-400">
          It might&apos;ve been removed, or perhaps it was never here. The
          digital world is full of surprises.
        </p>
      </div>
    </div>
  );
}
