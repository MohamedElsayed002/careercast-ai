"use client";

import { useTRPC } from "@/trpc/client";
import { Button } from "./ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const DeleteButton = ({ user }: { user: string }) => {
  const queryClient = useQueryClient();
  const trpc = useTRPC();
  const router = useRouter()
  const getAllUsers = trpc.allUsers.queryOptions(undefined).queryKey;
  const getAdminDashboardStats = trpc.adminDashboardStats.queryOptions(undefined).queryKey;

  const { mutate, isPending } = useMutation(
    trpc.deleteUser.mutationOptions({
      onSuccess: () => {
        toast.success("User deleted successfully");
        router.refresh()
        queryClient.invalidateQueries({ queryKey: getAllUsers });
        queryClient.invalidateQueries({ queryKey: getAdminDashboardStats });
      },
      onError: () => {
        toast.error("Failed to delete user");
      },
    })
  );
  return (
    <Button
      onClick={() => mutate({ userId: user })}
      variant="ghost"
      className="w-full"
      disabled={isPending}
    >
      Delete user
    </Button>
  );
};
