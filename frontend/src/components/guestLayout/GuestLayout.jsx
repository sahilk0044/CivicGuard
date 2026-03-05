import React from 'react';
import GuestHeader from './GuestHeader';
import { Outlet } from 'react-router-dom';
import GuestFooter from './GuestFooter';
const GuestLayout = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <div style={{ position: 'fixed', top: 0, width: '100%', zIndex: 100 }}>
                <GuestHeader />
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
                <GuestFooter />
            </div>
        </div>
    );
};

export default GuestLayout;