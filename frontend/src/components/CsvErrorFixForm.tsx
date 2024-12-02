import { Failed } from '../types'

export default function CsvErrorFixForm({
  item,
  handleSubmit,
}: {
  item: Failed
  handleSubmit: React.FormEventHandler<HTMLFormElement>
}) {
  const { row, data, issues } = item
  console.log(issues)
  return (
    <form
      onSubmit={handleSubmit}
      className="w-full grid grid-cols-[auto_2fr_3fr_1fr_1fr] justify-between gap-x-8 gap-y-3 items-start"
    >
      <input
        className="text-center bg-transparent w-4 cursor-none"
        name="row"
        value={row}
      />
      <label>
        <input
          type="text"
          className=" border w-full rounded-lg p-2"
          name="name"
          defaultValue={data.name}
        />
        {issues.name && <span className="text-red-600 p-1">{issues.name}</span>}
      </label>
      <label>
        <input
          type="email"
          className=" border w-full rounded-lg p-2"
          name="email"
          defaultValue={data.email}
        />
        {issues.email && (
          <span className="text-red-600 p-1">{issues.email}</span>
        )}
      </label>
      <label>
        <input
          type="number"
          className=" border w-full rounded-lg p-2"
          name="age"
          defaultValue={data.age}
        />
        {issues.age && <span className="text-red-600 p-1">{issues.age}</span>}
      </label>

      <button>Retry</button>
    </form>
  )
}
