import React, {useEffect} from 'react';
import { SketchPicker } from "react-color";

const ColorModal = ({color, onChange, closeModalFunction}) => {
    useEffect(() => {
        document.addEventListener('keyup', (event) => {
           if(event.keyCode === 27) {
               closeModalFunction();
           }
        });
    }, []);

    return <div className="colorModal">
        <div className="colorModal__inner">
            <button className="colorModal__close" onClick={() => { closeModalFunction(); }}>
                &times;
            </button>
            <h3 className="colorModal__header">
                Zmień kolor
            </h3>
            <SketchPicker color={color}
                          onChange={(color, event) => { onChange(color, event) }} />
          <button className="btn btn--changeColor" onClick={() => { closeModalFunction(); }}>
              Potwierdź
          </button>
        </div>
    </div>
};

export default ColorModal;
