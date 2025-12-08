import Image from 'next/image';
import React from 'react';

const Loading: React.FC = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-[1005]">
      <div className="flex flex-col items-center">
        <Image height={400} width={300} src="/loading.png" alt="Loading" />
      </div>
    </div>
  );
};

export default Loading;