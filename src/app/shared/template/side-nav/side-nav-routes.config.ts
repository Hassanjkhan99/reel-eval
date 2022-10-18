import { SideNavInterface } from '../../interfaces/side-nav.type';
export const ROUTES: SideNavInterface[] = [
    {
        path: '',
        title: 'Dashboard',
        iconType: 'nzIcon',
        iconTheme: 'outline',
        icon: 'dashboard',
        submenu: []
    },    {
        path: 'authentication/login',
        title: 'Dashboard',
        iconType: 'nzIcon',
        iconTheme: 'outline',
        icon: 'dashboard',
        submenu: []
    },
    {
        path: '',
        title: 'Staff',
        iconType: 'nzIcon',
        iconTheme: 'outline',
        icon: 'user',
        submenu: [
            {
                path: 'staff/add',
                title: 'Add Staff Member',
                iconType: '',
                icon: '',
              submenu: []
            },            {
                path: 'staff/view',
                title: 'View Staff Members',
                iconType: '',
                icon: '',
              submenu: []
            },
        ]
    }
]
