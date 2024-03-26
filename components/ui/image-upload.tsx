"use client"

import { CldUploadWidget } from 'next-cloudinary'
import { ImagePlus, Trash } from 'lucide-react'
import { FC, useEffect, useState } from "react";
import { Button } from './button';
import Image from 'next/image';

type ImageUploadProps = {
  disabled?: boolean;
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
  value: string[]
}

const ImageUpload: FC<ImageUploadProps> = ({
  disabled,
  onChange,
  onRemove,
  value
}) => {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null

  const onUpload = (result: any) => {
    onChange(result.info.secure_url)
  }

  return (
    <div className="">
      <div className="mb-4 flex items-center gap-4">
        {
          value.map(url => (
            <div key={url} className="relative w-[15rem] h-[15rem] rounded-md overflow-hidden">
              <div className="z-10 absolute top-2 right-2">
                <Button
                  type='button'
                  onClick={() => onRemove(url)}
                  variant="destructive"
                  size="icon"
                >
                  <Trash className='h-4 w-4' />
                </Button>
              </div>
              <Image
                fill
                src={url}
                className='object-cover'
                alt='Image'
              />
            </div>
          ))
        }
      </div>
      <CldUploadWidget onUpload={onUpload} uploadPreset="xvoi8rlp">
        {({ open }) => {
          const onClick = () => {
            open()
          }

          return (
            <Button
              type='button'
              disabled={disabled}
              variant="secondary"
              onClick={onClick}
            >
              <ImagePlus className='h-4 w-4 mr-2' />
              Carregue uma imagem
            </Button>
          )
        }}
      </CldUploadWidget>
    </div>
  )
}

export default ImageUpload