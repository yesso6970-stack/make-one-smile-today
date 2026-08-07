"use client";

import { LockKeyhole, Sparkles } from "lucide-react";

import { PraiseSticker } from "@/components/cards/praise-sticker";
import { Card, CardContent } from "@/components/ui/card";
import { PRAISE_STICKERS } from "@/constants/praise-stickers";

interface StickerShelfProps {
  earnedStickerIds: readonly string[];
}

export function StickerShelf({ earnedStickerIds }: StickerShelfProps) {
  const earnedStickers = PRAISE_STICKERS.filter((sticker) =>
    earnedStickerIds.includes(sticker.id),
  );

  return (
    <Card className="shadow-warm mt-3 border-0">
      <CardContent className="flex items-center gap-4 p-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="flex items-center gap-1.5 text-xs font-extrabold">
              <Sparkles className="text-accent h-3.5 w-3.5" /> 나의 칭찬 스티커
            </p>
            <span className="bg-primary/20 rounded-full px-2 py-0.5 text-[10px] font-black tabular-nums">
              {earnedStickers.length} / {PRAISE_STICKERS.length}
            </span>
          </div>
          <p className="text-muted mt-1 text-[11px] font-medium">
            {earnedStickers.length > 0
              ? `${earnedStickers.length}개의 다정한 순간을 모았어요`
              : "한 사람을 웃게 하고 첫 스티커를 받아보세요"}
          </p>
        </div>
        <div className="flex -space-x-2">
          {earnedStickers.length > 0 ? (
            earnedStickers
              .slice(-3)
              .map((sticker) => (
                <PraiseSticker key={sticker.id} sticker={sticker} compact />
              ))
          ) : (
            <div className="bg-surface-soft text-muted flex h-12 w-12 items-center justify-center rounded-full border-4 border-white shadow-sm">
              <LockKeyhole className="h-4 w-4" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
