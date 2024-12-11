import { ButtonProps, Dialog, IconButton, useTheme } from '@mui/material';

import { DiscriminatedItem, ItemGeolocation } from '@graasp/sdk';
import { Button } from '@graasp/ui';

import { FolderPlus } from 'lucide-react';

import useModalStatus from '@/components/hooks/useModalStatus';
import { useBuilderTranslation } from '@/config/i18n';
import { ADD_FOLDER_BUTTON_CY } from '@/config/selectors';
import { BUILDER } from '@/langs/constants';

import { FolderCreateForm } from './FolderCreateForm';

type Props = {
  previousItemId?: DiscriminatedItem['id'];
  parentId?: DiscriminatedItem['id'];
  geolocation?: Pick<ItemGeolocation, 'lat' | 'lng'>;
  size?: ButtonProps['size'];
  type?: 'button' | 'icon';
};

export const NewFolderButton = ({
  previousItemId,
  parentId,
  geolocation,
  size = 'medium',
  type = 'button',
}: Props): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();
  const theme = useTheme();
  const { isOpen, openModal, closeModal } = useModalStatus();

  const handleClickOpen = () => {
    openModal();
  };

  return (
    <>
      {type === 'icon' ? (
        <IconButton
          onClick={handleClickOpen}
          color="secondary"
          sx={{
            background: theme.palette.primary.main,
            '&:hover': { background: 'grey' },
          }}
          data-umami-event="new-folder-icon-button"
        >
          <FolderPlus color="white" />
        </IconButton>
      ) : (
        <Button
          dataCy={ADD_FOLDER_BUTTON_CY}
          onClick={handleClickOpen}
          color="primary"
          aria-label="add-folder"
          startIcon={<FolderPlus />}
          size={size}
          data-umami-event="new-folder-button"
        >
          {translateBuilder(BUILDER.CREATE_FOLDER_BUTTON_TEXT)}
        </Button>
      )}
      <Dialog open={isOpen} onClose={closeModal} maxWidth="md" fullWidth>
        <FolderCreateForm
          onClose={closeModal}
          previousItemId={previousItemId}
          parentId={parentId}
          geolocation={geolocation}
        />
      </Dialog>
    </>
  );
};
