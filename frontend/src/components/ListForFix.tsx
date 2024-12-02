import { useState } from 'react'
import CsvErrorFixForm from './CsvErrorFixForm'
import { Result } from '../types'

export default function ListForFix({
  dataError,
  setShow,
}: {
  dataError: Result
  setShow: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const [dataList, setDataList] = useState(dataError!.failed)

  const handleClick = () => {
    setShow(true)
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const row = Number(formData.get('row'))
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const age = Number(formData.get('age'))

    const options = {
      method: 'POST',
      body: JSON.stringify({
        row,
        data: {
          name,
          email,
          age: age === 0 ? null : age,
        },
      }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }

    fetch('/register', options)
      .then((res) => res.json())
      .then((data) => {
        console.log(data.success, '--', data)
        if (data.success) {
          setDataList((prev) => prev.filter((item) => item.result.row !== row))
        } else {
          setDataList((prev) =>
            prev.map((item) => (item.result.row !== row ? item : data))
          )
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error)
      })
  }

  return (
    <div className="min-w-fit p-10 flex flex-col justify-center items-center gap-14">
      {dataError.success > 0 && (
        <div className=" text-lg border-green-600 border-2 max-w-xl py-2 px-4 flex gap-14 justify-between items-center rounded-xl">
          <img src="./check.svg" alt="icono de check" className="w-10 " />
          <p className="text-green-600">
            {dataError.success} records uploades successfully
          </p>
          <button className="bg-transparent p-0">
            <img src="./x-mark.svg" alt="icono de cerrar" className="w-7" />
          </button>
          <button onClick={handleClick} className="absolute top-5 right-5 ">
            New File
          </button>
        </div>
      )}
      {dataList.length > 0 && (
        <div className="flex flex-col gap-4 items-center">
          <p className="text-xl">
            The {dataList.length} records listed below encountered errors.
            Please rectify these issues and retry.
          </p>

          <>
            <div className="w-full grid grid-cols-[auto_2fr_3fr_1fr_1fr] justify-between gap-x-8 gap-y-3 items-strat">
              <span>Row</span>
              <span>Name</span>
              <span>Email</span>
              <span className="col-span-2">Age</span>
            </div>

            {dataList.map((item) => (
              <CsvErrorFixForm
                key={item.result.data.id}
                item={item.result}
                handleSubmit={handleSubmit}
              />
            ))}
          </>
        </div>
      )}
    </div>
  )
}
