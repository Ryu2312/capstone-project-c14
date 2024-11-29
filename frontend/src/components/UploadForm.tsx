import { useState } from 'react'

export default function Upload() {
  const [value, setValue] = useState<File | null>(null)
  const [data, setData] = useState<Data[]>([])

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    fetch('/upload', {
      method: 'POST',
      body: formData,
    })
      .then((data) => data.json())
      .then((data) => setData(data))
    event.currentTarget.reset()
  }

  function handleOnChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (!event.currentTarget.files) return
    const file = event.currentTarget.files[0]
    setValue(file)
  }
  console.log(data)

  return (
    <>
      <form
        className="flex flex-col gap-10 border h-96 max-w-7xl w-3/4 min-w-fit rounded-xl items-center justify-center"
        onSubmit={handleSubmit}
      >
        <input
          name="file"
          type="file"
          accept=".csv"
          className="py-2 px-4 rounded-xl"
          onChange={handleOnChange}
        />
        <button disabled={!value}>Upload File</button>
      </form>
    </>
  )
}

interface Data {
  id: number
  name: string
  email: string
  age: number
  role: string
}
