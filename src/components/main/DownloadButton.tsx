import { useEffect } from 'react';

import { DownloadButton as Button } from '@graasp/ui';

import { buildDownloadButtonId } from '@/config/selectors';

import { useBuilderTranslation } from '../../config/i18n';
import { mutations } from '../../config/queryClient';
import { BUILDER } from '../../langs/constants';

type Props = {
  id: string;
  name: string;
};

export const DownloadButton = ({ id, name }: Props): JSX.Element => {
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
    <span id={buildDownloadButtonId(id)}>
      <Button
        handleDownload={handleDownload}
        isLoading={isDownloading}
        title={translateBuilder(BUILDER.DOWNLOAD_ITEM_BUTTON)}
        ariaLabel={translateBuilder(BUILDER.DOWNLOAD_ITEM_BUTTON)}
        loaderColor="primary"
        loaderSize={10}
      />
    </span>
  );
};

export default DownloadButton;
