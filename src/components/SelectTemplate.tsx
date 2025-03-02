import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useState } from "react";
type SelectTemplateProps = {};

const templates = [
  { value: "pizzeria", label: "Pizzeria 🍕" },
  { value: "barber", label: "Barber Shop ✂️" },
  { value: "store", label: "Retail Store 🛍️" },
  { value: "cafe", label: "Café ☕" },
  { value: "portfolio", label: "Portfolio 💼" },
];

export default function SelectTemplate({}: SelectTemplateProps) {
  const [selectedTemplate, setSelectedTemplate] = useState("");

  const handleSelect = (value: string) => {
    setSelectedTemplate(value);
  };

  return (
    <>
      <Select onValueChange={handleSelect}>
        <SelectTrigger className="w-[200px] border p-2 rounded-lg shadow-sm">
          <SelectValue placeholder="Choose a template" />
        </SelectTrigger>
        <SelectContent>
          {templates.map((template) => (
            <SelectItem key={template.value} value={template.value}>
              {template.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );
}
