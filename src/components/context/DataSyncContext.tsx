import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

export enum SyncStatus {
  NO_CHANGES = 'noChanges',
  SYNCHRONIZED = 'synchronized',
  ERROR = 'error',
  SYNCHRONIZING = 'synchronizing',
}

type ComputeStatusParam = {
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
};

type DataSyncContextType = {
  status: SyncStatus;
  computeStatusFor: (
    requestKey: string,
    requestStatus: ComputeStatusParam,
  ) => void;
};

const DataSyncContext = createContext<DataSyncContextType>({
  status: SyncStatus.NO_CHANGES,
  computeStatusFor: (_requestKey, _requestStatus) => {
    console.error(
      'No Provider found for "DataSyncContext". Check that this Provider is accessible.',
    );
  },
});

type Props = {
  children: JSX.Element | JSX.Element[];
};

const containsStatus = (allStatus: SyncStatus[], status: SyncStatus) =>
  allStatus.some((s) => s === status);

/**
 * DataSyncContext manages a set of queries states and compute an aggregated final state.
 *
 * This can be useful when we want to display to the user the current state
 * of a synchronization. This can be one or multiple mutations states for example.
 *
 */
export const DataSyncContextProvider = ({ children }: Props): JSX.Element => {
  const [status, setStatus] = useState(SyncStatus.NO_CHANGES);
  const [mapStatus, setMapStatus] = useState<Map<string, SyncStatus>>(
    new Map(),
  );

  const updateStatus = (newMapStatus: Map<string, SyncStatus>) => {
    const allStatus = Array.from(newMapStatus.values());

    switch (true) {
      case containsStatus(allStatus, SyncStatus.ERROR): {
        setStatus(SyncStatus.ERROR);
        return;
      }
      case containsStatus(allStatus, SyncStatus.SYNCHRONIZING): {
        setStatus(SyncStatus.SYNCHRONIZING);
        return;
      }
      case containsStatus(allStatus, SyncStatus.SYNCHRONIZED): {
        setStatus(SyncStatus.SYNCHRONIZED);
        return;
      }
      default:
        setStatus(SyncStatus.NO_CHANGES);
    }
  };

  useEffect(() => updateStatus(mapStatus), [mapStatus]);

  /**
   * Compute the current status of the given request.
   * The three status parameters are considered in the order: Error, Loading and then Success.
   *
   * @param requestKey The key of the request.
   * @param isLoading Indicates if the current request is loading.
   * @param isSuccess Indicates if the current request has succeeded.
   * @param isError Indicates if the current request has failed.
   *
   */
  const computeStatusFor = useCallback(
    (
      requestKey: string,
      { isLoading, isSuccess, isError }: ComputeStatusParam,
    ) => {
      let statusSync: SyncStatus | undefined;

      if (isSuccess) {
        statusSync = SyncStatus.SYNCHRONIZED;
      } else if (isLoading) {
        statusSync = SyncStatus.SYNCHRONIZING;
      } else if (isError) {
        statusSync = SyncStatus.ERROR;
      }

      if (statusSync) {
        setMapStatus((curr) => new Map([...curr, [requestKey, statusSync]]));
      }
    },
    [],
  );

  const value = useMemo(
    () => ({
      status,
      computeStatusFor,
    }),
    [status, computeStatusFor],
  );

  return (
    <DataSyncContext.Provider value={value}>
      {children}
    </DataSyncContext.Provider>
  );
};

export const useDataSyncContext = (): DataSyncContextType =>
  useContext(DataSyncContext);
