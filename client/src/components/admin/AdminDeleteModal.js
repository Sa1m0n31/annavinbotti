import React, {useEffect, useRef} from 'react';
import {SketchPicker} from "react-color";
import Loader from "../shop/Loader";

const AdminDeleteModal = ({id, header, text, btnText, closeModalFunction, deleteStatus, deleteFunction, success, loading, fail}) => {
    const headerRef = useRef(null);
    const textRef = useRef(null);
    const btnRef = useRef(null);

    useEffect(() => {
        document.addEventListener('keyup', (event) => {
            if(event.keyCode === 27) {
                closeModalFunction();
            }
        });
    }, []);

    useEffect(() => {
        if(deleteStatus === 1) {
            headerRef.current.style.opacity = '0';
            btnRef.current.style.opacity = '0';
            textRef.current.textContent = success;
        }
        else if(deleteStatus === -1) {
            headerRef.current.style.opacity = '0';
            btnRef.current.style.opacity = '0';
            textRef.current.textContent = fail;
        }
        else {
            headerRef.current.style.opacity = '1';
            btnRef.current.style.opacity = '1';
            textRef.current.textContent = text;
        }
    }, [deleteStatus]);

    return <div className="colorModal">
        <div className="colorModal__inner">
            <button className="colorModal__close" onClick={() => { closeModalFunction(); }}>
                &times;
            </button>
            <h3 className="colorModal__header" ref={headerRef}>
                {header}
            </h3>
            <p className="colorModal__text" ref={textRef}>
                {text}
            </p>
            <button className={loading ? "btn btn--changeColor hidden" : "btn btn--changeColor"}
                    ref={btnRef}
                    onClick={() => { deleteFunction(); }}>
                {btnText}
            </button>
            {loading ? <div className="center">
                <Loader />
            </div> : ''}
        </div>
    </div>
};

export default AdminDeleteModal;
