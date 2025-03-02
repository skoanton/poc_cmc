"use client";

import SelectTemplate from "@/components/SelectTemplate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Customer, MediaCategory } from "@prisma/client";
import { useParams } from "next/navigation";
import { ChangeEvent, use, useEffect, useState } from "react";

type pageProps = {};

type ImageFile = {
  file: File;
  type: string;
  category: MediaCategory;
  size: number;
  name: string;
};

type TextData = {
  type: string;
  category: MediaCategory;
  size: number;
  name: string;
};

export default function page({}: pageProps) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const { id } = useParams();

  useEffect(() => {
    fetch(`/api/customers/${id}`)
      .then((res) => res.json())
      .then(setCustomer)
      .catch(console.error);
  }, []);

  const [logoImage, setLogoImage] = useState<ImageFile | null>(null);
  const [companyImage, setCompanyImage] = useState<ImageFile | null>(null);
  const [companyName, setCompanyName] = useState<TextData | null>(null);
  const [description, setDescription] = useState<TextData | null>(null);
  const handleLogoChange = (file: ChangeEvent<HTMLInputElement>) => {
    console.log(file.target.files);

    if (file.target.files) {
      const data = {
        file: file.target.files[0],
        type: "logo",
        category: MediaCategory.LOGO,
        size: file.target.files[0].size,
        name: file.target.files[0].name,
      };
      setLogoImage(data);
    }
  };

  const handleFileInput = (file: ChangeEvent<HTMLInputElement>) => {
    console.log(file.target.files);

    if (file.target.files) {
      const data = {
        file: file.target.files[0],
        type: "image",
        category: MediaCategory.IMAGE,
        size: file.target.files[0].size,
        name: file.target.files[0].name,
      };
      setCompanyImage(data);
    }
  };

  const handleCompanyName = (name: ChangeEvent<HTMLInputElement>) => {
    console.log(name.target.value);
    const data = {
      file: name.target.value,
      type: "text",
      category: MediaCategory.COMPANY_NAME,
      size: name.target.value.length,
      name: name.target.value,
    };
    setCompanyName(data);
  };

  const handleDescription = (description: ChangeEvent<HTMLTextAreaElement>) => {
    console.log(description.target.value);
    const data = {
      file: description.target.value,
      type: "text",
      category: MediaCategory.DESCRIPTION,
      size: description.target.value.length,
      name: description.target.value,
    };
    setDescription(data);
  };

  const handleSubmit = async () => {
    const uploadFile = async (fileData: any) => {
      const formData = new FormData();
      formData.append("file", fileData.file);
      formData.append("type", fileData.type);
      formData.append("category", fileData.category);
      formData.append("size", fileData.size.toString());
      formData.append("customerId", customer!.id);

      try {
        const response = await fetch(`/api/media/${id}`, {
          method: "POST",
          body: formData,
        });

        const result = await response.json();
        console.log("Upload success:", result);
      } catch (error) {
        console.error("Upload failed:", error);
      }
    };

    if (logoImage) await uploadFile(logoImage);
    if (companyImage) await uploadFile(companyImage);
    if (companyName) await uploadFile(companyName);
    if (description) await uploadFile(description);
  };

  if (!customer) return <div>Loading...</div>;

  return (
    <div className="max-w-lg mx-auto bg-white shadow-lg rounded-2xl p-6">
      <SelectTemplate />
      {/* Greeting */}
      <h1 className="text-2xl font-semibold text-gray-800">
        Dashboard for <span className="font-bold">{customer.name}</span>
      </h1>

      <div className="mt-6 space-y-5">
        {/* Upload Logo */}
        <div>
          <h2 className="text-lg font-medium text-gray-700 mb-2">
            Upload Logo
          </h2>
          <Input
            type="file"
            onChange={handleLogoChange}
            className="w-full border p-2 rounded-md"
          />
        </div>

        {/* Upload Image */}
        <div>
          <h2 className="text-lg font-medium text-gray-700 mb-2">
            Upload Image
          </h2>
          <Input
            type="file"
            onChange={handleFileInput}
            className="w-full border p-2 rounded-md"
          />
        </div>

        {/* Company Name */}
        <div>
          <h2 className="text-lg font-medium text-gray-700 mb-2">
            Company Name
          </h2>
          <Input
            type="text"
            placeholder="Enter company name"
            onChange={handleCompanyName}
            className="w-full border p-2 rounded-md"
          />
        </div>

        {/* Description */}
        <div>
          <h2 className="text-lg font-medium text-gray-700 mb-2">
            Description
          </h2>
          <Textarea
            placeholder="Enter your company description..."
            onChange={handleDescription}
            className="w-full border p-2 rounded-md"
          />
        </div>

        {/* Submit Button */}
        <Button className="w-full" onClick={handleSubmit}>
          Submit
        </Button>
      </div>
    </div>
  );
}
