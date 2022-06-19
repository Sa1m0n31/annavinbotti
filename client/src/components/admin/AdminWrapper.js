import React, {useEffect, useState} from 'react';
import AdminStart from "../../pages/admin/AdminStart";
import LoadingPage from "../client/LoadingPage";
import AddProduct from "../../pages/admin/AddProduct";
import ProductList from "../../pages/admin/ProductList";
import AddAddon from "../../pages/admin/AddAddon";
import AddonList from "../../pages/admin/AddonList";
import AddType from "../../pages/admin/AddType";
import TypesList from "../../pages/admin/TypesList";
import AddStock from "../../pages/admin/AddStock";
import StockList from "../../pages/admin/StockList";
import AddPost from "../../pages/admin/AddPost";
import PostList from "../../pages/admin/PostList";
import AdminTermsPl from "../../pages/admin/AdminTermsPl";
import AdminNewsletter from "../../pages/admin/AdminNewsletter";
import AdminTermsEn from "../../pages/admin/AdminTermsEn";
import Waitlist from "../../pages/admin/Waitlist";
import OrderList from "../../pages/admin/OrderList";
import WaitlistDetails from "../../pages/admin/WaitlistDetails";
import OrderDetails from "../../pages/admin/OrderDetails";
import FormDetails from "../../pages/admin/FormDetails";
import ChangeAdminPassword from "../../pages/admin/ChangeAdminPassword";

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
            case 7:
                setRenderPage(<AddStock type={0} />);
                break;
            case 8:
                setRenderPage(<AddStock type={1} />);
                break;
            case 9:
                setRenderPage(<StockList type={0} />);
                break;
            case 10:
                setRenderPage(<StockList type={1} />);
                break;
            case 11:
                setRenderPage(<AddType />);
                break;
            case 12:
                setRenderPage(<TypesList />);
                break;
            case 13:
                setRenderPage(<AddPost />);
                break;
            case 14:
                setRenderPage(<PostList />);
                break;
            case 15:
                setRenderPage(<AdminNewsletter />);
                break;
            case 16:
                setRenderPage(<AdminTermsPl />);
                break;
            case 17:
                setRenderPage(<AdminTermsEn />);
                break;
            case 18:
                setRenderPage(<Waitlist />);
                break;
            case 19:
                setRenderPage(<OrderList />);
                break;
            case 20:
                setRenderPage(<WaitlistDetails />);
                break;
            case 21:
                setRenderPage(<OrderDetails />);
                break;
            case 22:
                setRenderPage(<FormDetails />);
                break;
            case 23:
                setRenderPage(<ChangeAdminPassword />);
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
