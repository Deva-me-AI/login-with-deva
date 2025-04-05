import monk from "@/images/space_monk.png";

export function ChannelNotFound() {
  return (
    <div className="deva-flex deva-h-full deva-items-center deva-justify-center deva-p-4">
      <div className="deva-w-full deva-max-w-md deva-rounded-lg deva-border deva-bg-secondary deva-p-6 deva-text-center">
        <div className="deva-mb-6">
          <img
            src={monk}
            alt="Astronaut monkey illustration"
            className="deva-mx-auto deva-h-[200px]"
          />
        </div>
        <h1 className="deva-mb-3 deva-text-2xl deva-font-semibold deva-text-white">
          This Channel doesn&apos;t exist
        </h1>
        <p className="deva-text-sm deva-leading-relaxed deva-text-zinc-400">
          It might&apos;ve been removed, or perhaps it was never here. The
          digital world is full of surprises.
        </p>
      </div>
    </div>
  );
}
