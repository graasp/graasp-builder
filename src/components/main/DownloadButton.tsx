import { FC, useEffect } from 'react';

import { BUILDER } from '@graasp/translations';
import { DownloadButton as Button } from '@graasp/ui';

import { useBuilderTranslation } from '../../config/i18n';
import { mutations } from '../../config/queryClient';

type Props = {
  id: string;
  name: string;
};

export const DownloadButton: FC<Props> = ({ id, name }) => {
  const { t: translateBuilder } = useBuilderTranslation();

  const {
    mutate: downloadItem,
    data,
    isSuccess,
    isLoading: isDownloading,
  } = mutations.useExportZip();

  useEffect(() => {
    if (isSuccess) {
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${name}.zip`);
      document.body.appendChild(link);
      link.click();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, isSuccess, id]);

  const handleDownload = () => {
    downloadItem({ id });
  };
  return (
    <Button
      handleDownload={handleDownload}
      isLoading={isDownloading}
      title={translateBuilder(BUILDER.DOWNLOAD_ITEM_BUTTON)}
      ariaLabel={translateBuilder(BUILDER.DOWNLOAD_ITEM_BUTTON)}
      loaderColor="primary"
      loaderSize={10}
    />
  );
};

export default DownloadButton;
