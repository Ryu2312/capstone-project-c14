import { useState } from 'react'
import { Result } from '../types'

export default function CsvUploadForm({
  setShow,
  setData,
}: {
  setShow: React.Dispatch<React.SetStateAction<boolean>>
  setData: React.Dispatch<React.SetStateAction<Result>>
}) {
  const [value, setValue] = useState<File | null>(null)

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    fetch('/upload', {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((data) => data.json())
      .then((data) => {
        if (data.ok) {
          setData({
            success: data.success,
            failed: data.failed,
          })
        }
      })
      .finally(() => setShow(false))
    event.currentTarget.reset()
  }

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.currentTarget.files) return
    const file = event.currentTarget.files[0]
    setValue(file)
  }

  return (
    <>
      <form
        className="flex flex-col gap-10 h-96 max-w-7xl w-full min-w-fit rounded-xl items-center justify-center"
        onSubmit={handleSubmit}
      >
        <input
          name="file"
          type="file"
          accept=".csv"
          className="py-2 px-4 rounded-xl"
          onChange={handleOnChange}
        />
        <button
          disabled={!value}
          className="disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Upload File
        </button>
      </form>
    </>
  )
}
