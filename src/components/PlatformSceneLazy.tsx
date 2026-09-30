"use client";

import dynamic from "next/dynamic";

const PlatformScene = dynamic(() => import("./PlatformScene"), { ssr: false });

export default PlatformScene;