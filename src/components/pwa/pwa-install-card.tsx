"use client";

import { Download, Share } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { usePwaInstall } from "@/hooks/use-pwa-install";

export function PwaInstallCard() {
  const { canInstall, isInstalled, isIos, install } = usePwaInstall();
  const [instructionsOpen, setInstructionsOpen] = useState(false);

  if (isInstalled) {
    return (
      <div className="bg-success/10 text-success rounded-2xl px-4 py-3 text-xs font-black">
        ✓ 홈 화면 앱으로 설치되어 있어요
      </div>
    );
  }

  const handleInstall = async () => {
    if (isIos || !canInstall) {
      setInstructionsOpen(true);
      return;
    }
    const result = await install();
    if (result === "accepted") toast.success("설치를 시작했어요");
  };

  return (
    <>
      <Button className="w-full" onClick={handleInstall}>
        <Download className="h-4 w-4" /> 홈 화면에 앱 설치
      </Button>
      <Dialog open={instructionsOpen} onOpenChange={setInstructionsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>홈 화면에 설치하기</DialogTitle>
            <DialogDescription>
              브라우저 메뉴에서 아래 순서로 설치할 수 있어요.
            </DialogDescription>
          </DialogHeader>
          <div className="bg-surface-soft rounded-2xl p-4 text-sm leading-7 font-semibold">
            <p className="flex items-center gap-2 font-black">
              <Share className="text-accent h-4 w-4" /> iPhone · iPad
            </p>
            <p>공유 버튼 → 홈 화면에 추가</p>
            <p className="mt-2 font-black">Android · PC</p>
            <p>브라우저 메뉴 → 앱 설치</p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
