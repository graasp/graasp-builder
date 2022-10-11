import PropTypes from 'prop-types';

import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { MUTATION_KEYS } from '@graasp/query-client';
import { DownloadButton as Button } from '@graasp/ui';

import { useMutation } from '../../config/queryClient';

export const DownloadButton = ({ id, name }) => {
  const { t } = useTranslation();

  const {
    mutate: downloadItem,
    data,
    isSuccess,
    isLoading: isDownloading,
  } = useMutation(MUTATION_KEYS.EXPORT_ZIP);

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
      title={t('Download')}
    />
  );
};

DownloadButton.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

export default DownloadButton;
