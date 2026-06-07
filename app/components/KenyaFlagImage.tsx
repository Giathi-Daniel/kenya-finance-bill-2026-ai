"use client";

import Image from "next/image";

export default function KenyaFlagImage({
  className = "",
  priority = false,
}: {
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src="/kenya-flag.png"
      width={200}
      height={134}
      alt="Kenya flag"
      priority={priority}
      className={className}
    />
  );
}
