import React from 'react'
import { Outlet } from 'react-router-dom';
import UserHeader from './UserHeader';
import UserFooter from './UserFooter';

const UserLayout = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

            {/* HEADER */}
            <div style={{ position: 'fixed', top: 0, width: '100%', zIndex: 1000 }}>
                <UserHeader />
            </div>

            {/* PAGE CONTENT */}
            <div style={{ flex: 1, paddingTop: '75px', paddingBottom: '40px' }}>
                <Outlet />
            </div>

            {/* FOOTER */}
            <div style={{
                width: '100%',
                backgroundColor: 'black',
                color: 'white'
            }}>
                <UserFooter />
            </div>

        </div>
    );
};

export default UserLayout;