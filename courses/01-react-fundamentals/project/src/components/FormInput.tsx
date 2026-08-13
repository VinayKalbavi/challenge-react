import type {
  ChangeEvent,
  RefObject,
} from 'react'

export interface FormInputProps {
  label: string
  id: string
  value: string
  onChange: (
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >,
  ) => void
  type?: string
  placeholder?: string
  error?: string

  /** Renders a textarea instead of an input when true. */
  multiline?: boolean

  /** Ref attached to the underlying input element. */
  inputRef?: RefObject<HTMLInputElement>
}

export default function FormInput({
  label,
  id,
  value,
  onChange,
  type = 'text',
  placeholder,
  error,
  multiline = false,
  inputRef,
}: FormInputProps) {
  return (
    <div>
      <label htmlFor={id}>{label}</label>

      {multiline ? (
        <textarea
          id={id}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          aria-invalid={Boolean(error)}
        />
      ) : (
        <input
          ref={inputRef}
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          aria-invalid={Boolean(error)}
        />
      )}

      {error && (
        <p role="alert">{error}</p>
      )}
    </div>
  )
}