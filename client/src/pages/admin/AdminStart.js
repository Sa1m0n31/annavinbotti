import React from 'react';
import AdminMenu from "../../components/admin/AdminMenu";
import AdminTop from "../../components/admin/AdminTop";

const AdminStart = () => {
    return <div className="container container--admin">
        <AdminTop />
        <div className="admin">
            <AdminMenu menuOpen={0} />
            <main className="admin__main">

            </main>
        </div>
    </div>
};

export default AdminStart;
