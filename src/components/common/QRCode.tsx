import { useState } from 'react';
import QR from 'react-qr-code';

import { QrCode2 } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import { Dialog, DialogContent, IconButton, Tooltip } from '@mui/material';

import { useBuilderTranslation } from '@/config/i18n';
import { BUILDER } from '@/langs/constants';

type Props = {
  value: string;
};

const QRCode = ({ value }: Props): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();
  const [openQrModal, setOpenQrModal] = useState<boolean>(false);

  return (
    <>
      <Tooltip title={translateBuilder(BUILDER.SHARE_ITEM_LINK_QR_CODE)}>
        <IconButton onClick={() => setOpenQrModal(true)}>
          <QrCode2 />
        </IconButton>
      </Tooltip>
      <Dialog open={openQrModal} onClose={() => setOpenQrModal(false)}>
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
          <QR size={500} value={value} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default QRCode;
