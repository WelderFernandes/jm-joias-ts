import React, { useRef, useEffect, ReactNode } from 'react'
import ReactInputMask, { Props as InputProps } from 'react-input-mask'

import { useField } from '@unform/core'
import { FormHelperText, TextField } from '@mui/material'

interface Props extends InputProps {
  name: string
  label?: string
}

export default function InputMask({ name, label, ...rest }: Props) {
  const inputRef = useRef(null)
  const { fieldName, registerField, defaultValue, error } = useField(name)

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      path: 'value',
      setValue(ref: any, value: string) {
        ref.setInputValue(value)
      },
      clearValue(ref: any) {
        ref.setInputValue('')
      }
    })
  }, [fieldName, registerField])

  return (
    <>
      <ReactInputMask ref={inputRef} defaultValue={defaultValue} {...rest}>
        {() => <TextField name={fieldName} error={!!error} label={label} />}
      </ReactInputMask>
      <FormHelperText error>{error}</FormHelperText>
    </>
  )
}