import { useState } from 'react';

type Props = {
  isInitiallyOpen?: boolean;
};

export type UseModalStatus = {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
};

export const useModalStatus = ({
  isInitiallyOpen = false,
}: Props = {}): UseModalStatus => {
  const [isOpen, setIsOpen] = useState(isInitiallyOpen);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return {
    isOpen,
    openModal,
    closeModal,
  };
};

export default useModalStatus;
