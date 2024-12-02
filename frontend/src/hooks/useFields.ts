import {  useState } from 'react'

export function useFields({
  type,
  initialValue,
}: {
  type: string
  initialValue: string | number
}) {
 const [value, setValue] = useState(initialValue)


  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value)
  }
  
  return {
    type,
    value,
    onChange,
  }
}
