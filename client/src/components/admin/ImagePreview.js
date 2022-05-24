import React, {useEffect} from "react";

const ImagePreview = ({ meta }) => {
    return (
        <div className="imagePreview">
        <img className="img" src={meta?.previewUrl} alt="zdjecie" />
    </div>
    )
}

export default ImagePreview;
