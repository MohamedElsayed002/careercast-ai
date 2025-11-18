"use client";

import { useTRPC } from "@/trpc/client";
import { Button } from "./ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const DeleteButton = ({ user }: { user: string }) => {
  const queryClient = useQueryClient();
  const trpc = useTRPC();
  const { mutate, isPending } = useMutation(
    trpc.deleteUser.mutationOptions({
      onSuccess: () => {
        toast.success("User deleted successfully");
        queryClient.invalidateQueries({
          queryKey: [
            trpc.allUsers.queryOptions(undefined).queryKey,
            trpc.adminDashboardStats.queryOptions(undefined).queryKey,
          ],
        });
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
