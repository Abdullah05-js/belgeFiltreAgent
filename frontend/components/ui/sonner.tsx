"use client";

import {
  CircleCheck,
  Info,
  LoaderCircle,
  OctagonX,
  TriangleAlert,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      richColors
      className="toaster group"
      position="top-right"
      
      icons={{
        success: <CircleCheck className="h-4 w-4" />,
        info: <Info className="h-4 w-4" />,
        warning: <TriangleAlert className="h-4 w-4 " />,
        error: <OctagonX className="h-4 w-4" />,
        loading: <LoaderCircle className="h-4 w-4 animate-spin" />,
      }}
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          error:
            "group-[.toaster]:border-red-500 group-[.toaster]:bg-red-50 dark:group-[.toaster]:bg-red-950/20",
          success:
            "group-[.toaster]:border-green-500 group-[.toaster]:bg-green-50 dark:group-[.toaster]:bg-green-300/20",
          warning:
            "group-[.toaster]:border-amber-500 group-[.toaster]:bg-amber-50 dark:group-[.toaster]:bg-amber-950/20",
          info: "group-[.toaster]:border-blue-500 group-[.toaster]:bg-blue-50 dark:group-[.toaster]:bg-blue-950/20",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
