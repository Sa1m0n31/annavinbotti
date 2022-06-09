import React from 'react';
import DisplayAddress from "./DisplayAddress";

const AdminOrderInfo = ({order}) => {
    return <div className="flex">

            {order?.userAddress ? <DisplayAddress header="Dane zamawiającego"
                                     lines={[
                                         order?.fullName,
                                         order?.userAddress?.flat ? `ul. ${order.userAddress.street} ${order.userAddress.building}/${order.userAddress.flat}` : `ul. ${order?.userAddress?.street} ${order?.userAddress?.building}`,
                                         `${order.userAddress?.postalCode} ${order.userAddress?.city}`,
                                         order?.email,
                                         order?.phoneNumber
                                     ]} /> : ''}


            {order?.deliveryAddress ? <DisplayAddress header="Dane wysyłki"
                                            lines={[
                                                order?.deliveryAddress?.flat ? `ul. ${order.deliveryAddress.street} ${order.deliveryAddress.building}/${order.deliveryAddress.flat}` : `ul. ${order?.deliveryAddress?.street} ${order?.deliveryAddress?.building}`,
                                                `${order.deliveryAddress?.postalCode} ${order.deliveryAddress?.city}`
                                            ]}
                /> : ''}
        </div>
};

export default AdminOrderInfo;
