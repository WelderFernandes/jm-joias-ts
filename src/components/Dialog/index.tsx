import { useState, ReactNode } from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import LoadingButton from '@mui/lab/LoadingButton'
import Stack from '@mui/material/Stack'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'

type DialogProps = {
  title: string
  confirmText: string
  confirmColor: string
  children: ReactNode
  closeModal: () => void
  confirm: () => void
}

export default function ResponsiveDialog({
  title,
  confirmText,
  confirmColor,
  closeModal,
  children,
  confirm
}: DialogProps) {
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'))
  const [loading, setLoading] = useState(false)

  const handleClose = () => {
    closeModal && closeModal()
  }

  function handleConfirm() {
    confirm && confirm()
    console.log('confirm')
    setLoading(true)
  }

  return (
    <div>
      <Dialog
        disableEscapeKeyDown={true}
        fullScreen={fullScreen}
        open={true}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{children}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus variant="outlined" onClick={handleClose}>
            CANCELAR
          </Button>
          <LoadingButton
            variant="outlined"
            endIcon={<DeleteForeverIcon />}
            onClick={handleConfirm}
            loading={loading}
            sx={{
              borderColor: confirmColor,
              color: confirmColor,
              '&:hover': {
                backgroundColor: confirmColor,
                color: 'white',
                fontWeight: 'bold'
              }
            }}
          >
            {confirmText}
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </div>
  )
}
