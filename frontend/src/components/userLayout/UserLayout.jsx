import React from 'react'
import { Outlet } from 'react-router-dom';
import UserHeader from './UserHeader';
import UserFooter from './UserFooter';
const UserLayout = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <div style={{ position: 'fixed', top: 0, width: '100%', zIndex: 100 }}>
                <UserHeader />
            </div>
            <div style={{ flex: 1, paddingTop: '75px', paddingBottom: '40px' }}>
                <Outlet />
            </div>
            <div style={{
                position: 'float',
                bottom: 0,
                width: '100%',
                zIndex: 100,
                backgroundColor: 'black',
                color: 'white'
            }}>
                <UserFooter />
            </div>
        </div>
    );
};

export default UserLayout;