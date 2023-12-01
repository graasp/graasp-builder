import { useState } from 'react';
import QR from 'react-qr-code';

import { QrCode2 } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import { Box, Dialog, DialogContent, IconButton, Tooltip } from '@mui/material';

import { useBuilderTranslation } from '@/config/i18n';
import {
  SHARE_ITEM_QR_BTN_ID,
  SHARE_ITEM_QR_DIALOG_ID,
} from '@/config/selectors';
import { BUILDER } from '@/langs/constants';

type Props = {
  value: string;
  disabled?: boolean;
};

const QRCode = ({ value, disabled = false }: Props): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();
  const [openQrModal, setOpenQrModal] = useState<boolean>(false);

  return (
    <>
      <Tooltip title={translateBuilder(BUILDER.SHARE_ITEM_LINK_QR_CODE)}>
        <IconButton
          onClick={() => setOpenQrModal(true)}
          id={SHARE_ITEM_QR_BTN_ID}
          disabled={disabled}
        >
          <QrCode2 />
        </IconButton>
      </Tooltip>
      <Dialog
        open={openQrModal}
        onClose={() => setOpenQrModal(false)}
        id={SHARE_ITEM_QR_DIALOG_ID}
      >
        <IconButton
          aria-label="close"
          onClick={() => setOpenQrModal(false)}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent sx={{ p: 5 }}>
          <Box width={{ xs: '60vw', sm: '50vw', md: '30vw', lg: '24vw' }}>
            <QR
              style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
              value={value}
            />
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default QRCode;
