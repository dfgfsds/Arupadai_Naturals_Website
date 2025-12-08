import Link from 'next/link';

interface BreadcrumbItem {
  name: string;
  href: string;
  isActive?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

// Utility to truncate words
const truncateWords = (text: string, wordLimit: number): string => {
  const words = text.split(' ');
  return words.length > wordLimit
    ? words.slice(0, wordLimit).join(' ') + '...'
    : text;
};

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <nav className="py-2">
      <div className="container mx-auto">
        <ul className="flex space-x-2 text-gray-600 flex-wrap">
          {items.map((item, index) => (
            <li key={item.name} className="flex items-center">
              {index > 0 && <span className="mx-2">|</span>}
              {item.isActive ? (
                <span className="text-gray-900">
                  {truncateWords(item.name, 5)}
                </span>
              ) : (
                <Link href={item.href}>
                  <span className="hover:text-gray-900">
                    {truncateWords(item.name, 5)}
                  </span>
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Breadcrumb;
