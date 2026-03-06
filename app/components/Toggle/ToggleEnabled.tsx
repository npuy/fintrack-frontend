import { Switch, Tooltip } from "@mantine/core";
import { useFetcher } from "@remix-run/react";

interface Props {
  id: string;
  enabled: boolean;
  action: string;
  extraData: Record<string, string>;
}

export function ToggleEnabled({ id, enabled, action, extraData }: Props) {
  const fetcher = useFetcher<{ ok: boolean; error?: string }>();

  const isSubmitting = fetcher.state !== "idle";
  const optimisticEnabled = isSubmitting
    ? fetcher.formData?.get("enabled") === "true"
    : enabled;
  const hasError = fetcher.state === "idle" && fetcher.data?.ok === false;

  return (
    <Tooltip label="Update failed" disabled={!hasError} color="red" withArrow>
      <Switch
        checked={optimisticEnabled}
        disabled={isSubmitting}
        color={hasError ? "red" : undefined}
        onChange={(e) => {
          fetcher.submit(
            {
              intent: "toggle",
              id,
              enabled: String(e.currentTarget.checked),
              ...extraData,
            },
            { method: "POST", action },
          );
        }}
      />
    </Tooltip>
  );
}
