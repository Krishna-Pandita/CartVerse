import React from 'react'
import { Label } from './label'
import { Input } from './input'
import { Button } from './button'
import { Card, CardContent } from "./card";
import { X } from "lucide-react";

const ImageUpload = ({productData, setProductData}) => {
  const handleFiles = (e) =>{
    const files= Array.from(e.target.files || [])
    if(files.length){
      setProductData((prev)=> ({
        ...prev,
        productImg: [...prev.productImg, ...files]
      }))
    }
  }

  const removeImage = (idx) => {
  setProductData((prev) => ({
    ...prev,
    productImg: prev.productImg.filter((_, i) => i !== idx),
  }));
};


  return (
    <div className='grid gap-2'>

<Label>Product Images</Label>
<Input type="file" id="file-upload" className="hidden" accept="image/*" multiple onChange={handleFiles}/>
<Button variant='outline'>
  <label htmlFor='file-upload' className='cursor-pointer'>Uplaod Images</label>
</Button>


  {/* IMAGE PREVIEW */}

{
  productData.productImg.length > 0 && (
    <div className='grid grid-cols-2 gap-4 mt-3 sm:grid-cols-3'>
   {
    productData.productImg.map((file,idx) =>{
      let preview;
      if(file instanceof File){
        preview = URL.createObjectURL(file)
      } else if(typeof file === "string"){
        preview = file
      } else if (file?.url){
        preview = file.url
      }else{
        return null
      }
      return (
        <Card key={idx} className="relative group overflow-hidden">
                 <CardContent>
                  <img src={preview} alt="" width={200} height={200} className='object-cover rounded-md h-32 w-full '/>
                  <button onClick={() =>removeImage(idx)} className='absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition '><X size={14}/></button>
                 </CardContent>
        </Card>
      )
    })
   }
    </div>
  )
}

    </div>
  )
}

export default ImageUpload