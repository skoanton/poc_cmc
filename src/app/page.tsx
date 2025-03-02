"use client";
import { Customer } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const [customers, setCustomers] = useState<Customer[] | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/customers")
      .then((res) => res.json())
      .then(setCustomers)
      .catch(console.error);
  }, []);

  const handleNav = (customerId: string) => {
    console.log(customerId);
    router.push(`/customers/${customerId}`);
    // Navigate to the customer page
  };

  const handleDomainNav = (customerId: string) => {
    console.log(customerId);
    router.push(`/domain/${customerId}`);
    // Navigate to the domain page
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      {/* Customers Section */}
      <div className="bg-white shadow-lg rounded-2xl p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Customers</h2>
        <ul className="divide-y divide-gray-200">
          {customers?.map((customer) => (
            <li
              key={customer.id}
              onClick={() => handleNav(customer.id)}
              className="py-3 px-4 rounded-lg hover:bg-gray-100 hover:cursor-pointer transition duration-200"
            >
              <span className="text-gray-700 font-medium">{customer.name}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Domains Section */}
      <div className="bg-white shadow-lg rounded-2xl p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Domains</h2>
        <ul className="divide-y divide-gray-200">
          {customers?.map((customer) => (
            <li
              key={customer.id}
              onClick={() => handleDomainNav(customer.id)}
              className="py-3 px-4 rounded-lg hover:bg-gray-100 hover:cursor-pointer transition duration-200"
            >
              <span className="text-gray-700 font-medium">{customer.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
