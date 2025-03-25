import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { Markdown } from './markdown'
import { Globe, Link2 } from 'lucide-react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { Card, CardContent, CardFooter } from '@/components/ui/card'

const SearchBlock = ({ result }) => {
  return (
    <div>
      {result && (
        <>
          <div className="w-full no-scroll">
            <p className="font-semibold">Fontes ({result.sources.length})</p>
            <Carousel
              opts={{
                align: 'start',
                loop: true,
              }}
              className="w-full"
            >
              <div className="flex gap-x-3 items-center">
                <CarouselPrevious className="hover:scale-105" />
                <CarouselContent>
                  {result.sources.map((src, idx) => (
                    <CarouselItem
                      key={`source-${idx}`}
                      className="md:basis-1/2 lg:basis-1/3 "
                    >
                      <Link href={src.url} target="_blank">
                        <Card className="h-full bg-sidebar hover:border hover:border-primary">
                          <CardContent className="p-4 flex-grow gap-x-2">
                            <div className="flex items-center gap-x-1">
                              <Globe className="pb-1" />
                              <p className='text-sm'>{idx+1}</p>
                            </div>

                            <p className="text-lg">
                              {src?.title || 'Titulo não encontrado'}
                            </p>
                          </CardContent>
                        </Card>
                      </Link>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselNext className="hover:scale-105" />
              </div>
            </Carousel>
          </div>
          <Markdown>{result.text}</Markdown>
        </>
      )}
    </div>
  )
}

export default SearchBlock
