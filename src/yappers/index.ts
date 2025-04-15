import { useSWRFetcher } from "@/lib/fetcher";
import type { PaginatedYapperProjectVotes } from "../server";
import { useDevaContext } from "@/DevaContext";
import { useCallback } from "react";

export const useVotedProjects = () => {
  const { accessToken, url } = useDevaContext();

  return useSWRFetcher<PaginatedYapperProjectVotes, Error>(
    accessToken ? `${url}/api/sdk/yapper/` : null,
    {
      headers: accessToken
        ? {
            Authorization: `Bearer ${accessToken}`,
          }
        : undefined,
    },
  );
};

export const useVoteForProject = () => {
  // const { accessToken, url } = useDevaContext();
  const vote = useCallback(() => {
    console.log("vote");
  }, []);
  return {
    vote,
  };
};
