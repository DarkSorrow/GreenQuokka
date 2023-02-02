import { useState } from 'react';
import Typography from '@mui/joy/Typography';

import Stack from '@mui/joy/Stack';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import Button from '@mui/joy/Button';
import { useTranslation } from "react-i18next";

type AppDialogConfirmProps = {
  id: string;
  title: string;
  open: boolean;
  onConfirm: () => void;
  onClose: () => void;
  children: React.ReactNode;
};

export const AppDialogConfirm = ({ id, title, onConfirm, onClose, open, children }: AppDialogConfirmProps) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    await onConfirm();
    setIsLoading(false);
  }
  return (
    <Modal open={open} onClose={onClose} aria-labelledby={`dialog-${id}-title`}>
      <ModalDialog
        aria-labelledby="basic-modal-dialog-title"
        aria-describedby="basic-modal-dialog-description"
        sx={{
          maxWidth: 500,
          borderRadius: 'md',
          p: 3,
          boxShadow: 'lg',
        }}
      >
        <Typography
          id="basic-modal-dialog-title"
          component="h2"
          level="inherit"
          fontSize="1.25em"
          mb="0.25em"
        >
          {title}
        </Typography>
        {children}
        <Stack spacing={1} direction="row">
          <Button
            onClick={onClose}
            color="primary"
            data-testid={`dialog-${id}-close`}
          >
            {t<string>('ndel')}
          </Button>
          <Button
            data-testid={`dialog-${id}-confirm`}
            loading={isLoading}
            color="danger"
            onClick={handleConfirm}
          >
            {t<string>('ydel')}
          </Button>
        </Stack>
      </ModalDialog>
    </Modal>
  );
}
