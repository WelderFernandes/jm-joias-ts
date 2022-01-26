import React, { useEffect, useRef, InputHTMLAttributes } from 'react'
import { useField } from '@unform/core'
import { TextField } from '@mui/material'
import { FormHelperText } from '@mui/material'

interface Props {
  name: string
  label?: string
  variant?: 'outlined' | 'standard' | 'filled'
  value?: string
}

export default function InputSimple({ name, variant, label, ...rest }: Props) {
  const inputRef = useRef(null)
  const { fieldName, defaultValue, registerField, error } = useField(name)
  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef,
      getValue: ref => {
        return ref.current.value
      },
      setValue: (ref, value) => {
        ref.current.value = value
      },
      clearValue: ref => {
        ref.current.value = ''
      }
    })
  }, [fieldName, registerField])

  return (
    <>
      <TextField
        inputRef={inputRef}
        name="name"
        variant={variant}
        label={label}
        defaultValue={defaultValue}
        error={!!error}
        {...rest}
      />
      <FormHelperText error>{error}</FormHelperText>
    </>
  )
}
