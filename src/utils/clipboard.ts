export const copyToClipboard = async (
  s: string,
  { onSuccess, onError }: { onSuccess: () => void; onError: () => void },
): Promise<void> => {
  // write to clipboard
  try {
    await navigator.clipboard.writeText(s);
    onSuccess?.();
  } catch {
    onError?.();
  }
};
