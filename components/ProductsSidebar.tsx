'use client';

import * as Accordion from '@radix-ui/react-accordion';
import * as Checkbox from '@radix-ui/react-checkbox';
import { CheckIcon } from 'lucide-react';
import { useCategories } from '@/context/CategoriesContext';

export default function ProductsSidebar({
  selectedCategory,
  setSelectedCategory,
}: {
  selectedCategory: string;
  setSelectedCategory: (val: string) => void;
}) {
  const { categories }: any = useCategories();

  const handleCheckboxChange = (categoryId: string) => {
    setSelectedCategory(selectedCategory === categoryId ? '' : categoryId);
  };

  return (
    <div className=" p-6 shadow-xl">
      <h3 className="text-lg font-semibold mb-4">Filters</h3>

      <Accordion.Root type="multiple" defaultValue={['category']}>
        <Accordion.Item value="category">
          <Accordion.Header>
            <Accordion.Trigger className="w-full text-left text-base font-medium py-2">
              Categories
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="pt-2 space-y-2">
            {categories?.data?.slice(0, 30)?.map((category: any) => (
              <div key={category.id} className="flex items-center gap-2">
                <Checkbox.Root
                  className="w-4 h-4 rounded border border-gray-300 bg-white flex items-center justify-center data-[state=checked]:bg-green-600"
                  id={`category-${category.id}`}
                  checked={selectedCategory === category.id}
                  onCheckedChange={() => handleCheckboxChange(category.id)}
                >
                  <Checkbox.Indicator>
                    <CheckIcon className="w-3 h-3 text-white" />
                  </Checkbox.Indicator>
                </Checkbox.Root>

                <label
                  htmlFor={`category-${category.id}`}
                  className="text-sm font-medium leading-none"
                >
                  {category.name}
                </label>
              </div>
            ))}
          </Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
    </div>
  );
}
