import React, {useEffect, useState} from 'react';
import AdminStart from "../../pages/admin/AdminStart";
import LoadingPage from "../client/LoadingPage";
import AddProduct from "../../pages/admin/AddProduct";
import ProductList from "../../pages/admin/ProductList";
import AddAddon from "../../pages/admin/AddAddon";
import AddonList from "../../pages/admin/AddonList";

const AdminWrapper = ({page}) => {
    const [loaded, setLoaded] = useState(false);
    const [renderPage, setRenderPage] = useState(null);

    useEffect(() => {
        switch(page) {
            case 1:
                setRenderPage(<AdminStart />);
                break;
            case 2:
                setRenderPage(<AddProduct />);
                break;
            case 3:
                setRenderPage(<ProductList />);
                break;
            case 4:
                setRenderPage(<AddAddon />);
                break;
            case 5:
                setRenderPage(<AddonList />);
                break;
            case 6:
                setRenderPage(<AddAddon update={true} />);
                break;
            default:
                window.location = '/';
                break;
        }
        setLoaded(true);
    }, []);

    return loaded ? renderPage : <LoadingPage />
};

export default AdminWrapper;
