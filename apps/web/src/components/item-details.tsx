import Image from "next/image";
// import { useState } from "react";

export default function ItemDetails({
  image,
  name,
  price,
  quantity,
}: {
  image: string;
  name: string;
  price: number;
  quantity: number;
}) {
  // const [name, setName] = useState();
  // const [quantity, setQuantity] = useState();
  // const [price, setPrice] = useState();

  return (
    <>
      <div className="relative h-full w-full">
        <Image src={image} alt={name} fill className="object-cover" />
      </div>
      <div className="grid border p-4">
        <p>{name}</p>
        <p>Rp. {price}</p>
        <div className="mt-5 flex items-center gap-2">
          <button className="cursor-pointer border p-2">-</button>
          <p>x {quantity}</p>
          <button className="cursor-pointer border p-2">+</button>
        </div>
      </div>
    </>
  );
}
