import React from 'react';

const UserDash = () => {
    return (
        <div>
          <p>You are a <strong>Customer</strong>.</p>
          <ul className="list-disc list-inside">
            <li>Send New Parcel</li>
            <li>Track Parcels</li>
            <li>View Delivery History</li>
          </ul>
        </div>
    );
};

export default UserDash;