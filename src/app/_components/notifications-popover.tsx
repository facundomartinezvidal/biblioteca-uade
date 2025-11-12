"use client";

import { useState, useEffect } from "react";
import { Bell, Check, CheckCheck, Loader2 } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { api } from "~/trpc/react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { supabase } from "~/lib/supabase/client";
import { useUser } from "~/lib/contexts";

export function NotificationsPopover() {
  const [open, setOpen] = useState(false);
  const { user } = useUser();
  const utils = api.useUtils();

  // Queries
  const { data: notifications = [], isLoading } =
    api.notifications.getMyNotifications.useQuery(undefined, {
      enabled: !!user,
    });

  const { data: unreadCount } = api.notifications.getUnreadCount.useQuery(
    undefined,
    {
      enabled: !!user,
    },
  );

  // Mutations
  const markAsRead = api.notifications.markAsRead.useMutation({
    onSuccess: () => {
      void utils.notifications.getMyNotifications.invalidate();
      void utils.notifications.getUnreadCount.invalidate();
    },
  });

  const markAllAsRead = api.notifications.markAllAsRead.useMutation({
    onSuccess: () => {
      void utils.notifications.getMyNotifications.invalidate();
      void utils.notifications.getUnreadCount.invalidate();
    },
  });

  // Realtime subscription
  useEffect(() => {
    if (!user) return;

    console.log("[Notifications] Setting up Realtime for user:", user.id);

    const channel = supabase
      .channel(`notifications-${user.id}`, {
        config: {
          broadcast: { self: true },
        },
      })
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          console.log("[Notifications] Realtime event received:", {
            eventType: payload.eventType,
            payload,
          });
          
          // Invalidar queries para refrescar datos
          void utils.notifications.getMyNotifications.invalidate();
          void utils.notifications.getUnreadCount.invalidate();
        },
      )
      .subscribe((status, err) => {
        console.log("[Notifications] Subscription status:", status);
        if (err) {
          console.error("[Notifications] Subscription error:", err);
        }
      });

    return () => {
      console.log("[Notifications] Cleaning up Realtime subscription");
      void supabase.removeChannel(channel);
    };
  }, [user, utils]);

  const handleMarkAsRead = (notificationId: string) => {
    markAsRead.mutate({ notificationId });
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead.mutate();
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "LOAN_DEADLINE":
        return "⏰";
      case "LOAN_EXPIRED":
        return "❌";
      case "PENALTY_APPLIED":
        return "⚠️";
      case "PENALTY_DEADLINE":
        return "💰";
      case "PENALTY_EXPIRED":
        return "🔴";
      default:
        return "📢";
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-8 w-8 rounded-md text-white hover:bg-white/10 hover:text-white"
        >
          <Bell className="h-4 w-4" />
          {unreadCount && unreadCount.count > 0 && (
            <>
              <Badge
                variant="destructive"
                className="absolute -right-1 -top-1 flex h-5 w-5 animate-pulse items-center justify-center rounded-full p-0 text-[10px]"
              >
                {unreadCount.count > 9 ? "9+" : unreadCount.count}
              </Badge>
              {/* Red dot indicator for emphasis */}
              <span className="absolute right-0 top-0 flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500"></span>
              </span>
            </>
          )}
          <span className="sr-only">Notificaciones</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="end" sideOffset={8}>
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h3 className="text-sm font-semibold">Notificaciones</h3>
          {notifications.length > 0 && unreadCount && unreadCount.count > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-0 text-xs hover:underline"
              onClick={handleMarkAllAsRead}
              disabled={markAllAsRead.isPending}
            >
              {markAllAsRead.isPending ? (
                <Loader2 className="mr-1 h-3 w-3 animate-spin" />
              ) : (
                <CheckCheck className="mr-1 h-3 w-3" />
              )}
              Marcar todas como leídas
            </Button>
          )}
        </div>

        <div className="max-h-[400px] overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="text-muted-foreground h-6 w-6 animate-spin" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Bell className="text-muted-foreground mb-2 h-8 w-8" />
              <p className="text-muted-foreground text-sm">
                No tienes notificaciones
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`hover:bg-muted/50 flex gap-3 p-4 transition-colors ${
                    !notification.read
                      ? "bg-blue-50/50 dark:bg-blue-950/20"
                      : ""
                  }`}
                >
                  <div className="text-2xl">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium leading-tight">
                        {notification.title}
                      </p>
                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 shrink-0"
                          onClick={() => handleMarkAsRead(notification.id)}
                          disabled={markAsRead.isPending}
                        >
                          {markAsRead.isPending &&
                          markAsRead.variables?.notificationId ===
                            notification.id ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <Check className="h-3 w-3" />
                          )}
                          <span className="sr-only">Marcar como leída</span>
                        </Button>
                      )}
                    </div>
                    <p className="text-muted-foreground text-xs">
                      {notification.message}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {formatDistanceToNow(new Date(notification.createdAt), {
                        addSuffix: true,
                        locale: es,
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
