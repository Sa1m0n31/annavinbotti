import React from 'react';
import AdminMenu from "../../components/admin/AdminMenu";
import AdminTop from "../../components/admin/AdminTop";
import StatsSection from "../../components/admin/StatsSection";
import AdminQuickMenu from "../../components/admin/AdminQuickMenu";
import ContactWithSupport from "../../components/admin/ContactWithSupport";

const AdminStart = () => {
    return <div className="container container--admin">
        <AdminTop />
        <div className="admin">
            <AdminMenu menuOpen={0} />
            <main className="admin__main">
                <h2 className="admin__main__header">
                    Witaj w panelu administracyjnym!
                </h2>

                <div className="admin__start">
                    <StatsSection />
                    <AdminQuickMenu />
                    <ContactWithSupport />
                </div>
            </main>
        </div>
    </div>
};

export default AdminStart;
