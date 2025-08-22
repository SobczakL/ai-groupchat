import { useEffect, useRef, useState } from 'react';
import MessageWindow from '../../components/messageWindow/MessageWindow';
import UserCountOptions from '../../components/userOptions/UserCountOptions';
import UserDetailsOptions from '../../components/userOptions/UserDetailsOptions';
import { UserCount, CurrentUsers } from '../../lib/types';
import { useUsers } from '../../hooks/useUsers';
import type { User } from '../../lib/types';

export default function DemoUserPortal() {

    return (
        <div className='h-[100vh]'>
            {!isLoading
                ? currentUsers.users.map((user, index) => {
                    return (
                        <MessageWindow
                            key={index}
                            userDetails={user}
                        />
                    );
                })
                : null
            }
        </div>
    );
}

