import QR from 'react-qr-code';

import { Box, Modal } from '@mui/material';

type Props = {
  value: string;
  open: boolean;
  handleClose: () => void;
};

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '30%',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

const QRCode = ({ value, open, handleClose }: Props): JSX.Element => (
  <Modal open={open} onClose={handleClose}>
    <Box sx={style}>
      <QR
        size={256}
        style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
        value={value}
        viewBox="0 0 256 256"
      />
    </Box>
  </Modal>
);

export default QRCode;
