"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PropsWithChildren, useEffect } from "react";

import { Menu } from "@/lib/components/Menu/Menu";
import { BrainProvider } from "@/lib/context";
import { useBrainContext } from "@/lib/context/BrainProvider/hooks/useBrainContext";
import { SideBarProvider } from "@/lib/context/SidebarProvider/sidebar-provider";
import { useSupabase } from "@/lib/context/SupabaseProvider";
import { UpdateMetadata } from "@/lib/helpers/updateMetadata";
import { usePageTracking } from "@/services/analytics/june/usePageTracking";

import "../lib/config/LocaleConfig/i18n";

// This wrapper is used to make effect calls at a high level in app rendering.
const App = ({ children }: PropsWithChildren): JSX.Element => {
  const { fetchAllBrains, fetchDefaultBrain, fetchPublicPrompts } =
    useBrainContext();
  const { session } = useSupabase();

  usePageTracking();

  useEffect(() => {
    if (session?.user) {
      void fetchAllBrains();
      void fetchDefaultBrain();
      void fetchPublicPrompts();
    }
  }, [session]);

  return (
    <div className="relative h-full w-full flex justify-stretch items-stretch">
      <Menu />
      <div className="flex-1">{children}</div>
      <UpdateMetadata />
    </div>
  );
};

const queryClient = new QueryClient();

const AppWithQueryClient = ({ children }: PropsWithChildren): JSX.Element => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrainProvider>
        <SideBarProvider>
          <App>{children}</App>
        </SideBarProvider>
      </BrainProvider>
    </QueryClientProvider>
  );
};

export { AppWithQueryClient as App };
