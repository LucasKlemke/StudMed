import React, { useEffect } from 'react';
import Image from 'next/image';

const ImageContainer = ({
  total,
  images,
}: {
  total: number;
  images: string[];
}) => {
  useEffect(() => {
    console.log('total', total);
    console.log('images');
  }, []);

  return (
    <div>
      {total === 1 && (
        <>
          {images.map((attachment: any, index: Number) => (
            <Image
              width={200}
              height={200}
              key={`${attachment.name}-${index}`}
              src={attachment.url}
              alt={attachment.name as string}
            />
          ))}
        </>
      )}
      {total > 1 && total <= 4 && (
        <>
          <div className={`grid grid-cols-2 hover:contrast-50 rounded-lg p-2`}>
            {images.map((attachment: any, index: number) => (
              <Image
                className={`${
                  index == total - 1 && total == 3
                    ? `col-span-2 w-[200px] h-[100px] object-cover`
                    : ` w-[{100px}] h-[100px] object-cover`
                } `}
                width={100}
                height={100}
                key={`${attachment.name}-${index}`}
                src={attachment.url}
                alt={attachment.name as string}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ImageContainer;
