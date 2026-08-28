"use client";

import { useEffect } from "react";
import { useNotification } from "@/context/NotificationContext";

export function useAntiInspect(pageName = "Halaman Login") {
  const { showToast } = useNotification();

  useEffect(() => {
    if (typeof window === "undefined") return;

    let toastThrottled = false;
    const triggerSecurityNotice = (reason: string) => {
      if (toastThrottled) return;
      toastThrottled = true;
      showToast({
        type: "warning",
        title: "Akses Dibatasi — Security Guard",
        message: `Inspect element, DevTools, dan scraping dinonaktifkan pada ${pageName} demi keamanan kredensial.`
      });
      setTimeout(() => {
        toastThrottled = false;
      }, 3000);
    };

    // 1. Block Context Menu (Right Click)
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      triggerSecurityNotice("Klik kanan");
      return false;
    };

    // 2. Block DevTools Keyboard Shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      // F12 key
      if (e.key === "F12" || e.keyCode === 123) {
        e.preventDefault();
        e.stopPropagation();
        triggerSecurityNotice("F12 DevTools");
        return false;
      }

      const isCtrlOrCmd = e.ctrlKey || e.metaKey;

      // Ctrl+Shift+I (Inspect), Ctrl+Shift+J (Console), Ctrl+Shift+C (Element Picker)
      if (isCtrlOrCmd && e.shiftKey && (e.key === "I" || e.key === "i" || e.key === "J" || e.key === "j" || e.key === "C" || e.key === "c")) {
        e.preventDefault();
        e.stopPropagation();
        triggerSecurityNotice("Shortcut DevTools");
        return false;
      }

      // Ctrl+U (View Source)
      if (isCtrlOrCmd && (e.key === "U" || e.key === "u")) {
        e.preventDefault();
        e.stopPropagation();
        triggerSecurityNotice("View Source");
        return false;
      }

      // Ctrl+S (Save Page)
      if (isCtrlOrCmd && (e.key === "S" || e.key === "s")) {
        e.preventDefault();
        e.stopPropagation();
        triggerSecurityNotice("Save Page");
        return false;
      }

      // Ctrl+P (Print to Scrap)
      if (isCtrlOrCmd && (e.key === "P" || e.key === "p")) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };

    // 3. Block Drag & Drop to Scrap Images/Content
    const handleDragStart = (e: DragEvent) => {
      e.preventDefault();
      return false;
    };

    // 4. Console Protection: Auto-clear console
    const clearConsoleInterval = setInterval(() => {
      try {
        console.clear();
      } catch (e) {}
    }, 2000);

    // 5. Detect DevTools via inner/outer dimensions
    const checkDevToolsDimensions = () => {
      const threshold = 160;
      const widthDiff = window.outerWidth - window.innerWidth > threshold;
      const heightDiff = window.outerHeight - window.innerHeight > threshold;
      if (widthDiff || heightDiff) {
        console.clear();
      }
    };
    window.addEventListener("resize", checkDevToolsDimensions);

    // Attach event listeners
    window.addEventListener("contextmenu", handleContextMenu, true);
    window.addEventListener("keydown", handleKeyDown, true);
    window.addEventListener("dragstart", handleDragStart, true);

    return () => {
      window.removeEventListener("contextmenu", handleContextMenu, true);
      window.removeEventListener("keydown", handleKeyDown, true);
      window.removeEventListener("dragstart", handleDragStart, true);
      window.removeEventListener("resize", checkDevToolsDimensions);
      clearInterval(clearConsoleInterval);
    };
  }, [pageName, showToast]);
}
