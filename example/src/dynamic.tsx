import { lazy, type ComponentType } from "react";

const isServerSide = typeof window === "undefined";
const Loading = ({
  error,
  isLoading,
  pastDelay,
}: {
  error: Error | null;
  isLoading: boolean;
  pastDelay: boolean;
}) => {
  if (!pastDelay) return null;
  if (process.env.NODE_ENV !== "production") {
    if (isLoading) {
      return null;
    }
    if (error) {
      return (
        <p>
          {error.message}
          <br />
          {error.stack}
        </p>
      );
    }
  }

  return null;
};

export const noSSR = <P extends object>(
  loader: () => Promise<ComponentType<P>>,
): ComponentType<P> => {
  if (isServerSide) {
    return () => <Loading error={null} isLoading pastDelay={false} />;
  }

  return lazy(async () => ({ default: await loader() })) as unknown as ComponentType<P>;
};
