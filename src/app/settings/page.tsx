"use client";

import {
  Bell,
  Database,
  Info,
  Monitor,
  Moon,
  Music2,
  Smartphone,
  Sun,
  Vibrate,
} from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { AppShell } from "@/components/layout/app-shell";
import { BottomNavigation } from "@/components/layout/bottom-navigation";
import { Header } from "@/components/layout/header";
import { PwaInstallCard } from "@/components/pwa/pwa-install-card";
import { SettingSwitch } from "@/components/settings/setting-switch";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { APP_VERSION } from "@/constants/preferences";
import { useAppPreferences } from "@/hooks/use-app-preferences";
import { cn } from "@/lib/utils";
import type { ThemePreference } from "@/types/preferences";

const themes: Array<{
  id: ThemePreference;
  label: string;
  icon: typeof Sun;
}> = [
  { id: "light", label: "라이트", icon: Sun },
  { id: "dark", label: "다크", icon: Moon },
  { id: "system", label: "시스템", icon: Monitor },
];

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { preferences, hydrated, updatePreference, resetLocalData } =
    useAppPreferences();
  const [mounted, setMounted] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  useEffect(() => setMounted(true), []);

  const updateNotifications = async (enabled: boolean) => {
    if (enabled && !("Notification" in window)) {
      toast.error("이 브라우저는 알림을 지원하지 않아요");
      return;
    }
    if (enabled && "Notification" in window) {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        toast.error("알림 권한이 필요해요", {
          description: "브라우저 설정에서 알림을 허용해주세요.",
        });
        return;
      }
    }
    updatePreference("notifications", enabled);
    toast.success(enabled ? "알림을 켰어요" : "알림을 껐어요");
  };

  return (
    <AppShell>
      <Header title="설정" showBack />
      <main id="main-content" className="flex-1 space-y-4 px-5 pt-6 pb-32">
        <section aria-labelledby="appearance-title">
          <h1 id="appearance-title" className="text-xl font-black">
            내게 편안한 화면
          </h1>
          <p className="text-muted mt-1 text-sm font-semibold">
            선택한 모드는 이 기기에 안전하게 기억돼요.
          </p>
          <div className="bg-surface shadow-warm mt-4 grid grid-cols-3 gap-2 rounded-[1.75rem] border p-2">
            {themes.map(({ id, label, icon: Icon }) => {
              const selected = mounted && (theme ?? "system") === id;
              return (
                <button
                  key={id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setTheme(id)}
                  className={cn(
                    "flex min-h-20 flex-col items-center justify-center gap-2 rounded-2xl text-xs font-black transition-colors",
                    selected
                      ? "bg-primary text-[#333]"
                      : "hover:bg-surface-soft",
                  )}
                >
                  <Icon className="h-5 w-5" /> {label}
                </button>
              );
            })}
          </div>
        </section>

        <Card>
          <CardContent className="divide-border divide-y p-4">
            <SettingSwitch
              icon={Bell}
              label="알림"
              description="다정한 미션 알림을 받을 준비"
              checked={hydrated && preferences.notifications}
              disabled={!hydrated}
              onCheckedChange={(value) => void updateNotifications(value)}
            />
            <SettingSwitch
              icon={Vibrate}
              label="진동"
              description="성공 순간에 가벼운 햅틱 피드백"
              checked={hydrated && preferences.vibration}
              disabled={!hydrated}
              onCheckedChange={(value) => {
                updatePreference("vibration", value);
                if (value) navigator.vibrate?.(24);
              }}
            />
            <SettingSwitch
              icon={Music2}
              label="효과음"
              description="기분 좋은 상호작용 소리"
              checked={hydrated && preferences.sound}
              disabled={!hydrated}
              onCheckedChange={(value) => updatePreference("sound", value)}
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-3 p-5">
            <div className="flex items-center gap-3">
              <Smartphone className="text-accent h-5 w-5" />
              <div>
                <h2 className="text-sm font-black">앱으로 더 편하게</h2>
                <p className="text-muted text-xs font-semibold">
                  오프라인에서도 오늘의 기록을 만나요.
                </p>
              </div>
            </div>
            <PwaInstallCard />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-2">
            <Link
              href="/about"
              className="hover:bg-surface-soft flex items-center gap-3 rounded-2xl px-3 py-4 text-sm font-black"
            >
              <Info className="text-accent h-5 w-5" /> 앱 정보와 정책
              <span className="text-muted ml-auto text-xs">v{APP_VERSION}</span>
            </Link>
          </CardContent>
        </Card>

        <Button
          variant="outline"
          className="w-full text-red-600"
          onClick={() => setResetOpen(true)}
        >
          <Database className="h-4 w-4" /> 이 기기의 데이터 초기화
        </Button>
      </main>
      <BottomNavigation active="settings" />

      <Dialog open={resetOpen} onOpenChange={setResetOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>이 기기의 기록을 지울까요?</DialogTitle>
            <DialogDescription>
              미션, 캘린더, 포인트, 스티커와 설정이 초기화됩니다. 서버에
              동기화된 개인 일지는 삭제하지 않습니다.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setResetOpen(false)}
            >
              취소
            </Button>
            <Button
              className="flex-1 bg-red-600 text-white hover:bg-red-700"
              onClick={resetLocalData}
            >
              초기화
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
