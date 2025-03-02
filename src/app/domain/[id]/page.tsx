"use client";
import { Media, MediaCategory } from "@prisma/client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type pageProps = {};

export default function page({}: pageProps) {
  const { id } = useParams();
  console.log(id);

  const [companyName, setCompanyName] = useState<string | null>(null);
  const [logo, setLogo] = useState<string | null>(null);
  const [companyImage, setCompanyImage] = useState<string | null>(null);
  const [description, setDescription] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return; // Om `id` saknas, avbryt

    fetch(`/api/media/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.error && Array.isArray(data)) {
          const companyName = data.find(
            (media: Media) => media.category === MediaCategory.COMPANY_NAME
          )?.url;
          const logo = data.find(
            (media: Media) => media.category === MediaCategory.LOGO
          )?.url;
          const companyImage = data.find(
            (media: Media) => media.category === MediaCategory.IMAGE
          )?.url;
          const description = data.find(
            (media: Media) => media.category === MediaCategory.DESCRIPTION
          )?.url;

          setCompanyName(companyName || "Unknown Company");
          setLogo(logo || "/default-logo.png");
          setCompanyImage(companyImage || "/default-image.png");
          setDescription(description || "No description available.");
        }

        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching media:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="max-w-lg mx-auto bg-white shadow-lg rounded-2xl p-6 text-center">
      {/* Company Name */}
      <h1 className="text-2xl font-bold text-gray-800">
        Welcome to <span className="text-blue-600">{companyName}</span>
      </h1>

      <div className="mt-6 space-y-5">
        {/* Logo */}
        {logo && (
          <img
            src={logo}
            alt="Company logo"
            className="mx-auto max-w-[200px] rounded-lg shadow-md"
          />
        )}

        {/* Company Image */}
        {companyImage && (
          <img
            src={companyImage}
            alt="Company image"
            className="mx-auto max-w-[400px] rounded-lg shadow-md"
          />
        )}

        {/* Description */}
        <p className="text-gray-700 text-lg">{description}</p>
      </div>
    </div>
  );
}
