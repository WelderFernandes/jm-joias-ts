import { ChangeEvent, ReactNode } from 'react'
import InputMask from 'react-input-mask'

type MaskInputProps = {
  mask: string
  placeholder: string
  value: string
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  children: ReactNode
}

function MaskInput({
  mask = '-',
  value,
  onChange,
  placeholder = '-',
  children
}: MaskInputProps) {
  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    onChange({
      ...event,
      target: {
        ...event.target,
        value: event.target.value.replace(/\D/g, '')
      }
    })
  }
  return (
    <InputMask
      mask={mask}
      maskPlaceholder={placeholder}
      onChange={handleChange}
      value={value}
    >
      {children}
    </InputMask>
  )
}

export default MaskInput
