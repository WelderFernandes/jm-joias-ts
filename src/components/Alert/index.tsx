import React from 'react'
import { VariantType, useSnackbar } from 'notistack'

export default function AlertProvider() {
  const { enqueueSnackbar } = useSnackbar()

  const handleClick = () => {
    enqueueSnackbar('I love snacks.')
  }

  const handleClickVariant = (variant: VariantType) => () => {
    // variant could be success, error, warning, info, or default
    enqueueSnackbar('This is a success message!', { variant })
  }

  return <React.Fragment>{() => handleClickVariant('success')}</React.Fragment>
}
