import { useState } from 'react'
import CsvUploadForm from './CsvUploadForm'
import ListForFix from './ListForFix'
import { Result } from '../types'

export default function Authenticated() {
  const [data, setData] = useState<Result>({
    success: 0,
    failed: [],
  })
  const [show, setShow] = useState(false)

  return (
    <div className="relative w-full min-h-[60vh] h-full max-w-7xl border rounded-xl flex flex-col justify-center items-center">
      {show ? (
        <CsvUploadForm setShow={setShow} setData={setData} />
      ) : (
        <ListForFix dataError={data} setShow={setShow} />
      )}
    </div>
  )
}
