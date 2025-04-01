export default function ErrorInput({ errors }: { errors: string[] }) {
  return (
    <ul className="mt-2 pl-5">
      {errors.map((item: string, index: number) => (
        <li key={index} className="list-disc text-xs text-red-500">
          {item}
        </li>
      ))}
    </ul>
  );
}
