import React, { useRef, useState } from 'react'
import './imageGenerator.css'
import default_image from '../assets/default_image.svg'


const ImageGenerator = () => {

  const [image_url, setImage_url] = useState("/");
  let inputRef = useRef(null);

  const imgGenerator = async () => {
    if (inputRef.current.value === "") {
      return 0;
    }
    const response = await fetch (
      "https://api.openai.com/v1/images/generations",
      {
        method: "POST",
        headers: {
          "Content-Type" : "application/json",
          Authorization:
          "Bearer sk-proj-b8RsiHWDmhfICt2GWgu4T3BlbkFJ7Amwxra47kN9ac6yvwJl",
          "User-Agent":"Chrome",
        },
        body:JSON.stringify({
          prompt:`${inputRef.current.value}`,
          n:1,
          size:"512x512",
        }),
      }
    );
    let data = await response.json();
    console.log(data);
  }

  return (
    <div className='ai-image-geenrator'>
      <div className="header">Ai image <span>generator</span></div>
      <div className="img-loading">
        <div className="image"><img src={image_url === "/" ? default_image : image_url} alt="" /></div>
      </div>
      <div className="search-box">
        <input type="text" ref={inputRef} className='search-input' placeholder='Describe what you wants to see' />
        <div onClick={() => {imgGenerator()}} className="generate-btn">Generate</div>
      </div>
    </div>
  )
}

export default ImageGenerator