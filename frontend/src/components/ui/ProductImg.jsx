import React, { useState } from 'react'
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'

const ProductImg = ({images}) => {
  const [mainImg, setMainImg] = useState(images?.[0]?.url || '')
  return (
    <div className='flex gap-5 w-max'>
      <div className='gap-5 flex flex-col'>
        {
          images?.map((img)=>{
            return <img onClick={()=>setMainImg(img.url)} src={img.url} alt="" className='cursor-pointer w-20 h-20 shadow-lg' />
          })
        }
        </div>

        <Zoom>
        <img src={mainImg} alt="" className='w-[450px] border shadow-lg' />
        </Zoom>
    </div>

  )
}

export default ProductImg