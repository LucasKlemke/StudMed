import type { Attachment } from 'ai'

import { LoaderIcon } from './icons'
import { File } from 'lucide-react'

export const PreviewAttachment = ({
  attachment,
  isUploading = false,
}: {
  attachment: Attachment
  isUploading?: boolean
}) => {
  const { name, url, contentType } = attachment

  return (
    // <div className="flex flex-col gap-2">
    //   <div className="w-20 h-16 aspect-video bg-muted rounded-md relative flex flex-col items-center justify-center">
    //     {contentType ? (
    //       contentType.startsWith('image') ? (
    //         // NOTE: it is recommended to use next/image for images
    //         // eslint-disable-next-line @next/next/no-img-element
    //         <img
    //           key={url}
    //           src={url}
    //           alt={name ?? 'An image attachment'}
    //           className="rounded-md size-full object-cover"
    //         />
    //       ) : (
    //         <div className="" />
    //       )
    //     ) : (
    //       <div className="" />
    //     )}

    //     {isUploading && (
    //       <div className="animate-spin absolute text-zinc-500">
    //         <LoaderIcon />
    //       </div>
    //     )}
    //   </div>
    //   <div className="text-xs text-zinc-500 max-w-16 truncate">{name}</div>
    // </div>
    <div className={'flex flex-col items-center gap-2'}>
      <div className="w-20 h-16 bg-muted rounded-md flex items-center justify-center">
        <File className="h-8 w-8 text-muted-foreground" />
      </div>
      <span className="text-xs text-muted-foreground max-w-20 truncate">
        {name}
      </span>
    </div>
  )
}
