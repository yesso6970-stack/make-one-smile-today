"use client";

import { Download, Share2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { APP_URL } from "@/constants/app";

interface ShareAchievementCardProps {
  people: number;
  streak: number;
}

async function createCardBlob(people: number, streak: number): Promise<Blob> {
  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 1350;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas is unavailable");
  const gradient = context.createLinearGradient(0, 0, 1080, 1350);
  gradient.addColorStop(0, "#FFD54F");
  gradient.addColorStop(1, "#FFF2B0");
  context.fillStyle = gradient;
  context.fillRect(0, 0, 1080, 1350);
  context.fillStyle = "rgba(255,255,255,.48)";
  context.beginPath();
  context.arc(920, 150, 240, 0, Math.PI * 2);
  context.fill();
  context.textAlign = "center";
  context.fillStyle = "#333333";
  context.font = "700 54px sans-serif";
  context.fillText("오늘 한 사람 웃기기", 540, 170);
  context.font = "140px sans-serif";
  context.fillText("😊", 540, 430);
  context.font = "900 76px sans-serif";
  context.fillText("오늘도", 540, 610);
  context.fillText("한 사람을 웃게 했습니다", 540, 710);
  context.font = "700 42px sans-serif";
  context.fillText(`이번 달 ${people}명 · ${streak}일 연속`, 540, 850);
  context.fillStyle = "rgba(255,255,255,.7)";
  context.roundRect(140, 980, 800, 150, 48);
  context.fill();
  context.fillStyle = "#6d5a17";
  context.font = "700 34px sans-serif";
  context.fillText("Make One Smile Today", 540, 1070);
  return new Promise((resolve, reject) =>
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Image failed"))),
      "image/png",
      0.95,
    ),
  );
}

export function ShareAchievementCard({
  people,
  streak,
}: ShareAchievementCardProps) {
  const [busy, setBusy] = useState(false);

  const download = async () => {
    setBusy(true);
    try {
      const blob = await createCardBlob(people, streak);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "make-one-smile-today.png";
      link.click();
      URL.revokeObjectURL(url);
      toast.success("공유 카드를 저장했어요");
    } finally {
      setBusy(false);
    }
  };

  const share = async () => {
    setBusy(true);
    try {
      const blob = await createCardBlob(people, streak);
      const file = new File([blob], "make-one-smile-today.png", {
        type: "image/png",
      });
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          title: "오늘 한 사람 웃기기",
          text: "오늘도 한 사람을 웃게 했습니다 😊",
          url: APP_URL,
          files: [file],
        });
      } else {
        await download();
        toast.info("저장한 이미지를 카카오·Threads·Instagram에서 선택해주세요");
      }
    } catch (error) {
      if (!(error instanceof DOMException && error.name === "AbortError"))
        toast.error("공유를 시작하지 못했어요");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-2">
      <Button variant="outline" onClick={() => void download()} disabled={busy}>
        <Download className="h-4 w-4" /> 이미지 저장
      </Button>
      <Button onClick={() => void share()} disabled={busy}>
        <Share2 className="h-4 w-4" /> 앱으로 공유
      </Button>
    </div>
  );
}
