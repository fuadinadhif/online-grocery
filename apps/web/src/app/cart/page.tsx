import ItemDetails from "@/components/item-details";

const products = [
  {
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1999&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    name: "Wireless Headphones",
    quantity: 15,
    price: 500000,
  },
  {
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1999&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    name: "Classic Leather Watch",
    quantity: 8,
    price: 2500000,
  },
  {
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1999&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    name: "Bluetooth Speaker",
    quantity: 25,
    price: 300000,
  },
  {
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1999&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    name: "Running Shoes",
    quantity: 30,
    price: 1500000,
  },
  {
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1999&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    name: "Smartphone Stand",
    quantity: 40,
    price: 250000,
  },
];

export default function CartPage() {
  return (
    <main className="max-wrapper flex flex-1 flex-col items-center justify-center">
      <div className="grid w-full gap-8">
        {products.map((product, index) => (
          <div key={index} className="grid w-full grid-cols-[200px_1fr] gap-5">
            <ItemDetails
              image={product.image}
              name={product.name}
              quantity={product.quantity}
              price={product.price}
            />
          </div>
        ))}
      </div>
    </main>
  );
}
