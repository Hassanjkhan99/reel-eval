import {SideNavInterface} from '../../interfaces/side-nav.type';

export const ROUTES: SideNavInterface[] = [
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
              submenu: [],
              iconTheme: 'fill'
            }, {
            path: 'staff/view',
            title: 'View Staff Members',
            iconType: '',
            icon: '',
            submenu: [],
            iconTheme: "fill"
          },
        ]
    },
  {
    path: '',
    title: 'Prospect',
    iconType: 'nzIcon',
    iconTheme: 'outline',
    icon: 'user',
    submenu: [
      {
        path: 'prospect/add',
        title: 'Add Prospect',
        iconType: '',
        icon: '',
        iconTheme: 'fill',
        submenu: []
      }, {
        path: 'prospect/view',
        title: 'View Prospect',
        iconType: '',
        icon: '',
        iconTheme: 'fill',
        submenu: []
      },
    ]
  }

]
