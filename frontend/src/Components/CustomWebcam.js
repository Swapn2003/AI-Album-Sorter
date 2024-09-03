import React, { useRef, useState, useCallback, useEffect } from "react";
import Webcam from "react-webcam";
import axios from "axios";

const CustomWebcam = ({ albumId, authToken, onImagesReceived, noFaceFound }) => {
  const webcamRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(null);
  const [imgUrl, setImgUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const cloudName = process.env.REACT_APP_CLOUD_NAME;


  const capture = useCallback(async () => {
    setLoading(true);
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc);
    const formData = new FormData();
    formData.append("file", imageSrc);
    formData.append("upload_preset", "ai-image-sorter");

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        formData
      );
      setImgUrl(response.data.secure_url);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  }, [albumId, authToken, onImagesReceived]);

  useEffect(() => {
    const fetchImages = async () => {
      
      if (imgUrl) {
        try {
          const response = await axios.get(
            `/api/albums/${albumId}/find-my-images`,
            {
              params: {
                album_id: albumId,
                url: imgUrl,
              },
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`,
              },
            }
          );
  
          const cloudinaryLinks = response.data;
          console.log("Cloudinary links:", cloudinaryLinks);

          if (onImagesReceived) {
            onImagesReceived(cloudinaryLinks);
          }
        } catch (error) {
          console.error("Error fetching images:", error);
          noFaceFound();
        }
      }
    };
  
    fetchImages();
  }, [imgUrl, onImagesReceived, noFaceFound]);
  

  return (
    <div className="container" style = {
      {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }
    }>
      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
        </div>
      )}
      {imgSrc ? (
        <img src={imgSrc} alt="webcam" />
      ) : (
        <Webcam height={300} width={300} ref={webcamRef} style={{
          borderRadius: '50%',   
          objectFit: 'cover'
        }} />
      )}
      <div className="btn-container">
        <button onClick={capture}>Capture photo</button>
      </div>
    </div>
  );
};

export default CustomWebcam;
